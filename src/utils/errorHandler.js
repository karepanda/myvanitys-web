import { getErrorMessage } from './errorMessages';

export class ErrorHandler {
	constructor(setShowPopup, setMessage, setTitle, setType) {
		this.setShowPopup = setShowPopup;
		this.setMessage = setMessage;
		this.setTitle = setTitle;
		this.setType = setType;
		this.onSessionExpired = null;
		this.invalidatedToken = null;
		// Lets callers avoid replacing an error already shown during an operation.
		this.messageCount = 0;
	}

	setSessionExpiredHandler(handler) {
		this.onSessionExpired = handler;
	}

	resetSessionInvalidation() {
		this.invalidatedToken = null;
	}

	
	showErrorMessage(message, title, type) {
		this.messageCount += 1;
		console.error('ERROR HANDLER CALLED:', { message, title, type });
		console.error('STACK TRACE:', new Error().stack);
		if (this.setMessage) this.setMessage(message);
		if (this.setTitle) this.setTitle(title);
		if (this.setType) this.setType(type);
		if (this.setShowPopup) this.setShowPopup(true);
	}

	
	handleApiError(category, status, errorText, token = null) {
		const errorInfo = getErrorMessage(category, status);

		
		if (errorText) {
			try {
				const errorData = JSON.parse(errorText);
				if (errorData.message) {
					
					errorInfo.message = errorData.message;
				}
			} catch {
				// Keep the default message when the response body is not JSON.
			}
		}

		if (status === 401 && token && this.onSessionExpired && this.invalidatedToken !== token) {
			this.invalidatedToken = token;
			this.onSessionExpired(token);
		}

		this.showErrorMessage(errorInfo.message, errorInfo.title, errorInfo.type);

		return errorInfo;
	}

	
	showValidationError(code = 'requiredFields') {
		const errorInfo = getErrorMessage('validation', code);
		this.showErrorMessage(errorInfo.message, errorInfo.title, errorInfo.type);
	}

	showNetworkError(code = 'offline') {
		const errorInfo = getErrorMessage('network', code);
		this.showErrorMessage(errorInfo.message, errorInfo.title, errorInfo.type);
	}

	showGenericError() {
		const errorInfo = getErrorMessage('generic', 'default');
		this.showErrorMessage(errorInfo.message, errorInfo.title, errorInfo.type);
	}
}
