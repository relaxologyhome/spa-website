# Relaxology Home Support - Premium Spa Services Platform

A luxurious, fully-functional single-page application for a premium mobile spa specializing in deep tissue and aromatic oil therapy for women. Built with Node.js/Express.js backend and vanilla JavaScript frontend.

## 🌿 Project Overview

**Spa Name:** Relaxology Home Support  
**Service Model:** Mobile spa therapy - We bring the sanctuary to your doorstep  
**Primary Location:** Chennai (with legacy service in Gachibowli, Hyderabad)  
**Therapist:** Certified Expert Therapist Mani (Professional Conduct & Boundaries Certified)  
**Primary Service:** 60-Minute Signature Deep Tissue & Oil Therapy

### Mission Statement
> "A curated therapeutic sanctuary, specialized deep tissue, and aromatic oil relief, exclusively for women. We target tension and chronic pain (e.g., 'laptop neck') with unparalleled professional hygiene and absolute boundary respect."

---

## 🏗️ Project Structure

```
Spa_website/
├── server.js                 # Main Express.js application
├── package.json             # Node.js dependencies
├── index.html               # Main HTML page
├── public/
│   ├── css/
│   │   └── styles.css      # Luxury design (Deep Green & Gold)
│   └── js/
│       └── app.js          # Frontend logic & API integration
└── README.md               # This file
```

---

## 🎨 Design Highlights

### Color Palette
- **Deep Green:** #1a4d3e (Primary)
- **Forest Green:** #2d6a52 (Secondary)
- **Gold Accents:** #d4af37 (Premium touches)
- **Light Gray:** #f5f5f5 (Backgrounds)

### Features
- Luxury, professional aesthetic
- Fully responsive (Desktop, Tablet, Mobile)
- Smooth animations and transitions
- Accessibility-focused design
- Premium typography with serif fonts

---

## 📋 Key Features

### FUNCTION A: Standard Web Presentation
Comprehensive website pages served via GET endpoints:
- **Home Page:** Hero section with spa context
- **Services Page:** Detailed service offerings
- **About Page:** Certified therapist information
- **Reviews Section:** Client testimonials with ratings

### FUNCTION B: Appointment Booking Logic
Complete booking system with:
- Client name, WhatsApp contact, address area collection
- Service type selection
- Weekend-only date/time restrictions
- Comprehensive validation
- Mock confirmation codes
- WhatsApp notification instructions

**Required Fields:**
- Client Name (string)
- Contact Number (10-digit WhatsApp)
- Chennai Address Area (string)
- Service Type (dropdown)
- Preferred Date (weekend only)
- Preferred Time (9 AM - 6 PM slots)

### FUNCTION C: Feedback Collection Logic
Testimonial submission system with:
- Client name and location input
- 1-5 star rating system
- Comment text (10-500 characters)
- Validation and moderation status
- Character count feedback

**Required Fields:**
- Client Name (string)
- Location/Area (string)
- Star Rating (1-5 integer)
- Comment (10-500 characters)

### FUNCTION D: Review Retrieval Logic
Review management features:
- `getAllReviews()` - Fetch and sanitize existing reviews
- Review filtering by rating
- Review statistics (average rating, total count)
- Pre-populated sample reviews:
  - "Transformative Relief. Exemplary Conduct. Reassuring Boundaries." - Ananya S., Adyar
  - Additional professional testimonials

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 12.0 or higher
- npm (comes with Node.js)

### Installation Steps

