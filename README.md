# Enterprise Dashboard

A production-ready, enterprise-grade dashboard application built with Next.js 15, TypeScript, Clean Architecture principles, and modern best practices.

## 🎯 Project Overview

This is a unified dashboard application featuring:

- **Authentication**: Secure login with DummyJSON API
- **Users Management**: Paginated user listing with search
- **Products Management**: Product catalog with filtering, sorting, and detail pages
- **Games Management**: RAWG API integration with advanced filters and game details
- **Advanced Select Component**: Reusable dropdown with multi-select, search, virtualization

## 🏗 Architecture

This project follows **Clean Architecture** principles with strict separation of concerns:

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication route group
│   └── (dashboard)/       # Protected dashboard routes
├── features/              # Feature modules (UI + business logic)
│   ├── auth/
│   ├── users/
│   ├── products/
│   └── games/
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── select/           # Advanced Select component
├── domain/               # Domain models (business entities)
│   ├── auth/
│   ├── user/
│   ├── product/
│   └── game/
├── services/             # Business logic layer
├── infrastructure/       # External concerns
│   ├── http/            # HTTP client
│   ├── repositories/    # Data access (Repository pattern)
│   └── mappers/         # API to Domain adapters
├── hooks/               # Custom React hooks
├── lib/                 # Library configurations
├── types/               # TypeScript types
├── utils/               # Utility functions
└── config/              # App configuration
```

### Why Clean Architecture?

1. **Maintainability**: Clear separation makes changes easier
2. **Scalability**: Easy to add new features without affecting existing code
3. **Independence**: Domain logic doesn't depend on external APIs

## 🎨 UI Strategy: Chakra UI + Tailwind CSS

### Why Both?

**Chakra UI** provides:

- Accessibility out of the box (WCAG compliant)
- Component primitives (Box, Button, Table, etc.)
- Built-in keyboard navigation
- Screen reader support

**Tailwind CSS** provides:

- Visual customization and styling
- Responsive design utilities
- Consistent spacing and colors
- Performance-optimized CSS

**Example:**

```tsx
<Box className="rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md">
  <Heading className="text-2xl font-bold text-gray-900">Title</Heading>
</Box>
```

- `Box` from Chakra = semantic HTML + accessibility
- Tailwind classes = visual presentation

## 🔑 Design Patterns

### Repository Pattern

Abstracts data sources. Services don't know if data comes from REST, GraphQL, or localStorage.

```typescript
// Interface (abstraction)
interface IUserRepository {
  getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>>;
}

// Implementation
class UserRepository implements IUserRepository {
  constructor(private httpClient: HttpClient) {}
  // ... implementation
}
```

### Adapter Pattern

Transforms API responses to domain models, keeping domain pure.

```typescript
// API shape (what we receive)
interface DummyJsonUserResponse {
  /* ... */
}

// Domain model (what we use)
interface User {
  /* ... */
}

// Adapter
class UserMapper {
  static toDomain(response: DummyJsonUserResponse): User {
    // Transform API → Domain
  }
}
```

### Factory Pattern

Centralizes service creation with dependency injection.

```typescript
class ServiceFactory {
  static getUserService(): UserService {
    const httpClient = HttpClientFactory.getDummyJsonClient();
    const repository = new UserRepository(httpClient);
    return new UserService(repository);
  }
}
```

### Strategy Pattern

Enables extensible filtering and sorting without modifying core logic.

### Compound Component Pattern

Advanced Select component with flexible composition.

```typescript
<Select<string>
  options={groupedOptions}
  multiple
  searchable
  virtualized
  onChange={(values) => console.log(values)}
/>
```

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Component System**: Chakra UI 3.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: React Query (TanStack Query)
- **Forms**: Headless UI (for Select component)
- **Virtualization**: TanStack Virtual
- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. **IMPORTANT**: Add your RAWG API key to `.env.local`:

```env
RAWG_API_KEY=your_actual_api_key_here
```

**⚠️ Without a valid RAWG API key, the Games page will show an error.**

- Get your **free** API key from: **https://rawg.io/apidocs**
- Sign up takes less than 1 minute
- Update `.env.local` with your actual key
- Restart the dev server after adding the key
- **Note**: API key is server-side only (secure)

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Login Credentials (DummyJSON)

```
Username: emilys
Password: emilyspass
```

See more test users: https://dummyjson.com/docs/users

## 📝 Environment Variables

| Variable                        | Description                 | Required | Default                 | Visibility  |
| ------------------------------- | --------------------------- | -------- | ----------------------- | ----------- |
| `RAWG_API_KEY`                  | RAWG API key for games data | Yes      | -                       | Server-only |
| `NEXT_PUBLIC_DUMMYJSON_API_URL` | DummyJSON API base URL      | No       | `https://dummyjson.com` | Client      |
| `NEXT_PUBLIC_APP_NAME`          | Application name            | No       | `Enterprise Dashboard`  | Client      |
| `NEXT_PUBLIC_API_TIMEOUT`       | API timeout in ms           | No       | `30000`                 | Client      |

