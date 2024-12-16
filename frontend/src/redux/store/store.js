// store.js
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weatherSlice';
import authReducer from '../features/authSlice';

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    auth: authReducer,
  },
});

export default store;
