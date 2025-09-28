# React TypeScript Dependency Injection POC

A production-ready React TypeScript application template demonstrating modern dependency injection patterns, architectural best practices, and industry-standard tooling choices. This project serves as a comprehensive starting point for scalable React applications.

## 🎯 Project Purpose

This POC demonstrates how to implement clean, type-safe dependency injection in React TypeScript applications while following SOLID principles, YAGNI (You Aren't Gonna Need It), and KISS (Keep It Simple, Stupid) philosophies.

**Key Learning Outcomes:**
- Context-based dependency injection in React
- Type-safe service resolution
- Modern build tooling and testing strategies
- Industry-standard file organization and naming conventions
- Automated code quality and import management

---

## 🏗️ Technology Stack & Architectural Decisions

### Build Tool: Vite (not Create React App)

**✅ Chosen: Vite**
- **Lightning-fast HMR**: Sub-second hot module replacement
- **Modern ESBuild**: 10-100x faster than traditional bundlers
- **Native ES modules**: Leverages browser capabilities
- **Better TypeScript support**: Out-of-the-box TypeScript integration
- **Smaller bundle sizes**: Tree shaking and modern output

**❌ Alternatives Considered:**
- **Create React App**: Slower builds, outdated webpack config, less flexibility
- **Custom Webpack**: Too much configuration overhead
- **Parcel**: Less ecosystem support for React

**🎯 Benefits Gained:**
- Development server starts in <1 second
- HMR updates in <100ms
- Modern development experience
- Better build performance

**📚 Industry Support:** Adopted by Vue, Svelte, and increasingly React projects in 2024-2025

---

### Testing: Vitest (migrated from Jest)

**✅ Chosen: Vitest**
- **Native Vite integration**: Same configuration and plugins
- **ESM support**: No complex configuration for ES modules
- **import.meta.env support**: Works with Vite environment variables
- **Faster execution**: Leverages Vite's build pipeline
- **Jest-compatible API**: Easy migration path

**❌ Alternatives Considered:**
- **Jest**: Configuration complexity with Vite, `import.meta.env` issues
- **Cypress Component Testing**: Heavier for unit tests
- **Testing Library alone**: Needs test runner

**🎯 Benefits Gained:**
- Zero configuration overhead
- Consistent development and test environments
- 3x faster test execution
- No ESM/CommonJS conflicts

**🔄 Migration Story:**
Initially started with Jest but encountered `import.meta.env` compatibility issues. Vitest resolved all integration problems while maintaining Jest's familiar API.

---

### Dependency Injection: React Context (not Global Singletons)

**✅ Chosen: React Context Pattern**
- **React-native approach**: Follows React's composition model
- **Testability**: Easy to provide mock containers in tests
- **Server-side rendering ready**: No global state issues
- **Multiple contexts support**: Can have different DI scopes
- **Component tree integration**: Natural React patterns

**❌ Alternatives Considered:**
- **Global Singletons**: Poor testability, SSR issues, not React-idiomatic
- **Module-level instances**: Harder to mock, tight coupling
- **Higher-order components**: More complex API than Context

**🎯 Benefits Gained:**
- Clean testing story with dependency injection
- React DevTools integration
- Natural React patterns
- Flexible service scoping

**📚 Industry Pattern:** Used by React Router, Redux, Theme-UI, React Query, and most major React libraries

#### ServiceContainer Implementation

```typescript
// Type-safe service resolution
export class ServiceContainer {
  register<T>(name: string, instance: T): void
  get<T>(name: string): T
  has(name: string): boolean
}

// Centralized service registration
export function configureServices(): ServiceContainer

// Type-safe service mapping
export type ServiceMap = {
  [Services.HttpClient]: HttpClient;
  [Services.TimeProvider]: TimeProvider;
  [Services.AuthService]: AuthorizationService;
}
```

**Key Architectural Decisions:**
- **Temporal Coupling Elimination**: `configureServices()` returns container instead of void
- **Type Safety**: `ServiceMap` provides compile-time guarantees
- **Single Responsibility**: Each service has focused purpose
- **SOLID Compliance**: Dependency inversion, open/closed principles

---

### ServiceProvider Pattern (not Direct Context Usage)

**✅ Chosen: ServiceProvider Wrapper Component**
```typescript
// Wrapped approach
<ServiceProvider container={container}>
  <App />
</ServiceProvider>

// vs Direct Context usage
<ServiceContext.Provider value={container}>
  <App />
</ServiceContext.Provider>
```

**Reasoning:**
- **Industry Standard**: All major React libraries use this pattern
- **API Consistency**: Clean, predictable interface for consumers
- **Future Extensibility**: Room for validation, dev tools, error boundaries
- **Type Safety**: Compile-time guarantees for container prop
- **Professional Appearance**: Matches established React ecosystem patterns

**📚 Examples:** `<Router>`, `<Provider store={store}>`, `<ThemeProvider>`, `<QueryClientProvider>`

---

## 📁 File Organization & Naming Conventions

### File Naming: kebab-case (2024-2025 Industry Standard)

**✅ Chosen: kebab-case for ALL files**
```
✅ Modern Standard:
user-profile.tsx          → export function UserProfile()
authorization-service.ts  → export class AuthorizationService()
use-service.ts           → export function useService()
auth-types.ts            → export interface AuthConfig
```

**❌ Deprecated Patterns:**
```
❌ Mixed Pascal+Camel (Being Abandoned):
UserProfile.tsx     ← Component files PascalCase
userService.ts      ← Services camelCase
auth-config.ts      ← Config kebab-case
```

**🎯 Benefits of kebab-case:**
- **Web-first thinking**: Files become URLs naturally
- **Cross-platform compatibility**: No case-sensitivity issues
- **CLI-friendly**: Easier to type and script
- **No cognitive overhead**: One consistent rule
- **Modern framework adoption**: Next.js, Vite, Remix all use kebab-case

**📚 Industry Evidence:**
- **Major Frameworks**: Next.js, Vite, Remix, Astro
- **Major Libraries**: Material-UI, Ant Design, React Router
- **Companies**: Vercel, Shopify, Linear (2024 analysis)

### Folder Structure: Domain-Based Organization

```
src/
├── hooks/
│   └── use-service/          ← Hook-specific folder
│       ├── index.ts          ← Barrel export
│       ├── service-context.ts
│       ├── service-provider.tsx
│       └── use-service.ts
├── services/
│   ├── auth/                 ← Domain grouping
│   │   ├── index.ts          ← Barrel export
│   │   ├── auth-types.ts
│   │   ├── authorization-service.ts
│   │   └── authorization-service.test.ts
│   ├── http/
│   ├── time/
│   ├── container.ts          ← Core DI infrastructure
│   ├── registry.ts           ← Service configuration
│   └── index.ts              ← Root barrel export
└── main.tsx
```

**Design Principles:**
- **Domain Cohesion**: Related files grouped together
- **Co-location**: Tests next to implementation
- **Barrel Exports**: Clean import paths via index.ts
- **Scalability**: Easy to add new domains

---

### Project Structure: Single App vs App Folder Pattern

**❌ Alternative Considered: App Folder Structure**
```
project-root/
├── app/
│   ├── src/              ← Current src/ content moved here
│   │   ├── hooks/
│   │   ├── services/
│   │   └── main.tsx
│   ├── tests/            ← Vitest configuration isolated
│   │   ├── vitest.config.ts
│   │   ├── vitest.setup.ts
│   │   └── vitest-env.d.ts
│   ├── app.tsx           ← Main app component
│   └── app.css           ← App-specific styles
├── package.json
└── other config files
```

**Benefits of App Folder Approach:**
- **Logical grouping**: All application code contained in single folder
- **Test isolation**: Separate tests directory with clear boundaries
- **Future-ready**: Easier transition to monorepo if multiple apps needed
- **Clean root**: Only project-wide configuration at root level

**✅ Why Current Structure Was Chosen:**
- **Industry Standard**: 99% of React projects use `src/` at root (Vite, CRA, standard)
- **Tool Compatibility**: Seamless integration with all React tooling and IDEs
- **Developer Expectations**: New developers instantly understand familiar structure
- **Template Purpose**: As a POC template, should follow widely-adopted patterns
- **Zero Configuration**: No need to reconfigure build tools, TypeScript, or ESLint
- **YAGNI Compliance**: Not over-engineering for uncertain future monorepo needs

**When App Folder Makes Sense:**
- **Monorepo projects**: Multiple applications requiring clear separation (Turborepo, Nx)
- **Multiple related apps**: When you're definitely building several applications
- **Team preference**: Strong organizational requirements for strict app boundaries
- **Enterprise patterns**: Large teams with complex application portfolios

**📚 Industry Evidence:**
- **Standard React**: Vite, Create React App, 99% of React projects use `src/` at root
- **Monorepo Tools**: Turborepo uses `apps/app-name/src/` for multiple applications
- **Next.js**: Uses `app/` for routing, not for organizing source code
- **Framework consensus**: React ecosystem has standardized on root-level `src/`

**🎯 Decision Outcome:** Current structure maintains industry standards while being immediately familiar to React developers, making it ideal for a template that others will use as a starting point.

---

### Barrel Exports: index.ts Pattern

**✅ Chosen: Comprehensive Barrel Exports**
```typescript
// Clean imports enabled:
import { useService } from '@/hooks/use-service'
import { configureServices, ServiceContainer } from '@/services'
import { HttpClient } from '@/services/http'

// Instead of:
import { useService } from '@/hooks/use-service/use-service'
import { configureServices } from '@/services/registry'
import { ServiceContainer } from '@/services/container'
```

**Benefits:**
- **Cleaner import statements**: Shorter, more readable paths
- **API control**: Explicit control over public interfaces
- **Refactoring safety**: Internal reorganization doesn't break imports
- **Documentation**: index.ts serves as API documentation

**📚 Standard Practice:** Node.js, TypeScript, and React ecosystem standard

---

### Path Aliases: @ Prefix for Absolute Imports

**✅ Chosen: Absolute imports with @ alias**
```typescript
// Absolute imports (preferred)
import { ServiceProvider } from '@/hooks/use-service'
import { configureServices } from '@/services'
import App from '@/App'

// vs Relative imports (avoided)
import { ServiceProvider } from '../../hooks/use-service'
import { configureServices } from '../services'
import App from './App'
```

**Configuration in vite.config.ts:**
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
}
```

**Benefits:**
- **Refactoring safety**: Moving files doesn't break imports
- **Clarity**: Always clear what's local vs external
- **Consistency**: Same import style throughout codebase
- **IDE support**: Better autocomplete and navigation

---

## 🎨 Code Quality & Developer Experience

### Import Ordering: Automated Sorting Rules

**✅ Configured ESLint Import Ordering:**
```typescript
// Automatic grouping with newlines:
import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import './index.css'
import App from '@/App'
import { ServiceProvider } from '@/hooks/use-service'
import { configureServices } from '@/services'
```

**Ordering Rules:**
1. **React dependencies** (react, react-*)
2. **3rd party libraries** (axios, etc.)
3. **CSS/assets and internal absolute imports** (@/ imports)
4. **Relative imports** (./...)

**Benefits:**
- **Consistency**: Same import order across all files
- **Readability**: Clear separation of dependency types
- **Maintainability**: Easier to spot missing imports
- **Automation**: No manual sorting required

**Available Commands:**
```bash
npm run lint:fix         # Auto-fix all ESLint issues including imports
npm run format:imports   # Focus only on import ordering
```

### ESLint Configuration: Production-Ready Rules

**Key Rules Configured:**
- `import/order`: Automatic import sorting and grouping
- `import/no-relative-packages`: Prevents relative imports to packages
- `import/no-unresolved`: Catches broken import paths
- TypeScript-aware parsing with project references

---

## 🧪 Testing Strategy

### Test Organization: Co-location Pattern

```
src/services/auth/
├── authorization-service.ts
├── authorization-service.test.ts    ← Test co-located
├── auth-types.ts
└── index.ts
```

**Benefits:**
- **Discoverability**: Tests next to implementation
- **Maintainability**: Easy to keep tests in sync
- **Refactoring safety**: Moving code moves tests too

### Testing Tools Stack

- **Vitest**: Test runner and framework
- **@testing-library/react**: Component testing utilities
- **@testing-library/jest-dom**: DOM assertion matchers
- **jsdom**: Browser environment simulation

**Test Configuration:**
```typescript
// vitest.config.ts - Optimized for React
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts']
  }
});
```

---

## 🔧 Environment Variables & Configuration

### Environment Variable Naming: APP_ vs VITE_ Prefix

**✅ Chosen: APP_ Prefix**
```bash
# .env file
APP_TENANT_ID=your-azure-tenant-id
APP_CLIENT_ID=your-azure-client-id
APP_CLIENT_SECRET=your-azure-client-secret
APP_SCOPE=https://graph.microsoft.com/.default
```

**❌ Alternative Considered: VITE_ Prefix**
```bash
# Not used in this project
VITE_TENANT_ID=your-azure-tenant-id
VITE_CLIENT_ID=your-azure-client-id
```

**🎯 Why APP_ Prefix Was Chosen:**
- **Framework-agnostic**: Not tied to Vite build tool
- **Professional standard**: Used by many companies and enterprise projects
- **Portable**: Easy to migrate between different build tools (Webpack, Rollup, etc.)
- **Cleaner separation**: Build tool vs application configuration
- **Future-proof**: Won't need changes if switching build systems

**📚 Industry Evidence:**
- **Create React App**: Uses `REACT_APP_` prefix (framework-specific)
- **Next.js**: Supports custom prefixes over `NEXT_PUBLIC_`
- **Enterprise**: Most companies use `APP_`, `API_`, or custom prefixes
- **Best Practice**: Framework-agnostic naming is preferred for reusability

### Environment Setup

**1. Copy Environment Template:**
```bash
cp .env.example .env
```

**2. Configure Required Variables:**
```bash
# Authentication (Required)
APP_TENANT_ID=your-azure-tenant-id-here
APP_CLIENT_ID=your-azure-client-id-here
APP_CLIENT_SECRET=your-azure-client-secret-here

