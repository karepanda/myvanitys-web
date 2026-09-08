import i18n from '../i18n/config';

export const errorMessages = {
  // Authentication errors
  // The backend has no stable error codes yet; these AUTH_* keys are selected by the existing heuristic status/detail/message classification.
  auth: {
    400: {
      key: 'AUTH_BAD_REQUEST',
      type: 'warning'
    },
    401: {
      key: 'AUTH_INVALID_TOKEN',
      type: 'warning'
    },
    403: {
      key: 'AUTH_FORBIDDEN',
      type: 'warning'
    },
    404: {
      key: 'AUTH_SERVICE_NOT_FOUND',
      type: 'warning'
    },
    500: {
      key: 'AUTH_SERVER_ERROR',
      type: 'error'
    },
    502: {
      key: 'AUTH_SERVER_ERROR',
      type: 'error'
    },
    503: {
      key: 'AUTH_SERVER_ERROR',
      type: 'error'
    },
    504: {
      key: 'AUTH_SERVER_ERROR',
      type: 'error'
    },
    default: {
      key: 'AUTH_UNKNOWN',
      type: 'error'
    },
    withoutToken: {
      key: 'AUTH_TOKEN_MISSING',
      type: 'warning'
    },
    withoutUserData: {
      key: 'AUTH_USER_DATA_MISSING',
      type: 'error'
    },
    registrationFailed: {
      key: 'AUTH_REGISTRATION_FAILED',
      type: 'error'
    },
    noUserId: {
      key: 'AUTH_USER_ID_MISSING',
      type: 'error'
    },
    noToken: {
      key: 'AUTH_UNKNOWN',
      type: 'error'
    }
  },

  // User profile errors
  profile: {
    400: {
      message: 'Invalid request. Please verify your information and try again.',
      title: 'Bad Request',
      type: 'warning'
    },
    401: {
      message: 'Your session has expired. Please log in again to continue.',
      title: 'Session Expired',
      type: 'warning'
    },
    403: {
      message: 'You do not have permission to access this profile.',
      title: 'Access Denied',
      type: 'warning'
    },
    404: {
      message: 'User profile not found. It may have been deleted or moved.',
      title: 'Not Found',
      type: 'warning'
    },
    500: {
      message: 'An error occurred on the server while retrieving the profile. Please try again later.',
      title: 'Server Error',
      type: 'error'
    },
    default: {
      message: 'An unexpected error occurred while accessing the profile. Please try again.',
      title: 'Profile Error',
      type: 'error'
    }
  },

  // Category for product-related errors
  product: {
    400: {
      message: 'Invalid request. Please verify the information and try again.',
      title: 'Bad Request',
      type: 'warning'
    },
    401: {
      message: 'Your session has expired. Please log in again.',
      title: 'Session Expired',
      type: 'warning'
    },
    403: {
      message: 'You do not have permission to access these products.',
      title: 'Access Denied',
      type: 'warning'
    },
    404: {
      message: 'Products not found. They may have been deleted or moved.',
      title: 'Not Found',
      type: 'warning'
    },
    500: {
      message: 'An error occurred on the server while retrieving the products. Please try again later.',
      title: 'Server Error',
      type: 'error'
    },
    default: {
      message: 'An unexpected error occurred while loading products. Please try again.',
      title: 'Product Error',
      type: 'error'
    },
    fetchFailed: {
      message: 'Products could not be loaded. Please check your connection and try again.',
      title: 'Loading Error',
      type: 'warning'
    },
    emptyResult: {
      message: 'No products found associated with your account.',
      title: 'No Products',
      type: 'info'
    }
  },

  // Form validation errors
  validation: {
    requiredFields: {
      message: 'Please complete all required fields.',
      title: 'Missing Fields',
      type: 'warning'
    },
    invalidEmail: {
      message: 'Please enter a valid email address.',
      title: 'Invalid Email',
      type: 'warning'
    },
    passwordsDoNotMatch: {
      message: 'Passwords do not match. Please try again.',
      title: 'Passwords Do Not Match',
      type: 'warning'
    },
    invalidPassword: {
      message: 'Password must be at least 8 characters long and include a number and a special character.',
      title: 'Invalid Password',
      type: 'warning'
    }
  },

  // Network errors
  network: {
    noConnection: {
      message: 'It seems you are offline. Please check your internet connection and try again.',
      title: 'Network Error',
      type: 'error'
    },
    timeout: {
      message: 'The request has timed out. Please try again later.',
      title: 'Connection Timeout',
      type: 'error'
    }
  },

  // Type for informational messages
  info: {
    default: {
      message: 'Important information.',
      title: 'Information',
      type: 'info'
    },
    sessionActive: {
      message: 'You are logged in.',
      title: 'Active Session',
      type: 'info'
    }
  },

  // Generic errors
  generic: {
    default: {
      message: 'An unexpected error occurred. Please try again.',
      title: 'Error',
      type: 'error'
    },
    serverError: {
      message: 'An error occurred on the server. Our team has been notified. Please try again later.',
      title: 'Server Error',
      type: 'error'
    }
  }
};

// Utility function to get error message by category and code
export const getErrorMessage = (category, code) => {
  if (!errorMessages[category]) {
    return errorMessages.generic.default;
  }

  const errorInfo = errorMessages[category][code] || errorMessages[category].default || errorMessages.generic.default;

  if (category !== 'auth' || !errorInfo.key) {
    return errorInfo;
  }

  const translationKey = errorInfo.key
    .replace(/^AUTH_/, '')
    .toLowerCase()
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

  return {
    message: i18n.t(`errors:auth.${translationKey}.message`),
    title: i18n.t(`errors:auth.${translationKey}.title`),
    type: errorInfo.type
  };
};
