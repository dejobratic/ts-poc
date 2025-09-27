import { render, screen, fireEvent } from '@testing-library/react';
import { RequestBuilder } from '@/components/request-builder/RequestBuilder';
import type { HttpRequest } from '@/services/http';

describe('RequestBuilder', () => {
  const defaultRequest: HttpRequest = {
    method: 'GET',
    url: '',
    headers: {},
  };

  const mockOnRequestChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render method selector with default GET', () => {
    render(<RequestBuilder request={defaultRequest} onRequestChange={mockOnRequestChange} />);
    
    const methodSelect = screen.getByRole('combobox', { name: /method/i });
    expect(methodSelect).toHaveValue('GET');
  });

  it('should render URL input field', () => {
    render(<RequestBuilder request={defaultRequest} onRequestChange={mockOnRequestChange} />);
    
    const urlInput = screen.getByRole('textbox', { name: /url/i });
    expect(urlInput).toBeInTheDocument();
  });

  it('should call onRequestChange when method changes', () => {
    render(<RequestBuilder request={defaultRequest} onRequestChange={mockOnRequestChange} />);
    
    const methodSelect = screen.getByRole('combobox', { name: /method/i });
    fireEvent.change(methodSelect, { target: { value: 'POST' } });

    expect(mockOnRequestChange).toHaveBeenCalledWith({
      ...defaultRequest,
      method: 'POST',
    });
  });

  it('should call onRequestChange when URL changes', () => {
    render(<RequestBuilder request={defaultRequest} onRequestChange={mockOnRequestChange} />);
    
    const urlInput = screen.getByRole('textbox', { name: /url/i });
    fireEvent.change(urlInput, { target: { value: 'https://api.example.com' } });

    expect(mockOnRequestChange).toHaveBeenCalledWith({
      ...defaultRequest,
      url: 'https://api.example.com',
    });
  });

  it('should show body editor when method is POST', () => {
    const postRequest = { ...defaultRequest, method: 'POST' as const };
    render(<RequestBuilder request={postRequest} onRequestChange={mockOnRequestChange} />);
    
    const bodyTextarea = screen.getByRole('textbox', { name: /body/i });
    expect(bodyTextarea).toBeInTheDocument();
  });

  it('should not show body editor when method is GET', () => {
    render(<RequestBuilder request={defaultRequest} onRequestChange={mockOnRequestChange} />);
    
    const bodyTextarea = screen.queryByRole('textbox', { name: /body/i });
    expect(bodyTextarea).not.toBeInTheDocument();
  });
});