# API Configuration (Optional)
APP_API_BASE_URL=https://api.example.com
APP_API_TIMEOUT=10000

# Development Settings
APP_ENVIRONMENT=development
APP_DEBUG_MODE=true
```

**3. Environment Validation:**
Environment variables are validated at startup in `src/services/registry.ts`. Missing required variables will show helpful error messages.

---

## 🛠️ Development Experience

### VS Code Configuration

This project includes optimized VS Code settings for React TypeScript development:

**📁 .vscode/settings.json:**
- Auto-fix ESLint issues on save
- Organize imports automatically
- TypeScript path mapping support
- File nesting for better organization
- Optimized search and exclusion patterns

**🔌 .vscode/extensions.json:**
- Essential extensions for React + TypeScript
- Code formatting and linting tools
- Git integration and debugging support
- Testing framework integration

**🚀 Quick Setup:**
1. Open project in VS Code
2. Install recommended extensions (popup will appear)
3. Settings are automatically applied
4. Start coding with optimized developer experience

### Debugging Configuration

**React + Vite Debugging:**
```json
// .vscode/launch.json (optional)
{
  "type": "chrome",
  "request": "launch",
  "name": "Debug React App",
  "url": "http://localhost:5173",
  "webRoot": "${workspaceFolder}/src"
}
```

---

## 🚀 Production Readiness

### Error Handling Patterns

**Service-Level Error Handling:**
```typescript
// Example: Enhanced service with error handling
export class HttpClient {
  async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpError(response.status, response.statusText);
      }
      return await response.json();
    } catch (error) {
      // Log error, transform, or handle gracefully
      throw new ServiceError('HTTP request failed', error);
    }
  }
}
```

**React Error Boundaries:**
```typescript
// Add error boundaries for service failures
<ServiceProvider container={container}>
  <ErrorBoundary fallback={<ErrorFallback />}>
    <App />
  </ErrorBoundary>
