import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../../context/AuthContext';
import { loginUser } from '../../services/authService'; // import mock
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../features/user/userSlice';

jest.mock('../../services/authService', () => ({
  loginUser: jest.fn(() =>
    Promise.resolve({
      data: {
        token: 'mock-token',
        user: mockUser,
      },
    })
  )
}));

const mockUser = { id: 'u123', email: 'test@email.com' };

const MockComponent = () => (
  <AuthContext.Consumer>
    {({ user, login, logout }) => (
      <>
        <p data-testid="user-status">{user ? user.email : 'Not logged in'}</p>
        <button onClick={() => login('test@email.com', '1234')}>Login</button>
        <button onClick={logout}>Logout</button>
      </>
    )}
  </AuthContext.Consumer>
);

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    loginUser.mockResolvedValue({
      data: {
        token: 'test-token',
        user: mockUser,
      },
    });
  });

  test('renders default user state and updates after login', async () => {
    const store = configureStore({
      reducer: { user: userReducer },
    });

    render(
      <Provider store={store}>
        <AuthProvider>
          <MockComponent />
        </AuthProvider>
      </Provider>
    );


    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');

    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent(mockUser.email);
    });
  });

  test('clears user on logout', async () => {
    const store = configureStore({
      reducer: { user: userReducer },
    });

    render(
      <Provider store={store}>
        <AuthProvider>
          <MockComponent />
        </AuthProvider>
      </Provider>
    );

    // click Login and wait for context to update
    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });
    await waitFor(() =>
      expect(screen.getByTestId('user-status')).toHaveTextContent(mockUser.email)
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Logout'));
    });

    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
  });
});
