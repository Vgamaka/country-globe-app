jest.mock('../../services/authService', () => ({
  loginUser: jest.fn(() => Promise.resolve({
    data: {
      token: 'fake-token',
      user: { id: 'u123', email: 'test@email.com' },
    }
  }))
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../pages/Login';
import { AuthContext } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { loginUser } from '../../services/authService';

describe('Login Integration Test', () => {
  const mockLogin = jest.fn();

  test('allows user to input credentials and calls login', async () => {
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@email.com', '123456');
    });
  });
});
