# CORS Configuration Documentation

## Overview

The Dash0 Times backend API has been configured with CORS (Cross-Origin Resource Sharing) middleware to enable secure cross-origin requests from the frontend application during development.

## Configuration Details

### Allowed Origins
- `http://localhost:5173` - Default Vite development server port
- `http://localhost:3000` - Alternative React development server port

### Allowed Methods
- GET
- POST
- PUT
- DELETE
- OPTIONS

### Allowed Headers
- `Content-Type` - For JSON request bodies
- `Authorization` - For future authentication mechanisms
- `x-demo-user` - Custom header for demo user context simulation

### Additional Settings
- **Credentials**: Enabled (`credentials: true`) to allow cookies and authentication headers
- **Preflight Caching**: Browser default (typically 5 seconds)

## Implementation

The CORS middleware is configured in `backend/src/server.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-user']
}));
```

## Testing CORS

### Test 1: Health Check with Allowed Origin
```bash
curl -I -H "Origin: http://localhost:5173" http://localhost:3001/api/health
```

Expected headers:
- `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Credentials: true`

### Test 2: Preflight OPTIONS Request
```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: x-demo-user" \
  -I http://localhost:3001/api/articles
```

Expected headers:
- `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type,Authorization,x-demo-user`

### Test 3: Request with Custom Header
```bash
curl -H "Origin: http://localhost:5173" \
  -H "x-demo-user: pro-user" \
  http://localhost:3001/api/articles
```

Expected: Response includes viewer context and proper CORS headers

### Test 4: Unauthorized Origin
```bash
curl -I -H "Origin: http://malicious-site.com" http://localhost:3001/api/health
```

Expected: No `Access-Control-Allow-Origin` header (CORS blocks the request)

## Endpoints with CORS Support

All API endpoints include CORS headers:
- `GET /api/health` - Health check
- `GET /api/articles` - List all articles
- `GET /api/articles/:id` - Get single article
- `GET /api/search?q=query` - Search articles
- `GET /api/recommendation` - Get recommended articles

## Security Considerations

1. **Development Only**: Current configuration allows localhost origins only
2. **Production**: Update allowed origins to include production frontend domain
3. **Credentials**: Enabled to support future authentication features
4. **Custom Headers**: x-demo-user header is explicitly allowed for demo purposes

## Troubleshooting

### CORS Error in Browser Console
If you see CORS errors:
1. Verify backend server is running on port 3001
2. Check frontend is running on port 5173 or 3000
3. Ensure Origin header matches allowed origins
4. Check browser console for specific CORS error messages

### Missing CORS Headers
If CORS headers are missing:
1. Verify cors middleware is installed: `npm list cors`
2. Check middleware is applied before route handlers
3. Restart backend server after configuration changes

## Requirements Validation

✅ **Requirement 8.5**: CORS headers are included in all API endpoint responses
✅ **Requirement 9.5**: x-demo-user header is properly allowed for authentication simulation
✅ All endpoints tested and verified to include proper CORS headers
✅ Preflight OPTIONS requests handled correctly
✅ Unauthorized origins properly rejected
