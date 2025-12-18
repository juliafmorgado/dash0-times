import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import ToastContainer from '../components/ToastContainer'
import { initializeGlobalErrorHandler, cleanupGlobalErrorHandler } from '../utils/globalErrorHandler'

const ToastContext = createContext()

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = ++toastId
    const newToast = {
      id,
      type: 'error',
      duration: 5000,
      ...toast,
    }

    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods for different toast types
  const showError = useCallback((message, options = {}) => {
    return addToast({
      type: 'error',
      message,
      title: options.title || 'Error',
      ...options,
    })
  }, [addToast])

  const showSuccess = useCallback((message, options = {}) => {
    return addToast({
      type: 'success',
      message,
      title: options.title || 'Success',
      ...options,
    })
  }, [addToast])

  const showWarning = useCallback((message, options = {}) => {
    return addToast({
      type: 'warning',
      message,
      title: options.title || 'Warning',
      ...options,
    })
  }, [addToast])

  const showInfo = useCallback((message, options = {}) => {
    return addToast({
      type: 'info',
      message,
      title: options.title || 'Info',
      ...options,
    })
  }, [addToast])

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  }

  // Initialize global error handler when toast context is ready
  useEffect(() => {
    initializeGlobalErrorHandler(value)
    
    return () => {
      cleanupGlobalErrorHandler()
    }
  }, [value])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default ToastContext