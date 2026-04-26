# Quick Deployment Checklist - Render.com

Complete this checklist to deploy and test your site.

## Pre-Deployment (5 minutes)

- [ ] Verify package.json has all dependencies
- [ ] Test locally: `npm install && npm start`
- [ ] Test locally: Visit http://localhost:3000
- [ ] Push code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Deployment Steps (10 minutes)

### Step 1: Create Render Service
1. Go to https://render.com
2. Sign up with GitHub (if not already done)
3. Dashboard → "New +" → "Web Service"
4. Select your `spa-website` repository
5. Configure:
   - Name: `spa-website`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Plan: `Free`
7. Click "Create Web Service"

**⏳ Wait 2-3 minutes for build & deployment**

### Step 2: Set Environment Variables
1. Dashboard → Your service
2. Click "Environment" tab
3. Add variables:

```
GMAIL_USER=relaxologyhome@gmail.com
GMAIL_PASSWORD=[Your 16-char Gmail App Password]
NODE_ENV=production
```

4. Click "Save"

**⏳ Wait 1 minute for restart**

### Step 3: Get Your Live URL

Your site will be live at:
```
https://spa-website.onrender.com
```

(Render will show this in the dashboard)

## Testing Steps (10 minutes)

### Test 1: Website Loads
```bash
# In browser
https://spa-website.onrender.com

# Or in terminal
curl https://spa-website.onrender.com
```

✅ Should see spa website homepage

### Test 2: Health Check
```bash
curl https://spa-website.onrender.com/api/health
```

✅ Response:
```json
{"status": "healthy", "uptime": ...}
```

### Test 3: Get Reviews
```bash
curl https://spa-website.onrender.com/api/reviews
```

✅ Should see array of 10 reviews

### Test 4: Book Appointment (Test Email)

**PowerShell:**
```powershell
$url = "https://spa-website.onrender.com/api/book-appointment"
$body = @{
    clientName = "Test User"
    gender = "Female"
    contactNumber = "9876543210"
    addressArea = "Test Area"
    serviceType = "60-Minute Signature Deep Tissue & Oil Therapy"
    preferredDate = "2026-05-05"
    preferredTime = "10:00 AM"
} | ConvertTo-Json

Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json" | ConvertFrom-Json | ConvertTo-Json
```

✅ Response: `"success": true`
✅ Check email: Should receive booking email at relaxologyhome@gmail.com

### Test 5: Submit Feedback (Test Email)

**PowerShell:**
```powershell
$url = "https://spa-website.onrender.com/api/submit-feedback"
$body = @{
    clientName = "Test Reviewer"
    location = "Test City"
    rating = 5
    comment = "Testing the deployed feedback system successfully"
} | ConvertTo-Json

Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json" | ConvertFrom-Json | ConvertTo-Json
```

✅ Response: `"success": true`
✅ Check email: Should receive feedback email at relaxologyhome@gmail.com

### Test 6: Browser Testing

Visit: `https://spa-website.onrender.com`

Test these features:
- [ ] Navigation menu works
- [ ] Hero section displays
- [ ] Services section loads
- [ ] Carousel testimonials display
- [ ] Carousel buttons work (next/prev)
- [ ] Carousel dots work
- [ ] Booking form validates
- [ ] Mobile responsive (test on phone)

### Test 7: Error Testing

Test validation errors:

**Invalid Phone Number:**
```powershell
$body = @{
    clientName = "Test"
    gender = "Female"
    contactNumber = "123"  # Invalid
    addressArea = "Area"
    serviceType = "Service"
    preferredDate = "2026-05-05"
    preferredTime = "10:00 AM"
} | ConvertTo-Json

Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json"
```

✅ Should get error: "Valid 10-digit WhatsApp contact number is required"

**Invalid Rating:**
```powershell
$body = @{
    clientName = "Test"
    location = "City"
    rating = 10  # Invalid (must be 1-5)
    comment = "Test comment with enough characters"
} | ConvertTo-Json

Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json"
```

✅ Should get error: "Star Rating must be between 1 and 5"

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| **Site won't load** | Wait 30 sec (free tier wakes up), check Logs tab |
| **502 Error** | Server crashed, check Logs, Render auto-restarts |
| **Emails not sending** | Verify GMAIL_PASSWORD in Environment vars |
| **Build failed** | Check Logs, fix errors, push new commit |
| **Uptime slow** | Normal for free tier, wakes up on first request |

## Share Your Live Site

Your deployed site URL:
```
https://spa-website.onrender.com
```

Share with:
- Team members
- Clients
- For feedback/testing

## Make Changes & Redeploy

```bash
# 1. Make changes locally
# 2. Test: npm start
# 3. Commit & push
git add .
git commit -m "Add new feature"
git push origin main

# Render auto-redeploys in 1-2 minutes
# Check Dashboard → Deployments tab
```

## Success Criteria ✅

- [ ] Website loads at https://spa-website.onrender.com
- [ ] All pages display correctly
- [ ] API endpoints respond
- [ ] Booking form works & sends email
- [ ] Feedback form works & sends email
- [ ] Testimonial carousel works
- [ ] Mobile responsive
- [ ] No 502/504 errors in logs

---

**When ALL above are ✅ = DEPLOYMENT SUCCESSFUL!**

Need detailed guide? See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
