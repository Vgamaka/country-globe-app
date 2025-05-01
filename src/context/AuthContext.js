import React, { createContext } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser, loginThunk } from '../features/user/userSlice';
import { useSelector } from 'react-redux';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const login = (email, password) => {
    dispatch(loginThunk({ email, password }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(clearUser());
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};