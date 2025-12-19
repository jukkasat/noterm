import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '@/pages/NotFound';

// Mock unhead
vi.mock('@unhead/react', () => ({
  useSeoMeta: vi.fn(),
}));

describe('NotFound page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear console.error spy
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render 404 heading', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render error message', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText(/Oops! Page not found/i)).toBeInTheDocument();
  });

  it('should render link to home page', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const homeLink = screen.getByText(/Return to Home/i);
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should log error to console with pathname', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('404 Error'),
      expect.any(String)
    );

    consoleSpy.mockRestore();
  });

  it('should have correct styling classes', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const heading = screen.getByText('404');
    const outerDiv = heading.parentElement?.parentElement;
    expect(outerDiv).toHaveClass('min-h-screen');
  });

  it('should render with dark mode support', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const heading = screen.getByText('404');
    expect(heading).toHaveClass('dark:text-gray-100');
  });
});