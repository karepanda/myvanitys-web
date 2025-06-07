// hooks/useReviews.js
import { useState, useCallback } from 'react';
import { productFacade } from '../services/product/productFacade';

export const useReviews = (productId) => {
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
      const errorMessage = err.response?.data?.detail || err.message || 'Error al cargar las reseñas';
      setError(errorMessage);
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

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
      const errorMessage = err.response?.data?.detail || err.message || 'Error al agregar la reseña';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [productId, loadReviews]);

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
      const errorMessage = err.response?.data?.detail || err.message || 'Error al actualizar la reseña';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [productId]);

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
      const errorMessage = err.response?.data?.detail || err.message || 'Error al eliminar la reseña';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [productId]);

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