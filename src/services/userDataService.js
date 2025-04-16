import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Favorites
export const addFavorite = async (countryCode, countryName) =>
  await API.post('/favorites', { countryCode, countryName }, getAuthHeaders());

export const getFavorites = async () =>
  await API.get('/favorites', getAuthHeaders());

// Notes
export const addNote = async (countryCode, countryName, text) =>
  await API.post('/notes', { countryCode, countryName, text }, getAuthHeaders());

export const getNotes = async () =>
  await API.get('/notes', getAuthHeaders());