**Security Note**: `RAWG_API_KEY` is server-side only (no `NEXT_PUBLIC_` prefix), ensuring it's never exposed to the browser.

## 🏗 Build & Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📊 Performance Considerations

### Implemented Optimizations

1. **React Query Caching**: API responses cached for 1 minute
2. **Debounced Search**: 500ms debounce prevents excessive API calls
3. **Virtualization**: Select component virtualizes large lists (>50 items)
4. **Code Splitting**: Automatic with Next.js App Router
5. **Lazy Loading**: Images loaded on-demand
6. **Memoization**: Expensive computations cached with `useMemo`
7. **Server Components**: Default to reduce client bundle size

## 🔐 Security

- **Authentication**: Token-based with HttpOnly cookies
- **Protected Routes**: Middleware-based route protection
- **HTTPS Only**: Enforced in production
- **API Keys**: Environment variables, never committed
- **XSS Protection**: React's built-in escaping
- **CSRF**: SameSite cookies

## ♿ Accessibility

- **WCAG 2.1 AA Compliant**: Using Chakra UI primitives
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators
- **Color Contrast**: Meets AA standards

## 📁 Folder Structure Explained

### `/app` - Next.js App Router

Contains route groups and pages:

- `(auth)`: Login page
- `(dashboard)`: Protected routes (users, products, games)

### `/features` - Feature Modules

Each feature is self-contained with:

- Components
- Hooks
- Types
- Business logic

### `/domain` - Domain Models

Pure TypeScript interfaces representing business entities. No dependencies.

### `/infrastructure` - External Concerns

- HTTP clients
- API mappers
- Repository implementations
- Third-party integrations

### `/services` - Business Logic

Service layer depends on repository interfaces (Dependency Inversion Principle).

### `/components` - Shared UI

Reusable components used across features.

## 🎯 Design Decisions

### Why Next.js App Router?

- Server Components reduce client bundle
- Built-in routing and layouts
- Middleware for authentication
- Optimized for production

### Why React Query?

- Automatic caching and refetching
- Loading and error states
- Optimistic updates
- Background synchronization

### Why Separate Domain Models?

- API changes don't break business logic
- Easier testing
- Clear contracts
- Single source of truth

### Why Service Layer?

- Testable business logic
- API-agnostic
- Reusable across components
- Clear separation of concerns

## ⚖️ Trade-offs

### Architecture Complexity vs. Simplicity

**Choice**: Clean Architecture  
**Trade-off**: More files and layers, but better maintainability for large projects

### Type Safety vs. Development Speed

**Choice**: Strict TypeScript (no `any`)  
**Trade-off**: Slower initial development, but fewer runtime errors

### Bundle Size vs. Features

**Choice**: Include Chakra UI + Tailwind  
**Trade-off**: Larger bundle, but better DX and accessibility

### Client vs. Server Rendering

**Choice**: Server Components by default  
**Trade-off**: More complexity, but better performance

## 🔮 Future Improvements

### Short-term

- [ ] Add unit tests for services and repositories
- [ ] Implement E2E tests with Playwright
- [ ] Add optimistic updates for mutations
- [ ] Implement infinite scroll for games list
- [ ] Add skeleton loaders for better UX

### Medium-term

- [ ] Add user preferences (theme, language)
- [ ] Implement advanced caching strategies
- [ ] Add PWA support
- [ ] Implement error tracking (Sentry)
- [ ] Add analytics (Vercel Analytics)

### Long-term

- [ ] GraphQL layer for data fetching
- [ ] Real-time updates with WebSockets
- [ ] Micro-frontends architecture
- [ ] Add CMS for content management
- [ ] Multi-tenancy support

## 🤝 Code Quality Rules

1. **No component > 200 lines**: Extract hooks and subcomponents
2. **No `any` type**: Use proper TypeScript types
3. **Extract business logic**: Keep components thin
4. **Domain ≠ API**: Always use mappers
5. **Dependency Inversion**: Services depend on interfaces
6. **Single Responsibility**: One component, one job
7. **Meaningful names**: No `data`, `temp`, `handleClick`

## 📚 Documentation

- All services have JSDoc comments
- Complex utilities documented
- Business logic explained
- Architecture decisions recorded

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [DummyJSON](https://dummyjson.com) for mock data API
- [RAWG](https://rawg.io) for games database API
- [Chakra UI](https://chakra-ui.com) for accessible components
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling

---

**Built with following enterprise-grade practices and Clean Architecture principles.**
