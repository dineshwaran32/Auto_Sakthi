import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.253.142:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      // Try to get token from AsyncStorage first
      let token = await AsyncStorage.getItem('token');
      
      // If not found, try to get from user data
      if (!token) {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          token = user.token;
        }
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Token attached to request:', config.url);
      } else {
        console.warn('⚠️  No token found for request:', config.url);
      }
    } catch (error) {
      console.error('Error getting token for request:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('🚨 API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    // Handle rate limiting with retry logic
    if (error.response?.status === 429) {
      console.warn('⚠️ Rate limited - will retry after delay');
      const retryAfter = error.response.headers['retry-after'] || 60; // Default to 60 seconds
      
      // Wait for the specified time before retrying
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      
      // Retry the request
      return api.request(error.config);
    }
    
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized - clearing tokens');
      // Clear invalid tokens
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      } catch (clearError) {
        console.error('Error clearing tokens:', clearError);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 