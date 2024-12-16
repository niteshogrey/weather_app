// features/weatherSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action for fetching weather data
export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (location, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Token");
      console.log("Token:", token)
      if (!token) {
        console.log("Token is required");
        return;
      }
      const response = await axios.get(`http://localhost:1000/api/weather/${location}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      
      return response.data; // Success case
    } catch (error) {
      return rejectWithValue(error.response.data); // Error case
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: null,
    errorMessage: '',
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.errorMessage = '';
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.message || 'An error occurred';
      });
  },
});

export default weatherSlice.reducer;
