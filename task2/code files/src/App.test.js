import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect } from '@jest/globals';
import App from './App';

// Mock requestAnimationFrame for testing
window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
window.cancelAnimationFrame = (id) => clearTimeout(id);

describe('Bottom Sheet App', () => {
  test('renders main content', () => {
    render(<App />);
    expect(screen.getByText('Bottom Sheet Demo')).toBeInTheDocument();
    expect(screen.getByText('Experience smooth spring animations with multiple snap points')).toBeInTheDocument();
  });

  test('renders control buttons', () => {
    render(<App />);
    expect(screen.getByText('Open Half')).toBeInTheDocument();
    expect(screen.getByText('Open Full')).toBeInTheDocument();
    expect(screen.getByText('Open Peek')).toBeInTheDocument();
  });

  test('opens bottom sheet when button is clicked', async () => {
    render(<App />);
    const openButton = screen.getByText('Open Half');
    
    fireEvent.click(openButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bottom Sheet Content')).toBeInTheDocument();
    });
  });

  test('closes bottom sheet when close button is clicked', async () => {
    render(<App />);
    const openButton = screen.getByText('Open Half');
    
    fireEvent.click(openButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bottom Sheet Content')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByLabelText('Close bottom sheet');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Bottom Sheet Content')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  test('closes bottom sheet when overlay is clicked', async () => {
    render(<App />);
    const openButton = screen.getByText('Open Half');
    
    fireEvent.click(openButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bottom Sheet Content')).toBeInTheDocument();
    });
    
    const overlay = document.querySelector('.bottom-sheet-overlay');
    fireEvent.click(overlay);
    
    await waitFor(() => {
      expect(screen.queryByText('Bottom Sheet Content')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  test('handles keyboard navigation', async () => {
    render(<App />);
    const openButton = screen.getByText('Open Half');
    
    fireEvent.click(openButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bottom Sheet Content')).toBeInTheDocument();
    });
    
    // Test Escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByText('Bottom Sheet Content')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  test('snap point buttons work correctly', async () => {
    render(<App />);
    const openButton = screen.getByText('Open Half');
    
    fireEvent.click(openButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bottom Sheet Content')).toBeInTheDocument();
    });
    
    // Test internal snap point buttons
    const peekButton = screen.getByText('Peek');
    const fullButton = screen.getByText('Full');
    
    expect(peekButton).toBeInTheDocument();
    expect(fullButton).toBeInTheDocument();
    
    fireEvent.click(peekButton);
    fireEvent.click(fullButton);
  });
});