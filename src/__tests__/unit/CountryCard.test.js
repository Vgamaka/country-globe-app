import React from 'react';
import { render, screen } from '@testing-library/react';
import CountryCard from '../../components/CountryCard';
import { BrowserRouter } from 'react-router-dom';

const mockCountry = {
  name: { common: 'Sri Lanka' },
  capital: ['Colombo'],
  population: 21000000,
  region: 'Asia',
  flags: { png: 'https://flagcdn.com/w320/lk.png' },
  cca3: 'LKA'
};

test('renders CountryCard correctly', () => {
  render(
    <BrowserRouter>
      <CountryCard country={mockCountry} />
    </BrowserRouter>
  );

  expect(screen.getByText('Sri Lanka')).toBeInTheDocument();
  expect(screen.getByText(/Capital:/)).toBeInTheDocument();
  expect(screen.getByText(/Colombo/)).toBeInTheDocument();
});
