import { useState } from 'react';
import { RequestBuilder } from '@/components/request-builder/RequestBuilder';
import { AuthConfiguration } from '@/components/auth-configuration/AuthConfiguration';
import { ResponseViewer } from '@/components/response-viewer/ResponseViewer';
import { HttpClient as HttpService } from '@/services/http';
import { AuthorizationService } from '@/services/auth';
import { SystemTimeProvider } from '@/services/time/time-provider';
import type { HttpRequest, HttpResponse } from '@/services/http';
import type { AuthConfig, AuthToken } from '@/services/auth';

export function HttpClient() {
  const [request, setRequest] = useState<HttpRequest>({
    url: '',
    method: 'GET',
    headers: {},
    body: undefined,
  });

  const [authConfig, setAuthConfig] = useState<AuthConfig>({
    tenantId: '',
    clientId: '',
    clientSecret: '',
    scope: 'https://graph.microsoft.com/.default',
  });

  const [response, setResponse] = useState<HttpResponse | null>(null);
  const [authToken, setAuthToken] = useState<AuthToken | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const httpService = new HttpService();
  const timeProvider = new SystemTimeProvider();
  const authService = new AuthorizationService(authConfig, httpService, timeProvider);

  const handleGetToken = async () => {
    try {
      setIsLoading(true);
      const token = await authService.getToken();
      setAuthToken(token);
    } catch (error) {
      console.error('Failed to get token:', error);
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async () => {
    try {
      setIsLoading(true);
      
      // Add auth header if token is available
      const requestWithAuth = authToken 
        ? {
            ...request,
            headers: {
              ...request.headers,
              Authorization: `${authToken.tokenType} ${authToken.accessToken}`,
            },
          }
        : request;

      const httpResponse = await httpService.send(requestWithAuth);
      setResponse(httpResponse);
    } catch (error) {
      console.error('Request failed:', error);
      // Create an error response for display
      setResponse({
        status: 0,
        statusText: 'Request Failed',
        headers: {},
        data: error instanceof Error ? error.message : 'Unknown error',
        isSuccessStatusCode: false,
        ensureSuccessStatusCode: () => {},
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isTokenValid = authToken !== null && authToken.expiresAt > timeProvider.now();
  const canSendRequest = request.url.trim() !== '';

  return (
    <div>
      <h1>HTTP Client</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <RequestBuilder 
            request={request} 
            onRequestChange={setRequest} 
          />
          
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={handleSendRequest}
              disabled={!canSendRequest || isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>

        <div>
          <AuthConfiguration
            config={authConfig}
            onConfigChange={setAuthConfig}
            onGetToken={handleGetToken}
            isTokenValid={isTokenValid}
          />
        </div>
      </div>

      {response && (
        <div style={{ marginTop: '20px' }}>
          <ResponseViewer response={response} />
        </div>
      )}
    </div>
  );
}