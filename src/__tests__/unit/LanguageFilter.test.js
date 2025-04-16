import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageFilter from '../../components/LanguageFilter';

describe('LanguageFilter Component', () => {
  test('renders language dropdown and triggers onChange', () => {
    const handleChange = jest.fn();

    render(<LanguageFilter selectedLanguage="" onChange={handleChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'english' } });
    expect(handleChange).toHaveBeenCalledWith('english');
  });
});
