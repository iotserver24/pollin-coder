# Analytics Setup

This app uses **Vercel Analytics** for tracking user interactions and performance monitoring.

## 📊 What's Tracked

### **Page Views**
- Automatic tracking of all page visits
- Gallery page views (`gallery_viewed`)

### **User Actions**
- **Project Creation** (`project_created`)
  - Model used (e.g., "gpt-4", "claude-3")
  - Quality setting (high/low)
  - Timestamp

- **Project Forking** (`project_forked`)
  - Project ID
  - Timestamp

- **Screenshot Uploads** (`screenshot_uploaded`)
  - Timestamp

- **Code Generation** (`code_generated`)
  - Model used
  - Prompt length
  - Timestamp

### **Errors**
- **Error Tracking** (`error_occurred`)
  - Error type
  - Error message
  - Timestamp

## 🚀 Setup

The analytics are automatically configured when deployed to Vercel. No additional setup required!

### **Components Used**
- `@vercel/analytics` - Core analytics
- `@vercel/speed-insights` - Performance monitoring

### **Custom Hook**
- `hooks/use-analytics.ts` - Centralized tracking functions

## 📈 Viewing Data

1. Go to your Vercel dashboard
2. Select your project
3. Navigate to **Analytics** tab
4. View real-time data and insights

## 🔧 Custom Events

To add new tracking events:

```typescript
import { useAnalytics } from '@/hooks/use-analytics';

const analytics = useAnalytics();

// Track custom event
analytics.track('custom_event', {
  property: 'value',
  timestamp: new Date().toISOString()
});
```

## 📱 Privacy

- No personal data is collected
- Only anonymous usage statistics
- Compliant with privacy regulations
- Works alongside existing Plausible analytics 