import { getErrorMessage } from './errorMessages';

export class ErrorHandler {
	constructor(setShowPopup, setMessage, setTitle, setType) {
		this.setShowPopup = setShowPopup;
		this.setMessage = setMessage;
		this.setTitle = setTitle;
		this.setType = setType;
	}

	
	showErrorMessage(message, title, type) {
		console.error('ERROR HANDLER CALLED:', { message, title, type });
		console.error('STACK TRACE:', new Error().stack);
		if (this.setMessage) this.setMessage(message);
		if (this.setTitle) this.setTitle(title);
		if (this.setType) this.setType(type);
		if (this.setShowPopup) this.setShowPopup(true);
	}

	
	handleApiError(category, status, errorText) {
		const errorInfo = getErrorMessage(category, status);

		
		if (errorText) {
			try {
				const errorData = JSON.parse(errorText);
				if (errorData.message) {
					
					errorInfo.message = errorData.message;
				}
			} catch (e) {
				
			}
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
