import { Component } from 'react'
import ErrorMessage from './ErrorMessage'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Log to external error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo)
    }
  }

  handleRetry = () => {
    // Reset error state to retry rendering
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry)
      }

      // Default fallback UI
      return (
        <div style={{ 
          padding: 'var(--dash0-spacing-lg, 1.5rem)',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ErrorMessage
            title="Something went wrong"
            message="An unexpected error occurred while rendering this component. Please try refreshing the page."
            onRetry={this.handleRetry}
            retryText="Try Again"
            actions={
              <button 
                onClick={() => window.location.reload()}
                style={{
                  marginLeft: 'var(--dash0-spacing-sm, 0.5rem)',
                  padding: 'var(--dash0-spacing-sm, 0.5rem) var(--dash0-spacing-lg, 1.5rem)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--dash0-color-border-primary, #404040)',
                  borderRadius: 'var(--dash0-border-radius-md, 0.375rem)',
                  color: 'var(--dash0-color-text-primary, #ffffff)',
                  cursor: 'pointer',
                  fontSize: 'var(--dash0-font-size-base, 1rem)',
                  fontWeight: 'var(--dash0-font-weight-medium, 500)',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'var(--dash0-color-background-tertiary, #404040)'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                }}
              >
                Refresh Page
              </button>
            }
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary