import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import CountryDetails from '../../pages/CountryDetails';

jest.mock('../../services/restcountries', () => ({
  getCountryByCode: jest.fn(),
}));

jest.mock('../../services/userDataService', () => ({
  addFavorite: jest.fn(),
  addNote: jest.fn(),
}));
jest.mock('../../services/authService', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));


import { getCountryByCode } from '../../services/restcountries';

const mockCountry = [{
  cca3: 'SGS',
  name: {
    common: 'South Georgia',
    official: 'South Georgia and the South Sandwich Islands',
  },
  capital: ['King Edward Point'],
  region: 'Antarctic',
  population: 30,
  flags: { png: 'https://flagcdn.com/sg.png' },
  languages: { eng: 'English' }
}];

describe('CountryDetails Page - South Georgia', () => {
  test('displays country data for South Georgia', async () => {
    getCountryByCode.mockResolvedValueOnce(mockCountry);

    render(
      <AuthContext.Provider value={{ user: { id: 1 } }}>
        <MemoryRouter initialEntries={['/details/SGS']}>
          <Routes>
            <Route path="/details/:code" element={<CountryDetails />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/South Georgia and the South Sandwich Islands/i)).toBeInTheDocument();
      expect(screen.getByText(/King Edward Point/i)).toBeInTheDocument();
      expect(screen.getByText(/Antarctic/i)).toBeInTheDocument();
      expect(screen.getByText(/30/i)).toBeInTheDocument();
      expect(screen.getByText(/English/i)).toBeInTheDocument();
    });
  });
});
