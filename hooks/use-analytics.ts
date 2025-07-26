import { track } from '@vercel/analytics';

export const useAnalytics = () => {
  const trackProjectCreated = (model: string, quality: string) => {
    track('project_created', {
      model,
      quality,
      timestamp: new Date().toISOString()
    });
  };

  const trackProjectForked = (projectId: string) => {
    track('project_forked', {
      project_id: projectId,
      timestamp: new Date().toISOString()
    });
  };

  const trackGalleryViewed = () => {
    track('gallery_viewed', {
      timestamp: new Date().toISOString()
    });
  };

  const trackCodeGenerated = (model: string, promptLength: number) => {
    track('code_generated', {
      model,
      prompt_length: promptLength,
      timestamp: new Date().toISOString()
    });
  };

  const trackScreenshotUploaded = () => {
    track('screenshot_uploaded', {
      timestamp: new Date().toISOString()
    });
  };

  const trackError = (errorType: string, errorMessage: string) => {
    track('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      timestamp: new Date().toISOString()
    });
  };

  const trackPageView = (page: string) => {
    track('page_viewed', {
      page,
      timestamp: new Date().toISOString()
    });
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