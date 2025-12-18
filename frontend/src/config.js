/**
 * Configuration file for Dash0 Times application
 * Manages environment-specific settings and API configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:3001',
  TIMEOUT: 10000, // 10 seconds
  ENDPOINTS: {
    HEALTH: '/api/health',
    ARTICLES: '/api/articles',
    ARTICLE_DETAIL: '/api/articles',
    SEARCH: '/api/search',
    RECOMMENDATIONS: '/api/recommendation'
  }
};

// Application Configuration
export const APP_CONFIG = {
  NAME: 'Dash0 Times',
  VERSION: '1.0.0',
  ENVIRONMENT: (typeof import.meta !== 'undefined' && import.meta.env?.MODE) || 'development'
};

// Demo User Configuration for Authentication Simulation
export const DEMO_USERS = {
  FREE: { id: 'demo-free-user', plan: 'free' },
  PRO: { id: 'demo-pro-user', plan: 'pro' },
  ENTERPRISE: { id: 'demo-enterprise-user', plan: 'enterprise' }
};

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  SEARCH_DEBOUNCE_MS: 300,
  BANNER_DELAY_MS: 1800,
  HEAVY_COMPUTATION_MIN_MS: 200,
  HEAVY_COMPUTATION_MAX_MS: 400
};

export default {
  API_CONFIG,
  APP_CONFIG,
  DEMO_USERS,
  PERFORMANCE_CONFIG
};