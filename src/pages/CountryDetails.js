import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryByCode } from '../services/restcountries';

const CountryDetails = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const data = await getCountryByCode(code);
        setCountry(data[0]); // API returns an array
      } catch (error) {
        console.error('Error fetching country:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!country) return <p className="text-center mt-5">Country not found.</p>;

  return (
    <div className="container mt-4">
      <Link to="/" className="btn btn-secondary mb-4">← Back</Link>
      <div className="card shadow-sm">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={country.flags?.png}
              alt={`${country.name?.common} flag`}
              className="img-fluid rounded-start"
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="card-title">{country.name?.common}</h3>
              <p className="card-text">
                <strong>Official Name:</strong> {country.name?.official}<br />
                <strong>Capital:</strong> {country.capital?.[0]}<br />
                <strong>Region:</strong> {country.region}<br />
                <strong>Population:</strong> {country.population?.toLocaleString()}<br />
                <strong>Languages:</strong> {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;
