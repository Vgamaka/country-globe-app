import React from 'react';
import { toast } from 'react-toastify';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../../pages/Register';
import { act } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import registerReducer from '../../redux/slices/registerSlice';

// single jest.mock for toast + container
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

jest.mock('../../services/authService', () => ({
  registerUser: jest.fn()
}));

const createMockStore = () =>
  configureStore({
    reducer: {
      register: registerReducer
    },
    preloadedState: {
      register: {
        status: 'idle',
        error: null
      }
    }
  });


import { registerUser } from '../../services/authService';

describe('Register Page Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields and allows registration', async () => {
    registerUser.mockResolvedValueOnce({ data: { message: 'Success' } });

    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' }
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Registered successfully!');
    });

    expect(registerUser).toHaveBeenCalledWith('test@example.com', 'password123');
  });


  test('shows error toast when registration fails', async () => {
    registerUser.mockRejectedValueOnce(new Error('User already exists'));

    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'exists@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' }
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
    });

    // now assert directly on the mocked toast.error call:
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('User already exists');
    });
  });
});
