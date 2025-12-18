import { ApiError } from './apiClient'

/**
 * Enhanced error handling utility for Dash0 Times application
 * Provides consistent error processing and user-friendly messaging
 */

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * Error categories for better classification
 */
export const ERROR_CATEGORIES = {
  NETWORK: 'network',
  API: 'api',
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
}

/**
 * Get error category based on error type and status
 */
export function getErrorCategory(error) {
  if (error instanceof ApiError) {
    if (error.isNetworkError()) {
      return ERROR_CATEGORIES.NETWORK
    }
    
    if (error.status === 401) {
      return ERROR_CATEGORIES.AUTHENTICATION
    }
    
    if (error.status === 403) {
      return ERROR_CATEGORIES.AUTHORIZATION
    }
    
    if (error.status === 404) {
      return ERROR_CATEGORIES.NOT_FOUND
    }
    
    if (error.status >= 400 && error.status < 500) {
      return ERROR_CATEGORIES.CLIENT
    }
    
    if (error.status >= 500) {
      return ERROR_CATEGORIES.SERVER
    }
    
    return ERROR_CATEGORIES.API
  }
  
  if (error.name === 'ValidationError') {
    return ERROR_CATEGORIES.VALIDATION
  }
  
  return ERROR_CATEGORIES.UNKNOWN
}

/**
 * Get error severity based on category and context
 */
export function getErrorSeverity(error, context = {}) {
  const category = getErrorCategory(error)
  
  switch (category) {
    case ERROR_CATEGORIES.NETWORK:
      return ERROR_SEVERITY.HIGH
    case ERROR_CATEGORIES.SERVER:
      return ERROR_SEVERITY.HIGH
    case ERROR_CATEGORIES.AUTHENTICATION:
      return ERROR_SEVERITY.MEDIUM
    case ERROR_CATEGORIES.AUTHORIZATION:
      return ERROR_SEVERITY.MEDIUM
    case ERROR_CATEGORIES.NOT_FOUND:
      return context.isOptional ? ERROR_SEVERITY.LOW : ERROR_SEVERITY.MEDIUM
    case ERROR_CATEGORIES.VALIDATION:
      return ERROR_SEVERITY.LOW
    default:
      return ERROR_SEVERITY.MEDIUM
  }
}

/**
 * Get user-friendly error messages based on error type and context
 */
export function getUserFriendlyMessage(error, context = {}) {
  const category = getErrorCategory(error)
  
  // Custom messages based on context
  if (context.operation) {
    switch (context.operation) {
      case 'search':
        if (category === ERROR_CATEGORIES.SERVER) {
          return 'Search is temporarily unavailable. Please try again in a moment.'
        }
        if (category === ERROR_CATEGORIES.NETWORK) {
          return 'Unable to perform search. Please check your connection and try again.'
        }
        break
        
      case 'load_article':
        if (category === ERROR_CATEGORIES.NOT_FOUND) {
          return 'This article could not be found. It may have been moved or deleted.'
        }
        if (category === ERROR_CATEGORIES.NETWORK) {
          return 'Unable to load the article. Please check your connection and try again.'
        }
        break
        
      case 'load_articles':
        if (category === ERROR_CATEGORIES.NETWORK) {
          return 'Unable to load articles. Please check your connection and try again.'
        }
        if (category === ERROR_CATEGORIES.SERVER) {
          return 'Article service is temporarily unavailable. Please try again later.'
        }
        break
        
      case 'load_recommendations':
        if (category === ERROR_CATEGORIES.NETWORK || category === ERROR_CATEGORIES.SERVER) {
          return 'Unable to load recommendations at this time.'
        }
        break
    }
  }
  
  // Generic messages based on category
  switch (category) {
    case ERROR_CATEGORIES.NETWORK:
      return 'Unable to connect to the server. Please check your internet connection and try again.'
      
    case ERROR_CATEGORIES.SERVER:
      return 'A server error occurred. Please try again later.'
      
    case ERROR_CATEGORIES.NOT_FOUND:
      return 'The requested resource could not be found.'
      
    case ERROR_CATEGORIES.AUTHENTICATION:
      return 'Authentication required. Please log in and try again.'
      
    case ERROR_CATEGORIES.AUTHORIZATION:
      return 'You do not have permission to access this resource.'
      
    case ERROR_CATEGORIES.VALIDATION:
      return error.message || 'Please check your input and try again.'
      
    default:
      // Use the error's user message if available, otherwise fall back to generic
      if (error instanceof ApiError) {
        return error.getUserMessage()
      }
      return error.message || 'An unexpected error occurred. Please try again.'
  }
}

/**
 * Get appropriate retry strategy based on error type
 */
