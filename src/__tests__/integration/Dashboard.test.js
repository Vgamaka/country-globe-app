jest.mock('../../services/userDataService', () => ({
    getFavorites: jest.fn(),
    getNotes: jest.fn(),
    deleteNote: jest.fn(),
    updateNote: jest.fn(),
}));
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../features/user/userSlice'; 
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
import { AuthContext } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react';
import {
    getFavorites,
    getNotes,
    deleteNote,
    updateNote,
} from '../../services/userDataService';


const mockFavorites = [
    { _id: '1', countryCode: 'IND', countryName: 'India' },
    { _id: '2', countryCode: 'USA', countryName: 'United States' }
];

const mockNotes = [
    { _id: 'n1', countryCode: 'IND', countryName: 'India', text: 'Visited in 2023' },
    { _id: 'n2', countryCode: 'JPN', countryName: 'Japan', text: 'Bucket list' }
];

const renderWithProviders = (ui) => {
    const mockStore = configureStore({
        reducer: {
            user: userReducer
        },
        preloadedState: {
            user: {
                user: { id: '123', email: 'user@test.com' },
                status: 'succeeded',
                error: null
            }
        }
    });

    return render(
        <Provider store={mockStore}>
            <BrowserRouter>
                {ui}
            </BrowserRouter>
        </Provider>
    );
};


describe('Dashboard Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders favorites and notes', async () => {
        getFavorites.mockResolvedValueOnce({ data: mockFavorites });
        getNotes.mockResolvedValueOnce({ data: mockNotes });
      
        renderWithProviders(<Dashboard />);
      
        const indiaElements = await screen.findAllByText('India');
        expect(indiaElements.length).toBeGreaterThanOrEqual(2);
      
        expect(screen.getByText('United States')).toBeInTheDocument();
        expect(screen.getByText('Visited in 2023')).toBeInTheDocument();
        expect(screen.getByText('Bucket list')).toBeInTheDocument();
      });
      
      
    test('allows editing and saving a note', async () => {
        getFavorites.mockResolvedValueOnce({ data: [] });
        getNotes.mockResolvedValueOnce({ data: mockNotes });

        renderWithProviders(<Dashboard />);

        await waitFor(() => {
            const note = screen.getByText('Bucket list');
            expect(note).toBeInTheDocument();
        }, { timeout: 2000 });

        await act(async () => {
            fireEvent.click(screen.getAllByText('Edit')[1]);
        });

        const textarea = screen.getByDisplayValue('Bucket list');
        fireEvent.change(textarea, { target: { value: 'Updated note text' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Save'));
        });

        expect(updateNote).toHaveBeenCalledWith('n2', 'Updated note text');
    });

    test('allows deleting a note', async () => {
        getFavorites.mockResolvedValueOnce({ data: [] });
        getNotes.mockResolvedValueOnce({ data: mockNotes });
        deleteNote.mockResolvedValueOnce({});

        renderWithProviders(<Dashboard />);

        await waitFor(() => expect(screen.getByText('Visited in 2023')).toBeInTheDocument());

        await act(async () => {
            fireEvent.click(screen.getAllByText('Delete')[0]);
        });

        expect(deleteNote).toHaveBeenCalledWith('n1');
    });

    test('shows empty state messages', async () => {
        getFavorites.mockResolvedValueOnce({ data: [] });
        getNotes.mockResolvedValueOnce({ data: [] });

        renderWithProviders(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText(/No favorites yet/i)).toBeInTheDocument();
            expect(screen.getByText(/No notes yet/i)).toBeInTheDocument();
        });
    });
});
