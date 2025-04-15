import React from 'react';
import { Link } from 'react-router-dom';

const CountryCard = ({ country }) => {
  return (
    <div className="card h-100 shadow-sm">
      <img
        src={country.flags?.png}
        className="card-img-top"
        alt={`${country.name?.common} flag`}
      />
      <div className="card-body">
        <h5 className="card-title">{country.name?.common}</h5>
        <p className="card-text">
          <strong>Capital:</strong> {country.capital?.[0]}<br />
          <strong>Region:</strong> {country.region}<br />
          <strong>Population:</strong> {country.population.toLocaleString()}
        </p>
        <Link
        to={country.cca3 ? `/country/${country.cca3}` : '#'}
        className="btn btn-primary"
      >
        View Details
      </Link>
      </div>
    </div>
  );
};

export default CountryCard;
