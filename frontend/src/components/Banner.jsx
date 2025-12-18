import { useState, useEffect } from 'react'
import styles from './Banner.module.css'

function Banner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show banner after exactly 1800ms to demonstrate CLS
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.banner}>
      <div className={styles.bannerContent}>
        <div className={styles.bannerIcon}>
          📊
        </div>
        <div className={styles.bannerText}>
          <h3 className={styles.bannerTitle}>Dash0 Monitoring Alert</h3>
          <p className={styles.bannerMessage}>
            This banner demonstrates Cumulative Layout Shift (CLS) - it appears after 1800ms and pushes content downward
          </p>
        </div>

      </div>
    </div>
  )
}

export default Banner