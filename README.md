# Dash0 Times

A full-stack demo application designed to generate realistic telemetry and website monitoring signals. This application simulates a news/docs portal with intentional performance characteristics to demonstrate various web vitals metrics including Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP).

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dash0-times
```

2. Install dependencies:
```bash
pnpm install
```

## Development

Start both frontend and backend servers concurrently:
```bash
pnpm dev
```

This will start:
- Frontend React app (typically on http://localhost:5173)
- Backend Express server (typically on http://localhost:3001)

## Project Structure

```
dash0-times/
├── frontend/          # React SPA with Vite
├── backend/           # Express.js API server
├── package.json       # Root workspace configuration
└── README.md         # This file
```

## Things to Click (Telemetry Generation)

Once the application is running, you can generate various telemetry signals by:

1. **LCP (Largest Contentful Paint)**: Visit the home page and observe the hero title loading
2. **CLS (Cumulative Layout Shift)**: Wait 1.8 seconds on the home page for the banner to appear
3. **INP (Interaction to Next Paint)**: Click the "Run analysis" button on the home page
4. **API Performance**: Navigate to articles, search, or article details to trigger API calls with realistic delays
5. **Error Handling**: Use the search functionality to experience the 20% error rate

## Development Scripts

- `pnpm dev` - Start both frontend and backend in development mode
- `pnpm build` - Build both applications for production
- `pnpm start` - Start the production backend server
- `pnpm clean` - Clean build artifacts from both applications

## Troubleshooting

- Ensure you're using Node.js 18+ and pnpm 8+
- If ports are in use, the dev servers will automatically find available ports
- Check console output for specific server status and port information