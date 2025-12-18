import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../utils/apiClient'
import ErrorMessage from '../components/ErrorMessage'
import { SearchResultsSkeleton, Spinner, InlineLoader } from '../components/LoadingSkeleton'
import { trackNewTabNavigation, preservePageState, restorePageState } from '../utils/navigationTracking'
import { useErrorHandler } from '../hooks/useErrorHandler'
import styles from './SearchPage.module.css'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [timing, setTiming] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  
  // Error handling hook
  const { handleApiError, showSuccess } = useErrorHandler()
  
  // Debounce timer ref
  const debounceTimer = useRef(null)
  
  // Debounced search function
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([])
      setHasSearched(false)
      setTiming(null)
      return
    }
    
    setLoading(true)
    setError(null)
    setHasSearched(true)
    
    const startTime = performance.now()
    
    try {
      const response = await apiClient.get(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const endTime = performance.now()
      
      setResults(response.results || [])
      setTiming(Math.round(endTime - startTime))
      
      // Show success message for successful searches
      if (response.results && response.results.length > 0) {
        showSuccess(`Found ${response.results.length} result${response.results.length !== 1 ? 's' : ''} for "${searchQuery}"`, {
          duration: 3000
        })
      }
    } catch (err) {
      const endTime = performance.now()
      
      // Use enhanced error handling
      const errorInfo = handleApiError(err, { 
        operation: 'search',
        query: searchQuery 
      })
      
      setError(errorInfo.message)
      setResults([])
      setTiming(Math.round(endTime - startTime))
    } finally {
      setLoading(false)
    }
  }
  
  // Handle input changes with debouncing
  const handleInputChange = (e) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    // Set new timer for 300ms debounce
    debounceTimer.current = setTimeout(() => {
      performSearch(newQuery)
    }, 300)
  }
  
  // Restore search state on mount
  useEffect(() => {
    const restoredState = restorePageState('search')
    if (restoredState && restoredState.query) {
      setQuery(restoredState.query)
      setResults(restoredState.results || [])
      setTiming(restoredState.timing)
      setHasSearched(true)
      
      // Restore scroll position after a short delay
      if (restoredState.scrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, restoredState.scrollPosition)
        }, 100)
      }
    }
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])
  
  return (
    <div className={styles.searchPage}>
      <div className={styles.searchHeader}>
        <h1 className={styles.title}>Search Articles</h1>
        <p className={styles.subtitle}>Find articles, topics, and insights</p>
      </div>
      
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for articles, topics, or tags..."
            className={styles.searchInput}
            autoFocus
          />
          <div className={styles.searchIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        
        {timing && (
          <div className={styles.timing}>
            Search completed in {timing}ms
          </div>
        )}
      </div>
      
      <div className={styles.searchResults}>
        {loading && (
          <div className={styles.loadingState}>
            <InlineLoader text="Searching articles..." />
            <SearchResultsSkeleton count={3} />
          </div>
        )}
        
        {error && (
          <ErrorMessage 
            message={error} 
            title="Search Failed"
            onRetry={() => performSearch(query)}
            retryText="Retry Search"
          />
        )}
        
        {!loading && !error && hasSearched && (
          <>
            {results.length > 0 ? (
              <>
                <div className={styles.resultsHeader}>
                  <h2>Search Results</h2>
                  <span className={styles.resultsCount}>
                    {results.length} article{results.length !== 1 ? 's' : ''} found
                  </span>
                </div>
                
                <div className={styles.resultsList}>
                  {results.map((article) => (
                    <article key={article.id} className={styles.resultItem}>
                      <div className={styles.resultContent}>
                        <h3 className={styles.resultTitle}>
                          <Link to={`/articles/${article.id}`} className={styles.resultLink}>
                            {article.title}
                          </Link>
                        </h3>
                        
                        <p className={styles.resultExcerpt}>
                          {article.excerpt}
                        </p>
                        
                        <div className={styles.resultMeta}>
                          <div className={styles.resultTags}>
                            {article.tags.map((tag) => (
                              <span key={tag} className={styles.tag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className={styles.resultDate}>
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className={styles.resultActions}>
                          <Link 
                            to={`/articles/${article.id}`} 
                            className={styles.readButton}
                          >
                            Read Article
                          </Link>
                          <a 
                            href={`/articles/${article.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.newTabButton}
                            onClick={(e) => {
                              // Preserve current search state
                              preservePageState('search', {
                                query,
                                results,
                                timing,
                                scrollPosition: window.scrollY
                              });

                              // Track new tab navigation event
                              trackNewTabNavigation(article.id, 'search_results', {
                                search_query: query,
                                result_position: results.findIndex(r => r.id === article.id) + 1,
                                total_results: results.length
                              });
                            }}
                          >
                            Open in New Tab
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
                <h3>No articles found</h3>
                <p>Try searching with different keywords or check your spelling.</p>
              </div>
            )}
          </>
        )}
        
        {!hasSearched && !loading && (
          <div className={styles.searchPrompt}>
            <div className={styles.searchPromptIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h3>Start searching</h3>
            <p>Enter keywords to find articles, topics, and insights from Dash0 Times.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage