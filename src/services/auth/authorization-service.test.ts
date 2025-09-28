import { vi } from 'vitest';
import { AuthorizationService } from '@/services/auth/authorization-service';
import type { AuthConfig } from '@/services/auth/auth-types';
import { HttpClient } from '@/services/http';
import type { HttpResponse } from '@/services/http';
import type { TimeProvider } from '@/services/time/time-provider';

vi.mock('@/services/http', () => ({
  HttpClient: vi.fn().mockImplementation(() => ({
    send: vi.fn(),
  })),
}));

describe('AuthorizationService', () => {
  let authService: AuthorizationService;
  let mockHttpClient: HttpClient;
  let mockTimeProvider: TimeProvider;
  let authConfig: AuthConfig;

  beforeEach(() => {
    mockHttpClient = new HttpClient();
    
    mockTimeProvider = {
      now: vi.fn(),
      timestamp: vi.fn(),
      addSeconds: vi.fn(),
      addMinutes: vi.fn(),
    };

    authConfig = {
      tenantId: 'test-tenant-id',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      scope: 'https://graph.microsoft.com/.default',
    };

    authService = new AuthorizationService(authConfig, mockHttpClient, mockTimeProvider);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getToken', () => {
    it('should retrieve token from AAD and return AuthToken', async () => {
      const mockAADResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
      };

      const mockResponse: HttpResponse = {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        data: mockAADResponse,
        isSuccessStatusCode: true,
        ensureSuccessStatusCode: vi.fn(),
      };

      const mockNow = new Date('2023-01-01T12:00:00Z');
      const mockExpiresAt = new Date('2023-01-01T13:00:00Z');

      mockTimeProvider.now.mockReturnValue(mockNow);
      mockTimeProvider.addSeconds.mockReturnValue(mockExpiresAt);
      mockHttpClient.send.mockResolvedValue(mockResponse);

      const result = await authService.getToken();

      expect(mockHttpClient.send).toHaveBeenCalledWith({
        url: 'https://login.microsoftonline.com/test-tenant-id/oauth2/v2.0/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials&client_id=test-client-id&client_secret=test-client-secret&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default',
      });

      expect(mockResponse.ensureSuccessStatusCode).toHaveBeenCalled();
      expect(mockTimeProvider.now).toHaveBeenCalled();
      expect(mockTimeProvider.addSeconds).toHaveBeenCalledWith(mockNow, 3600);

      expect(result).toEqual({
        accessToken: 'test-access-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        expiresAt: mockExpiresAt,
      });
    });

    it('should handle AAD error response', async () => {
      const mockResponse: HttpResponse = {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        data: { error: 'invalid_client' },
        isSuccessStatusCode: false,
        ensureSuccessStatusCode: vi.fn(() => {
          throw new Error('HTTP Error 400: Bad Request');
        }),
      };

      mockHttpClient.send.mockResolvedValue(mockResponse);

      await expect(authService.getToken()).rejects.toThrow('HTTP Error 400: Bad Request');
      expect(mockResponse.ensureSuccessStatusCode).toHaveBeenCalled();
    });

    it('should calculate correct expiration date using TimeProvider', async () => {
      const expiresIn = 7200; // 2 hours
      const mockNow = new Date('2023-01-01T12:00:00Z');
      const mockExpiresAt = new Date('2023-01-01T14:00:00Z');

      const mockAADResponse = {
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: expiresIn,
      };

      const mockResponse: HttpResponse = {
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockAADResponse,
        isSuccessStatusCode: true,
        ensureSuccessStatusCode: vi.fn(),
      };

      mockTimeProvider.now.mockReturnValue(mockNow);
      mockTimeProvider.addSeconds.mockReturnValue(mockExpiresAt);
      mockHttpClient.send.mockResolvedValue(mockResponse);

      const result = await authService.getToken();

      expect(mockTimeProvider.addSeconds).toHaveBeenCalledWith(mockNow, expiresIn);
      expect(result.expiresAt).toBe(mockExpiresAt);
    });
  });

  describe('constructor', () => {
    it('should use provided dependencies', () => {
      const customHttpClient = new HttpClient();
      const customTimeProvider = mockTimeProvider;
      const service = new AuthorizationService(authConfig, customHttpClient, customTimeProvider);

      expect(service).toBeInstanceOf(AuthorizationService);
    });
  });
});