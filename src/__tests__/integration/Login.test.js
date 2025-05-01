import React, { act } from 'react';
import { toast } from 'react-toastify';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../pages/Login';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { loginThunk } from '../../features/user/userSlice';
import { loginUser } from '../../services/authService';

// Mock react-toastify so ToastContainer renders and toast.success/error are jest fns
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

// Mock authService.loginUser
jest.mock('../../services/authService', () => ({
  loginUser: jest.fn(),
}));

const mockStore = configureStore({
  reducer: {
    user: userReducer,
  },
});

describe('Login Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form and submits credentials', async () => {
    // Arrange: mock a successful API response
    loginUser.mockResolvedValueOnce({
      data: {
        token: 'fake-token',
        user: { id: 'u123', email: 'test@email.com' },
      }
    });

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    // Act: fill and submit form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@email.com' }
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: '123456' }
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      // wait for thunk to dispatch and update state
      await mockStore.dispatch(loginThunk({ email: 'test@email.com', password: '123456' }));
    });

    // Assert: success toast called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login successful!');
    });
  });

  test('shows error toast when login fails', async () => {
    // Arrange: mock a failed API response
    loginUser.mockRejectedValueOnce(new Error());

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    // Act: fill and submit form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'wrong@email.com' }
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpass' }
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
      // wait for thunk to dispatch and update state
      await mockStore.dispatch(loginThunk({ email: 'wrong@email.com', password: 'wrongpass' }));
    });

    // Assert: error toast called with fallback message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  test('can toggle password visibility', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    const passwordInput = screen.getByLabelText(/Password/i);
    const toggleIcon = screen.getByTestId('password-toggle');

    // Initially hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    // Toggle visibility
    fireEvent.click(toggleIcon);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
