# NaHero Web Project Guidelines

## Build and Test Commands
- Start development server: `npm start`
- Build project: `npm run build`
- Watch mode: `npm run watch`
- Run all tests: `npm test`
- Run single test: `npm test -- --include=src/path/to/file.spec.ts`
- Lint: `ng lint`

## Code Style Guidelines
- Use Angular CLI for generating components/services: `ng generate component|service name`
- Components use standalone API with explicit imports
- SCSS for styling with component-scoped styles
- Strong typing with TypeScript, avoid `any` type
- Naming: PascalCase for classes/components, camelCase for methods/properties
- Prefix component selectors with `app-`
- Error handling: use RxJS catchError for HTTP requests
- Use BehaviorSubject pattern for state management
- Organize imports by external modules first, then internal
- Keep components small and focused on a single responsibility
- Write unit tests for each component/service
- Use TailwindCSS for styling with shadcn pattern
- Follow Angular style guide: https://angular.io/guide/styleguide