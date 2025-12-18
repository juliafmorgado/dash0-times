import { Link } from 'react-router-dom'
import styles from './BrandHeader.module.css'

function BrandHeader() {
  return (
    <div className={styles.brandHeader}>
      <Link to="/" className={styles.logoLink}>
        <div className={styles.logo}>
          <span className={styles.logoText}>dash</span>
          <span className={styles.logoNumber}>0</span>
        </div>
        <span className={styles.tagline}>Times</span>
      </Link>
    </div>
  )
}

export default BrandHeader