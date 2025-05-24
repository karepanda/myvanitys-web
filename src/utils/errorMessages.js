export const errorMessages = {
  // Authentication errors
  auth: {
    400: {
      message: 'Invalid authentication request. Please try again.',
      title: 'Bad Request',
      type: 'warning'
    },
    401: {
      message: 'Invalid or expired token. Please log in again.',
      title: 'Authentication Error',
      type: 'warning'
    },
    403: {
      message: 'Access denied. You do not have permission to access this resource.',
      title: 'Forbidden',
      type: 'warning'
    },
    404: {
      message: 'Authentication service not found. Please try again later.',
      title: 'Not Found',
      type: 'warning'
    },
    500: {
      message: 'An error occurred on the server during authentication. Please try again later.',
      title: 'Server Error',
      type: 'error'
    },
    502: {
      message: 'An error occurred on the server during authentication. Please try again later.',
      title: 'Server Error',
      type: 'error'
    },
    503: {
      message: 'An error occurred on the server during authentication. Please try again later.',
      title: 'Server Error',
      type: 'error'
    },
    504: {
      message: 'An error occurred on the server during authentication. Please try again later.',
      title: 'Server Error',
      type: 'error'
    },
    default: {
      message: 'An unexpected error occurred during authentication. Please try again.',
      title: 'Authentication Error',
      type: 'error'
    },
    withoutToken: {
      message: 'Access token not found. Please try logging in again.',
      title: 'Authentication Error',
      type: 'warning'
    },
    withoutUserData: {
      message: 'No user data received from the authentication service.',
      title: 'Authentication Error',
      type: 'error'
    },
    registrationFailed: {
      message: 'Account creation failed. Please try registering again.',
      title: 'Registration Error',
      type: 'error'
    },
    noUserId: {
      message: 'Account was not created successfully. Please try again.',
      title: 'Registration Error',
      type: 'error'
    },
    noToken: {
      message: 'An unexpected error occurred during authentication. Please try again.',
      title: 'Authentication Error',
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

  return errorMessages[category][code] || errorMessages[category].default || errorMessages.generic.default;
};