# 🚀 QUICK START - Get Running in 5 Minutes!

## What You Need
1. Google Gemini API Key (free) - Get it here: https://makersuite.google.com/app/apikey
2. Node.js installed (v18+) - Download: https://nodejs.org/

## Steps

### 1️⃣ Get the API Key (2 minutes)
```
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (looks like: AIzaSyC...)
4. Save it somewhere safe!
```

### 2️⃣ Install & Run Locally (3 minutes)
```bash
# Install dependencies
npm install

# Install function dependencies
cd netlify/functions
npm install
cd ../..

# Create environment file
cp .env.example .env

# Edit .env and paste your API key:
# GEMINI_API_KEY=your_key_here

# Run the app!
npm run dev
```

Open http://localhost:3000 and test it out! 🎉

### 3️⃣ Deploy to Netlify (Optional - 5 minutes)

**Option A: Via UI (Easiest)**
1. Push code to GitHub
2. Go to netlify.com → "Add new site"
3. Connect GitHub repo
4. Add environment variable: `GEMINI_API_KEY`
5. Deploy!

**Option B: Via CLI**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set GEMINI_API_KEY "your_key"
netlify deploy --prod
```

## That's It!

Your garden planner is now live! 

**Next Steps:**
- Read DEPLOYMENT.md for detailed instructions
- Check ARCHITECTURE.md to understand how it works
- Customize colors in tailwind.config.js
- Add your logo to public/images/

## Need Help?

Common issues:
- **Can't find API key?** Check https://makersuite.google.com/app/apikey
- **Function errors?** Make sure you installed dependencies in netlify/functions/
- **Build fails?** Ensure Node.js 18+ is installed

For more help, see README.md or DEPLOYMENT.md
