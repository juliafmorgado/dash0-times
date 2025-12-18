/**
 * Centralized API client for Dash0 Times application
 * Provides consistent HTTP communication with error handling and authentication support
 */

// Configuration
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:3001';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

/**
 * API Client class for centralized HTTP communication
 */
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.demoUser = null; // For x-demo-user header simulation
  }

  /**
   * Set demo user for authentication simulation
   * @param {Object} user - User object with id and plan
   */
  setDemoUser(user) {
    this.demoUser = user;
  }

  /**
   * Clear demo user authentication
   */
  clearDemoUser() {
    this.demoUser = null;
  }

  /**
   * Build headers for requests including authentication if available
   * @param {Object} customHeaders - Additional headers to include
   * @returns {Object} Complete headers object
   */
  buildHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    // Add x-demo-user header if demo user is set
    if (this.demoUser) {
      headers['x-demo-user'] = JSON.stringify(this.demoUser);
    }
    
    return headers;
  }

  /**
   * Build full URL from endpoint
   * @param {string} endpoint - API endpoint path
   * @returns {string} Complete URL
   */
  buildURL(endpoint) {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseURL}/${cleanEndpoint}`;
  }

  /**
   * Request interceptor - processes requests before sending
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @returns {Object} Processed request options
   */
  requestInterceptor(url, options) {
    const processedOptions = {
      ...options,
      headers: this.buildHeaders(options.headers),
    };

    // Add timeout using AbortController
    if (!processedOptions.signal) {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
      processedOptions.signal = controller.signal;
    }

    return processedOptions;
  }

  /**
   * Response interceptor - processes responses after receiving
   * @param {Response} response - Fetch response object
   * @returns {Promise<Object>} Processed response data
   */
  async responseInterceptor(response) {
    const startTime = performance.now();
    
    try {
      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      // Parse JSON response
      const data = await response.json();
      const endTime = performance.now();
      
      // Add timing information to response
      return {
        ...data,
        timing: Math.round(endTime - startTime)
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors, JSON parsing errors, etc.
      throw new ApiError(
        error.name === 'AbortError' ? 'Request timeout' : 'Network error',
        0,
        { originalError: error.message }
      );
    }
  }

  /**
   * Core fetch wrapper with interceptors
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async request(endpoint, options = {}) {
    const url = this.buildURL(endpoint);
    const processedOptions = this.requestInterceptor(url, options);
    
    try {
      const response = await fetch(url, processedOptions);
      return await this.responseInterceptor(response);
    } catch (error) {
      // Ensure all errors are ApiError instances for consistent handling
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Request failed', 0, { originalError: error.message });
    }
  }

  /**
   * GET request wrapper
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options
    });
  }

  /**
   * POST request wrapper
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   */
  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      ...options
    });
  }

  /**
   * PUT request wrapper
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   */
  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      ...options
    });
  }

  /**
   * DELETE request wrapper
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options
    });
  }
}

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, status = 0, data = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  /**
   * Check if error is a network error
   * @returns {boolean}
   */
  isNetworkError() {
    return this.status === 0;
  }

  /**
   * Check if error is a client error (4xx)
   * @returns {boolean}
   */
  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if error is a server error (5xx)
   * @returns {boolean}
   */
  isServerError() {
    return this.status >= 500;
  }

  /**
   * Get user-friendly error message
   * @returns {string}
   */
  getUserMessage() {
    if (this.isNetworkError()) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    if (this.isServerError()) {
      return 'Server error occurred. Please try again later.';
    }
    
    if (this.isClientError()) {
      return this.message || 'Invalid request. Please check your input.';
    }
    
    return this.message || 'An unexpected error occurred.';
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();

export default apiClient;
export { ApiClient, ApiError };