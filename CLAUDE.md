# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript project optimized for modern frontend development. The project uses Vite as build tool, TailwindCSS for styling, and follows best practices for scalable web application development.

## Development Commands

### Environment Management
- `npm install` - Install dependencies
- `npm ci` - Clean install (for production/CI)
- `npm update` - Update dependencies

### Development Server
- `npm run dev` - Start development server
- `npm run preview` - Preview production build locally

### Build Commands
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint for code quality
- `npm run lint --fix` - Auto-fix linting issues

### Package Management
- `npm install <package>` - Install a package
- `npm install -D <package>` - Install development dependency
- `npm uninstall <package>` - Remove a package
- `npm outdated` - Check for outdated packages

## Technology Stack

### Core Technologies
- **React** - UI library (v19+)
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **Node.js** - Runtime environment (v22+)

### Styling & UI
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **class-variance-authority** - Component variants
- **clsx & tailwind-merge** - Conditional classes

### State Management & Data Fetching
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **React Router DOM** - Client-side routing
- **React Toastify** - Toast notifications

### Development Tools
- **ESLint** - Linting and code quality
- **TypeScript ESLint** - TypeScript-specific linting
- **Autoprefixer** - CSS vendor prefixes
- **PostCSS** - CSS processing

## Project Structure

### File Organization
```
src/
├── app/                    # App-level configuration
├── features/              # Feature-based modules
│   └── auth/
│       ├── basic/
│       │   ├── components/    # Feature components
│       │   ├── query/        # React Query hooks
│       │   ├── service/      # API services
│       │   └── types/        # TypeScript types
├── pages/                 # Route components
├── shared/               # Shared utilities
│   ├── components/
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Utility functions
│   ├── types/            # Global types
│   └── styles/           # Global styles
├── infrastructure/       # External integrations
├── assets/              # Static assets
├── core/                # Core business logic
├── App.tsx              # Main app component
├── main.tsx             # App entry point
└── index.css            # Global styles
```

### Naming Conventions
- **Files/Components**: Use PascalCase (`UserProfile.tsx`)
- **Directories**: Use kebab-case (`user-profile/`)
- **Functions/Variables**: Use camelCase (`getUserData`)
- **Constants**: Use UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: Use PascalCase (`UserProfileDto`)

## TypeScript Guidelines

### Type Imports
- Use `import type` for type-only imports
- Example: `import type { User } from './types'`

### Type Safety
- Avoid `any` - use `unknown` for uncertain types
- Use proper generic constraints
- Define interfaces for API responses
- Use union types for controlled values

### Best Practices
- Enable strict mode in tsconfig.json
- Use meaningful type names
- Document complex types with comments
- Prefer interfaces over type aliases for objects

## React Guidelines

### Component Structure
- Use functional components with hooks
- Implement proper TypeScript props interfaces
- Use React.memo() for performance when needed
- Follow hooks rules (no conditionals)

### State Management
- Use useState for local component state
- Use TanStack Query for server state
- Lift state up when needed by multiple components
- Use context sparingly for truly global state

### Best Practices
- Use descriptive component and prop names
- Keep components focused and single-purpose
- Use custom hooks for reusable logic
- Implement proper error boundaries

## Styling Guidelines

### TailwindCSS
- Use utility classes for styling
- Create component variants with CVA
- Use responsive design principles
- Follow mobile-first approach

### Component Styling
- Use `cn()` utility for conditional classes
- Implement design system patterns
- Use CSS variables for theming
- Keep styles consistent across components

## Code Quality Standards

### ESLint Configuration
- Follow React and TypeScript best practices
- No explicit `any` types
- Proper component export patterns
- React Refresh compatibility

### Before Committing
1. Run `npm run lint` and fix all issues
2. Run `npm run build` to ensure TypeScript compilation
3. Test core functionality manually
4. Ensure no console errors

## Development Workflow

### Starting Development
1. Check Node.js version (v22+)
2. Run `npm install` to install dependencies
3. Start development server with `npm run dev`
4. Open browser at http://localhost:5173

### Feature Development
1. Create feature branch
2. Implement in appropriate feature directory
3. Add TypeScript types
4. Test functionality
5. Run linting and build checks

### Production Build
1. Run `npm run build`
2. Test with `npm run preview`
3. Deploy dist/ directory

## API Integration

### Service Layer
- Use Axios for HTTP requests
- Implement proper error handling
- Use TypeScript for request/response types
- Create reusable service functions

### React Query
- Use for server state management
- Implement proper caching strategies
- Handle loading and error states
- Use mutations for data modifications

## Security Guidelines

### Dependencies
- Regularly update dependencies with `npm update`
- Audit dependencies with `npm audit`
- Use exact versions for critical dependencies

### Code Security
- Validate API responses with TypeScript
- Sanitize user inputs
- Use environment variables for configuration
- Implement proper authentication flows

## Performance Guidelines

### Bundle Optimization
- Use dynamic imports for code splitting
- Optimize images and assets
- Implement lazy loading for routes
- Monitor bundle size

### React Performance
- Use React.memo for expensive components
- Implement proper dependency arrays in hooks
- Avoid unnecessary re-renders
- Use production builds for deployment