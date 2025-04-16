import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../../components/SearchBar';

describe('SearchBar Component', () => {
  test('renders input and triggers onChange', () => {
    const handleChange = jest.fn();

    render(<SearchBar value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Search countries by name...');
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'India' } });
    expect(handleChange).toHaveBeenCalledWith('India');
  });
});
