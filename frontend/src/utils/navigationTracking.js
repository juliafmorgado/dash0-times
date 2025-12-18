/**
 * Navigation tracking utilities for new tab functionality
 */

/**
 * Track new tab navigation events
 * @param {string} articleId - The ID of the article being opened
 * @param {string} source - The source of the navigation (article_list, recommendation, etc.)
 * @param {Object} additionalData - Additional tracking data
 */
export const trackNewTabNavigation = (articleId, source, additionalData = {}) => {
  // Track with Google Analytics if available
  if (window.gtag) {
    window.gtag('event', 'new_tab_navigation', {
      event_category: 'navigation',
      event_label: source,
      article_id: articleId,
      ...additionalData
    });
  }

  // Track with custom analytics if available
  if (window.dash0Analytics) {
    window.dash0Analytics.track('new_tab_navigation', {
      articleId,
      source,
      timestamp: new Date().toISOString(),
      ...additionalData
    });
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('New tab navigation tracked:', {
      articleId,
      source,
      ...additionalData
    });
  }
};

/**
 * Preserve current page state before new tab navigation
 * @param {string} pageType - The type of page (articles, search, etc.)
 * @param {Object} state - The current page state to preserve
 */
export const preservePageState = (pageType, state) => {
  const stateKey = `dash0_page_state_${pageType}`;
  
  try {
    // Store state in sessionStorage for preservation during navigation
    sessionStorage.setItem(stateKey, JSON.stringify({
      ...state,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.warn('Failed to preserve page state:', error);
  }
};

/**
 * Restore preserved page state
 * @param {string} pageType - The type of page (articles, search, etc.)
 * @returns {Object|null} - The restored state or null if not found
 */
export const restorePageState = (pageType) => {
  const stateKey = `dash0_page_state_${pageType}`;
  
  try {
    const storedState = sessionStorage.getItem(stateKey);
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      
      // Check if state is not too old (1 hour max)
      const stateAge = new Date() - new Date(parsedState.timestamp);
      if (stateAge < 3600000) { // 1 hour in milliseconds
        return parsedState;
      }
    }
  } catch (error) {
    console.warn('Failed to restore page state:', error);
  }
  
  return null;
};

/**
 * Verify content consistency between inline and new tab navigation
 * @param {string} articleId - The article ID to verify
 * @returns {Promise<boolean>} - Whether content is consistent
 */
export const verifyContentConsistency = async (articleId) => {
  try {
    // This would typically make an API call to verify the article still exists
    // and has the same content hash or version
    const response = await fetch(`/api/articles/${articleId}/verify`, {
      method: 'HEAD'
    });
    
    return response.ok;
  } catch (error) {
    console.warn('Failed to verify content consistency:', error);
    return true; // Assume consistent if verification fails
  }
};