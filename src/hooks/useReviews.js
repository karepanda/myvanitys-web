// hooks/useReviews.js
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { productFacade } from '../services/product/productFacade';

export const useReviews = (productId) => {
  const { t } = useTranslation('reviews');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Loads reviews for the product
   */
  const loadReviews = useCallback(async (params = {}) => {
    if (!productId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await productFacade.getProductReviews(
        productId, 
        params, 
        null // errorHandler placeholder
      );
      
      if (result) {
        setReviews(result.reviews || result);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || t('errors.loading');
      setError(errorMessage);
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productId, t]);

  /**
   * Adds a new review to the product
   */
  const addReview = useCallback(async (reviewData, token) => {
    if (!productId || !token) {
      throw new Error('Product ID and authentication token are required');
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await productFacade.addReviewToProduct(
        token,
        productId,
        reviewData,
        null // errorHandler placeholder
      );

      if (result) {
        // Reload reviews to get the updated list
        await loadReviews();
        return result;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || t('errors.creating');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [productId, loadReviews, t]);

  /**
   * Updates an existing review
   */
  const updateReview = useCallback(async (reviewId, reviewData, token) => {
    if (!productId || !token || !reviewId) {
      throw new Error('Product ID, review ID, and authentication token are required');
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await productFacade.updateReview(
        token,
        productId,
        reviewId,
        reviewData,
        null // errorHandler placeholder
      );

      if (result) {
        // Update the local state
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId ? { ...review, ...result } : review
          )
        );
        return result;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || t('errors.updating');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [productId, t]);

  /**
   * Deletes a review
   */
  const deleteReview = useCallback(async (reviewId, token) => {
    if (!productId || !token || !reviewId) {
      throw new Error('Product ID, review ID, and authentication token are required');
    }

    setSubmitting(true);
    setError(null);

    try {
      const success = await productFacade.deleteReview(
        token,
        productId,
        reviewId,
        null // errorHandler placeholder
      );

      if (success) {
        // Remove the review from local state
        setReviews(prevReviews =>
          prevReviews.filter(review => review.id !== reviewId)
        );
        return true;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || t('errors.deleting');
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [productId, t]);

  /**
   * Clears any existing error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    reviews,
    loading,
    submitting,
    error,
    loadReviews,
    addReview,
    updateReview,
    deleteReview,
    clearError,
  };
};
