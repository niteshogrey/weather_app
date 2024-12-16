// features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const backend_url = process.env.REACT_APP_BACKEND_URL 

// Async action for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backend_url}/user/login`, credentials);
      return response.data; // Success case
    } catch (error) {
      return rejectWithValue(error.response.data); // Error case
    }
  }
);

// Async action for signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userDetails, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backend_url}/user/register`, userDetails, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data; 
      // Success case
    } catch (error) {  
      console.log(error.response.data.message);
      return rejectWithValue(error.response.data.message); // Error case
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    errorMessage: '',
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.errorMessage = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.message || 'Login failed';
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.errorMessage = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.message || 'Signup failed';
      });
  },
});

export default authSlice.reducer;