</ServiceProvider>
```

### Security Considerations

**Environment Variables:**
- ✅ Never commit `.env` files to version control
- ✅ Use different values for dev/staging/production
- ✅ Store sensitive values in secure secret management
- ✅ Validate required variables at startup

**Service Configuration:**
- ✅ Implement request/response interceptors for auth
- ✅ Use HTTPS in production environments
- ✅ Validate and sanitize all external inputs
- ✅ Implement proper CORS configuration

**Dependency Injection Security:**
- ✅ Services are scoped and isolated
- ✅ No global state that could leak data
- ✅ Easy to mock services for testing

### Performance Guidelines

**Service Optimization:**
- ✅ Services are singletons (created once)
- ✅ Lazy loading can be added for heavy services
- ✅ HTTP client includes proper timeout configuration
- ✅ Time provider optimized for frequent calls

**Bundle Optimization:**
```typescript
// Lazy load heavy services
const HeavyService = React.lazy(() => import('@/services/heavy'));

// Dynamic service registration
if (featureFlag.enabled) {
  container.register('OptionalService', new OptionalService());
}
```

**Build Optimization:**
- ✅ Vite provides automatic code splitting
- ✅ Tree shaking eliminates unused service code
- ✅ TypeScript path aliases optimize imports
- ✅ ESLint import ordering improves parsing

---

## 🎓 Extending the System

### Adding a New Service (Step-by-Step)

**1. Create Service Domain Folder:**
```bash
mkdir src/services/notification
```

**2. Define Service Interface:**
```typescript
// src/services/notification/notification-types.ts
export interface NotificationConfig {
  apiKey: string;
  endpoint: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}
