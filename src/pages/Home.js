import React, { useEffect, useState } from 'react';
import {
  getAllCountries,
  searchCountryByName,
  filterByRegion,
} from '../services/restcountries';
import CountryCard from '../components/CountryCard';
import SearchBar from '../components/SearchBar';
import RegionFilter from '../components/RegionFilter';
import LanguageFilter from '../components/LanguageFilter';
import { filterByLanguage } from '../services/restcountries';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data = [];

        if (searchTerm.trim()) {
          data = await searchCountryByName(searchTerm.trim());
        } else if (selectedRegion) {
          data = await filterByRegion(selectedRegion);
        } else if (selectedLanguage) {
          data = await filterByLanguage(selectedLanguage);
        } else {
          data = await getAllCountries();
        }
        

        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchData, 500); // debounce delay
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedRegion, selectedLanguage]);

  return (
    <div className="container">
      <h2 className="text-center my-4">Countries</h2>

          <SearchBar
      value={searchTerm}
      onChange={(value) => {
        setSearchTerm(value);
        setSelectedRegion('');
        setSelectedLanguage('');
      }}
    />

    <RegionFilter
      selectedRegion={selectedRegion}
      onChange={(region) => {
        setSelectedRegion(region);
        setSearchTerm('');
        setSelectedLanguage('');
      }}
    />

    <LanguageFilter
      selectedLanguage={selectedLanguage}
      onChange={(lang) => {
        setSelectedLanguage(lang);
        setSearchTerm('');
        setSelectedRegion('');
      }}
    />

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="row">
          {countries.length > 0 ? (
            countries.map((country, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <CountryCard country={country} />
              </div>
            ))
          ) : (
            <p className="text-center">No countries found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
