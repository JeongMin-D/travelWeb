/**
 * Google Analytics 4 (GA4) Tracking Service
 * 
 * Measurement ID: G-559P8TCQXX
 */

export const GA_MEASUREMENT_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-559P8TCQXX';

/**
 * Log custom analytics event to Google Analytics (gtag)
 */
export const logAnalyticsEvent = (eventName, params = {}) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        ...params,
        send_to: GA_MEASUREMENT_ID
      });
    }
  } catch (err) {
    console.debug('[Analytics] Event tracking note:', err);
  }
};

/**
 * Track virtual page or tab views in SPA
 */
export const trackPageView = (pageName, pageTitle = '') => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: pageTitle || pageName,
        page_path: `/${pageName}`
      });
      window.gtag('event', 'page_view', {
        page_title: pageTitle || pageName,
        page_location: window.location.href,
        page_path: `/${pageName}`
      });
    }
  } catch (err) {
    console.debug('[Analytics] PageView tracking note:', err);
  }
};

/**
 * Common Event Helpers
 */
export const trackDestinationSelect = (destName, country, continent) => {
  logAnalyticsEvent('select_destination', {
    destination_name: destName,
    country,
    continent
  });
};

export const trackItineraryGenerate = (destName, days, style) => {
  logAnalyticsEvent('generate_itinerary', {
    destination_name: destName,
    duration_days: days,
    travel_style: style
  });
};

export const trackFeedbackSubmit = (category, title) => {
  logAnalyticsEvent('submit_feedback', {
    feedback_category: category,
    feedback_title: title
  });
};

export const trackAuthAction = (actionType) => {
  logAnalyticsEvent(actionType === 'login' ? 'login' : 'sign_up', {
    method: 'voyage_appdb'
  });
};
