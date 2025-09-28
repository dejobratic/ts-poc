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