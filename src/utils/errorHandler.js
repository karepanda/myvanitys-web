import { getErrorMessage } from './errorMessages';

export class ErrorHandler {
  constructor(setShowPopup, setMessage, setTitle, setType) {
    this.setShowPopup = setShowPopup;
    this.setMessage = setMessage;
    this.setTitle = setTitle;
    this.setType = setType;
  }

  // Main method to display error messages
  showErrorMessage(message, title, type) {
    if (this.setMessage) this.setMessage(message);
    if (this.setTitle) this.setTitle(title);
    if (this.setType) this.setType(type);
    if (this.setShowPopup) this.setShowPopup(true);
  }

  // Method to handle API errors
  handleApiError(category, status, errorText) {
    const errorInfo = getErrorMessage(category, status);
    
    // Try to parse error response for more details if text is provided
    if (errorText) {
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          // Override with server message if available
          errorInfo.message = errorData.message;
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }

    this.showErrorMessage(
      errorInfo.message,
      errorInfo.title,
      errorInfo.type
    );
    
    return errorInfo;
  }
  
  // Convenience methods for common errors
  showValidationError(code = 'requiredFields') {
    const errorInfo = getErrorMessage('validation', code);
    this.showErrorMessage(
      errorInfo.message,
      errorInfo.title,
      errorInfo.type
    );
  }
  
  showNetworkError(code = 'offline') {
    const errorInfo = getErrorMessage('network', code);
    this.showErrorMessage(
      errorInfo.message,
      errorInfo.title,
      errorInfo.type
    );
  }
  
  showGenericError() {
    const errorInfo = getErrorMessage('generic', 'default');
    this.showErrorMessage(
      errorInfo.message,
      errorInfo.title,
      errorInfo.type
    );
  }
}