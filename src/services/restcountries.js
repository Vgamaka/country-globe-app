import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';
// Include latlng so we get real coordinates for each country
const FIELDS = 'name,capital,region,population,languages,flags,cca3,latlng';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
});

/**
 * Fetch all countries with only the fields we need.
 */
export const getAllCountries = async () => {
  const response = await api.get(`/all?fields=${FIELDS}`);
  return response.data;
};

/**
 * Fetch a single country by its 3-letter code, for detail view.
 */
export const getCountryByCode = async (code) => {
  const response = await api.get(`/alpha/${code}`);
  return response.data;
};

/**
 * Search countries by name, returning only our chosen fields.
 */
export const searchCountryByName = async (name) => {
  const response = await api.get(`/name/${encodeURIComponent(name)}?fields=${FIELDS}`);
  return response.data;
};

/**
 * Filter countries by region.
 */
export const filterByRegion = async (region) => {
  const response = await api.get(`/region/${encodeURIComponent(region)}?fields=${FIELDS}`);
  return response.data;
};

/**
 * Filter countries by language code.
 */
export const filterByLanguage = async (language) => {
  const response = await api.get(`/lang/${encodeURIComponent(language)}?fields=${FIELDS}`);
  return response.data;
};
