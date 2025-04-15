import React, { useEffect, useState } from 'react';
import { getAllCountries, searchCountryByName } from '../services/restcountries';
import CountryCard from '../components/CountryCard';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (searchTerm.trim()) {
          const data = await searchCountryByName(searchTerm.trim());
          setCountries(data);
        } else {
          const data = await getAllCountries();
          setCountries(data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchData, 500); // debounce input

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <div className="container">
      <h2 className="text-center my-4">Countries</h2>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
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
