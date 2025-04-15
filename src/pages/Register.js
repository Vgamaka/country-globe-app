import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      setMessage('Registered successfully! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage('User already exists or error occurred.');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {message && <p className="text-info">{message}</p>}
        <button className="btn btn-success" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
