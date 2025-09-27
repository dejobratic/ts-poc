export interface AuthConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  scope: string;
}

export interface AuthToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: Date;
}