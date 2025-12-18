import styles from './LoadingSkeleton.module.css'

function LoadingSkeleton({ 
  width = '100%', 
  height = '1rem', 
  className = '', 
  variant = 'rectangular' 
}) {
  const skeletonClass = `${styles.skeleton} ${styles[variant]} ${className}`
  
  return (
    <div 
      className={skeletonClass}
      style={{ width, height }}
      aria-label="Loading content..."
    />
  )
}

// Spinner component for async operations
export function Spinner({ size = 'medium', className = '' }) {
  const spinnerClass = `${styles.spinner} ${styles[`spinner${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${className}`
  
  return (
    <div className={spinnerClass} aria-label="Loading...">
      <div className={styles.spinnerCircle}></div>
    </div>
  )
}

// Article list skeleton for articles page
export function ArticleListSkeleton({ count = 5 }) {
  return (
    <div className={styles.articleListSkeleton}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.articleCardSkeleton}>
          <div className={styles.articleCardContent}>
            {/* Title */}
            <LoadingSkeleton height="1.5rem" className={styles.cardTitle} />
            
            {/* Excerpt */}
            <div className={styles.cardExcerpt}>
              <LoadingSkeleton height="1rem" />
              <LoadingSkeleton height="1rem" />
              <LoadingSkeleton height="1rem" width="75%" />
            </div>
            
            {/* Meta info */}
            <div className={styles.cardMeta}>
              <div className={styles.cardTags}>
                <LoadingSkeleton width="60px" height="1.5rem" variant="pill" />
                <LoadingSkeleton width="80px" height="1.5rem" variant="pill" />
                <LoadingSkeleton width="70px" height="1.5rem" variant="pill" />
              </div>
              <div className={styles.cardDate}>
                <LoadingSkeleton width="120px" height="0.875rem" />
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className={styles.cardActions}>
            <LoadingSkeleton width="100px" height="2.25rem" variant="button" />
            <LoadingSkeleton width="120px" height="2.25rem" variant="button" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Article detail skeleton for article detail page
export function ArticleSkeleton() {
  return (
    <div className={styles.articleSkeleton}>
      {/* Title skeleton */}
      <LoadingSkeleton height="3rem" className={styles.titleSkeleton} />
      
      {/* Meta info skeleton */}
      <div className={styles.metaSkeleton}>
        <LoadingSkeleton width="120px" height="1rem" />
        <LoadingSkeleton width="100px" height="1rem" />
      </div>
      
      {/* Tags skeleton */}
      <div className={styles.tagsSkeleton}>
        <LoadingSkeleton width="80px" height="1.75rem" variant="pill" />
        <LoadingSkeleton width="100px" height="1.75rem" variant="pill" />
        <LoadingSkeleton width="90px" height="1.75rem" variant="pill" />
      </div>
      
      {/* Content skeleton */}
      <div className={styles.contentSkeleton}>
        <LoadingSkeleton height="1.25rem" />
        <LoadingSkeleton height="1.25rem" />
        <LoadingSkeleton height="1.25rem" width="85%" />
        <LoadingSkeleton height="1.25rem" />
        <LoadingSkeleton height="1.25rem" width="70%" />
        <LoadingSkeleton height="1.25rem" />
        <LoadingSkeleton height="1.25rem" width="90%" />
        <LoadingSkeleton height="1.25rem" />
      </div>
    </div>
  )
}

// Recommendations sidebar skeleton
export function RecommendationsSkeleton() {
  return (
    <div className={styles.recommendationsSkeleton}>
      <LoadingSkeleton height="1.5rem" width="180px" className={styles.sectionTitle} />
      {[1, 2, 3].map(i => (
        <div key={i} className={styles.recommendationItem}>
          <LoadingSkeleton height="1.25rem" />
          <LoadingSkeleton height="0.875rem" width="80%" />
          <div className={styles.recommendationMeta}>
            <LoadingSkeleton width="80px" height="0.75rem" />
            <LoadingSkeleton width="90px" height="0.75rem" />
          </div>
          <div className={styles.recommendationActions}>
            <LoadingSkeleton width="60px" height="1.75rem" variant="button" />
            <LoadingSkeleton width="80px" height="1.75rem" variant="button" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Search results skeleton
export function SearchResultsSkeleton({ count = 3 }) {
  return (
    <div className={styles.searchResultsSkeleton}>
      <div className={styles.searchHeader}>
        <LoadingSkeleton height="1.5rem" width="150px" />
        <LoadingSkeleton height="1rem" width="100px" />
      </div>
      
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.searchResultItem}>
          <LoadingSkeleton height="1.5rem" className={styles.resultTitle} />
          <div className={styles.resultExcerpt}>
            <LoadingSkeleton height="1rem" />
            <LoadingSkeleton height="1rem" width="85%" />
          </div>
          <div className={styles.resultMeta}>
            <div className={styles.resultTags}>
              <LoadingSkeleton width="60px" height="1.25rem" variant="pill" />
              <LoadingSkeleton width="80px" height="1.25rem" variant="pill" />
            </div>
            <LoadingSkeleton width="100px" height="0.875rem" />
          </div>
          <div className={styles.resultActions}>
            <LoadingSkeleton width="100px" height="2rem" variant="button" />
            <LoadingSkeleton width="120px" height="2rem" variant="button" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Inline loading component for small operations
export function InlineLoader({ text = 'Loading...', showSpinner = true }) {
  return (
    <div className={styles.inlineLoader}>
      {showSpinner && <Spinner size="small" />}
      <span className={styles.inlineLoaderText}>{text}</span>
    </div>
  )
}

export default LoadingSkeleton