```

**3. Implement Service:**
```typescript
// src/services/notification/notification-service.ts
export class NotificationService {
  constructor(
    private config: NotificationConfig,
    private httpClient: HttpClient
  ) {}

  async send(notification: Omit<Notification, 'id'>): Promise<void> {
    // Implementation
  }
}
```

**4. Add Tests:**
```typescript
// src/services/notification/notification-service.test.ts
describe('NotificationService', () => {
  it('should send notifications', () => {
    // Test implementation
  });
});
```

**5. Create Barrel Export:**
```typescript
// src/services/notification/index.ts
export { NotificationService } from './notification-service';
export type { NotificationConfig, Notification } from './notification-types';
```

**6. Update Service Registry:**
```typescript
// src/services/registry.ts
export const Services = {
  // ... existing services
  NotificationService: 'NotificationService',
} as const;

export type ServiceMap = {
  // ... existing services
  [Services.NotificationService]: NotificationService;
};

export function configureServices(): ServiceContainer {
  // ... existing setup
  const notificationConfig = getNotificationConfig();
  const notificationService = new NotificationService(notificationConfig, httpClient);

  serviceContainer.register(Services.NotificationService, notificationService);
  return serviceContainer;
}
```

**7. Use Service in Components:**
```typescript
// In any React component
function MyComponent() {
  const notificationService = useService(Services.NotificationService);

  const handleClick = () => {
    notificationService.send({
      title: 'Success',
      message: 'Operation completed',
      type: 'success'
    });
  };
}
```

### Common Service Patterns

**Authentication Interceptor:**
```typescript
export class AuthenticatedHttpClient extends HttpClient {
  constructor(private authService: AuthorizationService) {
    super();
  }

