import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000'; // ✅ fallback
const API_URL = `${baseURL}/auth`;

export const registerUser = async (email, password) => {
  return await axios.post(`${API_URL}/register`, { email, password });
};

export const loginUser = async (email, password) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};
