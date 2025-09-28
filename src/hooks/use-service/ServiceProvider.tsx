import type { ReactNode } from 'react';
import { ServiceContext } from './ServiceContext';
import type { ServiceContainer } from '@/services';

interface ServiceProviderProps {
  children: ReactNode;
  container: ServiceContainer;
}

export function ServiceProvider({ children, container }: ServiceProviderProps) {
  return (
    <ServiceContext.Provider value={container}>
      {children}
    </ServiceContext.Provider>
  );
}