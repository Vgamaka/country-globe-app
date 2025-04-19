import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/auth';

export const registerUser = async (email, password) => {
  return await axios.post(`${API_URL}/register`, { email, password });
};

export const loginUser = async (email, password) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};
