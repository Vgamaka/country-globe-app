import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryByCode } from '../services/restcountries';
import { AuthContext } from '../context/AuthContext';
import { addFavorite, addNote } from '../services/userDataService';

const CountryDetails = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const { user } = useContext(AuthContext);

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

  const handleAddFavorite = async () => {
    try {
      await addFavorite(country.cca3, country.name.common);
      alert('Added to favorites!');
    } catch (error) {
      alert('Already in favorites or an error occurred.');
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      await addNote(country.cca3, country.name.common, note);
      setNote('');
      alert('Note saved!');
    } catch (error) {
      alert('Error saving note.');
    }
  };

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

              {user && (
                <>
                  <button className="btn btn-outline-danger me-3 mb-3" onClick={handleAddFavorite}>
                     Add to Favorites
                  </button>

                  <form onSubmit={handleNoteSubmit}>
                    <textarea
                      className="form-control mb-2"
                      placeholder="Write a note about this country..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      required
                    />
                    <button className="btn btn-primary" type="submit"> Save Note</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;
