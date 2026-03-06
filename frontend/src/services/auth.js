// Simple frontend-only auth service for demo purposes
export function login({ email, password }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let role = 'patient'
      if (email.includes('doctor')) role = 'doctor'
      if (email.includes('admin')) role = 'admin'

      const user = {
        name: email.split('@')[0],
        email,
        role,
        token: 'demo-token'
      }

      localStorage.setItem('sh_user', JSON.stringify(user))

      resolve({ data: user })
    }, 400)
  })
}

export function logout() {
  localStorage.removeItem('sh_user')
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('sh_user'))
  } catch (e) {
    return null
  }
}
