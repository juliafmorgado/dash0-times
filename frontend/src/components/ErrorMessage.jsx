import styles from './ErrorMessage.module.css'

function ErrorMessage({ 
  message, 
  title = 'Error', 
  onRetry = null, 
  retryText = 'Try Again',
  className = '',
  variant = 'error',
  showIcon = true,
  actions = null
}) {
  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <path d="M12 9v4"></path>
            <path d="m12 17 .01 0"></path>
          </svg>
        )
      case 'info':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="m12 8 .01 0"></path>
          </svg>
        )
      default: // error
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" 
              fill="currentColor"
            />
          </svg>
        )
    }
  }

  return (
    <div className={`${styles.errorMessage} ${styles[variant]} ${className}`}>
      {showIcon && (
        <div className={styles.errorIcon}>
          {getIcon()}
        </div>
      )}
      
      <div className={styles.errorContent}>
        <h3 className={styles.errorTitle}>{title}</h3>
        <p className={styles.errorText}>{message}</p>
        
        <div className={styles.errorActions}>
          {onRetry && (
            <button 
              className={styles.retryButton}
              onClick={onRetry}
              type="button"
            >
              {retryText}
            </button>
          )}
          {actions}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage