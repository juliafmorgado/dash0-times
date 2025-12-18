import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import apiClient from '../utils/apiClient'
import { ArticleSkeleton, RecommendationsSkeleton } from '../components/LoadingSkeleton'
import ErrorMessage from '../components/ErrorMessage'
import { trackNewTabNavigation, verifyContentConsistency } from '../utils/navigationTracking'
import { useErrorHandler } from '../hooks/useErrorHandler'
import styles from './ArticleDetailPage.module.css'

function ArticleDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [recommendationsLoading, setRecommendationsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recommendationsError, setRecommendationsError] = useState(null)
  
  // Error handling hook
  const { handleApiError, handleSilentError, showSuccess, showWarning } = useErrorHandler()

  // Fetch article data
  const fetchArticle = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/api/articles/${id}`)
      setArticle(response.article)
      
      // Show success message for article load
      showSuccess(`Article "${response.article.title}" loaded successfully`, {
        duration: 2000
      })
    } catch (err) {
      console.error('Error fetching article:', err)
      const errorInfo = handleApiError(err, { 
        operation: 'load_article',
        articleId: id 
      })
      setError(errorInfo.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch recommendations
  const fetchRecommendations = async () => {
    try {
      setRecommendationsLoading(true)
      setRecommendationsError(null)
      const response = await apiClient.get('/api/recommendation')
      setRecommendations(response.recommendations)
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      // Handle recommendations error silently (no toast) since it's optional
      const errorInfo = handleSilentError(err, { 
        operation: 'load_recommendations',
        isOptional: true 
      })
      setRecommendationsError(errorInfo.message)
    } finally {
      setRecommendationsLoading(false)
    }
  }

  // Load article on mount and when ID changes
  useEffect(() => {
    if (id) {
      fetchArticle()
    }
  }, [id])

  // Load recommendations after article loads
  useEffect(() => {
    if (article) {
      fetchRecommendations()
    }
  }, [article])

  // Verify content consistency for new tab navigation
  useEffect(() => {
    if (id && article) {
      verifyContentConsistency(id).then(isConsistent => {
        if (!isConsistent) {
          console.warn(`Content consistency check failed for article ${id}`);
          showWarning('Content may be outdated. Consider refreshing the page.', {
            title: 'Content Warning',
            duration: 7000
          })
        }
      });
    }
  }, [id, article, showWarning])

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Render loading state
  if (loading) {
    return (
      <div className={styles.articleDetailPage}>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <ArticleSkeleton />
          </div>
          <aside className={styles.sidebar}>
            <RecommendationsSkeleton />
          </aside>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className={styles.articleDetailPage}>
        <div className={styles.container}>
          <ErrorMessage
            title="Failed to Load Article"
            message={error}
            onRetry={fetchArticle}
          />
        </div>
      </div>
    )
  }

  // Render article not found
  if (!article) {
    return (
      <div className={styles.articleDetailPage}>
        <div className={styles.container}>
          <ErrorMessage
            title="Article Not Found"
            message="The article you're looking for doesn't exist or has been removed."
          />
          <div className={styles.backLink}>
            <Link to="/articles" className={styles.backButton}>
              ← Back to Articles
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.articleDetailPage}>
      <div className={styles.container}>
        {/* Main Article Content */}
        <main className={styles.mainContent}>
          <article className={styles.article}>
            {/* Article Header */}
            <header className={styles.articleHeader}>
              <h1 className={styles.articleTitle}>{article.title}</h1>
              
              <div className={styles.articleMeta}>
                <time className={styles.publishDate} dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className={styles.tags}>
                  {article.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Article Body */}
            <div className={styles.articleBody}>
              {article.body.split('\n').map((paragraph, index) => {
                // Handle code blocks
                if (paragraph.startsWith('```')) {
                  return null // Skip code block markers for now
                }
                
                // Handle headers
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className={styles.sectionHeader}>
                      {paragraph.replace('## ', '')}
                    </h2>
                  )
                }
                
                if (paragraph.startsWith('# ')) {
                  return (
                    <h2 key={index} className={styles.sectionHeader}>
                      {paragraph.replace('# ', '')}
                    </h2>
                  )
                }

                // Handle bullet points
                if (paragraph.startsWith('- ')) {
                  return (
                    <li key={index} className={styles.listItem}>
                      {paragraph.replace('- ', '')}
                    </li>
                  )
                }

                // Handle bold text
                const boldText = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                
                // Regular paragraphs
                if (paragraph.trim()) {
                  return (
                    <p 
                      key={index} 
                      className={styles.paragraph}
                      dangerouslySetInnerHTML={{ __html: boldText }}
                    />
                  )
                }
                
                return null
              })}
            </div>

            {/* Back to Articles Link */}
            <div className={styles.articleFooter}>
              <Link to="/articles" className={styles.backButton}>
                ← Back to Articles
              </Link>
            </div>
          </article>
        </main>

        {/* Sidebar with Recommendations */}
        <aside className={styles.sidebar}>
          <div className={styles.recommendationsSection}>
            <h3 className={styles.sidebarTitle}>Recommended Articles</h3>
            
            {recommendationsLoading ? (
              <RecommendationsSkeleton />
            ) : recommendationsError ? (
              <ErrorMessage
                title="Recommendations Unavailable"
                message={recommendationsError}
                onRetry={fetchRecommendations}
                retryText="Retry Loading"
                variant="warning"
              />
            ) : (
              <div className={styles.recommendations}>
                {recommendations.map(rec => (
                  <article key={rec.id} className={styles.recommendationItem}>
                    <h4 className={styles.recommendationTitle}>
                      <Link 
                        to={`/articles/${rec.id}`}
                        className={styles.recommendationLink}
                      >
                        {rec.title}
                      </Link>
                    </h4>
                    <p className={styles.recommendationExcerpt}>
                      {rec.excerpt}
                    </p>
                    <div className={styles.recommendationMeta}>
                      <time className={styles.recommendationDate}>
                        {formatDate(rec.publishedAt)}
                      </time>
                    </div>
                    <div className={styles.recommendationActions}>
                      <Link 
                        to={`/articles/${rec.id}`}
                        className={styles.recommendationReadButton}
                      >
                        Read
                      </Link>
                      <a 
                        href={`/articles/${rec.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.recommendationNewTabButton}
                        onClick={(e) => {
                          // Track new tab navigation event
                          trackNewTabNavigation(rec.id, 'recommendation', {
                            source_article_id: id,
                            source_article_title: article.title
                          });
                        }}
                      >
                        New Tab
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ArticleDetailPage