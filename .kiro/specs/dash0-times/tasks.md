# Implementation Plan

- [-] 1. Set up project structure and workspace configuration
  - Create monorepo structure with frontend/ and backend/ directories
  - Configure pnpm workspaces with root package.json
  - Set up development scripts for concurrent frontend and backend execution
  - Initialize git repository with appropriate .gitignore files
  - _Requirements: 10.1, 10.2_

- [ ] 2. Initialize frontend React application with Vite
  - Create Vite + React project in frontend/ directory
  - Configure React Router v6 for client-side routing
  - Set up CSS Modules for component styling
  - Install and configure development dependencies
  - _Requirements: 2.1, 2.2_

- [ ] 3. Initialize backend Express application
  - Create Node.js Express server in backend/ directory
  - Configure CORS middleware for frontend development
  - Set up basic server structure with ES modules
  - Create health check endpoint
  - _Requirements: 8.5, 10.3, 10.4_

- [ ] 4. Create Dash0 branding and theme system
  - Research and implement Dash0 brand colors and design tokens
  - Create theme.js with Dash0 color palette and typography
  - Implement BrandHeader component with Dash0 logo
  - Set up consistent styling patterns across components
  - _Requirements: 11.1, 11.2, 11.3_

- [ ]* 4.1 Write property test for Dash0 branding consistency
  - **Property 13: Dash0 branding consistency**
  - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

- [ ] 5. Implement centralized API client
  - Create apiClient.js with fetch wrapper functions
  - Implement request/response interceptors for consistent error handling
  - Add support for x-demo-user header for authentication simulation
  - Configure base URL and common request options
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 5.1 Write property test for API client centralization
  - **Property 6: API client centralization**
  - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**

- [ ] 6. Create core layout and navigation components
  - Implement Layout.jsx with Dash0-branded header and footer
  - Create navigation menu with Home, Articles, Search links
  - Add footer with build info and current route display
  - Implement responsive design patterns
  - _Requirements: 2.1, 11.2, 11.4_

- [ ]* 6.1 Write property test for client-side routing consistency
  - **Property 1: Client-side routing consistency**
  - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**

- [ ] 7. Implement home page with performance triggers
  - Create HomePage.jsx with large hero title "Dash0 Times"
  - Add hero image or subheading for LCP measurement
  - Implement "Run analysis" button with heavy computation (200-400ms)
  - Display computation results and execution timing
  - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [ ]* 7.1 Write property test for heavy computation duration bounds
  - **Property 5: Heavy computation duration bounds**
  - **Validates: Requirements 3.4, 3.5**

- [ ] 8. Implement delayed banner for CLS demonstration
  - Create Banner.jsx component with Dash0 branding
  - Add 1800ms delay after page load before banner appears
  - Ensure banner pushes content downward (real layout shift)
  - Style banner with appropriate Dash0 design elements
  - _Requirements: 3.3_

- [ ]* 8.1 Write property test for layout shift timing precision
  - **Property 4: Layout shift timing precision**
  - **Validates: Requirements 3.3**

- [ ] 9. Create backend article data and endpoints
  - Generate 30-50 fake articles with realistic content
  - Implement GET /api/articles with 50-150ms artificial delay
  - Implement GET /api/articles/:id with 800-1200ms delay
  - Add support for viewer context when x-demo-user header is present
  - _Requirements: 8.1, 8.2_

- [ ]* 9.1 Write property test for API response timing bounds
  - **Property 2: API response timing bounds**
  - **Validates: Requirements 8.1, 8.2, 8.4**

- [ ] 10. Implement articles list page
  - Create ArticlesPage.jsx with Dash0 styling
  - Fetch and display articles with title, excerpt, tags, published date
  - Implement client-side pagination controls
  - Add tag filtering functionality
  - Include "Open in new tab" links for each article
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 7.1_

- [ ]* 10.1 Write property test for article display format consistency
  - **Property 10: Article display format consistency**
  - **Validates: Requirements 4.2, 7.1**

