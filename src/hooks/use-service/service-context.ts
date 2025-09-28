import { createContext } from 'react';

import type { ServiceContainer } from '@/services/container';

export const ServiceContext = createContext<ServiceContainer | null>(null);