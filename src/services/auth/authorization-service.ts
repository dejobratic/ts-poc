import type { AuthConfig, AuthToken } from '@/services/auth/auth-types';
import { HttpClient } from '@/services/http';
import type { HttpRequest } from '@/services/http';
import type { TimeProvider } from '@/services/time/time-provider';

export class AuthorizationService {
  private readonly httpClient: HttpClient;
  private readonly config: AuthConfig;
  private readonly timeProvider: TimeProvider;

  constructor(config: AuthConfig, httpClient: HttpClient, timeProvider: TimeProvider) {
    this.config = config;
    this.httpClient = httpClient;
    this.timeProvider = timeProvider;
  }

  async getToken(): Promise<AuthToken> {
    const request = this.createTokenRequest();

    const response = await this.httpClient.send<AADTokenResponse>(request);
    response.ensureSuccessStatusCode();

    return this.mapToAuthToken(response.data);
  }

  private createTokenRequest(): HttpRequest {
    return {
      url: `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.createTokenRequestBody(),
    };
  }

  private createTokenRequestBody(): string {
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      scope: this.config.scope,
    });
    return params.toString();
  }

  private mapToAuthToken(aadResponse: AADTokenResponse): AuthToken {
    const expiresAt = this.timeProvider.addSeconds(this.timeProvider.now(), aadResponse.expires_in);
    
    return {
      accessToken: aadResponse.access_token,
      tokenType: aadResponse.token_type,
      expiresIn: aadResponse.expires_in,
      expiresAt,
    };
  }
}

interface AADTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}