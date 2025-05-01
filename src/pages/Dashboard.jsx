import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFavorites, getNotes, deleteNote, updateNote } from '../services/userDataService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const [favorites, setFavorites] = useState([]);
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const favRes = await getFavorites();
      const noteRes = await getNotes();
      setFavorites(favRes.data);
      setNotes(noteRes.data);
    };

    if (user) fetchData();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
      toast.success('Note deleted!');
    } catch {
      toast.error('Error deleting note');
    }
  };

  const handleEdit = (note) => {
    setEditingNoteId(note._id);
    setEditText(note.text);
  };

  const handleUpdate = async () => {
    try {
      await updateNote(editingNoteId, editText);
      setNotes(notes.map(note =>
        note._id === editingNoteId ? { ...note, text: editText } : note
      ));
      toast.success('Note updated!');
    } catch {
      toast.error('Error updating note');
    }
    setEditingNoteId(null);
    setEditText('');
  };

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh', paddingTop: '80px' }} className="text-white">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <div className="container">
        <h3 className="mb-4">Your Dashboard</h3>

        {/* Favorites Section */}
        <div className="mb-4 p-4 rounded shadow" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <h5>Favorite Countries</h5>
          <ul className="list-group list-group-flush mt-2">
            {favorites.length === 0 && <p className="text-muted">No favorites yet.</p>}
            {favorites.map((fav) => (
              <li key={fav._id} className="list-group-item bg-transparent text-white border-bottom border-secondary">
                {fav.countryName}
              </li>
            ))}
          </ul>
        </div>

        {/* Notes Section */}
        <div className="p-4 rounded shadow" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <h5>Notes</h5>
          <ul className="list-group list-group-flush mt-2">
            {notes.length === 0 && <p className="text-muted">No notes yet.</p>}
            {notes.map((note) => (
              <li key={note._id} className="list-group-item bg-transparent text-white border-bottom border-secondary">
                <strong>{note.countryName}</strong>
                {editingNoteId === note._id ? (
                  <>
                    <textarea
                      className="form-control mt-2 bg-dark text-white border"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="mt-2">
                      <button className="btn btn-sm btn-success me-2" onClick={handleUpdate}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditingNoteId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-1">{note.text}</p>
                    <button
                          className="btn btn-sm me-2"
                          style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            border: '1px solid #fff',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#fff';
                            e.target.style.color = '#000';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#000';
                            e.target.style.color = '#fff';
                          }}
                          onClick={() => handleEdit(note)}
                        >
                          Edit
                        </button>

                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(note._id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
