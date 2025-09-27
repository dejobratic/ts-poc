import { render, screen, fireEvent } from '@testing-library/react';
import { AuthConfiguration } from '@/components/auth-configuration/AuthConfiguration';
import type { AuthConfig } from '@/services/auth';

describe('AuthConfiguration', () => {
  const defaultConfig: AuthConfig = {
    tenantId: '',
    clientId: '',
    clientSecret: '',
    scope: 'https://graph.microsoft.com/.default',
  };

  const mockOnConfigChange = jest.fn();
  const mockOnGetToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all required input fields', () => {
    render(
      <AuthConfiguration
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
        onGetToken={mockOnGetToken}
        isTokenValid={false}
      />
    );

    expect(screen.getByRole('textbox', { name: /tenant id/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /client id/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /client secret/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /scope/i })).toBeInTheDocument();
  });

  it('should render get token button', () => {
    render(
      <AuthConfiguration
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
        onGetToken={mockOnGetToken}
        isTokenValid={false}
      />
    );

    expect(screen.getByRole('button', { name: /get token/i })).toBeInTheDocument();
  });

  it('should call onConfigChange when tenant ID changes', () => {
    render(
      <AuthConfiguration
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
        onGetToken={mockOnGetToken}
        isTokenValid={false}
      />
    );

    const tenantInput = screen.getByRole('textbox', { name: /tenant id/i });
    fireEvent.change(tenantInput, { target: { value: 'test-tenant' } });

    expect(mockOnConfigChange).toHaveBeenCalledWith({
      ...defaultConfig,
      tenantId: 'test-tenant',
    });
  });

  it('should call onGetToken when button is clicked', () => {
    render(
      <AuthConfiguration
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
        onGetToken={mockOnGetToken}
        isTokenValid={false}
      />
    );

    const getTokenButton = screen.getByRole('button', { name: /get token/i });
    fireEvent.click(getTokenButton);

    expect(mockOnGetToken).toHaveBeenCalled();
  });

  it('should show token valid status when token is valid', () => {
    render(
      <AuthConfiguration
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
        onGetToken={mockOnGetToken}
        isTokenValid={true}
      />
    );

    expect(screen.getByText(/token valid/i)).toBeInTheDocument();
  });

  it('should show token invalid status when token is invalid', () => {
    render(
      <AuthConfiguration
        config={defaultConfig}
        onConfigChange={mockOnConfigChange}
        onGetToken={mockOnGetToken}
        isTokenValid={false}
      />
    );

    expect(screen.getByText(/no token/i)).toBeInTheDocument();
  });
});