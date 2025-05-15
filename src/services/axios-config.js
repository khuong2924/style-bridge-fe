import axios from 'axios';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: `${window.API_URL}${window.IDENTITY_API_PATH}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  config => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && userData.token) {
          config.headers['Authorization'] = `Bearer ${userData.token}`;
          console.log(`Request to ${config.url} with auth token: ${userData.token.substring(0, 15)}...`);
        }
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;
    
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else if (error.request) {
      console.error('Error Request:', error.request);
      console.error('No response received - possible network issue or CORS problem');
    } else {
      console.error('Error during request setup:', error.message);
    }
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Could add token refresh logic here
      
      // For now, clear user data and redirect to login
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 