import { render, screen } from '@testing-library/react';
import { ResponseViewer } from '@/components/response-viewer/ResponseViewer';
import type { HttpResponse } from '@/services/http';

describe('ResponseViewer', () => {
  const mockResponse: HttpResponse<{ message: string }> = {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    data: { message: 'Hello World' },
    isSuccessStatusCode: true,
    ensureSuccessStatusCode: jest.fn(),
  };

  it('should display status and status text', () => {
    render(<ResponseViewer response={mockResponse} />);
    
    expect(screen.getByText(/200 OK/i)).toBeInTheDocument();
  });

  it('should display response headers', () => {
    render(<ResponseViewer response={mockResponse} />);
    
    expect(screen.getByText(/content-type/i)).toBeInTheDocument();
    expect(screen.getByText(/application\/json/i)).toBeInTheDocument();
  });

  it('should display formatted JSON response body', () => {
    render(<ResponseViewer response={mockResponse} />);
    
    expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
  });

  it('should show success indicator for successful responses', () => {
    render(<ResponseViewer response={mockResponse} />);
    
    expect(screen.getByText(/✅/)).toBeInTheDocument();
  });

  it('should show error indicator for failed responses', () => {
    const errorResponse: HttpResponse = {
      ...mockResponse,
      status: 404,
      statusText: 'Not Found',
      isSuccessStatusCode: false,
    };

    render(<ResponseViewer response={errorResponse} />);
    
    expect(screen.getByText(/❌/)).toBeInTheDocument();
    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
  });

  it('should not render when no response is provided', () => {
    const { container } = render(<ResponseViewer response={null} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should handle non-JSON response data', () => {
    const textResponse: HttpResponse<string> = {
      ...mockResponse,
      data: 'Plain text response',
    };

    render(<ResponseViewer response={textResponse} />);
    
    expect(screen.getByText(/Plain text response/i)).toBeInTheDocument();
  });
});