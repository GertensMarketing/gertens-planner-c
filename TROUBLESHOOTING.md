# 🔧 Troubleshooting Guide - Gertens Garden Planner

## Common Issues & Solutions

---

## 🚫 Build & Deployment Issues

### ❌ Issue: "npm install fails"

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**
```bash
# Solution 1: Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Solution 2: Use legacy peer deps
npm install --legacy-peer-deps

# Solution 3: Update Node.js
# Download latest LTS from nodejs.org
node --version  # Should be 18+
```

---

### ❌ Issue: "Netlify build fails"

**Symptoms:**
- Build shows errors in Netlify dashboard
- Site doesn't deploy

**Solutions:**

1. **Check build logs:**
   - Go to Netlify dashboard → Deploys → Failed deploy
   - Read the error message carefully

2. **Common fixes:**
   ```bash
   # Make sure netlify.toml is committed
   git add netlify.toml
   git commit -m "Add netlify config"
   git push

   # Verify build command works locally
   npm run build
   ```

3. **Check Node version:**
   - Netlify uses Node 18 by default
   - Verify in netlify.toml: `NODE_VERSION = "18"`

4. **Environment variables:**
   - Ensure `GEMINI_API_KEY` is set in Netlify
   - Site settings → Environment variables

---

### ❌ Issue: "Function deployment fails"

**Symptoms:**
```
Error: Cannot find module '@google/generative-ai'
```

**Solution:**
```bash
# Navigate to functions directory
cd netlify/functions

# Install dependencies
npm install

# Commit the package-lock.json
cd ../..
git add netlify/functions/package-lock.json
git commit -m "Add function dependencies"
git push
```

---

## 🖼️ Image Upload Issues

### ❌ Issue: "Image won't upload"

**Symptoms:**
- Drag and drop doesn't work
- File selector doesn't appear
- Image doesn't preview

**Solutions:**

1. **Check file size:**
   - Max size: 10MB
   - Compress large images before uploading

2. **Check file format:**
   - Supported: JPG, PNG, HEIC, WEBP
   - Not supported: GIF, BMP, TIFF

3. **Browser compatibility:**
   ```javascript
   // Check if FileReader is supported
   if (window.FileReader) {
     console.log('FileReader supported');
   } else {
     console.log('Use a modern browser');
   }
   ```

4. **Mobile camera issues:**
   - Grant camera permissions
   - Try "Choose File" instead of camera
   - Update browser to latest version

---

### ❌ Issue: "Image preview is blurry or distorted"

**Symptoms:**
- Image looks stretched
- Poor quality preview

**Solutions:**
1. Upload higher resolution image
2. Use native camera app, then upload
3. Check original image quality

---

## 🎨 Canvas Drawing Issues

### ❌ Issue: "Can't draw on canvas"

**Symptoms:**
- Clicks don't register
- No points appear
- Crosshair cursor missing

**Solutions:**

1. **Check browser console:**
   ```javascript
   // Open DevTools (F12)
   // Look for JavaScript errors
   ```

2. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete → Clear cache
   - Firefox: Ctrl+Shift+Delete → Clear cache
   - Safari: Cmd+Option+E

3. **Try different browser:**
   - Chrome (recommended)
   - Firefox
   - Edge

4. **Check canvas scaling:**
   - Zoom should be 100%
   - Try Ctrl+0 to reset zoom

---

### ❌ Issue: "Outline is misaligned"

**Symptoms:**
- Points don't appear where clicked
- Outline offset from image

**Solution:**
```javascript
// This is a canvas scaling issue
// Fixed in latest version

// Workaround: Reload the page
// Make sure you're on latest version
```

---

### ❌ Issue: "Can't undo points"

**Symptoms:**
- Undo button grayed out
- Points won't delete

**Solution:**
- This means no points are placed yet
- Place at least one point first
- Try "Clear All" to reset

---

## 🤖 AI Generation Issues

### ❌ Issue: "Failed to generate garden plan"

