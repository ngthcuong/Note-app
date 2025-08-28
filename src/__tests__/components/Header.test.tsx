import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Header from '../../components/Header';
import { AuthProvider } from '../../contexts/AuthContext';

describe('Header Component', () => {
  test('renders Header component in Home Page', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </AuthProvider>
    );
    // Update this test based on your actual Header component content
    const headerElement = screen.getByText('Trang chủ');
    expect(headerElement).toBeInTheDocument();
  });
});
