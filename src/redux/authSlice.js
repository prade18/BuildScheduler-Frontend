// import { createSlice } from '@reduxjs/toolkit'
// import { jwtDecode } from 'jwt-decode'

// const getTokenFromStorage = () => {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('token') || null
//   }
//   return null
// }

// const getUserInfoFromToken = (token) => {
//   try {
//     const decoded = jwtDecode(token)
//     return {
//       username: decoded.sub,
//       email: decoded.email,
//       role: decoded.role,
//       phone: decoded.phone,
//     }
//   } catch (error) {
//     return null
//   }
// }

// const initialToken = getTokenFromStorage()
// const initialUserInfo = initialToken ? getUserInfoFromToken(initialToken) : null

// const initialState = {
//   token: initialToken,
//   userInfo: initialUserInfo,
// }

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     loginSuccess: (state, action) => {
//       const token = action.payload
//       state.token = token
//       state.userInfo = getUserInfoFromToken(token)

//       if (typeof window !== 'undefined') {
//         localStorage.setItem('token', token)
//       }
//     },
//     logout: (state) => {
//       state.token = null
//       state.userInfo = null

//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('token')
//       }
//     },
//   },
// })

// export const { loginSuccess, logout } = authSlice.actions
// export default authSlice.reducer


// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api'; // Changed from '@/utils/api' to relative path

// Helper functions for token and user info from storage
const getTokenFromStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || null;
  }
  return null;
};

const getUserInfoFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      username: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      phone: decoded.phone || null,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

// Async Thunk for fetching the FULL user profile from your API
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        return rejectWithValue('No authentication token found. Please log in.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await api.get('/api/user/my-profile', config);
      return data.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Initial state for the auth slice
const initialToken = getTokenFromStorage();
const initialUserInfo = initialToken ? getUserInfoFromToken(initialToken) : null;

const initialState = {
  token: initialToken,
  userInfo: initialUserInfo,
  loginLoading: false,
  loginError: null,

  userProfile: {
    data: null,
    loading: false,
    error: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const token = action.payload;
      state.token = token;
      state.userInfo = getUserInfoFromToken(token);

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      state.loginLoading = false;
      state.loginError = null;
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      state.userProfile.data = null;
      state.userProfile.loading = false;
      state.userProfile.error = null;
      state.loginLoading = false;
      state.loginError = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    clearLoginError: (state) => {
        state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.userProfile.loading = true;
        state.userProfile.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userProfile.loading = false;
        state.userProfile.data = action.payload;
        state.userProfile.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.userProfile.loading = false;
        state.userProfile.error = action.payload;
        state.userProfile.data = null;
      });
  },
});

export const { loginSuccess, logout, clearLoginError } = authSlice.actions;
export default authSlice.reducer;