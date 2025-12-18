import { Link, useLocation } from 'react-router-dom'
import BrandHeader from './BrandHeader'
import styles from './Layout.module.css'

function Layout({ children }) {
  const location = useLocation()
  
  // Get build info - in a real app this would come from build process
  const buildInfo = {
    version: '0.0.0',
    buildTime: new Date().toISOString().split('T')[0],
    environment: 'development'
  }
  
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <BrandHeader />
          <div className={styles.navLinks}>
            <Link 
              to="/" 
              className={`${styles.navLink} ${location.pathname === '/' ? styles.navLinkActive : ''}`}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link 
              to="/articles" 
              className={`${styles.navLink} ${location.pathname.startsWith('/articles') ? styles.navLinkActive : ''}`}
              aria-current={location.pathname.startsWith('/articles') ? 'page' : undefined}
            >
              Articles
            </Link>
            <Link 
              to="/search" 
              className={`${styles.navLink} ${location.pathname === '/search' ? styles.navLinkActive : ''}`}
              aria-current={location.pathname === '/search' ? 'page' : undefined}
            >
              Search
            </Link>
          </div>
        </nav>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLeft}>
            <p className={styles.footerText}>
              © 2026 <span className={styles.footerBrand}>Dash0</span> Times - Demo Application
            </p>
            <p className={styles.buildInfo}>
              v{buildInfo.version} • Built {buildInfo.buildTime} • {buildInfo.environment}
            </p>
          </div>
          <div className={styles.footerRight}>
            <p className={styles.footerRoute}>
              Current route: <span className={styles.routePath}>{location.pathname}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout