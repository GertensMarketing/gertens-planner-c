# 🌿 Gertens Garden Planner

An AI-powered landscape planning tool that helps customers design their dream gardens with personalized plant recommendations. Built for Gertens Garden Center - North America's largest and best garden center.

![Gertens Garden Planner](https://img.shields.io/badge/Status-Production%20Ready-green) ![Built with React](https://img.shields.io/badge/React-18.2-blue) ![Powered by AI](https://img.shields.io/badge/Powered%20by-Google%20Gemini-orange)

## ✨ Features

- 📸 **Photo Upload/Capture** - Take a photo or upload an existing image of your garden space
- ✏️ **Interactive Outline Tool** - Draw the exact garden bed boundaries with a crosshair cursor
- 🌞 **Sun Exposure Selection** - Specify full sun, partial sun, or mostly shade conditions
- 🎨 **Theme Selection** - Choose from 5 professionally curated garden themes:
  - Shade Loving
  - Fun in the Sun
  - Colors Galore
  - White Moonlight Garden
  - Minnesota Native Garden
- 🤖 **AI-Powered Recommendations** - Google Gemini analyzes your space and provides custom plant selections
- 🌱 **Minnesota-Hardy Plants** - All recommendations guaranteed to thrive in USDA Zones 3-4
- 📐 **Layout Design** - Get specific placement suggestions based on your outlined area
- 💡 **Planting Tips** - Expert advice for successful garden establishment

## 🏗️ Architecture

**Frontend:**
- React 18 with Vite
- Tailwind CSS for Blueprint-style professional design
- HTML5 Canvas for interactive drawing
- Responsive mobile-first design

**Backend:**
- Netlify Functions (serverless)
- Google Gemini 1.5 Flash API for AI analysis
- Secure API key management

**Hosting:**
- Netlify (with automatic deployments from GitHub)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- A Netlify account (free tier works perfectly)
- A GitHub account

### Installation

1. **Clone this repository:**
```bash
git clone <your-repo-url>
cd gertens-garden-planner
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install Netlify Function dependencies:**
```bash
cd netlify/functions
npm install
cd ../..
```

4. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. **Run locally:**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📦 Deployment to Netlify

### Option 1: Deploy via Netlify UI (Recommended)

1. **Push your code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Connect to Netlify:**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings are automatically detected from `netlify.toml`
   - Click "Deploy site"

3. **Add Environment Variables:**
   - In your Netlify site dashboard, go to "Site settings" → "Environment variables"
   - Add `GEMINI_API_KEY` with your API key value
   - Redeploy the site

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify:**
```bash
netlify login
```

3. **Initialize Netlify site:**
```bash
netlify init
```

4. **Set environment variables:**
```bash
netlify env:set GEMINI_API_KEY "your_api_key_here"
```

5. **Deploy:**
```bash
netlify deploy --prod
```

## 🎨 Customization

### Adding the Gertens Logo

Place your logo file at:
```
public/images/gertens-blueprint-favicon.png
```

The logo should be:
- PNG format
- Square dimensions (recommended: 512x512px)
- Transparent background
- Blueprint/camera style icon

### Modifying Themes

Edit `src/components/QuestionFlow.jsx` to add or modify garden themes:

```javascript
const themeOptions = [
  {
    value: 'your-new-theme',
    label: 'Your Theme Name',
    description: 'Theme description',
    icon: '🌺'
  },
  // ... existing themes
];
```

### Adjusting Colors

Modify `tailwind.config.js` to change the color scheme:

```javascript
colors: {
  'gertens-blue': '#1e40af',        // Primary blue
  'gertens-light-blue': '#3b82f6',  // Accent blue
  'blueprint-bg': '#f0f4f8',        // Background
}
```

## 🔧 Configuration Files

### `netlify.toml`
Configures build settings and serverless functions.

### `vite.config.js`
Vite bundler configuration for React.

### `tailwind.config.js`
Tailwind CSS customization with Gertens branding.

## 📱 Mobile Optimization

The app is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Camera capture support
- Responsive canvas drawing
- Mobile-first design

## 🔐 Security

- API keys are stored securely in Netlify environment variables
- Never committed to Git
- Serverless functions prevent client-side exposure
- CORS properly configured

## 🌟 Future Enhancements

### Phase 2 Features (Planned)

- [ ] **Google Sheets Integration** - Connect plant inventory via CSV
- [ ] **More Garden Themes** - Expand theme options
- [ ] **Save/Share Plans** - User accounts and plan storage
- [ ] **Print Optimization** - Professional PDF export
- [ ] **Advanced Filters** - Budget, maintenance level, wildlife-friendly
- [ ] **3D Visualization** - Interactive 3D garden preview
- [ ] **Shopping List** - Direct plant purchase integration
- [ ] **Seasonal Views** - See your garden across seasons

### Connecting Google Sheets Plant Inventory

1. Publish your Google Sheet as CSV
2. Add the published URL to your environment variables
3. Modify the Gemini prompt in `netlify/functions/generate-plan.js` to include:
   ```javascript
   // Fetch plant inventory
   const response = await fetch(process.env.PLANT_INVENTORY_CSV_URL);
   const csvData = await response.text();
   ```
4. Include the inventory in the AI prompt

## 🐛 Troubleshooting

### "Failed to generate garden plan"
- Check that your Gemini API key is correctly set in Netlify
- Verify the API key has not exceeded rate limits
- Check Netlify Function logs for detailed errors

### Canvas not drawing
- Ensure browser supports HTML5 Canvas
- Check console for JavaScript errors
- Try clearing browser cache

### Image not uploading
- Verify image is under 10MB
- Check file format (JPG, PNG, HEIC supported)
- Ensure camera permissions are granted (mobile)

## 📊 Analytics

Consider adding:
- Google Analytics for user tracking
- Netlify Analytics for deployment metrics
- Custom event tracking for feature usage

## 🤝 Contributing

This is a proprietary application for Gertens Garden Center. For suggestions or issues, please contact the development team.

## 📄 License

Proprietary - © Gertens Garden Center

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Hosted on [Netlify](https://www.netlify.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Built with 💚 for Gertens Garden Center**

For support, visit [Gertens.com](https://www.gertens.com) or contact our development team.
