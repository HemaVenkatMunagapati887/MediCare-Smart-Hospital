const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error('Password is required and must be at least 6 characters');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    authProvider: ['local']
  });

  if (user) {
    // Create actual profile record in Patient / Doctor collection
    if (user.role === 'patient') {
      await Patient.create({
        user: user._id,
        gender: 'Male', // Default or from req.body
        bloodGroup: 'O+'
      });
    } else if (user.role === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization: 'General',
        experience: 0,
        fees: 0
      });
    }

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Block Google-only users from password login
  if (!user.password) {
    res.status(401);
    throw new Error('This account was created with Google. Please use "Sign in with Google" button.');
  }

  if (await user.matchPassword(password)) {
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Google OAuth login/register
// @route   POST /api/v1/auth/google
// @access  Public
exports.googleAuth = async (req, res) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Google ID token is required' });
    }

    // Verify Google ID token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid Google token' });
    }

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if user exists by googleId
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists by email (local account)
      user = await User.findOne({ email });

      if (user) {
        // Link Google to existing account
        user.googleId = googleId;
        if (!user.authProvider.includes('google')) {
          user.authProvider.push('google');
        }
        await user.save();
      } else {
        // Create new user via Google
        user = await User.create({
          name,
          email,
          googleId,
          authProvider: ['google'],
          role: role || 'patient',
        });

        // Create actual profile record in Patient / Doctor collection
        if (user.role === 'patient') {
          await Patient.create({
            user: user._id,
            gender: 'Male',
            bloodGroup: 'O+'
          });
        } else if (user.role === 'doctor') {
          await Doctor.create({
            user: user._id,
            specialization: 'General',
            experience: 0,
            fees: 0
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Google Auth Error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Google authentication failed' });
  }
};

// @desc    Register via Google OAuth (with mandatory password)
// @route   POST /api/v1/auth/google-register
// @access  Public
exports.googleRegister = async (req, res) => {
  try {
    const { idToken, role, password } = req.body;

    if (!idToken || !role || !password) {
      return res.status(400).json({ success: false, message: 'Google token, role and password are required' });
    }

    // Admin accounts cannot be self-registered
    if (role === 'admin') {
      return res.status(403).json({ success: false, message: 'Administrator accounts cannot be self-registered. Contact your system administrator.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Verify Google ID token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid Google token. Please try again.' });
    }

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Enforce institute domain for doctor/admin
    if ((role === 'doctor' || role === 'admin') && !email.toLowerCase().endsWith('@rguktn.ac.in')) {
      return res.status(403).json({
        success: false,
        message: 'Doctor and Administrator accounts are restricted to @rguktn.ac.in email addresses.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { googleId }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this Google email already exists. Please login instead.' });
    }

    // Create user with both Google and local auth
    const user = await User.create({
      name,
      email,
      googleId,
      password,
      role: role || 'patient',
      authProvider: ['google', 'local'],
    });

    // Create actual profile record in Patient / Doctor collection
    if (user.role === 'patient') {
      await Patient.create({
        user: user._id,
        gender: 'Male',
        bloodGroup: 'O+'
      });
    } else if (user.role === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization: 'General',
        experience: 0,
        fees: 0
      });
    }

    res.status(201).json({ success: true, message: 'Registration successful! Please login with your email and password.' });
  } catch (err) {
    console.error('GoogleRegister Error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Registration failed' });
  }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Forgot password - send 4-digit OTP
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    // Check if user has a password (not Google-only)
    const userWithPwd = await User.findOne({ email }).select('+password');
    if (!userWithPwd.password) {
      return res.status(400).json({ success: false, message: 'This account uses Google Sign-In. Password reset is not available.' });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Save hashed OTP and expiry (10 minutes)
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Send email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #2563eb; text-align: center;">MediCare+ Hospital</h2>
        <p style="text-align: center; color: #374151;">Your password reset OTP is:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #1d4ed8; background: #eff6ff; padding: 12px 24px; border-radius: 8px;">${otp}</span>
        </div>
        <p style="text-align: center; color: #6b7280; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'MediCare+ Password Reset OTP',
      html,
    });

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    console.error('ForgotPassword Error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
  }
};

// @desc    Verify OTP
// @route   POST /api/v1/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpire');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.resetOtp || !user.resetOtpExpire) {
      return res.status(400).json({ success: false, message: 'No OTP request found. Please request a new OTP.' });
    }

    if (Date.now() > user.resetOtpExpire) {
      user.resetOtp = undefined;
      user.resetOtpExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    // OTP is valid — generate a short-lived token for reset
    const resetToken = generateToken(user._id);

    // Clear OTP fields
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'OTP verified successfully', resetToken });
  } catch (err) {
    console.error('VerifyOtp Error:', err.message);
    res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
};

// @desc    Reset password (after OTP verification)
// @route   POST /api/v1/auth/reset-password
// @access  Public (requires resetToken)
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;

    if (!resetToken || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Verify the reset token
    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired reset token. Please start over.' });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = password;
    if (!user.authProvider.includes('local')) {
      user.authProvider.push('local');
    }
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You can now login.' });
  } catch (err) {
    console.error('ResetPassword Error:', err.message);
    res.status(500).json({ success: false, message: 'Password reset failed' });
  }
};
