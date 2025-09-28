import { useContext } from 'react';
import { ServiceContext } from './ServiceContext';
import type { ServiceMap } from '@/services';

export function useService<K extends keyof ServiceMap>(key: K): ServiceMap[K] {
  const serviceContainer = useContext(ServiceContext);

  if (!serviceContainer) {
    throw new Error('useService must be used within a ServiceProvider');
  }

  return serviceContainer.get<ServiceMap[K]>(key);
}