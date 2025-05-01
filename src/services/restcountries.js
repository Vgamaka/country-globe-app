import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // timeout in milliseconds
});


export const getAllCountries = async () => {
  const response = await api.get('/all?fields=name,capital,region,population,languages,flags,cca3');
  return response.data;
};
// Get full details by code (for detail page)
export const getCountryByCode = async (code) => {
  const response = await api.get(`/alpha/${code}`);
  return response.data;
};

// Search by name
export const searchCountryByName = async (name) => {
  const response = await api.get(`/name/${name}`);
  return response.data;
};

// Filter by region
export const filterByRegion = async (region) => {
  const response = await api.get(`/region/${region}`);
  return response.data;
};

export const filterByLanguage = async (language) => {
  const response = await api.get(`/lang/${language}`);
  return response.data;
};
