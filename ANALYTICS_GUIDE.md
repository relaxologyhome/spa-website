# 📊 Visitor Analytics Guide

## Overview
The spa website now includes comprehensive visitor analytics that tracks:
- **Total visitor count** and unique IPs
- **Page views** and visits per user
- **Device types** (Mobile, Desktop, Tablet, etc.)
- **Geographic location** (Country, City, Region) via IP geolocation
- **Visitor actions** (bookings, feedback submissions)
- **Real-time analytics dashboard**

---

## 🔑 Access the Analytics Dashboard

### URL
```
https://relaxology-home.onrender.com/analytics?pwd=YOUR_PASSWORD
```

### Default Password
```
spa123
```

### Change the Password
Set the `ADMIN_PASSWORD` environment variable in Render:

1. Go to **Render Dashboard** → Your Spa Service
2. Click **Environment** tab
3. Add new variable:
   - Name: `ADMIN_PASSWORD`
   - Value: `your_secure_password_here`
4. Click **Save Changes** (auto-redeployment)

---

## 📊 Analytics Dashboard Features

### Summary Statistics
- **Total Visitors**: Unique IP addresses that visited
- **Total Page Views**: Sum of all page visits
- **Average Views/Visitor**: Average pages per visitor
- **Unique Countries**: How many different countries visited
- **Device Types**: Breakdown by device category

### Charts
1. **Device Distribution** (Doughnut Chart)
   - Shows visitor count by device type
   - Mobile, Desktop, Tablet, etc.

2. **Top 10 Countries** (Bar Chart)
   - Shows which countries send most visitors
   - Sorted by visitor count

### Recent Visitors Table
- **IP Address**: Visitor's IP (masked for privacy)
- **Location**: City, Country
- **Device**: Type of device used
- **Page Views**: How many times they visited
- **Actions**: Number of interactions (bookings, feedback)
- **Last Visit**: When they last visited

---

## 🔐 Security Features

### Password Protection
- Analytics accessible only with correct password
- Login page shown if wrong password
- Password sent as query parameter (HTTPS only in production)

### Data Privacy
- Visitor data stored in `data/visitors.json` on server
- Not committed to Git (in .gitignore)
- Persists across deployments on same Render instance
- **Note**: Data lost when Render service is recreated

### Recommendations
1. Use a strong admin password
2. Don't share the analytics URL publicly
3. For production, consider adding authentication layer
4. Review IP geolocation API terms (using free tier of ip-api.com)

---

## 📡 API Endpoints

### 1. Track Visitor Action
```bash
POST /api/track-action
```
**Body:**
```json
{
  "action": "booking_submitted",
  "details": {
    "serviceType": "oil_massage",
    "date": "2026-04-27"
  }
}
```

**Response:**
```json
{ "success": true }
```

### 2. Get Analytics Data
```bash
GET /api/analytics?pwd=YOUR_PASSWORD
```

**Response:**
```json
{
  "summary": {
    "totalVisitors": 42,
    "totalPageViews": 127,
    "averagePageViews": "3.02",
    "uniqueCountries": 5,
    "uniqueDevices": 3
  },
  "deviceStats": {
    "Mobile": 28,
    "Desktop": 12,
    "Unknown": 2
  },
  "topCountries": {
    "India": 35,
    "United States": 4,
    "United Kingdom": 2,
    "Australia": 1
  },
  "recentVisitors": [...]
}
```

### 3. Analytics Dashboard
```
GET /analytics?pwd=YOUR_PASSWORD
```
Interactive HTML dashboard with charts and visitor table

---

## 🛠️ What Gets Tracked

### On Page Load
- Visitor IP address
- Device type (Mobile, Desktop, Tablet, etc.)
- User agent (browser, OS)
- Geographic location (country, city, region)
- Page visited

### On Form Submission
- Booking submission with service type and date
- Feedback submission with rating and comment length

### Stored Data Per Visitor
```javascript
{
  "id": "1698765432000",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "firstVisit": "2026-04-27T10:30:00.000Z",
  "lastVisit": "2026-04-27T11:15:00.000Z",
  "pageViews": 3,
  "pages": ["/", "/index.html"],
  "location": {
    "country": "India",
    "city": "Chennai",
    "region": "Tamil Nadu"
  },
  "device": "Mobile",
  "actions": [
    {
      "action": "booking_submitted",
      "details": { "serviceType": "oil_massage" },
      "timestamp": "2026-04-27T11:15:00.000Z"
    }
  ]
}
```

---

## 📁 File Structure

```
data/
├── bookings.json        # Booking records
├── feedback.json        # Feedback/reviews
└── visitors.json        # Visitor analytics
```

All files are:
- ✅ Persisted to disk (survive server restart)
- ✅ Created automatically on first use
- ❌ NOT committed to Git (in .gitignore)
- ❌ Lost when Render instance is recreated

---

## 🚀 Deployment

### On Render.com

1. **Environment Variable Setup**
   ```
   ADMIN_PASSWORD = your_secure_password
   GMAIL_USER = your_gmail@gmail.com
   GMAIL_PASSWORD = your_app_password
   ```

2. **Automatic on Deploy**
   - Data persists during deployment
   - New data files created automatically
   - Visitors.json loaded on startup

3. **After Deployment**
   - Visit `https://your-service.onrender.com/analytics?pwd=YOUR_PASSWORD`
   - View visitor analytics in real-time

---

## ✅ Testing Locally

1. **Start server**
   ```bash
   npm start
   ```

2. **Visit analytics dashboard**
   - http://localhost:3000/analytics?pwd=spa123

3. **Submit test booking**
   - Fill out booking form and submit
   - Check "Actions" column in visitors table

4. **Check data file**
   ```bash
   cat data/visitors.json
   ```

---

## ⚠️ Limitations

1. **Geolocation Accuracy**: IP-based geolocation has ~95% accuracy
2. **VPN/Proxy**: Users behind VPN will show VPN's location
3. **Privacy**: Not suitable for collecting personal data (use with privacy policy)
4. **Data Retention**: Data lost when Render service is recreated (upgrade to paid plan for persistence)
5. **Rate Limits**: Free IP-API tier has rate limits (~45 requests/minute)

---

## 🔄 Refresh Analytics

Click **🔄 Refresh** button to reload latest data without page reload

---

## 📞 Support

For issues:
1. Check browser console for errors (F12)
2. Check Render logs: `Render Dashboard → Logs`
3. Verify `ADMIN_PASSWORD` environment variable is set
4. Try accessing `/api/analytics?pwd=spa123` directly to see raw data

---

## 📝 Privacy Compliance

**Important:** If collecting visitor data, ensure you:
- Have a privacy policy
- Comply with GDPR (if EU visitors)
- Have appropriate cookie/tracking disclosure
- Only store data for legitimate purposes

Consider adding a banner like:
> "We use analytics to understand visitor behavior and improve our services."

---

**Last Updated:** April 27, 2026
**Status:** ✅ Live and Production Ready
