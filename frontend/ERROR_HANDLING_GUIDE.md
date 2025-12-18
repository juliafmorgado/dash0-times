# Error Handling System Guide

## Overview

The Dash0 Times application implements a comprehensive error handling system that provides consistent user feedback, graceful error recovery, and robust error reporting. The system is built with Dash0's design language and follows modern React patterns.

## Architecture

### Core Components

1. **Toast Notification System**
   - `Toast.jsx` - Individual toast notification component
   - `ToastContainer.jsx` - Container for managing multiple toasts
   - `ToastContext.jsx` - React context for global toast management

2. **Error Handling Utilities**
   - `errorHandler.js` - Enhanced error processing and categorization
   - `globalErrorHandler.js` - Global error handling for unhandled errors
   - `useErrorHandler.js` - Custom hook for component-level error handling

3. **Enhanced Components**
   - `ErrorMessage.jsx` - Enhanced error display component with variants
   - `ErrorBoundary.jsx` - React error boundary for catching render errors

## Features

### Toast Notifications

The toast system provides four types of notifications:

- **Error** (red) - For failures and critical issues
- **Success** (green) - For successful operations
- **Warning** (yellow) - For non-critical issues that need attention
- **Info** (blue) - For informational messages

#### Usage

```jsx
import { useErrorHandler } from '../hooks/useErrorHandler'

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useErrorHandler()
  
  const handleSuccess = () => {
    showSuccess('Operation completed successfully!', {
      title: 'Success',
      duration: 3000
    })
  }
  
  const handleError = () => {
    showError('Something went wrong', {
      title: 'Error',
      duration: 5000
    })
  }
}
```

### Error Categories and Severity

The system automatically categorizes errors and determines appropriate responses:

#### Categories
- `NETWORK` - Connection and network-related errors
- `API` - Server API errors
- `VALIDATION` - Input validation errors
- `AUTHENTICATION` - Auth-related errors
- `AUTHORIZATION` - Permission errors
- `NOT_FOUND` - Resource not found errors
- `SERVER` - Server-side errors
- `CLIENT` - Client-side errors
- `UNKNOWN` - Uncategorized errors

#### Severity Levels
- `LOW` - Minor issues (3s toast duration)
- `MEDIUM` - Standard issues (5s toast duration)
- `HIGH` - Important issues (7s toast duration)
- `CRITICAL` - Critical issues (10s toast duration, no auto-dismiss)

### API Error Handling

The system provides enhanced API error handling with automatic retry strategies:

```jsx
import { useErrorHandler } from '../hooks/useErrorHandler'

function ArticlesPage() {
  const { handleApiError, createOperationHandler } = useErrorHandler()
  
  const fetchArticles = async () => {
    try {
      const response = await apiClient.get('/api/articles')
      // Handle success
    } catch (error) {
      // Enhanced error handling with context
      handleApiError(error, { 
        operation: 'load_articles',
        isOptional: false 
      })
    }
  }
  
  // Or use operation-specific handler
  const articlesErrorHandler = createOperationHandler('load_articles')
}
```

### Global Error Handling

The system handles unhandled errors automatically:

- **Unhandled Promise Rejections** - Caught and displayed as toast notifications
- **JavaScript Errors** - Global error handler shows appropriate messages
- **Network Status** - Automatic detection of online/offline status
- **React Errors** - Error boundary catches render errors

### Error Message Component

Enhanced ErrorMessage component with multiple variants:

```jsx
<ErrorMessage
  title="Failed to Load Data"
  message="Unable to fetch the requested information"
  variant="error" // error, warning, info
  onRetry={handleRetry}
  retryText="Try Again"
  showIcon={true}
  actions={<CustomActions />}
/>
```

## Implementation Examples

### Page-Level Error Handling

```jsx
import { useErrorHandler } from '../hooks/useErrorHandler'
import ErrorMessage from '../components/ErrorMessage'

function MyPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { handleApiError, showSuccess } = useErrorHandler()
  
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.get('/api/data')
      setData(response.data)
      
      showSuccess('Data loaded successfully')
    } catch (err) {
      const errorInfo = handleApiError(err, { 
        operation: 'load_data' 
      })
      setError(errorInfo.message)
    } finally {
      setLoading(false)
    }
  }
  
  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Data"
        message={error}
        onRetry={fetchData}
      />
    )
  }
  
  // Render normal content
}
```

### Silent Error Handling

For optional operations that shouldn't show toast notifications:

```jsx
const { handleSilentError } = useErrorHandler()

const fetchOptionalData = async () => {
  try {
    const response = await apiClient.get('/api/optional-data')
    setOptionalData(response.data)
  } catch (err) {
    // Handle error silently (no toast notification)
    const errorInfo = handleSilentError(err, { 
      operation: 'load_optional_data',
      isOptional: true 
    })
    console.log('Optional data failed to load:', errorInfo.message)
  }
}
```

## Configuration

### Toast Duration by Severity

The system automatically sets toast duration based on error severity:

- Low severity: 3 seconds
- Medium severity: 5 seconds  
- High severity: 7 seconds
- Critical severity: 10 seconds (no auto-dismiss)

### Retry Strategies

The system provides intelligent retry strategies based on error type:

- **Network errors**: 3 retries with 2s delay
- **Server errors**: 2 retries with 3s delay  
- **404 errors**: No retry (unless optional resource)
- **Client errors**: 2 retries with 1s delay

## Best Practices

### 1. Use Appropriate Error Types

```jsx
// For critical operations
handleApiError(error, { operation: 'save_data' })

// For optional operations  
handleSilentError(error, { operation: 'load_recommendations', isOptional: true })
```

### 2. Provide Context

```jsx
handleApiError(error, { 
  operation: 'search',
  query: searchQuery,
  filters: activeFilters
})
```

### 3. Handle Success States

```jsx
showSuccess(`Found ${results.length} results`, {
  title: 'Search Complete',
  duration: 3000
})
```

### 4. Use Error Boundaries

Wrap components that might throw errors:

```jsx
<ErrorBoundary>
  <ComplexComponent />
</ErrorBoundary>
```

## Testing Error Scenarios

The HomePage includes a demo section for testing different error types:

1. Visit the home page
2. Scroll to the "Error Handling Demo" section
3. Click buttons to test different notification types
4. Test network errors by going offline
5. Test API errors by triggering search failures

## Monitoring and Debugging

### Development Mode

In development, the system provides detailed console logging:

```
🚨 Error Handler - HIGH
Category: network
Context: { operation: 'search', query: 'test' }
Original Error: TypeError: Failed to fetch
User Message: Unable to connect to the server...
Retry Strategy: { shouldRetry: true, maxRetries: 3 }
```

### Production Mode

In production, errors are logged for external monitoring services while showing user-friendly messages to users.

## Customization

### Custom Error Messages

```jsx
const customErrorHandler = createErrorHandler(toastContext)

customErrorHandler.handle(error, context, {
  title: 'Custom Error Title',
  showToast: true,
  toastOptions: {
    duration: 8000,
    type: 'warning'
  }
})
```

### Custom Toast Types

Extend the toast system with custom types by modifying the Toast component and adding corresponding CSS classes.

## Accessibility

The error handling system includes accessibility features:

- ARIA labels and roles for screen readers
- Keyboard navigation support
- High contrast error states
- Semantic HTML structure
- Focus management for error states

## Performance Considerations

- Toast notifications use React portals for optimal rendering
- Error handlers are memoized to prevent unnecessary re-renders
- Global error handlers are properly cleaned up on unmount
- Debounced error reporting prevents spam