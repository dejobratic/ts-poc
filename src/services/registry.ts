import { AuthorizationService } from '@/services/auth';
import type { AuthConfig } from '@/services/auth';
import { ServiceContainer } from '@/services/container';
import { HttpClient } from '@/services/http';
import { SystemTimeProvider } from '@/services/time/time-provider';
import type { TimeProvider } from '@/services/time/time-provider';

// Single source of truth for service keys
export const Services = {
  HttpClient: 'HttpClient',
  TimeProvider: 'TimeProvider',
  AuthService: 'AuthService',
} as const;

// Type mapping for full type safety
export type ServiceMap = {
  [Services.HttpClient]: HttpClient;
  [Services.TimeProvider]: TimeProvider;
  [Services.AuthService]: AuthorizationService;
};

function getAuthConfig(): AuthConfig {
  return {
    tenantId: import.meta.env.APP_TENANT_ID || '',
    clientId: import.meta.env.APP_CLIENT_ID || '',
    clientSecret: import.meta.env.APP_CLIENT_SECRET || '',
    scope: import.meta.env.APP_SCOPE || 'https://graph.microsoft.com/.default',
  };
}

export function configureServices(): ServiceContainer {
  const serviceContainer = new ServiceContainer();
  const timeProvider = new SystemTimeProvider();
  const httpClient = new HttpClient();
  const authConfig = getAuthConfig();
  const authService = new AuthorizationService(authConfig, httpClient, timeProvider);

  serviceContainer.register(Services.TimeProvider, timeProvider);
  serviceContainer.register(Services.HttpClient, httpClient);
  serviceContainer.register(Services.AuthService, authService);

  return serviceContainer;
}