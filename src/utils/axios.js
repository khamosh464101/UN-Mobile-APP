// lib/Axios.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import Constants from "expo-constants";

const axios = Axios.create({
  baseURL: 'https://demo.momtaz.ws',
  withCredentials: true, // include cookies if needed
});



// Request Interceptor
axios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token")
    console.log('12345', 'https://demo.momtaz.ws');
    config.headers.Accept = 'application/json';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
    }


    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'An error occurred';
      switch (status) {
        case 401:
          console.warn('Unauthenticated – redirecting to login');
          break;

        case 403:
          console.warn('Unauthorized – access denied');
          if (typeof window !== 'undefined') {
            window.location.href = '/unauthorized'; // or show a toast
          }
          break;

        case 404:
          console.warn(`Not found: ${error.config?.url}`);
          break;

        case 500:
          console.error('Server error:', message);
          break;

        default:
          if (status !== 422) {
            // Ignore 422 so you can handle it yourself
            console.warn(`Unexpected error (${status}):`, message);
          }
          break;
      }
    } else if (error.request) {
      console.error('No response from server (maybe offline):', error.message);
      alert('Network error: check your internet connection.');
    } else {
      console.error('Unexpected Axios error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axios;