export function getRetryStrategy(error, context = {}) {
  const category = getErrorCategory(error)
  const severity = getErrorSeverity(error, context)
  
  const strategy = {
    shouldRetry: false,
    retryDelay: 1000,
    maxRetries: 3,
    retryMessage: 'Try Again'
  }
  
  switch (category) {
    case ERROR_CATEGORIES.NETWORK:
      strategy.shouldRetry = true
      strategy.retryDelay = 2000
      strategy.maxRetries = 3
      strategy.retryMessage = 'Retry Connection'
      break
      
    case ERROR_CATEGORIES.SERVER:
      // Only retry server errors for non-critical operations
      if (severity !== ERROR_SEVERITY.CRITICAL) {
        strategy.shouldRetry = true
        strategy.retryDelay = 3000
        strategy.maxRetries = 2
        strategy.retryMessage = 'Try Again'
      }
      break
      
    case ERROR_CATEGORIES.NOT_FOUND:
      // Don't retry 404s unless it's an optional resource
      if (context.isOptional) {
        strategy.shouldRetry = true
        strategy.maxRetries = 1
        strategy.retryMessage = 'Retry'
      }
      break
      
    case ERROR_CATEGORIES.API:
      // Retry generic API errors
      strategy.shouldRetry = true
      strategy.maxRetries = 2
      break
  }
  
  return strategy
}

/**
 * Enhanced error handler that processes errors and returns structured information
 */
export function handleError(error, context = {}) {
  const category = getErrorCategory(error)
  const severity = getErrorSeverity(error, context)
  const message = getUserFriendlyMessage(error, context)
  const retryStrategy = getRetryStrategy(error, context)
  
  // Log error for debugging (in development)
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error Handler - ${severity.toUpperCase()}`)
    console.log('Category:', category)
    console.log('Context:', context)
    console.log('Original Error:', error)
    console.log('User Message:', message)
    console.log('Retry Strategy:', retryStrategy)
    console.groupEnd()
  }
  
  return {
    category,
    severity,
    message,
    retryStrategy,
    originalError: error,
    context,
    timestamp: new Date().toISOString()
  }
}

/**
 * Create error handler with toast integration
 */
export function createErrorHandler(toastContext) {
  return {
    /**
     * Handle error and optionally show toast notification
     */
    handle: (error, context = {}, options = {}) => {
      const errorInfo = handleError(error, context)
      
      // Show toast notification unless explicitly disabled
      if (options.showToast !== false && toastContext) {
        const toastOptions = {
          title: options.title || getErrorTitle(errorInfo.category, context),
          duration: getSeverityDuration(errorInfo.severity),
          ...options.toastOptions
        }
        
        toastContext.showError(errorInfo.message, toastOptions)
      }
      
      return errorInfo
    },
    
    /**
     * Handle error silently (no toast)
     */
    handleSilent: (error, context = {}) => {
      return handleError(error, context)
    },
    
    /**
     * Show success message
     */
    showSuccess: (message, options = {}) => {
      if (toastContext) {
        toastContext.showSuccess(message, options)
      }
    },
    
    /**
     * Show warning message
     */
    showWarning: (message, options = {}) => {
      if (toastContext) {
        toastContext.showWarning(message, options)
      }
    },
    
    /**
     * Show info message
     */
    showInfo: (message, options = {}) => {
      if (toastContext) {
        toastContext.showInfo(message, options)
      }
    }
  }
}

/**
 * Get appropriate error title based on category and context
 */
function getErrorTitle(category, context) {
  if (context.operation) {
    switch (context.operation) {
      case 'search':
        return 'Search Failed'
      case 'load_article':
        return 'Article Load Failed'
      case 'load_articles':
        return 'Articles Load Failed'
      case 'load_recommendations':
        return 'Recommendations Unavailable'
      default:
        return 'Operation Failed'
    }
  }
  
  switch (category) {
    case ERROR_CATEGORIES.NETWORK:
      return 'Connection Error'
    case ERROR_CATEGORIES.SERVER:
      return 'Server Error'
    case ERROR_CATEGORIES.NOT_FOUND:
      return 'Not Found'
    case ERROR_CATEGORIES.AUTHENTICATION:
      return 'Authentication Required'
    case ERROR_CATEGORIES.AUTHORIZATION:
      return 'Access Denied'
    default:
      return 'Error'
  }
}

/**
 * Get toast duration based on error severity
 */
function getSeverityDuration(severity) {
  switch (severity) {
    case ERROR_SEVERITY.LOW:
      return 3000
    case ERROR_SEVERITY.MEDIUM:
      return 5000
    case ERROR_SEVERITY.HIGH:
      return 7000
    case ERROR_SEVERITY.CRITICAL:
      return 10000
    default:
      return 5000
  }
}