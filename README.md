# Dash0 Times

A full-stack demo application designed to generate rich backend telemetry for observability demonstrations. This application simulates a news/docs portal with comprehensive backend operations including database queries, external API calls, file operations, cache patterns, and error scenarios to showcase distributed tracing, structured logging, and performance monitoring capabilities.

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
- Start the React frontend on `http://localhost:3000` (Vite dev server)
- Start the Express backend on `http://localhost:3001` with OpenTelemetry auto-instrumentation
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
├── backend/                    # Express.js API server with OpenTelemetry
│   ├── src/
│   │   ├── data/              # Mock data, utilities, and database setup
│   │   └── server.js          # Main server file with enhanced telemetry
│   ├── .env                   # OpenTelemetry configuration
│   └── package.json           # Backend dependencies (includes OTel packages)
├── package.json               # Root workspace configuration
├── pnpm-workspace.yaml        # pnpm workspace definition
├── TELEMETRY_FEATURES.md      # Detailed telemetry documentation
└── README.md                  # This file
```

## Things to Click (Backend Telemetry Generation)

Once the application is running (`pnpm dev`), visit `http://localhost:3000` and perform these actions to generate backend telemetry signals:

### Primary Backend Telemetry Demo

1. **Backend Performance Demo**
   - **Heavy Analysis**: Click to trigger CPU-intensive computation + database operations (generates performance traces)
   - **Flaky Service**: Test service reliability with 30% error rate (generates error patterns and traces)
   - **Get Recommendations**: Enhanced recommendation engine with ML simulation (generates multi-span traces)

2. **Database & External APIs Demo**
   - **Database Query**: Multi-step SQLite operations with complex queries (generates database spans and query traces)
   - **Weather API**: External HTTP calls to httpbin.org with realistic delays (generates HTTP client traces)
   - **File Operations**: Filesystem I/O operations (create, read, write, delete) (generates filesystem spans)
   - **Cache Demo**: Cache hit/miss patterns with 70% hit rate (generates cache operation traces)

### Core Application Endpoints (Additional Telemetry)

3. **Articles List Performance**
   - Navigate to "Articles" (`/articles`)
   - API call has 50-150ms artificial delay (generates HTTP request traces)
   - Test pagination and tag filtering

4. **Article Detail Performance**
   - Click on any article from the articles list
   - API call has 800-1200ms artificial delay (generates slow query traces)
   - Recommendations sidebar loads separately (generates concurrent request traces)

5. **Search with Error Handling**
   - Navigate to "Search" (`/search`)
   - Type any search query (debounced by 300ms)
   - Search API has 20% chance of returning HTTP 500 error (generates error traces and patterns)

### Frontend Features

6. **Basic Web Vitals** (For frontend monitoring)
   - **LCP**: Large "Dash0 Times" hero title loading
   - **CLS**: Banner appears after 1.8 seconds causing layout shift
   - **INP**: "Run analysis" button triggers computation blocking main thread

7. **Client-side Navigation**
   - Use navigation menu to switch between pages
   - Test browser back/forward buttons
   - Open articles in new tabs

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
pnpm dev      # Start with OpenTelemetry auto-instrumentation and --watch flag
pnpm start    # Start production server with OpenTelemetry
pnpm dev:no-otel    # Start without OpenTelemetry (for debugging)
pnpm start:no-otel  # Start production without OpenTelemetry
```

## API Endpoints

The backend provides the following endpoints with realistic delays:

### Core Application Endpoints
- `GET /api/health` - Health check (immediate response)
- `GET /api/articles` - List articles (50-150ms delay)
- `GET /api/articles/:id` - Get article details (800-1200ms delay)
- `GET /api/search?q=query` - Search articles (100-400ms delay, 20% error rate)
- `GET /api/recommendation` - Get recommendations (200-900ms delay)

### Enhanced Telemetry Endpoints
- `POST /api/analyze` - Heavy computation + database simulation (500-1300ms)
- `GET /api/flaky-service` - Service reliability testing (30% error rate, 100-500ms)
- `GET /api/database-query` - Multi-step SQLite operations (600-1200ms)
- `GET /api/external-weather` - External API calls to httpbin.org (1100-1700ms)
- `POST /api/file-operations` - Filesystem I/O operations (150-300ms)
- `GET /api/cache-demo/:key` - Cache simulation (10-30ms hit, 220-580ms miss)

### OpenTelemetry Integration
- Automatic instrumentation for HTTP, database, and filesystem operations
- OTLP export configuration via environment variables
- Structured logging with trace correlation
- Real SQLite database operations for authentic database traces

## Troubleshooting

### Common Issues

**Port Conflicts:**
- If default ports are in use, the dev servers will automatically find available ports
- Frontend typically uses 3000, backend uses 3001
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
- Backend is configured for `localhost:3000` and `localhost:5173`
- If frontend runs on different port, update CORS config in `backend/src/server.js`

**Build Failures:**
```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

### Environment Variables

The application uses these default configurations:

- Frontend dev server: `http://localhost:3000`
- Backend server: `http://localhost:3001`
- Backend PORT can be overridden: `PORT=3002 pnpm dev`

#### OpenTelemetry Configuration (backend/.env)
```env
OTEL_SERVICE_NAME=dash0-times-backend
OTEL_TRACES_EXPORTER=otlp
OTEL_LOGS_EXPORTER=otlp
OTEL_LOGS_ENABLED=true
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

## Contributing

When making changes:

1. Follow the existing code style and patterns
2. Test telemetry generation after changes
3. Ensure both frontend and backend start successfully
4. Verify CORS configuration for cross-origin requests
5. Check that all "things to click" still generate expected signals
6. Test OpenTelemetry instrumentation is working
7. Verify new endpoints appear in traces and logs

## License

This is a demo application for Dash0 monitoring and observability tools.