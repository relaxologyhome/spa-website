# STEP-BY-STEP RENDER DEPLOYMENT

Visual guide with all commands to copy-paste.

---

## STEP 1: Prepare Code for GitHub
**Time: 5 minutes**

### 1.1 Navigate to project
```powershell
cd d:\Learning\Spa_website
```

### 1.2 Initialize Git (skip if already done)
```powershell
git init
```

### 1.3 Create .gitignore
```powershell
echo "node_modules" > .gitignore
echo ".env" >> .gitignore
echo ".DS_Store" >> .gitignore
```

### 1.4 Add all files
```powershell
git add .
```

### 1.5 Commit
```powershell
git commit -m "Deploy to Render - Spa website with email notifications"
```

### 1.6 Create GitHub Repository
1. Go to https://github.com/new
2. Name: `spa-website`
3. Description: `Premium spa booking website with email notifications`
4. Public
5. Click "Create repository"
6. Copy the repository URL (looks like: https://github.com/YOUR_USERNAME/spa-website.git)

### 1.7 Push to GitHub
Replace `YOUR_USERNAME` with your GitHub username:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/spa-website.git
git branch -M main
git push -u origin main
```

✅ **Your code is now on GitHub**

---

## STEP 2: Create Render Account & Service
**Time: 5 minutes**

### 2.1 Go to Render.com
1. Open https://render.com
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Render

### 2.2 Create Web Service
1. Dashboard → "New +" button
2. Click "Web Service"
3. Select `spa-website` repository
4. Click "Connect"

### 2.3 Configure Service

Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | `spa-website` |
| **Environment** | `Node` |
| **Region** | (closest to you) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | `Free` |

### 2.4 Click "Create Web Service"

⏳ **Wait 2-3 minutes** while Render builds and deploys

You should see in logs:
```
Building...
Running build command...
Installed dependencies successfully
Starting service...
✓ Email service configured and ready
```

✅ **Your site is now deployed!**

---

## STEP 3: Get Your Live URL
**Time: 1 minute**

After deployment completes:

1. Look at top of Render dashboard
2. You'll see a URL like: `https://spa-website.onrender.com`
3. **Copy this URL** - this is your live site!

✅ **Your site is LIVE!**

---

## STEP 4: Set Environment Variables
**Time: 3 minutes**

### 4.1 Go to Environment Variables

In Render dashboard:
1. Your service page
2. Click "Environment" tab
3. Click "Add Environment Variable"

### 4.2 Add GMAIL_USER

| Key | Value |
|-----|-------|
| `GMAIL_USER` | `relaxologyhome@gmail.com` |

Click "Add"

### 4.3 Add GMAIL_PASSWORD

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Google gives you 16-character password
4. Copy it (remove spaces)
5. In Render:

| Key | Value |
|-----|-------|
| `GMAIL_PASSWORD` | `xxxx_xxxx_xxxx_xxxx` (your 16-char password) |

Click "Add"

### 4.4 Add NODE_ENV

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |

Click "Add"

### 4.5 Save & Wait

Click "Save" button

⏳ **Wait 1-2 minutes** for restart

You should see service restart:
```
Service restarting...
Starting service...
✓ Email service configured and ready
```

✅ **Environment variables set!**

---

## STEP 5: Test Your Deployed Site
**Time: 10 minutes**

### 5.1 Test Homepage

Open in browser:
```
https://spa-website.onrender.com
```

You should see:
- Spa website homepage
- Navigation menu
- Hero section
- Services
- Testimonials carousel
- Booking form
- Feedback form

✅ **Homepage works!**

### 5.2 Test Health Check API

Open in browser:
```
https://spa-website.onrender.com/api/health
```

You should see JSON:
```json
{
  "status": "healthy",
  "uptime": 123,
  "uptimeFormatted": "0h 2m 3s",
  "memory": {
    "heapUsed": "25MB",
    "heapTotal": "256MB"
  }
}
```

✅ **API works!**

### 5.3 Test Reviews API

Open in browser:
```
https://spa-website.onrender.com/api/reviews
```

You should see array of 10 reviews

✅ **Reviews API works!**

### 5.4 Test Booking Email

Open PowerShell and run:

```powershell
$url = "https://spa-website.onrender.com/api/book-appointment"
$body = @{
    clientName = "John Doe"
    gender = "Female"
    contactNumber = "9876543210"
    addressArea = "Downtown"
    serviceType = "60-Minute Signature Deep Tissue & Oil Therapy"
    preferredDate = "2026-05-10"
    preferredTime = "10:00 AM"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

You should see:
```json
{
  "success": true,
  "message": "Appointment booking received successfully!",
  "confirmationCode": "RHS-1704067200000"
}
```

✅ **Booking API works!**

### 5.5 Check Email

Open https://gmail.com and login with `relaxologyhome@gmail.com`

Check inbox for:
- **Subject**: "📅 New Appointment Booking - RHS-..."
- **Contains**: Client name, date, time, service type, confirmation code

✅ **Booking email received!**

### 5.6 Test Feedback Email

Open PowerShell and run:

```powershell
$url = "https://spa-website.onrender.com/api/submit-feedback"
$body = @{
    clientName = "Jane Smith"
    location = "Uptown"
    rating = 5
    comment = "Testing deployment on Render platform successfully"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json"
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

You should see:
```json
{
  "success": true,
  "message": "Thank you for your feedback!",
  "feedbackId": 1
}
```

✅ **Feedback API works!**

### 5.7 Check Email Again

Check https://gmail.com inbox for:
- **Subject**: "💬 New Feedback/Testimonial - 5⭐ from Jane Smith"
- **Contains**: Rating, comment, location

✅ **Feedback email received!**

### 5.8 Test Carousel (Browser)

1. Open https://spa-website.onrender.com
2. Scroll to "Client Testimonials" section
3. Click next/prev arrows
4. Click carousel dots

All testimonials should display with smooth transitions

✅ **Carousel works!**

### 5.9 Test Mobile Responsive

1. Open https://spa-website.onrender.com
2. Press F12 (DevTools)
3. Click device icons (mobile mode)
4. Test on iPhone, iPad, Android sizes

Should be responsive and readable

✅ **Mobile responsive works!**

---

## STEP 6: Verify Everything
**Time: 5 minutes**

### Checklist

- [ ] Website loads at https://spa-website.onrender.com
- [ ] Homepage displays correctly
- [ ] Navigation works
- [ ] Services display
- [ ] Testimonials carousel works with arrows & dots
- [ ] `/api/health` returns healthy status
- [ ] `/api/reviews` returns reviews array
- [ ] Booking form submission works
- [ ] Booking email received at relaxologyhome@gmail.com
- [ ] Feedback form submission works
- [ ] Feedback email received at relaxologyhome@gmail.com
- [ ] Mobile responsive on phone
- [ ] No error messages in browser console
- [ ] Check Render logs - no errors

### Check Render Logs

1. Render dashboard
2. Click your service
3. Click "Logs" tab
4. Should show:
```
✓ Email service configured and ready
✓ Server health check passed
```

No `error` or `❌` messages

✅ **DEPLOYMENT SUCCESSFUL!**

---

## STEP 7: Share & Use

Your live website is ready!

**Share this URL:**
```
https://spa-website.onrender.com
```

**Share with:**
- Team members
- Clients for feedback
- Social media
- Email to stakeholders

---

## STEP 8: Make Updates (Optional)

To make changes and redeploy:

```powershell
# 1. Make changes locally
# 2. Test with: npm start

# 3. Commit changes
git add .
git commit -m "Update feature or fix"

# 4. Push to GitHub
git push origin main

# 5. Render auto-redeploys (1-2 minutes)
# 6. Check Dashboard → Deployments
```

---

## Troubleshooting

### Site shows "Cannot GET /"
- Wait 30 seconds (free tier wakes up)
- Refresh page
- Check logs for errors

### 502 Bad Gateway
- Server crashed
- Check Render logs
- Auto-restarts in 1-2 minutes

### Emails not sending
- Verify GMAIL_PASSWORD in Environment vars
- Check Render logs for "Email configuration issue"
- Verify Gmail App Password is 16 characters

### Build fails
- Check Render Logs
- Look for `npm install` errors
- Fix code locally, commit, push

---

## Success Indicators ✅

When you see ALL of these:
- ✅ Site loads at live URL
- ✅ APIs respond
- ✅ Emails send
- ✅ Carousel works
- ✅ No errors in logs
- ✅ Mobile responsive

**= DEPLOYMENT SUCCESSFUL!**

---

## Your Live Site

**Visit**: https://spa-website.onrender.com

**Share**: https://spa-website.onrender.com

**Admin Email**: relaxologyhome@gmail.com

---

**Deployment Complete!** 🎉
