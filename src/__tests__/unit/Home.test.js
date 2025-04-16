import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../../pages/Home';
import { BrowserRouter } from 'react-router-dom';

// ✅ Mock the entire service module
jest.mock('../../services/restcountries', () => ({
  getAllCountries: jest.fn()
}));

// 👇 Now we can import the mocked version
import { getAllCountries } from '../../services/restcountries';

const mockCountries = [
  {
    name: { common: 'India' },
    capital: ['New Delhi'],
    population: 1393409038,
    region: 'Asia',
    flags: { png: 'https://flagcdn.com/w320/in.png' },
    cca3: 'IND'
  }
];

test('renders countries from mock API', async () => {
  getAllCountries.mockResolvedValueOnce(mockCountries); // mock result

  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText(/New Delhi/)).toBeInTheDocument();
  });
});
