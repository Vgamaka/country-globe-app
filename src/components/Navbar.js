import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Country App</Link>
        <div className="d-flex">
          {user ? (
            <>
              <span className="me-3">👋 {user.email}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary btn-sm me-2">Login</Link>
              <Link to="/register" className="btn btn-outline-success btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
