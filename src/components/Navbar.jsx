import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../features/user/userSlice';
import {
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
  FaTachometerAlt,
} from 'react-icons/fa';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(clearUser());
  };
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 576);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top px-3 py-2 shadow"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center text-white">
        <Link className="navbar-brand text-white fw-bold fs-4" to="/">
          Country App
        </Link>

        <div className="d-flex align-items-center">
          {user ? (
            <>
              {!isMobile && (
                <span className="me-3">
                  <FaUserCircle className="me-1" /> {user.email}
                </span>
              )}
              <HoverButton
                to="/dashboard"
                label="Dashboard"
                icon={<FaTachometerAlt />}
                isMobile={isMobile}
              />
              <HoverButton
                asButton
                onClick={logout}
                label="Logout"
                icon={<FaSignOutAlt />}
                isMobile={isMobile}
                danger
              />
            </>
          ) : (
            <>
              <HoverButton
                to="/login"
                label="Login"
                icon={<FaSignInAlt />}
                isMobile={isMobile}
              />
              <HoverButton
                to="/register"
                label="Register"
                icon={<FaUserPlus />}
                isMobile={isMobile}
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const HoverButton = ({
  to,
  onClick,
  icon,
  label,
  isMobile,
  asButton = false,
  danger = false,
}) => {
  const [hover, setHover] = useState(false);

  const base = {
    backgroundColor: isMobile ? 'transparent' : hover ? 'white' : 'black',
    color: isMobile ? 'white' : hover ? 'black' : 'white',
    border: isMobile ? 'none' : '1px solid white',
    transition: 'all 0.3s ease',
    fontSize: '0.875rem',
  };

  if (danger) {
    base.border = isMobile ? 'none' : '1px solid red';
    base.color = isMobile ? 'white' : hover ? 'red' : 'white';
    base.backgroundColor = isMobile ? 'transparent' : hover ? 'white' : 'black';
  }

  const props = {
    className: 'btn btn-sm me-2',
    style: base,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    title: label,
  };

  return asButton ? (
    <button onClick={onClick} {...props}>
{isMobile ? React.cloneElement(icon, { size: 20 }) : label}
    </button>
  ) : (
    <Link to={to} {...props}>
{isMobile ? React.cloneElement(icon, { size: 20 }) : label}
    </Link>
  );
};

export default Navbar;
