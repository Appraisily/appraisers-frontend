# APPRAISERS Frontend Guidelines

## Build & Run Commands
- **Development**: `npm run dev` - Runs Vite dev server
- **Build**: `npm run build` - Creates production build
- **Preview**: `npm run preview` - Serves production build locally
- **Lint**: `npm run lint` - Run ESLint

## Code Style
- **Components**: PascalCase `.jsx` files with matching `.css` files
- **Functions/Variables**: camelCase, event handlers prefixed with `handle`
- **Constants**: UPPER_CASE
- **Imports**: Group by: 1) React/framework, 2) third-party, 3) components, 4) utils/services, 5) styles
- **Formatting**: 2-space indentation, semicolons required
- **Components**: Functional components with React Hooks, props destructuring at top
- **Error Handling**: Try/catch for async operations, extract detailed errors with fallbacks
- **Styling**: TailwindCSS with component-specific CSS files
- **API**: Axios with centralized config in `/services/api.js`
- **Best Practices**: Named exports preferred, form validation before submission, responsive design