/**
 * Global error handling utilities for Dash0 Times application
 * Handles unhandled promise rejections, network status, and global error scenarios
 */

let toastContext = null

/**
 * Initialize global error handler with toast context
 */
export function initializeGlobalErrorHandler(toast) {
  toastContext = toast
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
  
  // Handle global JavaScript errors
  window.addEventListener('error', handleGlobalError)
  
  // Handle network status changes
  window.addEventListener('online', handleNetworkOnline)
  window.addEventListener('offline', handleNetworkOffline)
  
  // Initial network status check
  if (!navigator.onLine) {
    handleNetworkOffline()
  }
}

/**
 * Cleanup global error handlers
 */
export function cleanupGlobalErrorHandler() {
  window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  window.removeEventListener('error', handleGlobalError)
  window.removeEventListener('online', handleNetworkOnline)
  window.removeEventListener('offline', handleNetworkOffline)
}

/**
 * Handle unhandled promise rejections
 */
function handleUnhandledRejection(event) {
  console.error('Unhandled promise rejection:', event.reason)
  
  if (toastContext) {
    // Check if it's a network-related error
    const isNetworkError = event.reason?.name === 'TypeError' && 
                          event.reason?.message?.includes('fetch')
    
    if (isNetworkError) {
      toastContext.showError(
        'Network connection lost. Please check your internet connection.',
        {
          title: 'Connection Error',
          duration: 7000
        }
      )
    } else {
      toastContext.showError(
        'An unexpected error occurred. Please try refreshing the page.',
        {
          title: 'Unexpected Error',
          duration: 5000
        }
      )
    }
  }
  
  // Prevent the default browser error handling
  event.preventDefault()
}

/**
 * Handle global JavaScript errors
 */
function handleGlobalError(event) {
  console.error('Global error:', event.error)
  
  if (toastContext) {
    toastContext.showError(
      'A JavaScript error occurred. Some features may not work properly.',
      {
        title: 'Script Error',
        duration: 5000
      }
    )
  }
}

/**
 * Handle network coming back online
 */
function handleNetworkOnline() {
  console.log('Network connection restored')
  
  if (toastContext) {
    toastContext.showSuccess(
      'Internet connection restored. You can continue using the application.',
      {
        title: 'Back Online',
        duration: 3000
      }
    )
  }
}

/**
 * Handle network going offline
 */
function handleNetworkOffline() {
  console.log('Network connection lost')
  
  if (toastContext) {
    toastContext.showWarning(
      'You are currently offline. Some features may not be available.',
      {
        title: 'No Internet Connection',
        duration: 0 // Don't auto-dismiss offline warnings
      }
    )
  }
}

/**
 * Check if the browser is currently online
 */
export function isOnline() {
  return navigator.onLine
}

/**
 * Show a network status message
 */
export function showNetworkStatus() {
  if (!toastContext) return
  
  if (isOnline()) {
    toastContext.showInfo('You are currently online.', {
      title: 'Network Status',
      duration: 2000
    })
  } else {
    toastContext.showWarning('You are currently offline.', {
      title: 'Network Status',
      duration: 5000
    })
  }
}

/**
 * Test network connectivity by making a simple request
 */
export async function testNetworkConnectivity() {
  try {
    const response = await fetch('/api/health', {
      method: 'GET',
      cache: 'no-cache',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
    
    return response.ok
  } catch (error) {
    console.warn('Network connectivity test failed:', error)
    return false
  }
}

/**
 * Handle critical application errors that require user intervention
 */
export function handleCriticalError(error, context = {}) {
  console.error('Critical error:', error, context)
  
  if (toastContext) {
    toastContext.showError(
      'A critical error occurred. Please refresh the page to continue.',
      {
        title: 'Critical Error',
        duration: 0 // Don't auto-dismiss critical errors
      }
    )
  }
  
  // In production, you might want to redirect to an error page
  // or show a modal with recovery options
}

/**
 * Handle API service unavailable scenarios
 */
export function handleServiceUnavailable(serviceName = 'service') {
  if (toastContext) {
    toastContext.showWarning(
      `The ${serviceName} is temporarily unavailable. Please try again later.`,
      {
        title: 'Service Unavailable',
        duration: 7000
      }
    )
  }
}

/**
 * Handle maintenance mode scenarios
 */
export function handleMaintenanceMode() {
  if (toastContext) {
    toastContext.showInfo(
      'The application is currently undergoing maintenance. Some features may be limited.',
      {
        title: 'Maintenance Mode',
        duration: 10000
      }
    )
  }
}