import React, { useEffect, useState, useRef, useContext } from 'react';
import Globe from 'react-globe.gl';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { addFavorite, addNote } from '../services/userDataService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const globeEl = useRef();
  const sidebarRef = useRef();
  const { user } = useContext(AuthContext);

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState('');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setSelectedCountry] = useState(null);
  const [countryDetails, setCountryDetails] = useState(null);
  const [note, setNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [favoriteCodes, setFavoriteCodes] = useState([]);
  const toggleButtonRef = useRef();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('https://restcountries.com/v3.1/all');
        const formatted = res.data.map((country) => ({
          name: country.name.common,
          lat: country.latlng?.[0] || 0,
          lng: country.latlng?.[1] || 0,
          flag: country.flags?.png || '',
          region: country.region || '',
          languages: Object.values(country.languages || {}).map(l => l.toLowerCase()),
          cca3: country.cca3
        }));
        setCountries(formatted);
      } catch (err) {
        toast.error('Failed to load countries');
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const filteredCountries = countries.filter((country) => {
    const matchesRegion = region ? country.region === region : true;
    const matchesLanguage = language ? country.languages.includes(language.toLowerCase()) : true;
    const matchesSearch = search ? country.name.toLowerCase().includes(search.toLowerCase()) : true;
    return matchesRegion && matchesLanguage && matchesSearch;
  });

  useEffect(() => {
    if (search.trim() && filteredCountries.length === 1) {
      const country = filteredCountries[0];
      globeEl.current.pointOfView({ lat: country.lat, lng: country.lng, altitude: 1.8 }, 1200);
    }
  }, [search, filteredCountries]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }      
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLabelClick = async (country) => {
    try {
      setSelectedCountry(country);
      globeEl.current.pointOfView({ lat: country.lat, lng: country.lng, altitude: 1.4 }, 1200);
      const res = await axios.get(`https://restcountries.com/v3.1/name/${country.name}`);
      setCountryDetails(res.data[0]);
    } catch (err) {
      toast.error('Failed to fetch country details');
    }
  };

  const handleAddFavorite = async () => {
    try {
      await addFavorite(countryDetails.cca3, countryDetails.name.common);
      toast.success('Added to favorites!');
      setFavoriteCodes((prev) => [...new Set([...prev, countryDetails.cca3])]);
    } catch {
      toast.error('Already in favorites or an error occurred.');
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingNote(true);
      await addNote(countryDetails.cca3, countryDetails.name.common, note);
      setNote('');
      toast.success('Note saved!');
    } catch {
      toast.error('Error saving note.');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="position-relative w-100 vh-100 overflow-hidden bg-dark text-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />

      <button
      ref={toggleButtonRef}
      onClick={() => setSidebarOpen((prev) => !prev)}
      className="btn btn-dark position-absolute"
      style={{ top: '50%', left: 0, zIndex: 11, transform: 'translateY(-50%)', borderRadius: '0 8px 8px 0' }}
    >
      ☰
    </button>
      <div
        ref={sidebarRef}
        className="position-absolute p-3"
        style={{
          top: '80px',
          left: sidebarOpen ? '0' : '-300px',
          width: '280px',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          transition: 'left 0.4s ease',
          zIndex: 10,
          height: 'calc(100% - 100px)',
          overflowY: 'auto',
          borderTopRightRadius: '12px',
          borderBottomRightRadius: '12px'
        }}
      >
        <div className="mb-3">
          <input
            type="text"
            className="form-control bg-dark text-white border-0"
            placeholder="Search countries by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <select
            className="form-select bg-dark text-white border-0"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">Filter by region...</option>
            {["Africa", "Americas", "Asia", "Europe", "Oceania", "Antarctic"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <select
            className="form-select bg-dark text-white border-0"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Filter by language...</option>
            {["english", "spanish", "french", "german", "arabic", "chinese", "hindi", "swahili"].map((lang) => (
              <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {countryDetails && (
        <div
          className="position-absolute bg-dark text-white p-4 rounded shadow"
          style={{
            top: '10%',
            right: '5%',
            zIndex: 12,
            width: '350px',
            maxHeight: '80vh',
            overflowY: 'auto',
            backgroundColor: 'rgba(0,0,0,0.85)',
            transition: 'opacity 0.4s ease, transform 0.3s ease',
            opacity: 1,
            transform: 'translateY(0)'
          }}
        >
          <button
            className="btn btn-sm btn-close btn-close-white float-end"
            onClick={() => {
              setCountryDetails(null);
              globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1200);
            }}
          ></button>

          <h5 className="mt-4">{countryDetails.name?.common}</h5>
          <img src={countryDetails.flags?.png} alt="Flag" className="img-fluid rounded mb-2" />
          <p><strong>Official Name:</strong> {countryDetails.name?.official}</p>
          <p><strong>Capital:</strong> {countryDetails.capital?.[0]}</p>
          <p><strong>Region:</strong> {countryDetails.region}</p>
          <p><strong>Population:</strong> {countryDetails.population?.toLocaleString()}</p>
          <p><strong>Languages:</strong> {countryDetails.languages ? Object.values(countryDetails.languages).join(', ') : 'N/A'}</p>

          {user && (
            <>
              <button className="btn btn-danger w-100 my-2" onClick={handleAddFavorite}>
                 Add to Favorites
              </button>
              <form onSubmit={handleNoteSubmit}>
                <textarea
                  className="form-control mb-2 text-black"
                  style={{ backgroundColor: '#fff' }}
                  placeholder="Write a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                />
                {savingNote ? (
                  <button className="btn btn-dark w-100" disabled>
                    Saving...
                  </button>
                ) : (
                  <button className="btn btn-outline-light w-100" type="submit">
                     Save Note
                  </button>
                )}
              </form>
            </>
          )}
        </div>
      )}

      {!loading && (
        <Globe
          ref={globeEl}
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
          labelsData={filteredCountries}
          labelLat={(d) => d.lat}
          labelLng={(d) => d.lng}
          labelText={(d) => d.name}
          labelSize={1.2}
          labelDotRadius={0.1}
          labelColor={(d) => favoriteCodes.includes(d.cca3) ? 'red' : 'white'}
          labelResolution={2}
          labelLabel={(d) =>
            `<div style="text-align:center;">
              <img src="${d.flag}" width="45" style="border-radius: 5px;"/><br/>
              <strong style="color: white; font-size: 14px;">${d.name}</strong>
            </div>`
          }
          onLabelClick={handleLabelClick}
          atmosphereColor="lightskyblue"
          atmosphereAltitude={0.3}
          showAtmosphere={true}
        />
      )}
    </div>
  );
};

export default Home;
