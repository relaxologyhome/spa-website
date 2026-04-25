# Relaxology Home Support - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd d:\Learning\Spa_website
npm install
```

### Step 2: Start the Server
```bash
npm start
```

You'll see:
```
======================================================================
Relaxology Home Support - Premium Spa Services
======================================================================

✓ Server running on http://localhost:3000

📍 Service: Deep Tissue & Aromatic Oil Therapy
👩‍⚕️ Therapist: Certified Expert Therapist Mani
📍 Locations: Chennai (Primary) | Gachibowli, Hyderabad (Legacy)

Available Endpoints:
  GET  / - Home page
  GET  /api/home-data - Spa information
  GET  /api/services - Services list
  GET  /api/therapist-info - Therapist details
  GET  /api/reviews - All reviews
  POST /api/book-appointment - Book appointment
  GET  /api/available-slots - Available time slots
  POST /api/submit-feedback - Submit testimonial

======================================================================
```

### Step 3: Open in Browser
Navigate to: **http://localhost:3000**

---

## ✨ Features You Can Test

### 1. View the Website
- **Home Page:** Luxury spa branding with hero section
- **Services:** 60-minute signature therapy details
- **About:** Therapist credentials and hygiene commitment
- **Reviews:** Client testimonials (loaded dynamically)

### 2. Book an Appointment
- Click "Book Now" or navigate to booking section
- Fill in all required fields:
  - Name: Any name (e.g., "Priya Sharma")
  - WhatsApp: 10-digit number (e.g., "9876543210")
  - Area: Any Chennai area (e.g., "Adyar", "Alwarpet")
  - Service: Select available service
  - Date: Choose a **weekend date** (Friday won't work!)
  - Time: Pick from available slots
- Get confirmation code with next steps

### 3. Submit Feedback
- Scroll to "Share Your Experience" section
- Rate your experience (1-5 stars)
- Add your feedback (10-500 characters)
- Submit and get confirmation

### 4. View Reviews
- Scroll to "Reviews" section
- See existing client testimonials
- Reviews include names, locations, ratings, and comments

---

## 📋 Important Notes

### Booking Rules
- ✅ Only **weekends** (Saturday & Sunday) are bookable
- ❌ Weekdays will show an error
- Available times: 9 AM to 6 PM
- Contact number must be 10 digits

### Feedback Rules
- Comments must be 10-500 characters
- Rating must be 1-5 stars
- Location is required (e.g., "Adyar")

### Test Data
All data is stored in memory (mock implementation):
- Bookings are lost when server restarts
- Feedback is lost when server restarts
- Existing reviews are pre-populated (hardcoded)

---

## 🧪 Test Scenarios

### Scenario 1: Successful Booking
1. Use any name (e.g., "Divya K.")
2. Use phone: 9876543210
3. Use area: "Besant Nagar"
4. Pick a **weekend** (e.g., May 3, 2026 - Saturday)
5. Pick time: "10:00 AM"
6. Submit ✅
7. Get confirmation code: RHS-[timestamp]

### Scenario 2: Invalid Date (Weekday)
1. Try to book on a Monday
2. See error: "Only weekend dates are available" ❌

### Scenario 3: Invalid Phone
1. Enter phone: "123" (too short)
2. See error on blur ❌

### Scenario 4: Share Feedback
1. Name: "Ananya S."
2. Area: "Adyar"
3. Rating: 5 stars
4. Comment: "Best therapy experience ever!"
5. Submit ✅
6. See: "Thank you for your feedback!"

---

## 🔧 Project Files

```
Spa_website/
├── server.js              ← Backend (Express.js)
│   ├── Function A: GET endpoints (home, services, therapist, reviews)
│   ├── Function B: POST /api/book-appointment
│   ├── Function C: POST /api/submit-feedback
│   └── Function D: GET /api/reviews (getAllReviews)
│
├── index.html             ← Main page
├── public/
│   ├── css/styles.css     ← Luxury design (Deep Green + Gold)
│   └── js/app.js          ← Frontend logic
│
├── package.json           ← Dependencies
└── README.md              ← Full documentation
```

---

## 🎨 Design Elements

### Color Scheme
- **Deep Green:** #1a4d3e (Primary - Professional)
- **Gold:** #d4af37 (Accents - Premium)
- **White/Light Gray:** Backgrounds

### Typography
- Serif fonts for headings (Luxury feel)
- Sans-serif for body text (Readability)

### Responsive
- Desktop: Full featured layout
- Tablet: Optimized columns (768px breakpoint)
- Mobile: Single column, touch-friendly (480px breakpoint)

---

## 📡 API Endpoints Summary

| Method | Endpoint | Purpose | Function |
|--------|----------|---------|----------|
| GET | / | Home page | A |
| GET | /api/home-data | Spa info | A |
| GET | /api/services | Services list | A |
| GET | /api/therapist-info | Therapist details | A |
| GET | /api/reviews | All reviews | D |
| GET | /api/available-slots | Time slots | A |
| POST | /api/book-appointment | Book appointment | B |
| POST | /api/submit-feedback | Submit feedback | C |

---

## 🐛 Common Issues

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Use different port
PORT=3001 npm start
```

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Cannot POST /api/book-appointment"
**Solution:** Ensure body-parser is installed: `npm install`

### Issue: Bookings/Feedback lost after restart
**This is expected!** Data is stored in memory. For persistence, implement a database.

---

## 💡 Next Steps (Optional Enhancements)

To make this production-ready, consider:

1. **Database Integration**
   - Replace in-memory storage with MongoDB/PostgreSQL
   - Create persistent booking and feedback records

2. **Authentication**
   - Add admin login
   - Secure admin endpoints

3. **Email/SMS Notifications**
   - Send WhatsApp confirmations
   - Email booking summaries

4. **Payment Integration**
   - Add Razorpay/Stripe for payments
   - Update pricing dynamically

5. **Analytics**
   - Track bookings by time/area
   - Monitor feedback trends
   - Generate reports

---

## 📞 Therapist Details

**Name:** Certified Expert Therapist Mani  
**Specialty:** Deep Tissue & Aromatic Oil Therapy  
**Certification:** Professional Conduct & Boundaries  
**Service Area:** Chennai (Primary) | Hyderabad (Legacy)  
**Availability:** Weekends Only (Saturday & Sunday)

---

## ✅ You're All Set!

Your Relaxology Home Support spa website is ready to go! 

**Access it now:** http://localhost:3000

Enjoy managing your spa services! 🌿✨