**Most Common Cause:** Missing or invalid API key

**Solutions:**

1. **Verify API key in Netlify:**
   ```
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Check GEMINI_API_KEY exists and is correct
   - Key should start with "AIza..."
   ```

2. **Check API key is valid:**
   - Visit: https://makersuite.google.com/app/apikey
   - Verify key is active
   - Generate new key if needed

3. **Redeploy site after adding key:**
   - Deploys → Trigger deploy → Deploy site

4. **Check Netlify Function logs:**
   ```
   - Functions tab in Netlify dashboard
   - Click on generate-plan
   - View real-time logs
   - Look for error messages
   ```

---

### ❌ Issue: "Generation takes forever"

**Symptoms:**
- Loading spinner never stops
- Takes more than 30 seconds

**Solutions:**

1. **Check internet connection:**
   - Verify you're online
   - Try refreshing page

2. **Gemini API timeout:**
   - Usually means API is overloaded
   - Wait a few minutes and try again

3. **Image too large:**
   - Compress image to under 5MB
   - Use JPG instead of PNG

4. **Check function timeout:**
   - Netlify functions timeout at 10 seconds (free) or 26 seconds (pro)
   - May need to upgrade plan

---

### ❌ Issue: "Plan shows generic/wrong recommendations"

**Symptoms:**
- Plants don't match conditions
- Non-Minnesota plants suggested
- Irrelevant recommendations

**Solutions:**

1. **Check prompt in function:**
   - Open `netlify/functions/generate-plan.js`
   - Verify prompt mentions Minnesota and zones 3-4

2. **Try different answers:**
   - Change sun exposure
   - Select different theme
   - Redraw outline larger/smaller

3. **Report issue:**
   - Save screenshot
   - Note your selections
   - Contact support

---

## 🌐 Network & API Issues

### ❌ Issue: "CORS errors in console"

**Symptoms:**
```
Access to fetch at '...' has been blocked by CORS policy
```

**Solution:**
- This is handled by Netlify Functions
- Ensure you're calling `/.netlify/functions/generate-plan`
- Not an external URL

---

### ❌ Issue: "Rate limit exceeded"

**Symptoms:**
```
Error: 429 Too Many Requests
```

**Solutions:**

1. **Gemini API limits:**
   - Free tier: 15 requests/minute
   - Wait 1-2 minutes between requests

2. **Upgrade API quota:**
   - Visit Google Cloud Console
   - Enable billing for higher limits
   - Or use caching to reduce calls

3. **Implement client-side throttling:**
   - Add cooldown period
   - Show user how long to wait

---

## 📱 Mobile Issues

### ❌ Issue: "App doesn't work on mobile"

**Symptoms:**
- Layout broken
- Buttons don't work
- Canvas issues

**Solutions:**

1. **Update mobile browser:**
   - iOS: Update Safari
   - Android: Update Chrome

2. **Clear mobile browser cache:**
   - iOS: Settings → Safari → Clear History
   - Android: Chrome → Settings → Privacy → Clear

3. **Try different mobile browser:**
   - iOS: Try Chrome or Firefox
   - Android: Try Samsung Internet

4. **Disable mobile data saver:**
   - May interfere with uploads

---

### ❌ Issue: "Camera won't open on mobile"

**Symptoms:**
- Camera permission denied
- Black screen when capturing

**Solutions:**

1. **Grant camera permissions:**
   - iOS: Settings → Safari → Camera
   - Android: Settings → Chrome → Permissions

2. **Use file upload instead:**
   - Take photo with camera app first
   - Then upload via file selector

---

## 💻 Local Development Issues

### ❌ Issue: "npm run dev doesn't work"

**Symptoms:**
```
Command not found: vite
```