- [ ]* 10.2 Write property test for tag filtering accuracy
  - **Property 11: Tag filtering accuracy**
  - **Validates: Requirements 4.4**

- [ ] 11. Implement article detail page with loading states
  - Create ArticleDetailPage.jsx with skeleton loading component
  - Fetch article data and display full content
  - Implement sidebar recommendations section
  - Add proper loading states and error handling
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 11.1 Write property test for loading state consistency
  - **Property 8: Loading state consistency**
  - **Validates: Requirements 5.2, 6.3**

- [ ] 12. Create recommendations endpoint and integration
  - Implement GET /api/recommendation with 200-900ms delay
  - Return 3 recommended articles with realistic data
  - Integrate recommendations into article detail sidebar
  - Handle loading and error states appropriately
  - _Requirements: 8.4, 5.4, 5.5_

- [ ] 13. Implement search functionality with debouncing
  - Create SearchPage.jsx with debounced search input (300ms)
  - Implement search results display with Dash0 styling
  - Add request timing display using performance.now()
  - Handle both success and error states gracefully
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [ ]* 13.1 Write property test for search debouncing behavior
  - **Property 9: Search debouncing behavior**
  - **Validates: Requirements 6.1**

- [ ] 14. Create flaky search endpoint
  - Implement GET /api/search with 100-400ms delay
  - Add 20% chance of returning HTTP 500 error
  - Return structured error messages for frontend handling
  - Test error rate consistency over multiple requests
  - _Requirements: 8.3, 6.4_

- [ ]* 14.1 Write property test for search error rate consistency
  - **Property 3: Search error rate consistency**
  - **Validates: Requirements 8.3**

- [ ] 15. Implement new tab functionality
  - Add target="_blank" support for article links
  - Ensure original page state preservation
  - Track new tab navigation events separately
  - Verify content consistency between inline and new tab navigation
  - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [ ]* 15.1 Write property test for new tab navigation preservation
  - **Property 7: New tab navigation preservation**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

- [ ] 16. Add comprehensive error handling and user feedback
  - Implement ErrorMessage.jsx component with Dash0 styling
  - Add toast notifications for API errors
  - Create user-friendly error messages for all failure scenarios
  - Ensure consistent error handling across all components
  - _Requirements: 6.4, 9.4_

- [ ] 17. Implement loading skeletons and UI states
  - Create LoadingSkeleton.jsx with Dash0 design patterns
  - Add skeleton states for article lists and detail pages
  - Implement spinners for search and other async operations
  - Ensure smooth transitions between loading and content states
  - _Requirements: 5.2, 6.3_

- [ ] 18. Add CORS configuration and headers
  - Configure Express CORS middleware for all endpoints
  - Ensure proper headers for frontend development
  - Test cross-origin requests from frontend to backend
  - Verify CORS headers in all API responses
  - _Requirements: 8.5_

- [ ]* 18.1 Write property test for CORS header presence
  - **Property 12: CORS header presence**
  - **Validates: Requirements 8.5**

- [ ] 19. Set up concurrent development environment
  - Install and configure concurrently package
  - Create root-level dev script to run both servers
  - Configure proper port assignments for frontend and backend
  - Add clear console output showing server statuses
  - _Requirements: 10.2, 10.3, 10.4, 10.5_

- [ ] 20. Create comprehensive README documentation
  - Document prerequisites and installation steps
  - Provide clear run commands for development
  - List "things to click" to generate telemetry signals
  - Include troubleshooting and development tips
  - _Requirements: 10.1, 10.2_

- [ ] 21. Final integration and testing checkpoint
  - Ensure all tests pass, ask the user if questions arise
  - Verify all telemetry signals are generated correctly (LCP, CLS, INP)
  - Test all API endpoints and error scenarios
  - Validate Dash0 branding consistency across all pages
  - Confirm concurrent development setup works properly