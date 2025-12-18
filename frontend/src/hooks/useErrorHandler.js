import { useCallback } from 'react'
import { useToast } from '../contexts/ToastContext'
import { createErrorHandler } from '../utils/errorHandler'

/**
 * Custom hook for consistent error handling with toast notifications
 */
export function useErrorHandler() {
  const toastContext = useToast()
  
  const errorHandler = createErrorHandler(toastContext)
  
  // Handle API errors with automatic toast notifications
  const handleApiError = useCallback((error, context = {}, options = {}) => {
    return errorHandler.handle(error, context, options)
  }, [errorHandler])
  
  // Handle errors silently (no toast notification)
  const handleSilentError = useCallback((error, context = {}) => {
    return errorHandler.handleSilent(error, context)
  }, [errorHandler])
  
  // Show success message
  const showSuccess = useCallback((message, options = {}) => {
    errorHandler.showSuccess(message, options)
  }, [errorHandler])
  
  // Show warning message
  const showWarning = useCallback((message, options = {}) => {
    errorHandler.showWarning(message, options)
  }, [errorHandler])
  
  // Show info message
  const showInfo = useCallback((message, options = {}) => {
    errorHandler.showInfo(message, options)
  }, [errorHandler])
  
  // Create error handler for specific operations
  const createOperationHandler = useCallback((operation, options = {}) => {
    return (error) => {
      return handleApiError(error, { operation, ...options.context }, options)
    }
  }, [handleApiError])
  
  return {
    handleApiError,
    handleSilentError,
    showSuccess,
    showWarning,
    showInfo,
    createOperationHandler,
    
    // Direct access to toast context for advanced usage
    toast: toastContext
  }
}

export default useErrorHandler