1. **Navigate to project directory:**
   ```bash
   cd d:\Learning\Spa_website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Access the website:**
   ```
   http://localhost:3000
   ```

---

## 📡 API Endpoints

### GET Endpoints (Web Presentation - FUNCTION A)

#### `GET /` 
Serves the main HTML page
```
Response: HTML page
```

#### `GET /api/home-data`
Get spa home page information
```json
{
  "spaName": "Relaxology Home Support",
  "tagline": "A curated therapeutic sanctuary...",
  "mission": "Exclusively for women...",
  "locations": ["Chennai (Primary)", "Gachibowli, Hyderabad (Legacy)"],
  "therapist": {
    "name": "Certified Expert Therapist Mani",
    "certifications": [...],
    "experience": "Expert"
  }
}
```

#### `GET /api/services`
Get available services
```json
[
  {
    "id": 1,
    "title": "60-Minute Signature Deep Tissue & Oil Therapy",
    "description": "...",
    "duration": "60 minutes",
    "includes": [...],
    "targetAreas": [...],
    "price": "Contact for quote"
  }
]
```

#### `GET /api/therapist-info`
Get detailed therapist information
```json
{
  "name": "Certified Expert Therapist Mani",
  "title": "Premium Wellness Therapist",
  "specialty": "Deep Tissue & Aromatic Oil Therapy",
  "certifications": [...],
  "expertise": [...],
  "hygiene": {...}
}
```

#### `GET /api/reviews`
Retrieve all reviews (FUNCTION D)
```json
[
  {
    "clientName": "Ananya S.",
    "location": "Adyar",
    "rating": 5,
    "comment": "Transformative Relief...",
    "date": "2026-04-15"
  }
]
```

#### `GET /api/reviews/filter?minRating=4`
Get filtered reviews by minimum rating
```json
{
  "total": 3,
  "reviews": [...]
}
```

#### `GET /api/reviews/stats`
Get review statistics
```json
{
  "totalReviews": 3,
  "averageRating": 5.0,
  "fiveStarCount": 3
}
```

#### `GET /api/available-slots`
Get available time slots
```json
{
  "slots": ["09:00 AM", "10:00 AM", ..., "06:00 PM"]
}
```

---

### POST Endpoints (Business Logic)

#### `POST /api/book-appointment` (FUNCTION B)
Book an appointment

**Request Body:**
```json
{
  "clientName": "Priya Sharma",
  "contactNumber": "9876543210",
  "addressArea": "Adyar",
  "serviceType": "60-min-signature",
  "preferredDate": "2026-05-03",
  "preferredTime": "10:00"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointment booking received successfully!",
  "confirmationCode": "RHS-1234567890",
  "nextSteps": "Our therapist Mani will contact you via WhatsApp to confirm...",
  "booking": {
    "name": "Priya Sharma",
    "date": "2026-05-03",
    "time": "10:00",
    "service": "60-min-signature"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Booking validation failed",
  "errors": ["Client Name is required", "Valid 10-digit WhatsApp number required"]
}
```

#### `POST /api/submit-feedback` (FUNCTION C)
Submit client feedback/testimonial

**Request Body:**
```json
{
  "clientName": "Ananya S.",
  "location": "Adyar",
  "rating": 5,
  "comment": "Transformative Relief. Exemplary Conduct. Reassuring Boundaries."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Thank you for your feedback! Your testimonial has been reviewed.",
  "feedbackId": 1
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Feedback validation failed",
  "errors": ["Comment must be at least 10 characters long"]
}
```

---

### Admin Endpoints (Mock Data)

#### `GET /api/admin/bookings`
Retrieve all bookings (mock data)
```json
{
  "total": 5,
  "bookings": [...]
}
```

#### `GET /api/admin/feedback`
Retrieve all feedback submissions (mock data)
```json
{
  "total": 2,
  "feedback": [...]
}
```

---

## 🔍 Validation Rules

### Booking Validation
- **Client Name:** Required, non-empty string
- **Contact Number:** 10-digit format (can have dashes/spaces)
- **Address Area:** Required, non-empty string
- **Service Type:** Must be valid service
- **Preferred Date:** Must be future date, weekend only (Sat/Sun)
- **Preferred Time:** Must be from available slots (9 AM - 6 PM)

### Feedback Validation
- **Client Name:** Required, non-empty string
- **Location:** Required, non-empty string
- **Rating:** Integer 1-5 (inclusive)
- **Comment:** 10-500 characters (inclusive)

---

## 💾 Mock Data Structure

### Existing Reviews (Pre-populated)
```javascript
[
  {
    id: 1,
    clientName: "Ananya S.",
    location: "Adyar",
    rating: 5,
    comment: "Transformative Relief. Exemplary Conduct. Reassuring Boundaries.",
    date: "2026-04-15"
  },
  // Additional reviews...
]
```

### Bookings Storage (In-Memory Mock)
All bookings are stored in memory with:
- Auto-incrementing ID
- Confirmation code (RHS-{timestamp})
- Status tracking (pending, confirmed, completed)
- Full booking details

### Feedback Storage (In-Memory Mock)
All feedback stored with:
- Auto-incrementing ID
- Moderation status
- Full submission details
- Timestamp

---

## 🎯 Frontend Features

### Navigation
- Sticky navigation with smooth scrolling
- Active state indicators
- Mobile-responsive hamburger menu
- Golden accent on hover

### Forms
- Real-time validation feedback
- Character counting for text areas
- Star rating system
- Error message display
- Success/error notifications

### Reviews Section
- Dynamic review card loading
- Star rating display
- Client location and date
- Responsive grid layout

### Responsive Design
- Mobile-first approach
- Tablet optimization (768px breakpoint)
- Mobile optimization (480px breakpoint)
- Touch-friendly form inputs

---

## 🔐 Security Features

### Input Validation
- All inputs validated on both frontend and backend
- XSS protection through data sanitization
- Phone number format validation
- Date validation (weekend-only enforcement)

### Error Handling
- Comprehensive error messages
- Try-catch blocks on all async operations
- Graceful fallbacks
- User-friendly error displays

---

## 🧪 Testing the API

### Using cURL

**Test Booking Endpoint:**
```bash
curl -X POST http://localhost:3000/api/book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test User",
    "contactNumber": "9876543210",
    "addressArea": "Adyar",
    "serviceType": "60-min-signature",
    "preferredDate": "2026-05-03",
    "preferredTime": "10:00"
  }'
