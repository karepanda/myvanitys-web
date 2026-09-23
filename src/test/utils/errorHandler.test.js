/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorHandler } from '../../utils/errorHandler';

describe('ErrorHandler session invalidation', () => {
	let setShowPopup;
	let setMessage;
	let setTitle;
	let setType;
	let onSessionExpired;
	let handler;

	beforeEach(() => {
		setShowPopup = vi.fn();
		setMessage = vi.fn();
		setTitle = vi.fn();
		setType = vi.fn();
		onSessionExpired = vi.fn();
		handler = new ErrorHandler(setShowPopup, setMessage, setTitle, setType);
		handler.setSessionExpiredHandler(onSessionExpired);
	});

	it('invokes the session-expired callback with the token on an authenticated 401', () => {
		handler.handleApiError('product', 401, '{}', 'token-A');

		expect(onSessionExpired).toHaveBeenCalledTimes(1);
		expect(onSessionExpired).toHaveBeenCalledWith('token-A');
	});

	it('does not invoke the callback for a 401 without a token', () => {
		handler.handleApiError('product', 401, '{}');

		expect(onSessionExpired).not.toHaveBeenCalled();
	});

	it('does not invoke the callback for a 401 without a registered handler', () => {
		const unbound = new ErrorHandler(setShowPopup, setMessage, setTitle, setType);
		unbound.handleApiError('product', 401, '{}', 'token-A');

		expect(onSessionExpired).not.toHaveBeenCalled();
	});

	it('does not invoke the callback for non-401 statuses even with a token', () => {
		handler.handleApiError('product', 500, '{}', 'token-A');

		expect(onSessionExpired).not.toHaveBeenCalled();
	});

	it('deduplicates two concurrent 401s for the same token into one invalidation', () => {
		handler.handleApiError('product', 401, '{}', 'token-A');
		handler.handleApiError('product', 401, '{}', 'token-A');

		expect(onSessionExpired).toHaveBeenCalledTimes(1);
	});

	it('invalidates again when a different token expires', () => {
		handler.handleApiError('product', 401, '{}', 'token-A');
		handler.handleApiError('product', 401, '{}', 'token-B');

		expect(onSessionExpired).toHaveBeenCalledTimes(2);
		expect(onSessionExpired).toHaveBeenNthCalledWith(2, 'token-B');
	});

	it('resets the dedup so a reused token can invalidate a new session', () => {
		handler.handleApiError('product', 401, '{}', 'token-A');
		expect(onSessionExpired).toHaveBeenCalledTimes(1);

		handler.resetSessionInvalidation();
		handler.handleApiError('product', 401, '{}', 'token-A');

		expect(onSessionExpired).toHaveBeenCalledTimes(2);
	});

	it('still shows the session-expired message on an authenticated 401', () => {
		handler.handleApiError('product', 401, '{}', 'token-A');

		expect(setMessage).toHaveBeenCalled();
		expect(setTitle).toHaveBeenCalled();
		expect(setType).toHaveBeenCalled();
		expect(setShowPopup).toHaveBeenCalledWith(true);
	});
});
