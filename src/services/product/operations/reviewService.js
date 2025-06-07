// services/product/operations/reviewService.js
import { productApiAdapter } from '../adapters/productApiAdapter';

export const reviewService = {
  /**
   * Adds a review to a product
   * @param {string} token - Authorization token
   * @param {string} productId - Product identifier
   * @param {Object} reviewData - Review data
   * @param {number} reviewData.rating - Rating for the product (1-5)
   * @param {string} reviewData.comment - Review comment
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Object|null>} - Product with updated reviews or null in case of error
   */
  addReviewToProduct: async (token, productId, reviewData, errorHandler) => {
    // Validate input data
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    
    if (!reviewData.comment || reviewData.comment.trim().length === 0) {
      throw new Error('Comment cannot be empty');
    }

    const payload = {
      rating: reviewData.rating,
      comment: reviewData.comment.trim()
    };

    return await productApiAdapter.post(
      `/products/${productId}/reviews`, 
      payload, 
      token, 
      errorHandler
    );
  },

  /**
   * Gets reviews for a specific product
   * @param {string} productId - Product identifier
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (optional)
   * @param {number} params.limit - Number of reviews per page (optional)
   * @param {string} params.sortBy - Sort criteria (optional)
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Object|null>} - Reviews data or null in case of error
   */
  getProductReviews: async (productId, params = {}, errorHandler) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    
    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `/products/${productId}/reviews?${queryString}`
      : `/products/${productId}/reviews`;

    return await productApiAdapter.get(endpoint, null, errorHandler);
  },

  /**
   * Updates a review
   * @param {string} token - Authorization token
   * @param {string} productId - Product identifier
   * @param {string} reviewId - Review identifier
   * @param {Object} reviewData - Updated review data
   * @param {number} reviewData.rating - New rating (optional)
   * @param {string} reviewData.comment - New comment (optional)
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Object|null>} - Updated review or null in case of error
   */
  updateReview: async (token, productId, reviewId, reviewData, errorHandler) => {
    const payload = {};
    
    if (reviewData.rating !== undefined) {
      if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
      payload.rating = reviewData.rating;
    }
    
    if (reviewData.comment !== undefined) {
      if (reviewData.comment.trim().length === 0) {
        throw new Error('Comment cannot be empty');
      }
      payload.comment = reviewData.comment.trim();
    }

    return await productApiAdapter.put(
      `/products/${productId}/reviews/${reviewId}`, 
      payload, 
      token, 
      errorHandler
    );
  },

  /**
   * Deletes a review
   * @param {string} token - Authorization token
   * @param {string} productId - Product identifier
   * @param {string} reviewId - Review identifier
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<boolean>} - Success status
   */
  deleteReview: async (token, productId, reviewId, errorHandler) => {
    const result = await productApiAdapter.delete(
      `/products/${productId}/reviews/${reviewId}`, 
      token, 
      errorHandler
    );
    
    return result !== null;
  },

  /**
   * Gets user's reviews
   * @param {string} token - Authorization token
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (optional)
   * @param {number} params.limit - Number of reviews per page (optional)
   * @param {Object} errorHandler - Error handler instance
   * @returns {Promise<Object|null>} - User reviews or null in case of error
   */
  getUserReviews: async (token, params = {}, errorHandler) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `/user/reviews?${queryString}`
      : `/user/reviews`;

    return await productApiAdapter.get(endpoint, token, errorHandler);
  }
};