```

**Test Feedback Endpoint:**
```bash
curl -X POST http://localhost:3000/api/submit-feedback \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test Client",
    "location": "Adyar",
    "rating": 5,
    "comment": "Amazing service and professional therapist. Highly recommend!"
  }'
```

**Get Reviews:**
```bash
curl http://localhost:3000/api/reviews
```

---

## 📱 Frontend Testing

1. **Booking Form:**
   - Fill out all fields
   - Try invalid date (weekday)
   - Test phone number validation
   - Submit valid booking

2. **Feedback Form:**
   - Test character count
   - Try invalid ratings
   - Test submission

3. **Reviews:**
   - Check that reviews load dynamically
   - Verify star display

---

## 🎨 Customization Guide

### Changing Colors
Edit `:root` variables in `public/css/styles.css`:
```css
:root {
    --deep-green: #1a4d3e;
    --gold: #d4af37;
    /* ... */
}
```

### Modifying Services
Edit `server.js` in the `/api/services` endpoint:
```javascript
const services = [
    // Add/modify service objects here
];
```

### Adding Reviews
Edit the `existingReviews` array in `server.js`:
```javascript
const existingReviews = [
    // Add new review objects
];
```

---

## 🚀 Production Deployment

### Required Changes for Production

1. **Replace Mock Data:**
   - Implement actual database (MongoDB, PostgreSQL, MySQL)
   - Replace in-memory storage with persistent DB

2. **Security Enhancements:**
   - Add authentication/authorization
   - Implement rate limiting
   - Add CSRF protection
   - Use environment variables for sensitive data

3. **Performance:**
   - Add caching for reviews
   - Implement pagination
   - Add image optimization

4. **Monitoring:**
   - Add error logging
   - Implement analytics
   - Set up performance monitoring

### Database Schema Example (Not Implemented)
```sql
-- Bookings Table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255),
  contact_number VARCHAR(20),
  address_area VARCHAR(255),
  service_type VARCHAR(100),
  preferred_date DATE,
  preferred_time TIME,
  confirmation_code VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP
);

-- Feedback Table
CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255),
  location VARCHAR(255),
  rating INT,
  comment TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP
);
```

---

## 📝 API Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Validation error |
| 404 | Not Found | Resource not found |
| 500 | Internal Error | Server error |

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is already in use
netstat -ano | findstr :3000

# Use a different port
PORT=3001 npm start
```

### Dependencies not installed
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install
```

### CORS issues
The app serves both frontend and backend from the same origin (no CORS needed).

---

## 📞 Support Information

**Therapist:** Certified Expert Therapist Mani  
**Specialty:** Deep Tissue & Aromatic Oil Therapy  
**Certifications:** Professional Conduct & Boundaries  
**Service Area:** Chennai (Primary), Hyderabad (Legacy)  
**Availability:** Weekends Only

---

## 📄 License

Relaxology Home Support © 2026. All rights reserved.

---

## 🎉 Ready to Deploy!

Your spa website is now fully functional with:
- ✅ Professional luxury design
- ✅ Complete booking system
- ✅ Feedback collection
- ✅ Review management
- ✅ Responsive mobile design
- ✅ Full API backend
- ✅ Form validation

Enjoy managing your spa services!
