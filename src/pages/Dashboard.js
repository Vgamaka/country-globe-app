import React, { useEffect, useState, useContext } from 'react';
import { getFavorites, getNotes } from '../services/userDataService';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const favRes = await getFavorites();
      const noteRes = await getNotes();
      setFavorites(favRes.data);
      setNotes(noteRes.data);
    };

    if (user) fetchData();
  }, [user]);

  return (
    <div className="container mt-5">
      <h3> Your Dashboard</h3>

      <h5 className="mt-4"> Favorite Countries</h5>
      <ul>
        {favorites.map((fav) => (
          <li key={fav._id}>{fav.countryName}</li>
        ))}
      </ul>

      <h5 className="mt-4"> Notes</h5>
      <ul>
        {notes.map((note) => (
            <li key={note._id}>
  <strong>{note.countryName}</strong>: {note.text}
</li>

        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