  async request(config: RequestConfig) {
    const token = await this.authService.getToken();
    return super.request({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    });
  }
}
```

**Caching Service:**
```typescript
export class CacheService {
  private cache = new Map<string, { data: any; expires: number }>();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  set<T>(key: string, data: T, ttl: number = 5000): void {
    this.cache.set(key, { data, expires: Date.now() + ttl });
  }
}
```

### Testing Service Integration

**Mock Services in Tests:**
```typescript
// test/setup.ts
const mockContainer = new ServiceContainer();
mockContainer.register(Services.HttpClient, createMockHttpClient());
mockContainer.register(Services.AuthService, createMockAuthService());

// Component test
render(
  <ServiceProvider container={mockContainer}>
    <ComponentUnderTest />
  </ServiceProvider>
);
```

**Integration Testing:**
```typescript
describe('Service Integration', () => {
  it('should integrate auth with http client', async () => {
    const container = configureServices();
    const authService = container.get<AuthorizationService>(Services.AuthService);
    const httpClient = container.get<HttpClient>(Services.HttpClient);

    // Test service interaction
  });
});
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

**❌ Problem: "useService must be used within a ServiceProvider"**
```typescript
// ✅ Solution: Ensure ServiceProvider wraps your app
function App() {
  return (
    <ServiceProvider container={container}>
      <YourComponent /> {/* Now can use useService */}
    </ServiceProvider>
  );
}
```

**❌ Problem: "Service 'ServiceName' not registered"**
```typescript
// ✅ Solution: Check service registration in registry.ts
export function configureServices(): ServiceContainer {
  const container = new ServiceContainer();

  // Make sure this line exists:
  container.register(Services.YourService, yourServiceInstance);

  return container;
}
```

**❌ Problem: Import path not resolved with @ alias**
```typescript
// ❌ Wrong
import { useService } from '../../../hooks/use-service';

// ✅ Correct
import { useService } from '@/hooks/use-service';

// Check vite.config.ts has:
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
}
```

