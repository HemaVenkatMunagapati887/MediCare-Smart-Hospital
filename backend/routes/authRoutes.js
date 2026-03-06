const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  googleAuth,
  googleRegister,
  forgotPassword,
  verifyOtp,
  resetPassword
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/google-register', googleRegister);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
