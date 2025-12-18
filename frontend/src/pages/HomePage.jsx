import { useState } from 'react'
import Banner from '../components/Banner'
import { Spinner } from '../components/LoadingSkeleton'
import { useErrorHandler } from '../hooks/useErrorHandler'
import styles from './HomePage.module.css'

function HomePage() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Error handling hook for demonstrations
  const { showSuccess, showError, showWarning, showInfo } = useErrorHandler()

  const runHeavyComputation = () => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    
    const startTime = performance.now()
    
    // Heavy computation that blocks main thread for 200-400ms
    setTimeout(() => {
      const computationStart = performance.now()
      
      // Simulate heavy computation with actual work
      let result = 0
      const iterations = Math.floor(Math.random() * 1000000) + 2000000 // 2-3M iterations
      
      for (let i = 0; i < iterations; i++) {
        result += Math.sqrt(i) * Math.sin(i) * Math.cos(i)
      }
      
      const computationEnd = performance.now()
      const totalDuration = computationEnd - startTime
      const computationDuration = computationEnd - computationStart
      
      setAnalysisResult({
        result: result.toFixed(2),
        totalDuration: totalDuration.toFixed(2),
        computationDuration: computationDuration.toFixed(2),
        iterations
      })
      setIsAnalyzing(false)
      
      // Show success notification
      showSuccess(`Analysis completed in ${totalDuration.toFixed(2)}ms`, {
        title: 'Analysis Complete',
        duration: 3000
      })
    }, Math.floor(Math.random() * 200) + 200) // 200-400ms delay
  }

  return (
    <div className={styles.homePage}>
      {/* Large hero title for LCP measurement */}
      <h1 className={styles.heroTitle}>Dash0 Times</h1>
      
      {/* Hero image/subheading for additional LCP content */}
      <div className={styles.heroImage}>
        <div className={styles.heroImagePlaceholder}>
          📊 Observability & Monitoring Hub
        </div>
      </div>
      
      <p className={styles.heroSubtitle}>
        Your source for monitoring and observability insights - generating realistic telemetry signals for demo purposes
      </p>
      
      {/* Run analysis button with heavy computation */}
      <button 
        className={styles.analysisButton}
        onClick={runHeavyComputation}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <Spinner size="small" />
            Analyzing...
          </>
        ) : (
          'Run Analysis'
        )}
      </button>
      
      {/* Display computation results and timing */}
      {analysisResult && (
        <div className={styles.analysisResults}>
          <h3>Analysis Complete!</h3>
          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Computation Result:</span>
              <span className={styles.resultValue}>{analysisResult.result}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total Duration:</span>
              <span className={styles.resultValue}>{analysisResult.totalDuration}ms</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Computation Time:</span>
              <span className={styles.resultValue}>{analysisResult.computationDuration}ms</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Iterations Processed:</span>
              <span className={styles.resultValue}>{analysisResult.iterations.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Banner that appears after 1800ms to demonstrate CLS */}
      <Banner />
      
      <div className={styles.content}>
        <p>Welcome to Dash0 Times - a demo application designed to generate realistic telemetry signals including LCP, CLS, and INP measurements.</p>
        <p>Click the "Run Analysis" button above to trigger a heavy computation that will generate INP (Interaction to Next Paint) telemetry data.</p>
        
        {/* Error Handling Demo Section */}
        <div className={styles.demoSection}>
          <h3>Error Handling Demo</h3>
          <p>Test the comprehensive error handling and notification system:</p>
          <div className={styles.demoButtons}>
            <button 
              className={styles.demoButton}
              onClick={() => showSuccess('This is a success message!', { title: 'Success Demo' })}
            >
              Show Success
            </button>
            <button 
              className={styles.demoButton}
              onClick={() => showError('This is an error message!', { title: 'Error Demo' })}
            >
              Show Error
            </button>
            <button 
              className={styles.demoButton}
              onClick={() => showWarning('This is a warning message!', { title: 'Warning Demo' })}
            >
              Show Warning
            </button>
            <button 
              className={styles.demoButton}
              onClick={() => showInfo('This is an info message!', { title: 'Info Demo' })}
            >
              Show Info
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage