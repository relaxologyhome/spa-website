# Deployment Guide - Render.com

Complete step-by-step guide to deploy your Spa website to Render.com

## Prerequisites

✅ GitHub account (required for Render deployment)
✅ Render account (free tier available)
✅ Gmail account for email notifications
✅ Code pushed to GitHub repository

## Step 1: Prepare Your Code for Deployment

### 1.1 Create GitHub Repository

```bash
# Initialize git in your project (if not already done)
cd d:\Learning\Spa_website
git init

# Create .gitignore file
echo node_modules > .gitignore
echo .env >> .gitignore
echo .DS_Store >> .gitignore

# Stage all files
git add .

# Commit
git commit -m "Initial commit - Spa website with email notifications"

# Create repository on GitHub
# Go to https://github.com/new
# Name it: spa-website (or your preferred name)
# Copy the repository URL

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/spa-website.git
git branch -M main
git push -u origin main
```

### 1.2 Verify package.json

Make sure your [package.json](package.json) has:
```json
{
  "name": "relaxology-home-support",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "body-parser": "^1.20.2",
    "nodemailer": "^6.9.7"
  }
}
```

### 1.3 Create .env.example (for reference, don't commit real credentials)

```bash
# Create .env.example
echo GMAIL_USER=relaxologyhome@gmail.com > .env.example
echo GMAIL_PASSWORD=your_app_password >> .env.example
echo PORT=3000 >> .env.example

# Commit it
git add .env.example
git commit -m "Add environment variables example"
git push
```

## Step 2: Create Render Account & Service

### 2.1 Sign Up on Render

1. Go to https://render.com
2. Click "Sign up"
3. Choose "Sign up with GitHub" (easiest option)
4. Authorize Render to access your GitHub account
5. Complete signup

### 2.2 Create New Web Service

1. Dashboard → "New +" → "Web Service"
2. **Connect Repository**:
   - Select "spa-website" (or your repo name)
   - Click "Connect"