**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Make sure you're in the right directory
cd gertens-garden-planner
npm run dev
```

---

### ❌ Issue: "Port 3000 already in use"

**Symptoms:**
```
Error: Port 3000 is already in use
```

**Solutions:**
```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3001
```

---

### ❌ Issue: "Netlify Functions don't work locally"

**Symptoms:**
- Functions return 404
- API calls fail in development

**Solutions:**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Use Netlify Dev:**
   ```bash
   netlify dev
   ```
   This runs both frontend AND functions locally

3. **Check function path:**
   - Should be `/.netlify/functions/generate-plan`
   - Not `/netlify/functions/generate-plan`

---

## 🎨 Styling Issues

### ❌ Issue: "Styles not loading"

**Symptoms:**
- Page looks unstyled
- Tailwind classes not working

**Solutions:**

1. **Check Tailwind is processing:**
   ```bash
   # Rebuild
   npm run build
   ```

2. **Verify CSS import:**
   - Check `src/main.jsx` imports `./index.css`
   - Check `src/index.css` has `@tailwind` directives

3. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

---

### ❌ Issue: "Logo doesn't appear"

**Symptoms:**
- Broken image icon
- Camera icon missing

**Solutions:**

1. **Check logo file exists:**
   ```bash
   ls public/images/gertens-blueprint-favicon.png
   ```

2. **Add the logo:**
   - Download from existing site
   - Or create your own
   - Place in `public/images/`

3. **Verify path in Header.jsx:**
   ```javascript
   src="/images/gertens-blueprint-favicon.png"
   ```

---

## 🔒 Security Issues

### ❌ Issue: "API key exposed in code"

**Symptoms:**
- Key visible in browser DevTools
- Key committed to GitHub

**CRITICAL FIX:**

1. **Remove from code immediately:**
   ```bash
   # Remove from git history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

2. **Rotate the API key:**
   - Generate new key at https://makersuite.google.com
   - Delete old key
   - Update Netlify environment variable

3. **Never commit .env:**
   - Check `.gitignore` includes `.env`
   - Use `.env.example` for templates

---

## 📊 Performance Issues

### ❌ Issue: "Site is slow"

**Solutions:**

1. **Check image sizes:**
   - Compress images before upload
   - Use modern formats (WebP)

2. **Check Netlify Function performance:**
   - View logs in Netlify dashboard
   - Consider upgrading plan for better performance

3. **Enable caching:**
   - Add caching headers
   - Cache API responses

---

## 🆘 Still Having Issues?

### Debug Checklist:

- [ ] Checked browser console for errors (F12)
- [ ] Cleared browser cache
- [ ] Tried different browser
- [ ] Checked Netlify deploy logs
- [ ] Checked Netlify function logs
- [ ] Verified API key is set and valid
- [ ] Updated all dependencies
- [ ] Tried on different device/network
- [ ] Read relevant documentation

### Getting Help:

1. **Check documentation:**
   - README.md
   - DEPLOYMENT.md
   - ARCHITECTURE.md

2. **Check Netlify status:**
   - https://www.netlifystatus.com/

3. **Check Gemini API status:**
   - https://status.cloud.google.com/

4. **Collect debugging info:**
   - Browser and version
   - Operating system
   - Steps to reproduce
   - Screenshots of errors
   - Console error messages
   - Netlify function logs

---

## 🔍 Useful Debugging Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check Netlify CLI version
netlify --version

# View Netlify logs
netlify logs

# Test function locally
netlify functions:invoke generate-plan --payload '{"test": true}'

# Check build locally
npm run build

# Preview production build
npm run preview

# Check for outdated packages
npm outdated

# Update all packages
npm update

# Clear all caches
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Error Code Reference

| Error Code | Meaning | Solution |
|------------|---------|----------|
| 404 | Function not found | Check function deployed, correct path |
| 429 | Rate limit | Wait and retry, upgrade quota |
| 500 | Server error | Check function logs |
| 503 | Service unavailable | Try again later |
| CORS | Cross-origin error | Check function headers |
| ECONNREFUSED | Connection refused | Check internet, API endpoint |

---

**Last Updated:** February 2024

For additional support, contact the development team or file an issue on GitHub.
