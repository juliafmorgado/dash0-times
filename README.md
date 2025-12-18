# Dash0 Times

A full-stack demo application designed to generate realistic telemetry and website monitoring signals. This application simulates a news/docs portal with intentional performance characteristics to demonstrate various web vitals metrics including Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP).

The application features Dash0 branding and design language, providing a realistic demo environment for testing monitoring and observability tools.

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** >= 18.0.0 (LTS recommended)
- **pnpm** >= 8.0.0 (package manager)

### Installing Prerequisites

**Node.js:**
- Download from [nodejs.org](https://nodejs.org/)
- Or use a version manager like [nvm](https://github.com/nvm-sh/nvm)

**pnpm:**
```bash
# Install pnpm globally
npm install -g pnpm

# Or using corepack (Node.js 16.10+)
corepack enable
corepack prepare pnpm@latest --activate
```

## Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd dash0-times
```

2. **Install all dependencies:**
```bash
pnpm install
```

This will install dependencies for both frontend and backend workspaces automatically.

## Development

### Quick Start

Start both frontend and backend servers concurrently:
```bash
pnpm dev
```

This command will:
- Start the React frontend on `http://localhost:5173` (Vite dev server)
- Start the Express backend on `http://localhost:3001`
- Display colored output with prefixes for easy identification
- Automatically restart servers on file changes
- Kill all processes if one fails

### Individual Server Commands

If you need to run servers separately:

```bash
# Frontend only (from root)
pnpm --filter dash0-times-frontend dev

# Backend only (from root)
pnpm --filter backend dev

# Or navigate to specific directories
cd frontend && pnpm dev
cd backend && pnpm dev
```

## Project Structure

```
dash0-times/
├── frontend/                    # React SPA with Vite
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Route-specific page components
│   │   ├── utils/             # API client and utilities
│   │   ├── contexts/          # React contexts (Toast, etc.)
│   │   └── hooks/             # Custom React hooks
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── data/              # Mock data and utilities
│   │   └── server.js          # Main server file
│   └── package.json           # Backend dependencies
├── package.json               # Root workspace configuration
├── pnpm-workspace.yaml        # pnpm workspace definition
└── README.md                  # This file
```

## Things to Click (Telemetry Generation)

Once the application is running (`pnpm dev`), visit `http://localhost:5173` and perform these actions to generate telemetry signals:

### Core Web Vitals

1. **LCP (Largest Contentful Paint)**
   - Navigate to the home page (`/`)
   - Observe the large "Dash0 Times" hero title loading
   - The hero content is designed to be the largest contentful element

2. **CLS (Cumulative Layout Shift)**
   - Stay on the home page (`/`)
   - Wait exactly 1.8 seconds after page load
   - A banner will appear and push content downward, causing measurable layout shift

3. **INP (Interaction to Next Paint)**
   - On the home page, click the "Run analysis" button
   - This triggers a heavy computation (200-400ms) that blocks the main thread
   - Results and timing will be displayed after completion

### API Performance Testing

4. **Articles List Performance**
   - Navigate to "Articles" (`/articles`)
   - API call has 50-150ms artificial delay
   - Test pagination and tag filtering

5. **Article Detail Performance**
   - Click on any article from the articles list
   - API call has 800-1200ms artificial delay
   - Observe loading skeleton during fetch
   - Recommendations sidebar loads separately (200-900ms delay)

6. **Search with Error Handling**
   - Navigate to "Search" (`/search`)
   - Type any search query (debounced by 300ms)
   - Search API has 20% chance of returning HTTP 500 error
   - Try multiple searches to experience both success and error states

### Navigation and State Management

7. **Client-side Routing**
   - Use navigation menu to switch between pages
   - Test browser back/forward buttons
   - Observe URL changes without full page reloads

8. **New Tab Functionality**
   - On articles list, click "Open in new tab" links
   - Verify original page state is preserved
   - Compare content between inline and new tab navigation

## Available Scripts

### Root Level Commands

- `pnpm dev` - Start both frontend and backend in development mode with hot reload
- `pnpm install` - Install dependencies for all workspaces
- `pnpm build` - Build both applications for production
- `pnpm start` - Start the production backend server
- `pnpm clean` - Clean build artifacts from both applications

### Frontend Specific

```bash
cd frontend
pnpm dev      # Start Vite dev server
pnpm build    # Build for production
pnpm preview  # Preview production build
pnpm lint     # Run ESLint
```

### Backend Specific

```bash
cd backend
pnpm dev      # Start with --watch flag
pnpm start    # Start production server
```

## API Endpoints

The backend provides the following endpoints with realistic delays:

- `GET /api/health` - Health check (immediate response)
- `GET /api/articles` - List articles (50-150ms delay)
- `GET /api/articles/:id` - Get article details (800-1200ms delay)
- `GET /api/search?q=query` - Search articles (100-400ms delay, 20% error rate)
- `GET /api/recommendation` - Get recommendations (200-900ms delay)

## Troubleshooting

### Common Issues

**Port Conflicts:**
- If default ports are in use, the dev servers will automatically find available ports
- Frontend typically uses 5173, backend uses 3001
- Check console output for actual port assignments

**pnpm Not Found:**
```bash
# Install pnpm globally
npm install -g pnpm

# Or enable corepack
corepack enable
```

**Node Version Issues:**
```bash
# Check your Node.js version
node --version

# Should be 18.0.0 or higher
# Use nvm to switch versions if needed
nvm use 18
```

**Dependencies Not Installing:**
```bash
# Clear pnpm cache and reinstall
pnpm store prune
rm -rf node_modules frontend/node_modules backend/node_modules
pnpm install
```

**CORS Errors:**
- Backend is configured for `localhost:5173` and `localhost:3000`
- If frontend runs on different port, update CORS config in `backend/src/server.js`

**Build Failures:**
```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

### Development Tips

**Hot Reload:**
- Frontend: Vite provides instant hot module replacement
- Backend: Uses Node.js `--watch` flag for automatic restarts

**Debugging:**
- Frontend: Use browser DevTools, React DevTools extension
- Backend: Console logs are displayed with colored prefixes
- API requests: Check Network tab in browser DevTools

**Performance Monitoring:**
- Open browser DevTools → Performance tab
- Record while performing telemetry actions
- Observe LCP, CLS, and INP measurements in the Performance panel

**Error Testing:**
- Search functionality has intentional 20% error rate
- Use browser DevTools → Network tab to see failed requests
- Error messages are displayed in the UI with toast notifications

### Environment Variables

The application uses these default configurations:

- Frontend dev server: `http://localhost:5173`
- Backend server: `http://localhost:3001`
- Backend PORT can be overridden: `PORT=3002 pnpm dev`

### Browser Compatibility

- Modern browsers with ES2020+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- JavaScript modules and fetch API required

## Contributing

When making changes:

1. Follow the existing code style and patterns
2. Test telemetry generation after changes
3. Ensure both frontend and backend start successfully
4. Verify CORS configuration for cross-origin requests
5. Check that all "things to click" still generate expected signals

## License

This is a demo application for Dash0 monitoring and observability tools.