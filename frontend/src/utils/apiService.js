/**
 * API Service layer for Dash0 Times application
 * Provides high-level API methods using the centralized API client
 */

import apiClient from './apiClient.js';
import { API_CONFIG } from '../config.js';

/**
 * Articles API methods
 */
export const articlesApi = {
  /**
   * Fetch all articles
   * @returns {Promise<Object>} Articles list response
   */
  async getAll() {
    return apiClient.get(API_CONFIG.ENDPOINTS.ARTICLES);
  },

  /**
   * Fetch single article by ID
   * @param {string} id - Article ID
   * @returns {Promise<Object>} Article detail response
   */
  async getById(id) {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ARTICLE_DETAIL}/${id}`);
  }
};

/**
 * Search API methods
 */
export const searchApi = {
  /**
   * Search articles by query
   * @param {string} query - Search query string
   * @returns {Promise<Object>} Search results response
   */
  async search(query) {
    const params = new URLSearchParams({ q: query });
    return apiClient.get(`${API_CONFIG.ENDPOINTS.SEARCH}?${params}`);
  }
};

/**
 * Recommendations API methods
 */
export const recommendationsApi = {
  /**
   * Fetch article recommendations
   * @returns {Promise<Object>} Recommendations response
   */
  async get() {
    return apiClient.get(API_CONFIG.ENDPOINTS.RECOMMENDATIONS);
  }
};

/**
 * Health check API methods
 */
export const healthApi = {
  /**
   * Check API health status
   * @returns {Promise<Object>} Health check response
   */
  async check() {
    return apiClient.get(API_CONFIG.ENDPOINTS.HEALTH);
  }
};

/**
 * Authentication simulation methods
 */
export const authApi = {
  /**
   * Set demo user for authentication simulation
   * @param {Object} user - User object with id and plan
   */
  setDemoUser(user) {
    apiClient.setDemoUser(user);
  },

  /**
   * Clear demo user authentication
   */
  clearDemoUser() {
    apiClient.clearDemoUser();
  },

  /**
   * Get current demo user
   * @returns {Object|null} Current demo user or null
   */
  getCurrentUser() {
    return apiClient.demoUser;
  }
};

// Export all API methods as a single object for convenience
export default {
  articles: articlesApi,
  search: searchApi,
  recommendations: recommendationsApi,
  health: healthApi,
  auth: authApi
};