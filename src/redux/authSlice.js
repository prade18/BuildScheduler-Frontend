import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'

const getTokenFromStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || null
  }
  return null
}

const getUserInfoFromToken = (token) => {
  try {
    const decoded = jwtDecode(token)
    return {
      username: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      phone: decoded.phone,
    }
  } catch (error) {
    return null
  }
}

const initialToken = getTokenFromStorage()
const initialUserInfo = initialToken ? getUserInfoFromToken(initialToken) : null

const initialState = {
  token: initialToken,
  userInfo: initialUserInfo,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const token = action.payload
      state.token = token
      state.userInfo = getUserInfoFromToken(token)

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token)
      }
    },
    logout: (state) => {
      state.token = null
      state.userInfo = null

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
