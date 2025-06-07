// components/ProductReviews.jsx
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useReviews } from '../hooks';
import { UserMessage } from './UserMessage/UserMessage';
import { ConfirmationDialog } from './ConfirmationDialog/ConfirmationDialog';
import { VanitysContext } from '../context/index';
import './ProductReviews.css';

const ProductReviews = ({ productId, token }) => {
  const {
    reviews,
    loading,
    submitting,
    error,
    loadReviews,
    addReview,
    deleteReview,
    clearError,
  } = useReviews(productId);

  const { showMissingFieldsPopup, setShowMissingFieldsPopup } = useContext(VanitysContext);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [messageConfig, setMessageConfig] = useState({
    message: '',
    title: '',
    type: 'warning'
  });

  // Load reviews when component mounts
  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      setMessageConfig({
        message: error,
        title: 'Review Error',
        type: 'error'
      });
      setShowMissingFieldsPopup(true);
    }
  }, [error, setShowMissingFieldsPopup]);

  const showSuccessMessage = (message) => {
    setMessageConfig({
      message,
      title: 'Success',
      type: 'info'
    });
    setShowMissingFieldsPopup(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!newReview.comment.trim()) {
      setMessageConfig({
        message: 'Comment cannot be empty',
        title: 'Required Field',
        type: 'warning'
      });
      setShowMissingFieldsPopup(true);
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      setMessageConfig({
        message: 'Rating must be between 1 and 5 stars',
        title: 'Invalid Rating',
        type: 'warning'
      });
      setShowMissingFieldsPopup(true);
      return;
    }

    try {
      await addReview(newReview, token);
      setNewReview({ rating: 5, comment: '' });
      setShowAddForm(false);
      showSuccessMessage('Review added successfully');
    } catch (err) {
      // Error is handled by the useEffect above
      console.error('Failed to add review:', err);
    }
  };

  const handleDeleteReview = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      await deleteReview(reviewToDelete, token);
      showSuccessMessage('Review deleted successfully');
    } catch (err) {
      console.error('Failed to delete review:', err);
    } finally {
      setShowDeleteConfirmation(false);
      setReviewToDelete(null);
    }
  };

  const cancelDeleteReview = () => {
    setShowDeleteConfirmation(false);
    setReviewToDelete(null);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : 'empty'}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  return (
    <>
      <div className="product-reviews">
        <div className="reviews-header">
          <h3>Product Reviews</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-add-review"
          >
            {showAddForm ? 'Cancel' : 'Add Review'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmitReview} className="add-review-form">
            <div className="form-group">
              <label htmlFor="rating">Rating:</label>
              <select
                id="rating"
                value={newReview.rating}
                onChange={(e) => setNewReview(prev => ({ 
                  ...prev, 
                  rating: parseInt(e.target.value) 
                }))}
                required
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} star{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Comment:</label>
              <textarea
                id="comment"
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ 
                  ...prev, 
                  comment: e.target.value 
                }))}
                placeholder="Write your review here..."
                required
                minLength={1}
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={submitting}
                className="btn-submit"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews for this product yet.</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="review-comment">
                  {review.comment}
                </div>

                <div className="review-actions">
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="btn-delete"
                    disabled={submitting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showMissingFieldsPopup && (
        <UserMessage
          message={messageConfig.message}
          title={messageConfig.title}
          type={messageConfig.type}
        />
      )}

      {showDeleteConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this review? This action cannot be undone."
          title="Confirm Deletion"
          type="error"
          onConfirm={confirmDeleteReview}
          onCancel={cancelDeleteReview}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </>
  );
};

// PropTypes validation
ProductReviews.propTypes = {
  productId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default ProductReviews;