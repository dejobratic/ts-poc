import axios from 'axios';
import { HttpClient } from './http-client';
import type { HttpRequest } from './http-types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClient', () => {
  let httpClient: HttpClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      request: jest.fn(),
    };
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    httpClient = new HttpClient({ baseUrl: 'https://api.example.com' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('send', () => {
    it('should make GET request and return HttpResponse with success status', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        data: { success: true },
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const request: HttpRequest = {
        url: '/test',
        method: 'GET',
        headers: { 'Authorization': 'Bearer token' },
      };

      const result = await httpClient.send(request);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/test',
        method: 'GET',
        headers: { 'Authorization': 'Bearer token' },
        data: undefined,
      });
      expect(result).toEqual({
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        data: { success: true },
        isSuccessStatusCode: true,
        ensureSuccessStatusCode: expect.any(Function),
      });
    });

    it('should make POST request with body using HttpRequest object', async () => {
      const mockResponse = {
        status: 201,
        statusText: 'Created',
        headers: {},
        data: { id: 123 },
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const request: HttpRequest = {
        url: '/create',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { name: 'Test Item' },
      };

      const result = await httpClient.send(request);

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/create',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { name: 'Test Item' },
      });
      expect(result).toEqual({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: { id: 123 },
        isSuccessStatusCode: true,
        ensureSuccessStatusCode: expect.any(Function),
      });
    });

    it('should handle error status and set isSuccessStatusCode to false', async () => {
      const mockResponse = {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        data: { error: 'Resource not found' },
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const request: HttpRequest = {
        url: '/notfound',
        method: 'GET',
      };

      const result = await httpClient.send(request);

      expect(result).toEqual({
        status: 404,
        statusText: 'Not Found',
        headers: {},
        data: { error: 'Resource not found' },
        isSuccessStatusCode: false,
        ensureSuccessStatusCode: expect.any(Function),
      });
    });

    it('should throw error when ensureSuccessStatusCode is called on failed response', async () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        data: { error: 'Server error' },
      };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const request: HttpRequest = {
        url: '/error',
        method: 'GET',
      };

      const result = await httpClient.send(request);

      expect(() => result.ensureSuccessStatusCode()).toThrow('HTTP Error 500: Internal Server Error');
    });
  });

  describe('constructor', () => {
    it('should create axios instance with HttpOptions', () => {
      new HttpClient({ baseUrl: 'https://test.com', timeout: 5000 });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://test.com',
        timeout: 5000,
      });
    });

    it('should create axios instance with partial HttpOptions', () => {
      new HttpClient({ baseUrl: 'https://test.com' });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://test.com',
        timeout: 30000,
      });
    });

    it('should create axios instance with default timeout when no options provided', () => {
      new HttpClient();

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: undefined,
        timeout: 30000,
      });
    });

    it('should create axios instance with custom timeout only', () => {
      new HttpClient({ timeout: 60000 });

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: undefined,
        timeout: 60000,
      });
    });
  });
});