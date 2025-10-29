import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_ID;
  
  if (measurementId && measurementId !== 'undefined') {
    ReactGA.initialize(measurementId, {
      gaOptions: {
        anonymizeIp: true,
      },
    });
    console.log('Google Analytics initialized');
  } else {
    console.warn('Google Analytics ID not found');
  }
};

// Track page views
export const trackPageView = (path, title) => {
  if (import.meta.env.VITE_GA_ID) {
    ReactGA.send({ 
      hitType: 'pageview', 
      page: path,
      title: title || document.title 
    });
  }
};

// Track events
export const trackEvent = (category, action, label = '', value = 0) => {
  if (import.meta.env.VITE_GA_ID) {
    // Ensure value is always a number
    const numericValue = typeof value === 'number' ? value : (Number(value) || 0);
    
    ReactGA.event({
      category,
      action,
      label,
      value: numericValue,
    });
  }
};

// Predefined event tracking functions for common actions
export const analytics = {
  // User Authentication Events
  trackLogin: (method = 'email') => {
    trackEvent('User', 'Login', method);
  },
  
  trackSignup: (method = 'email') => {
    trackEvent('User', 'Signup', method);
  },
  
  trackLogout: () => {
    trackEvent('User', 'Logout');
  },

  // Event Browsing
  trackEventView: (eventId, eventName) => {
    trackEvent('Event', 'View Event Detail', eventName, eventId);
  },

  trackEventListView: () => {
    trackEvent('Event', 'View Event List');
  },

  // Booking & Purchase Events
  trackBookingInitiated: (eventId, eventName, price) => {
    trackEvent('Booking', 'Initiated', eventName, price);
  },

  trackBookingCompleted: (eventId, eventName, price) => {
    trackEvent('Booking', 'Completed', eventName, price);
  },

  trackBookingCancelled: (eventId, eventName) => {
    trackEvent('Booking', 'Cancelled', eventName);
  },

  trackPaymentInitiated: (eventId, eventName, price) => {
    trackEvent('Payment', 'Initiated', eventName, price);
  },

  trackPaymentSuccess: (eventId, eventName, price) => {
    trackEvent('Payment', 'Success', eventName, price);
  },

  trackPaymentFailed: (eventId, eventName, reason = '') => {
    trackEvent('Payment', 'Failed', `${eventName} - ${reason}`);
  },

  // Navigation Events
  trackNavigation: (destination) => {
    trackEvent('Navigation', 'Click', destination);
  },

  trackCTAClick: (ctaName, location) => {
    trackEvent('CTA', 'Click', `${ctaName} - ${location}`);
  },

  // Dashboard Events
  trackDashboardView: (tab = 'bookings') => {
    trackEvent('Dashboard', 'View', tab);
  },

  trackBookingCancelRequest: (bookingId) => {
    trackEvent('Dashboard', 'Cancel Booking Request', bookingId);
  },

  // Admin Events
  trackAdminAccess: () => {
    trackEvent('Admin', 'Access Dashboard');
  },

  trackEventCreated: (eventName) => {
    trackEvent('Admin', 'Create Event', eventName);
  },

  trackEventEdited: (eventName) => {
    trackEvent('Admin', 'Edit Event', eventName);
  },

  trackEventDeleted: (eventName) => {
    trackEvent('Admin', 'Delete Event', eventName);
  },

  // Search & Filter
  trackSearch: (searchTerm) => {
    trackEvent('Search', 'Query', searchTerm);
  },

  trackFilter: (filterType, filterValue) => {
    trackEvent('Filter', filterType, filterValue);
  },

  // Social & Sharing
  trackShare: (eventName, platform = 'generic') => {
    trackEvent('Social', 'Share Event', `${eventName} - ${platform}`);
  },

  // Error Tracking
  trackError: (errorType, errorMessage) => {
    trackEvent('Error', errorType, errorMessage);
  },

  // Engagement
  trackScrollDepth: (percentage) => {
    trackEvent('Engagement', 'Scroll Depth', `${percentage}%`, percentage);
  },

  trackTimeOnPage: (pageName, seconds) => {
    trackEvent('Engagement', 'Time on Page', pageName, seconds);
  },
};
