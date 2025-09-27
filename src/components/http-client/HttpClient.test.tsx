import { render, screen, fireEvent } from '@testing-library/react';
import { HttpClient } from '@/components/http-client/HttpClient';

// Mock the service dependencies
jest.mock('@/services/http', () => ({
  HttpClient: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
}));

jest.mock('@/services/auth', () => ({
  AuthorizationService: jest.fn().mockImplementation(() => ({
    getToken: jest.fn(),
  })),
}));

jest.mock('@/services/time/time-provider', () => ({
  SystemTimeProvider: jest.fn().mockImplementation(() => ({
    now: jest.fn(),
    timestamp: jest.fn(),
    addSeconds: jest.fn(),
    addMinutes: jest.fn(),
  })),
}));

describe('HttpClient', () => {
  it('should render all main components', () => {
    render(<HttpClient />);
    
    expect(screen.getByText(/http client/i)).toBeInTheDocument();
    expect(screen.getByText(/authentication configuration/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send request/i })).toBeInTheDocument();
  });

  it('should render request builder form', () => {
    render(<HttpClient />);
    
    expect(screen.getByRole('combobox', { name: /method/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /url/i })).toBeInTheDocument();
  });

  it('should render auth configuration form', () => {
    render(<HttpClient />);
    
    expect(screen.getByRole('textbox', { name: /tenant id/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /client id/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /client secret/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /scope/i })).toBeInTheDocument();
  });

  it('should handle request changes', () => {
    render(<HttpClient />);
    
    const urlInput = screen.getByRole('textbox', { name: /url/i });
    fireEvent.change(urlInput, { target: { value: 'https://api.example.com' } });
    
    expect(urlInput).toHaveValue('https://api.example.com');
  });

  it('should handle auth config changes', () => {
    render(<HttpClient />);
    
    const tenantInput = screen.getByRole('textbox', { name: /tenant id/i });
    fireEvent.change(tenantInput, { target: { value: 'test-tenant' } });
    
    expect(tenantInput).toHaveValue('test-tenant');
  });

  it('should show empty response state initially', () => {
    render(<HttpClient />);
    
    expect(screen.queryByText(/response/i)).not.toBeInTheDocument();
  });

  it('should enable send button when URL is provided', () => {
    render(<HttpClient />);
    
    const urlInput = screen.getByRole('textbox', { name: /url/i });
    fireEvent.change(urlInput, { target: { value: 'https://api.example.com' } });
    
    const sendButton = screen.getByRole('button', { name: /send request/i });
    expect(sendButton).not.toBeDisabled();
  });

  it('should disable send button when URL is empty', () => {
    render(<HttpClient />);
    
    const sendButton = screen.getByRole('button', { name: /send request/i });
    expect(sendButton).toBeDisabled();
  });
});