3. **Configure Service**:
   - **Name**: `spa-website` (or preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

4. **Plan**: Select "Free" tier (for testing)

5. Click "Create Web Service"

**Render will now:**
- Build your code
- Install dependencies
- Start the server
- Give you a live URL

## Step 3: Set Environment Variables

### 3.1 Add Environment Variables in Render

1. In Render dashboard → Your service → "Environment"
2. Add these environment variables:

| Key | Value |
|-----|-------|
| `GMAIL_USER` | `relaxologyhome@gmail.com` |
| `GMAIL_PASSWORD` | Your 16-character Gmail App Password |
| `NODE_ENV` | `production` |

**How to get Gmail App Password:**
- Go to https://myaccount.google.com/apppasswords
- Select "Mail" and "Windows Computer"
- Copy the 16-character password
- Paste it as `GMAIL_PASSWORD`

### 3.2 Save Variables

Click "Save" - Render will automatically restart your service

## Step 4: Monitor Deployment

### 4.1 Check Build Logs

1. In your service dashboard
2. Click "Logs" tab
3. You should see:

```
Building...
Running build command 'npm install'...
Installed dependencies successfully
Starting service...
✓ Email service configured and ready
✓ Server running on http://...
```

### 4.2 Your Live URL

Once deployed, you'll see:
```
https://spa-website.onrender.com
```

Copy this URL for testing!

## Step 5: Test Your Deployment

### 5.1 Test Website Loads

```bash
# Test in browser or terminal
curl https://spa-website.onrender.com
```

You should get the HTML homepage.

### 5.2 Test API Endpoints

**Health Check**:
```bash
curl https://spa-website.onrender.com/api/health
```

Response:
```json
{
  "status": "healthy",
  "uptime": 120,
  "uptimeFormatted": "0h 2m 0s",
  "memory": {...}
}
```

**Get Services**:
```bash
curl https://spa-website.onrender.com/api/services
```

**Get Reviews**:
```bash
curl https://spa-website.onrender.com/api/reviews
```

### 5.3 Test Booking (Send Test Booking)

**Using PowerShell:**
```powershell
$url = "https://spa-website.onrender.com/api/book-appointment"
$body = @{
    clientName = "Test Client"
    gender = "Female"
    contactNumber = "9876543210"
    addressArea = "Test Area"
    serviceType = "60-Minute Signature Deep Tissue & Oil Therapy"
    preferredDate = "2026-05-01"
    preferredTime = "10:00 AM"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Appointment booking received successfully!",
  "confirmationCode": "RHS-1704067200000",
  "nextSteps": "Our therapist will contact you via WhatsApp to confirm your appointment.",
  "booking": {
    "name": "Test Client",
    "date": "2026-05-01",
    "time": "10:00 AM",
    "service": "60-Minute Signature Deep Tissue & Oil Therapy"
  }
}
```

**Check Email**: Look in `relaxologyhome@gmail.com` inbox for booking email ✉️

### 5.4 Test Feedback (Send Test Feedback)

**Using PowerShell:**
```powershell
$url = "https://spa-website.onrender.com/api/submit-feedback"
$body = @{
    clientName = "Test Reviewer"
    location = "Test Location"
    rating = 5
    comment = "This is excellent testing feedback for the deployed service"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Thank you for your feedback! Your testimonial has been received and will be reviewed.",
  "feedbackId": 1
}
```

**Check Email**: Look in `relaxologyhome@gmail.com` inbox for feedback email ✉️

## Step 6: Full Testing Checklist

- [ ] Website homepage loads at `https://spa-website.onrender.com`
- [ ] Navigation links work
- [ ] Carousel testimonials display correctly
- [ ] `/api/health` returns healthy status
- [ ] `/api/reviews` returns all reviews
- [ ] `/api/services` returns all services
- [ ] Test booking sends → Email received at relaxologyhome@gmail.com
- [ ] Test feedback sends → Email received at relaxologyhome@gmail.com
- [ ] Form validation works (try invalid data)
- [ ] Error handling works
- [ ] Mobile responsive design works

## Troubleshooting

### Issue: Service Won't Start

**Check Logs:**
1. Dashboard → Logs tab
2. Look for error messages

**Common Causes:**
- Missing dependencies: Run `npm install` locally first
- Port issues: Render assigns PORT automatically
- Syntax errors: Fix and push new commit

### Issue: Emails Not Sending

**Check:**
1. Verify `GMAIL_USER` and `GMAIL_PASSWORD` in Environment Variables
2. Check logs for: "Email configuration issue"
3. Verify Gmail App Password is correct (16 characters)

**Solution:**
```bash
# Update environment variables
# Dashboard → Environment → Update GMAIL_PASSWORD
# Render auto-restarts
```

### Issue: 502 Bad Gateway

**Cause**: Server crashed or not responding
**Solution**:
1. Check logs for errors
2. Render has auto-restart, wait 1-2 minutes
3. If persists, update code and push new commit

### Issue: Build Fails

**Check Logs for:**
- `npm install` errors → Fix package.json
- Syntax errors → Fix code
- Missing files → Commit and push

**Fix:**
```bash
# Fix code locally
# Test locally: npm start
# Commit and push
git add .
git commit -m "Fix deployment issue"
git push
# Render auto-rebuilds
```

## Make Changes & Redeploy

**To update your live site:**

```bash
# Make changes locally
# Test locally: npm start

# Commit changes
git add .
git commit -m "Update feature description"

# Push to GitHub
git push origin main

# Render automatically:
# 1. Detects new commit
# 2. Builds new version
# 3. Deploys automatically
```

**Check deployment progress:**
- Dashboard → "Deployment" tab
- Watch build logs in real-time

## Performance Monitoring

### Check Server Health

```bash
curl https://spa-website.onrender.com/api/health
```

Response shows:
- Uptime
- Memory usage
- Total bookings & feedback

### View Live Logs

Dashboard → Logs → Scroll to see real-time activity

## Important Notes

⚠️ **Free Tier Limitations:**
- Server spins down after 15 min of inactivity
- First request takes 30 seconds to wake up
- 0.5 GB RAM limit
- Sufficient for testing/demo

✅ **For Production:**
- Upgrade to Paid plan
- Always-on server
- Auto-scaling
- Better performance
- SSL certificate included

## Next Steps After Deployment

1. **Share Live URL**: `https://spa-website.onrender.com`
2. **Test All Features**: Use checklist above
3. **Monitor Logs**: Check for errors
4. **Collect Feedback**: Test with real users
5. **Make Improvements**: Update code and redeploy

## Useful Commands for Testing

**Check if site is up:**
```powershell
curl -I https://spa-website.onrender.com
```

**Get all reviews:**
```powershell
curl https://spa-website.onrender.com/api/reviews | ConvertFrom-Json | ConvertTo-Json
```

**Check available slots:**
```powershell
curl https://spa-website.onrender.com/api/available-slots | ConvertFrom-Json | ConvertTo-Json
```

## Support & Documentation

- Render Docs: https://render.com/docs
- Express.js Docs: https://expressjs.com
- Nodemailer Docs: https://nodemailer.com
- GitHub Pages: https://github.com

---

**Deployment Guide Created**: April 26, 2026
**Status**: Ready to Deploy