**❌ Problem: Environment variables not loading**
```bash
# ✅ Solution: Check file names and prefixes
.env.example  # Template file
.env          # Your actual values
.env.local    # Local overrides

# Make sure variables use APP_ prefix:
APP_TENANT_ID=value  # ✅ Correct
VITE_TENANT_ID=value # ❌ Won't work with current setup
```

**❌ Problem: ESLint import ordering not working**
```bash
# ✅ Solution: Run import fix command
npm run lint:fix

# Or configure auto-fix on save in VS Code settings.json:
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": "explicit"
}
```

**❌ Problem: Tests not finding services**
```typescript
// ✅ Solution: Provide test container
const testContainer = new ServiceContainer();
testContainer.register(Services.TestService, mockTestService);

render(
  <ServiceProvider container={testContainer}>
    <TestComponent />
  </ServiceProvider>
);
```

### Debugging DI Context Issues

**Service Resolution Debug:**
```typescript
// Add debugging to useService hook
export function useService<K extends keyof ServiceMap>(key: K): ServiceMap[K] {
  const container = useContext(ServiceContext);

  if (!container) {
    console.error('ServiceContext is null - check ServiceProvider wrapper');
    throw new Error('useService must be used within a ServiceProvider');
  }

  if (!container.has(key)) {
    console.error(`Service '${key}' not registered. Available services:`,
      Object.keys(Services));
    throw new Error(`Service '${key}' not registered`);
  }

  return container.get<ServiceMap[K]>(key);
}
```

**Container State Inspection:**
```typescript
// Development helper
if (process.env.NODE_ENV === 'development') {
  (window as any).debugContainer = container;
  console.log('Available services:', Object.keys(Services));
}
```

---

## 🎮 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run preview         # Preview production build

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:ui         # Run tests with UI

# Code Quality
npm run lint            # Check code quality
npm run lint:fix        # Auto-fix ESLint issues
npm run format:imports  # Auto-sort imports only
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for native ES modules)
- npm or yarn

### Setup
```bash
# Clone and install
git clone <repository-url>
cd react-ts-di-poc
npm install

# Start development
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Project Structure Walkthrough

1. **Entry Point**: `src/main.tsx` - Application bootstrap with DI setup
2. **DI Configuration**: `src/services/registry.ts` - Service registration
3. **Service Container**: `src/services/container.ts` - Core DI implementation
4. **React Integration**: `src/hooks/use-service/` - React-specific DI hooks
5. **Example Services**: `src/services/auth/`, `src/services/http/` - Domain services

---

## 🏛️ Architecture Principles Applied

### SOLID Principles
- **Single Responsibility**: Each service has one focused purpose
- **Open/Closed**: Services extensible without modification
- **Liskov Substitution**: Interface-based service contracts
- **Interface Segregation**: Focused service interfaces
- **Dependency Inversion**: Services depend on abstractions

### YAGNI (You Aren't Gonna Need It)
- **Minimal DI System**: Only essential features implemented
- **No Over-Engineering**: Avoided complex lifetime management
- **Simple Service Registration**: Straightforward container pattern

### KISS (Keep It Simple, Stupid)
- **Clear File Organization**: Predictable structure
- **Consistent Naming**: One rule for all files
- **Minimal Configuration**: Convention over configuration

---

## 📚 References & Further Reading

### Industry Standards
- [React Context Patterns](https://react.dev/reference/react/createContext)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/)

### Architectural Patterns
- [Dependency Injection in JavaScript](https://blog.thoughtram.io/angular/2015/09/17/resolve-service-dependencies-in-angular-2.html)
- [React Composition Patterns](https://react.dev/learn/passing-data-deeply-with-context)
- [File Naming Conventions 2024](https://alexmcgovern.com/blog/2024-12-18-ts-js-file-naming-conventions)

---

## 🎯 Key Takeaways for Future Projects

1. **Vite + Vitest**: Standard modern React toolchain
2. **kebab-case everywhere**: 2024-2025 industry standard
3. **Context-based DI**: React-idiomatic dependency injection
4. **Barrel exports**: Clean API boundaries with index.ts
5. **Absolute imports**: @ prefix for maintainable import paths
6. **Automated import sorting**: ESLint rules for consistency
7. **Co-located tests**: Tests next to implementation
8. **Type-safe service resolution**: Compile-time guarantees

This template provides a solid foundation for building scalable, maintainable React TypeScript applications with modern tooling and architectural patterns.