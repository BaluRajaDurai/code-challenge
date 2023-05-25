import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { getAllUsers } from './api';

// Testing the getAllUsers function
jest.mock('./api', () => ({
  getAllUsers: jest.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    getAllUsers.mockResolvedValue();
  });

  test('renders header and user details after loading users', async () => {
    render(<App />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeNull());
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('UserDetails')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
  });

  test('renders loading spinner while fetching users', async () => {
    render(<App />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeNull());
    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});
