import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, clearLoginStatus } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const emailRef = useRef();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  useEffect(() => {
    emailRef.current?.focus();
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (status === 'succeeded') {
      toast.success('Login successful!');
      setTimeout(() => navigate('/'), 2000);
      dispatch(clearLoginStatus());
    } else if (status === 'failed') {
      toast.error(error || 'Invalid credentials');
      dispatch(clearLoginStatus());
    }
  }, [status, error, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginThunk({ email, password }));
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <ToastContainer />
      <div className="container">
        <div
          className="p-4 rounded shadow mx-auto animate__animated animate__fadeInDown"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', maxWidth: '500px' }}
        >
          <h3 className="mb-4 text-center">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                className="form-control bg-dark text-white border-secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-control bg-dark text-white border-secondary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  data-testid="password-toggle"
                  className="input-group-text bg-dark text-white border-secondary"
                  onClick={() => setShowPass(!showPass)}
                  style={{ cursor: 'pointer' }}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember Me
              </label>
            </div>

            <div className="d-flex justify-content-center">
              <button
                className="btn btn-lg"
                style={{
                  backgroundColor: '#000',
                  color: '#fff',
                  border: '1px solid #fff',
                  width: '50%',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#000';
                  e.target.style.color = '#fff';
                }}
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
