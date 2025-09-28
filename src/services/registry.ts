import { ServiceContainer } from './container';
import { HttpClient } from './http';
import { SystemTimeProvider } from './time/time-provider';
import { AuthorizationService } from './auth';
import type { AuthConfig } from './auth';
import type { TimeProvider } from './time/time-provider';

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
    tenantId: import.meta.env.VITE_TENANT_ID || '',
    clientId: import.meta.env.VITE_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_CLIENT_SECRET || '',
    scope: import.meta.env.VITE_SCOPE || 'https://graph.microsoft.com/.default',
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