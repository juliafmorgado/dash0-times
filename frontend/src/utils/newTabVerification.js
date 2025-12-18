/**
 * Manual verification utilities for new tab functionality
 * This script helps verify that new tab functionality works correctly
 */

/**
 * Verify that new tab links have correct attributes
 */
export const verifyNewTabLinks = () => {
  const newTabLinks = document.querySelectorAll('a[target="_blank"]');
  const results = {
    totalLinks: newTabLinks.length,
    correctAttributes: 0,
    missingRel: 0,
    correctHrefs: 0
  };

  newTabLinks.forEach(link => {
    // Check for correct rel attribute
    if (link.getAttribute('rel') === 'noopener noreferrer') {
      results.correctAttributes++;
    } else {
      results.missingRel++;
    }

    // Check for correct href format
    if (link.href.includes('/articles/')) {
      results.correctHrefs++;
    }
  });

  console.log('New Tab Links Verification:', results);
  return results;
};

/**
 * Test page state preservation
 */
export const testPageStatePreservation = () => {
  const testState = {
    currentPage: 2,
    selectedTag: 'test',
    scrollPosition: 100,
    timestamp: new Date().toISOString()
  };

  // Store test state
  try {
    sessionStorage.setItem('dash0_page_state_test', JSON.stringify(testState));
    
    // Retrieve and verify
    const retrieved = JSON.parse(sessionStorage.getItem('dash0_page_state_test'));
    const isValid = retrieved.currentPage === testState.currentPage && 
                   retrieved.selectedTag === testState.selectedTag;
    
    console.log('Page State Preservation Test:', isValid ? 'PASSED' : 'FAILED');
    
    // Cleanup
    sessionStorage.removeItem('dash0_page_state_test');
    
    return isValid;
  } catch (error) {
    console.error('Page State Preservation Test: FAILED', error);
    return false;
  }
};

/**
 * Test navigation tracking
 */
export const testNavigationTracking = () => {
  let trackingCalled = false;
  
  // Mock tracking function
  const originalGtag = window.gtag;
  window.gtag = (...args) => {
    if (args[0] === 'event' && args[1] === 'new_tab_navigation') {
      trackingCalled = true;
      console.log('Navigation tracking called with:', args);
    }
  };

  // Import and test tracking function
  import('./navigationTracking.js').then(({ trackNewTabNavigation }) => {
    trackNewTabNavigation('test-article', 'test-source', { test: true });
    
    console.log('Navigation Tracking Test:', trackingCalled ? 'PASSED' : 'FAILED');
    
    // Restore original function
    window.gtag = originalGtag;
  });

  return trackingCalled;
};

/**
 * Run all verification tests
 */
export const runAllVerifications = () => {
  console.log('=== New Tab Functionality Verification ===');
  
  const linkResults = verifyNewTabLinks();
  const stateResults = testPageStatePreservation();
  const trackingResults = testNavigationTracking();
  
  const allPassed = linkResults.correctAttributes === linkResults.totalLinks &&
                   linkResults.missingRel === 0 &&
                   stateResults &&
                   trackingResults;
  
  console.log('=== Overall Result ===');
  console.log(allPassed ? '✅ All tests PASSED' : '❌ Some tests FAILED');
  
  return {
    links: linkResults,
    statePreservation: stateResults,
    tracking: trackingResults,
    overall: allPassed
  };
};

// Auto-run verification in development mode
if (process.env.NODE_ENV === 'development') {
  // Run verification after page load
  window.addEventListener('load', () => {
    setTimeout(runAllVerifications, 1000);
  });
}