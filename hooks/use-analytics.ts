import { track } from '@vercel/analytics';

export const useAnalytics = () => {
  const trackProjectCreated = (model: string, quality: string) => {
    try {
      track('project_created', {
        model,
        quality,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  const trackProjectForked = (projectId: string) => {
    try {
      track('project_forked', {
        project_id: projectId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  const trackGalleryViewed = () => {
    try {
      track('gallery_viewed', {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  const trackCodeGenerated = (model: string, promptLength: number) => {
    try {
      track('code_generated', {
        model,
        prompt_length: promptLength,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  const trackScreenshotUploaded = () => {
    try {
      track('screenshot_uploaded', {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  const trackError = (errorType: string, errorMessage: string) => {
    try {
      track('error_occurred', {
        error_type: errorType,
        error_message: errorMessage,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  const trackPageView = (page: string) => {
    try {
      track('page_viewed', {
        page,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  return {
    trackProjectCreated,
    trackProjectForked,
    trackGalleryViewed,
    trackCodeGenerated,
    trackScreenshotUploaded,
    trackError,
    trackPageView
  };
}; 