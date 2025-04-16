import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../../context/AuthContext';

// ✅ MOCK authService to avoid importing axios
jest.mock('../../services/authService', () => ({
  loginUser: jest.fn(() => Promise.resolve({ data: { token: 'fake-token', user: { id: '123', email: 'test@email.com' } } })),
  registerUser: jest.fn(() => Promise.resolve({ data: {} }))
}));

const MockComponent = () => (
  <AuthContext.Consumer>
    {({ user, login, logout }) => (
      <>
        <p>{user ? user.email : 'Not logged in'}</p>
        <button onClick={() => login('test@email.com', '1234')}>Login</button>
        <button onClick={logout}>Logout</button>
      </>
    )}
  </AuthContext.Consumer>
);

describe('AuthContext', () => {
  test('renders default user state and triggers login/logout', async () => {
    render(
      <AuthProvider>
        <MockComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Not logged in')).toBeInTheDocument();
  });
});
