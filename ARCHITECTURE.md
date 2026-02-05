# 🏗️ Technical Architecture - Gertens Garden Planner

## System Overview

The Gertens Garden Planner is a serverless, AI-powered web application that helps users design custom garden landscapes. It uses computer vision and generative AI to analyze garden spaces and provide personalized plant recommendations.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER DEVICE                          │
│  (Browser: Desktop, Tablet, Mobile)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    NETLIFY CDN                              │
│  • Global edge network                                      │
│  • Static asset delivery                                    │
│  • Automatic HTTPS                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────────┐
│  STATIC ASSETS   │    │ NETLIFY FUNCTIONS    │
│                  │    │  (Serverless)        │
│  • React App     │    │                      │
│  • HTML/CSS/JS   │    │  generate-plan.js    │
│  • Images        │    │                      │
└──────────────────┘    └──────────┬───────────┘
                                   │
                                   │ API Call
                                   ▼
                        ┌──────────────────────┐
                        │  GOOGLE GEMINI API   │
                        │  (1.5 Flash)         │
                        │                      │
                        │  • Vision Analysis   │
                        │  • Text Generation   │
                        └──────────────────────┘
```

---

## Technology Stack

### Frontend

**Core Framework:**
- **React 18.2** - Component-based UI library
- **Vite 5.0** - Fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework

**Key Libraries:**
- HTML5 Canvas API - For interactive drawing
- FileReader API - For image upload/processing
- Fetch API - For backend communication

**Build Pipeline:**
```
Source Code (JSX/CSS)
       ↓
   Vite Bundler
       ↓
  Optimized Bundle
       ↓
   Netlify CDN
```

### Backend

**Serverless Functions:**
- **Netlify Functions** - AWS Lambda under the hood
- **Node.js 18** - Runtime environment
- **esbuild** - Function bundler

**AI Integration:**
- **Google Gemini 1.5 Flash** - Multimodal AI model
- **@google/generative-ai SDK** - Official Node.js client

### Hosting & Infrastructure

- **Netlify** - Jamstack hosting platform
- **GitHub** - Version control and CI/CD trigger
- **Netlify CDN** - Global content delivery

---

## Component Architecture

### React Component Tree

```
App (Main Container)
├── Header
│   └── Logo & Title
│
├── ProgressIndicator
│   └── Step 1-4 visual tracker
│
└── Main Content (Conditional rendering based on step)
    │
    ├── Step 1: ImageUploader
    │   ├── Drag & Drop Zone
    │   ├── File Input
    │   └── Preview
    │
    ├── Step 2: GardenOutlineTool
    │   ├── Canvas Drawing
    │   ├── Point Management
    │   └── Drawing Controls
    │
    ├── Step 3: QuestionFlow
    │   ├── Sun Exposure Options
    │   └── Theme Selection
    │
    └── Step 4: GardenPlanResult
        ├── Loading Animation
        ├── Plan Display
        ├── Plant List
        └── Action Buttons
```

### State Management

**App-level State:**
```javascript
{
  step: 1,                    // Current wizard step (1-4)
  uploadedImage: "data:...",  // Base64 image data
  outlinePoints: [            // Garden bed outline
    {x: 100, y: 150},
    {x: 200, y: 150},
    // ...
  ],
  answers: {
    sunExposure: "full-sun",
    theme: "minnesota-native"
  },
  gardenPlan: {               // AI-generated response
    overview: "...",
    plants: [...],
    layout: "...",
    tips: [...]
  },
  loading: false              // API request state
}
```

---

## Data Flow

### 1. Image Upload Flow

```
User selects/captures image
        ↓
FileReader converts to base64
        ↓
Store in React state
        ↓
Display preview
        ↓
Pass to Canvas component
```

### 2. Outline Drawing Flow

```
User clicks on canvas
        ↓
Calculate coordinates (accounting for scaling)
        ↓
Add point to points array
        ↓
Redraw canvas with all points
        ↓
Connect points with lines/fill
```

### 3. AI Generation Flow

```
User completes questions
        ↓
Collect all data (image, outline, answers)
        ↓
POST to /netlify/functions/generate-plan
        ↓
Netlify Function receives request
        ↓
Initialize Gemini API client
        ↓
Construct detailed prompt
        ↓
Send image + prompt to Gemini
        ↓
Parse JSON response
        ↓
Return structured data
        ↓
Display in UI
```

---

## API Integration

### Gemini API Request Structure

```javascript
{
  model: "gemini-1.5-flash",
  contents: [
    {
      parts: [
        { text: "Detailed prompt..." },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: "base64_image_data"
          }
        }
      ]
    }
  ]
}
```

### Response Parsing

**Expected JSON Structure:**
```javascript
{
  overview: "Garden design concept summary",
  plants: [
    {
      name: "Plant Name (Scientific)",
      type: "perennial/shrub/tree",
      description: "Features, bloom time, height",
      placement: "Location suggestion"
    }
  ],
  layout: "Arrangement guidance",
  tips: ["Tip 1", "Tip 2", "Tip 3"]
}
```

---

## Security Architecture

### API Key Management

```
Developer sets GEMINI_API_KEY
        ↓
Stored in Netlify Environment Variables
        ↓
Injected into Function at runtime
        ↓
Never exposed to client
        ↓
Used server-side only
```

### CORS Configuration

```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
}
```

### Data Privacy

- No user data stored server-side
- Images processed in-memory only
- No persistent database
- Client-side state management only

---

## Performance Optimizations

### Frontend

1. **Code Splitting:**
   - Vite automatically splits code
   - Lazy loading of components (if needed)

2. **Image Optimization:**
   - Client-side resizing before upload (future)
   - Base64 encoding for transmission

3. **Canvas Performance:**
   - Debounced redraw operations
   - Efficient point management
   - Scaled rendering

### Backend

1. **Function Cold Starts:**
   - Lightweight dependencies
   - esbuild for fast bundling
   - Keep functions warm with periodic pings (optional)

2. **API Rate Limiting:**
   - Client-side request throttling
   - Error handling for rate limits

---

## Scalability Considerations

### Current Capacity

- **Netlify Free Tier:**
  - 100GB bandwidth/month
  - 300 build minutes/month
  - 125k function invocations/month

- **Gemini API Free Tier:**
  - 15 requests/minute
  - 1500 requests/day
  - $0 cost up to limit

### Scaling Strategies

**If traffic increases:**

1. **Upgrade Netlify Plan:**
   - Pro: $19/month (unlimited bandwidth)
   - Business: Custom pricing

2. **Implement Caching:**
   - Cache similar garden plans
   - Store common plant combinations

3. **Add Queue System:**
   - Implement request queue for high traffic
   - Background processing for non-urgent requests

4. **Database Integration:**
   - Store user plans
   - Cache AI responses
   - Analytics tracking

---

## Future Architecture Enhancements

### Phase 2 Additions

```
Current Architecture
        +
Google Sheets API
        ↓
Plant Inventory Integration
        +
User Authentication (Optional)
        ↓
Saved Plans Database
        +
Advanced Analytics
```

### Proposed Additions

1. **Database Layer:**
   - Firebase/Supabase for user data
   - Store garden plans
   - User preferences

2. **Advanced AI:**
   - Multi-model approach
   - Image segmentation
   - 3D rendering

3. **E-commerce Integration:**
   - Gertens inventory API
   - Shopping cart
   - Direct purchase

4. **Mobile App:**
   - React Native version
   - Offline support
   - AR preview (future)

---

## Monitoring & Observability

### Recommended Tools

1. **Netlify Analytics:**
   - Request logs
   - Function execution time
   - Error rates

2. **Google Analytics:**
   - User journey tracking
   - Conversion funnel
   - Feature usage

3. **Error Tracking:**
   - Sentry for error monitoring
   - Custom error boundaries
   - Function logging

### Key Metrics to Track

- Image upload success rate
- AI generation completion rate
- Average response time
- User drop-off points
- Most popular themes
- Plant recommendation diversity

---

## Development Workflow

```
Local Development
        ↓
    Git Commit
        ↓
  Push to GitHub
        ↓
Netlify Detects Change
        ↓
  Automated Build
        ↓
   Run Tests (optional)
        ↓
    Deploy to CDN
        ↓
  Live in Production
```

### Environment Management

- **Development:** Local Vite server
- **Preview:** Netlify deploy previews
- **Production:** Main branch auto-deploy

---

## Testing Strategy

### Manual Testing Checklist

- [ ] Image upload (various formats)
- [ ] Canvas drawing (various screen sizes)
- [ ] All sun exposure options
- [ ] All theme selections
- [ ] AI generation success
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Print functionality

### Automated Testing (Future)

- Unit tests for components
- Integration tests for API
- E2E tests for user flows
- Visual regression tests

---

## Troubleshooting Guide

### Common Issues

**Issue:** Function timeout
- **Cause:** Gemini API slow response
- **Solution:** Increase function timeout in netlify.toml

**Issue:** Canvas not scaling
- **Cause:** Browser compatibility
- **Solution:** Add polyfills for older browsers

**Issue:** High API costs
- **Cause:** Excessive requests
- **Solution:** Implement rate limiting/caching

---

## Technical Constraints

### Current Limitations

1. **Image Size:** Max 10MB (browser limitation)
2. **API Rate:** 15 req/min (Gemini free tier)
3. **Function Timeout:** 10 seconds (Netlify)
4. **No Persistence:** Plans not saved
5. **No Auth:** Open to all users

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 14+, Android 10+)

---

## Cost Analysis

### Monthly Costs (Estimated)

**Free Tier:**
- Netlify: $0
- Gemini API: $0
- GitHub: $0
- **Total: $0/month**

**With 1000 users/month:**
- Netlify Pro: $19
- Gemini API: ~$5-10
- **Total: ~$24-29/month**

**With 10000 users/month:**
- Netlify Business: Custom
- Gemini API: ~$50-100
- Database: ~$25
- **Total: ~$200-300/month**

---

This architecture is designed for scalability, maintainability, and cost-effectiveness while delivering an excellent user experience.
