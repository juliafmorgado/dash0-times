import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../utils/apiClient'
import ErrorMessage from '../components/ErrorMessage'
import { ArticleListSkeleton } from '../components/LoadingSkeleton'
import { trackNewTabNavigation, preservePageState, restorePageState } from '../utils/navigationTracking'
import { useErrorHandler } from '../hooks/useErrorHandler'
import styles from './ArticlesPage.module.css'

function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState('')
  const [allTags, setAllTags] = useState([])
  
  // Error handling hook
  const { handleApiError, showSuccess } = useErrorHandler()
  
  const articlesPerPage = 10

  // Fetch articles on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.get('/api/articles')
        setArticles(response.articles || [])
        
        // Extract unique tags from all articles
        const tags = new Set()
        response.articles?.forEach(article => {
          article.tags?.forEach(tag => tags.add(tag))
        })
        setAllTags(Array.from(tags).sort())
        
        // Show success message
        showSuccess(`Loaded ${response.articles?.length || 0} articles`, {
          duration: 2000
        })
      } catch (err) {
        const errorInfo = handleApiError(err, { 
          operation: 'load_articles' 
        })
        setError(errorInfo.message)
      } finally {
        setLoading(false)
      }
    }

    // Try to restore previous page state
    const restoredState = restorePageState('articles')
    if (restoredState) {
      setCurrentPage(restoredState.currentPage || 1)
      setSelectedTag(restoredState.selectedTag || '')
    }

    fetchArticles()
  }, [])

  // Filter articles by selected tag
  const filteredArticles = selectedTag 
    ? articles.filter(article => article.tags?.includes(selectedTag))
    : articles

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArticles = filteredArticles.slice(startIndex, endIndex)

  // Reset to first page when tag filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTag])

  // Handle tag filter change
  const handleTagFilter = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag)
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className={styles.articlesPage}>
        <h1 className={styles.pageTitle}>Articles</h1>
        <p className={styles.pageDescription}>
          Explore our collection of observability and monitoring insights
        </p>
        <ArticleListSkeleton count={8} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.articlesPage}>
        <h1 className={styles.pageTitle}>Articles</h1>
        <ErrorMessage
          title="Failed to Load Articles"
          message={error}
          onRetry={() => window.location.reload()}
          retryText="Reload Articles"
        />
      </div>
    )
  }

  return (
    <div className={styles.articlesPage}>
      <h1 className={styles.pageTitle}>Articles</h1>
      <p className={styles.pageDescription}>
        Explore our collection of observability and monitoring insights
      </p>

      <div className={styles.contentLayout}>
        {/* Main Content Area */}
        <div className={styles.mainContent}>
          {/* Articles List */}
          <div className={styles.articlesContainer}>
            {currentArticles.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No articles found for the selected filter.</p>
                <button 
                  className={styles.clearFilterButton}
                  onClick={() => setSelectedTag('')}
                >
                  Clear Filter
                </button>
              </div>
            ) : (
              <div className={styles.articlesList}>
                {currentArticles.map(article => (
                  <article key={article.id} className={styles.articleCard}>
                    <div className={styles.articleContent}>
                      <h2 className={styles.articleTitle}>
                        <Link 
                          to={`/articles/${article.id}`}
                          className={styles.articleTitleLink}
                          onClick={() => {
                            // Preserve current page state for regular navigation
                            preservePageState('articles', {
                              currentPage,
                              selectedTag,
                              scrollPosition: window.scrollY
                            });
                          }}
                        >
                          {article.title}
                        </Link>
                      </h2>
                      
                      <p className={styles.articleExcerpt}>
                        {article.excerpt}
                      </p>
                      
                      <div className={styles.articleMeta}>
                        <div className={styles.articleTags}>
                          {article.tags?.map(tag => (
                            <span 
                              key={tag} 
                              className={styles.articleTag}
                              onClick={() => handleTagFilter(tag)}
                              role="button"
                              tabIndex={0}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className={styles.articleInfo}>
                          <span className={styles.articleDate}>
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <div className={styles.paginationNumbers}>
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1
                  return (
                    <button
                      key={page}
                      className={`${styles.paginationNumber} ${currentPage === page ? styles.paginationNumberActive : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              
              <button
                className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className={styles.resultsSummary}>
            <p>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredArticles.length)} of {filteredArticles.length} articles
              {selectedTag && ` tagged with "${selectedTag}"`}
            </p>
          </div>
        </div>

        {/* Right Sidebar - Filter Section */}
        <div className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Filter by Topic</h3>
            <div className={styles.tagFilters}>
              <button
                className={`${styles.tagButton} ${!selectedTag ? styles.tagButtonActive : ''}`}
                onClick={() => handleTagFilter('')}
              >
                All Articles ({articles.length})
              </button>
              {allTags.map(tag => {
                const count = articles.filter(article => article.tags?.includes(tag)).length
                return (
                  <button
                    key={tag}
                    className={`${styles.tagButton} ${selectedTag === tag ? styles.tagButtonActive : ''}`}
                    onClick={() => handleTagFilter(tag)}
                  >
                    {tag} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticlesPage