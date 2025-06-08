import { useState } from 'react';
import { deleteProductService } from '../services/product/operations/deleteProductService';

/**
 * Custom hook for deleting products
 * Handles loading state, success/error states, and provides delete functionality
 *
 * @returns {Object} Hook state and methods
 */
export const useDeleteProduct = () => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState(null);
	const [lastDeletedId, setLastDeletedId] = useState(null);

	/**
	 * Deletes a product and handles state management
	 * @param {string} token - Authorization token
	 * @param {string} productId - Product identifier
	 * @param {Object} errorHandler - Error handler instance
	 * @param {Function} onSuccess - Callback executed on successful deletion
	 * @param {Function} onError - Callback executed on deletion error
	 * @returns {Promise<boolean>} - Success flag
	 */
	const deleteProduct = async (
		token,
		productId,
		errorHandler,
		onSuccess = null,
		onError = null
	) => {
		setIsDeleting(true);
		setDeleteError(null);
		setLastDeletedId(null);

		try {
			const success = await deleteProductService.deleteProduct(
				token,
				productId,
				errorHandler
			);

			if (success) {
				setLastDeletedId(productId);
				onSuccess?.(productId);
				return true;
			} else {
				const error = new Error('Failed to delete product');
				setDeleteError(error);
				onError?.(error, productId);
				return false;
			}
		} catch (error) {
			setDeleteError(error);
			onError?.(error, productId);
			return false;
		} finally {
			setIsDeleting(false);
		}
	};

	/**
	 * Resets the hook state
	 */
	const resetState = () => {
		setIsDeleting(false);
		setDeleteError(null);
		setLastDeletedId(null);
	};

	return {
		// State
		isDeleting,
		deleteError,
		lastDeletedId,

		// Methods
		deleteProduct,
		resetState,

		// Computed properties
		hasError: !!deleteError,
		isIdle: !isDeleting && !deleteError,
	};
};
