import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegionFilter from '../../components/RegionFilter';

describe('RegionFilter Component', () => {
  test('renders dropdown and calls onChange', () => {
    const handleChange = jest.fn();

    render(<RegionFilter selectedRegion="" onChange={handleChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'Asia' } });
    expect(handleChange).toHaveBeenCalledWith('Asia');
  });
});
