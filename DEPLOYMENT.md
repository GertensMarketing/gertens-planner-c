# 🚀 Deployment Guide - Gertens Garden Planner

## Step-by-Step Deployment Instructions

### Prerequisites Checklist
- ✅ Node.js 18+ installed
- ✅ GitHub account created
- ✅ Netlify account created (free tier is fine)
- ✅ Google Gemini API key obtained

---

## Part 1: Get Your Google Gemini API Key

1. **Visit Google AI Studio:**
   - Go to: https://makersuite.google.com/app/apikey

2. **Create API Key:**
   - Click "Create API Key"
   - Select or create a Google Cloud project
   - Copy your API key (it looks like: `AIzaSyC...`)
   - **SAVE THIS KEY** - you'll need it later

3. **Keep it Secret:**
   - Never share this key publicly
   - Never commit it to GitHub
   - Only add it to Netlify environment variables

---

## Part 2: Push Code to GitHub

1. **Create a New GitHub Repository:**
   - Go to https://github.com/new
   - Repository name: `gertens-garden-planner`
   - Make it Private (recommended)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Push Your Code:**
   
   Open your terminal in the project folder and run:

   ```bash
   # Initialize git (if not already done)
   git init

   # Add all files
   git add .

   # Create first commit
   git commit -m "Initial commit - Gertens Garden Planner"

   # Add your GitHub repository as remote
   # Replace YOUR_USERNAME with your actual GitHub username
   git remote add origin https://github.com/YOUR_USERNAME/gertens-garden-planner.git

   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

3. **Verify Upload:**
   - Refresh your GitHub repository page
   - You should see all the project files

---

## Part 3: Deploy to Netlify

### Method A: Using Netlify UI (Easiest)

1. **Login to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"

2. **Connect GitHub:**
   - Click "GitHub"
   - Authorize Netlify if prompted
   - Search for `gertens-garden-planner`
   - Click on your repository

3. **Configure Build Settings:**
   - Netlify will auto-detect settings from `netlify.toml`
   - You should see:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Functions directory: `netlify/functions`
   - Click "Deploy site"

4. **Add Environment Variables:**
   - While the site is deploying, go to "Site settings"
   - Click "Environment variables" in the left sidebar
   - Click "Add a variable"
   - Add:
     - Key: `GEMINI_API_KEY`
     - Value: [paste your Google Gemini API key]
   - Click "Create variable"

5. **Trigger Redeploy:**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"
   - Wait for deployment to complete (~2-3 minutes)

6. **Get Your Live URL:**
   - Once deployed, you'll see a URL like: `https://wonderful-plant-123abc.netlify.app`
   - Click it to view your live site!

### Method B: Using Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```
   - This opens your browser to authenticate

3. **Initialize Site:**
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Select your team
   - Choose a site name (or leave blank for auto-generated)
   - Confirm build settings

4. **Add Environment Variable:**
   ```bash
   netlify env:set GEMINI_API_KEY "your_actual_api_key_here"
   ```

5. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

6. **View Your Site:**
   - The CLI will show your live URL
   - Visit it to test!

---

## Part 4: Custom Domain (Optional)

1. **Buy a Domain:**
   - Purchase from Namecheap, Google Domains, etc.
   - Example: `gardenplanner.gertens.com`

2. **Add to Netlify:**
   - In Netlify: "Site settings" → "Domain management"
   - Click "Add custom domain"
   - Enter your domain name
   - Follow DNS configuration instructions

3. **Enable HTTPS:**
   - Netlify automatically provides free SSL
   - Wait ~24 hours for DNS propagation

---

## Part 5: Testing Your Deployment

### Test Checklist:

1. **Homepage Loads:**
   - ✅ Logo displays correctly
   - ✅ Upload interface appears
   - ✅ Styling looks correct

2. **Photo Upload:**
   - ✅ Can select/drag a photo
   - ✅ Preview displays
   - ✅ Can continue to next step

3. **Outline Tool:**
   - ✅ Canvas displays the image
   - ✅ Can click to place points
   - ✅ Outline draws correctly
   - ✅ Undo/Clear buttons work

4. **Questions:**
   - ✅ Can select sun exposure
   - ✅ Can select theme
   - ✅ Continue button activates

5. **AI Generation:**
   - ✅ Loading animation appears
   - ✅ Garden plan generates successfully
   - ✅ Plant recommendations display
   - ✅ Tips and layout show

### If Something Doesn't Work:

**Check Netlify Function Logs:**
1. Go to Netlify dashboard
2. Click "Functions" tab
3. Click on `generate-plan`
4. View real-time logs

**Common Issues:**

- **"Failed to generate plan"**
  - Check that `GEMINI_API_KEY` is set correctly
  - Verify API key is valid at https://makersuite.google.com

- **Site shows 404**
  - Check that build succeeded in "Deploys" tab
  - Verify `netlify.toml` is present

- **Function errors**
  - Check function logs in Netlify dashboard
  - Ensure `netlify/functions/package.json` dependencies installed

---

## Part 6: Continuous Deployment

Once set up, any push to GitHub automatically deploys:

```bash
# Make changes to your code
git add .
git commit -m "Updated garden themes"
git push

# Netlify automatically rebuilds and deploys!
```

**Monitor Deployments:**
- Check status at: https://app.netlify.com/sites/YOUR_SITE_NAME/deploys
- Get email notifications for successful/failed deploys

---

## Part 7: Adding the Logo

1. **Create/Get Your Logo:**
   - Create a PNG file (512x512px recommended)
   - Blueprint/camera style design
   - Transparent background

2. **Add to Project:**
   ```bash
   # Create images directory
   mkdir -p public/images
   
   # Copy your logo file
   cp /path/to/your/logo.png public/images/gertens-blueprint-favicon.png
   ```

3. **Deploy:**
   ```bash
   git add public/images/
   git commit -m "Added Gertens logo"
   git push
   ```

---

## Part 8: Monitoring & Analytics (Optional)

### Add Google Analytics:

1. Get GA4 tracking ID from Google Analytics

2. Add to `index.html` before `</head>`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

3. Deploy changes

### Enable Netlify Analytics:

1. In Netlify dashboard: "Site settings" → "Analytics"
2. Click "Enable Analytics"
3. $9/month for detailed server-side analytics

---

## Quick Reference Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Netlify (if using CLI)
netlify deploy --prod

# View Netlify logs
netlify logs

# Open Netlify dashboard
netlify open
```

---

## Support Contacts

- **Netlify Support:** https://www.netlify.com/support/
- **Google AI Support:** https://ai.google.dev/support
- **GitHub Support:** https://support.github.com/

---

## Success! 🎉

Your Gertens Garden Planner is now live! Share the URL with your team and start planning beautiful gardens!

**Next Steps:**
1. Test thoroughly with different photos
2. Gather user feedback
3. Plan Phase 2 features
4. Consider adding more garden themes
5. Integrate plant inventory from Google Sheets

**Remember to:**
- Keep your API key secret
- Monitor API usage/costs
- Update plant recommendations seasonally
- Collect user feedback for improvements
