// src/utils/api.js
import axios from 'axios';

// Create an Axios instance with your backend base URL
const api = axios.create({
  baseURL: 'http://localhost:8080', // !! IMPORTANT: DOUBLE-CHECK THIS - Make sure it matches your actual backend API URL !!
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;