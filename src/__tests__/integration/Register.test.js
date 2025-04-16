import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../../pages/Register';

jest.mock('../../services/authService', () => ({
  registerUser: jest.fn(() => Promise.resolve({ data: { message: 'Success' } })),
}));

describe('Register Page Integration Test', () => {
  test('allows user to fill the form and calls register', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // You can assert for success message or mock function call
    expect(await screen.findByText(/Registered successfully/i)).toBeInTheDocument();
  });
});
