/**
 * Relaxology Woman Spa - Express.js Backend
 * A curated therapeutic sanctuary for women's deep tissue and aromatic oil relief
  * Service provided by Certified Expert Therapist
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// MOCK DATABASE - EXISTING REVIEWS
// ============================================================================
const existingReviews = [
  {
    id: 1,
    clientName: "Ananya S.",
    location: "Adyar",
    rating: 5,
    comment: "Transformative Relief. Exemplary Conduct. Reassuring Boundaries.",
    date: "2026-04-15"
  },
  {
    id: 2,
    clientName: "Priya M.",
    location: "Alwarpet",
    rating: 5,
    comment: "Best deep tissue therapy I've ever experienced. Mani's professionalism and expertise are unmatched.",
    date: "2026-04-10"
  },
  {
    id: 3,
    clientName: "Divya K.",
    location: "Besant Nagar",
    rating: 5,
    comment: "Laptop neck pain completely resolved after just one session. Highly recommend!",
    date: "2026-04-05"
  }
];

// Mock storage for new bookings and feedback
const bookings = [];
const feedbackSubmissions = [];

// ============================================================================
// FUNCTION A: STANDARD WEB PRESENTATION (GET LOGIC)
// ============================================================================

/**
 * Serve the main landing page
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * API: Get home page data (luxury spa context)
 */
app.get('/api/home-data', (req, res) => {
  const homeData = {
    spaName: "Relaxology Woman Spa",
    tagline: "A curated therapeutic sanctuary, specialized deep tissue, and aromatic oil relief",
    mission: "Exclusively for women. We target tension and chronic pain with unparalleled professional hygiene and absolute boundary respect.",
    locations: ["Chennai", "Bangalore", "Hyderabad"],
    therapist: {
      name: "Certified Expert Therapist",
      certifications: ["Professional Conduct & Boundaries Certified", "Deep Tissue Therapy Specialist"],
      experience: "Expert"
    },
    heroColor: "Deep Green with Gold Accents"
  };
  res.json(homeData);
});

/**
 * API: Get services information
 */
app.get('/api/services', (req, res) => {
  const services = [
    {
      id: 1,
      title: "60-Minute Signature Deep Tissue & Oil Therapy",
      description: "Our flagship service combining professional deep tissue massage with curated aromatic oils targeting chronic tension and pain relief.",
      duration: "60 minutes",
      includes: [
        "Professional Deep Tissue Massage",
        "Curated Aromatic Oil Blend",
        "Complimentary Aromatic Oil Blend Gift",
        "Spotless Equipment Setup",
        "Professional Sanitization",
        "Absolute Boundary Respect"
      ],
      targetAreas: ["Laptop neck", "Chronic pain", "Muscle tension"],
      price: "Contact for quote"
    },
    {
      id: 2,
      title: "60-Minute Stress-Relief & Scalp Therapy",
      description: "Specialized therapy for mental clarity, headache relief, and upper body tension management.",
      duration: "60 minutes",
      includes: [
        "Deep Scalp Stimulation",
        "Neck & Shoulder Release",
        "Lavender-Infused Essential Oils",
        "Warm Towel Compression",
        "Professional Sanitization",
        "Absolute Boundary Respect"
      ],
      targetAreas: ["Tension headaches", "Shoulder stiffness", "Mental burnout"],
      price: "Contact for quote"
    },
    {
      id: 3,
      title: "75-Minute Revitalizing Foot & Leg Reflexology",
      description: "Circulation and relief for those who are on their feet all day with therapeutic foot care.",
      duration: "75 minutes",
      includes: [
        "Therapeutic Foot Soak",
        "Targeted Reflexology",
        "Cooling Mint & Eucalyptus Blend",
        "Lower Limb Drainage",
        "Complimentary Travel-Size Foot Balm",
        "Spotless Equipment Setup"
      ],
      targetAreas: ["Tired feet", "Leg swelling", "Poor circulation"],
      price: "Contact for quote"
    },
    {
      id: 4,
      title: "90-Minute Glow-Up Full Body Polishing",
      description: "Skin exfoliation, hydration, and deep relaxation for a radiant, glowing finish.",
      duration: "90 minutes",
      includes: [
        "Gentle Body Scrub",
        "Signature Oil Massage",
        "Skin Brightening Serum Application",
        "Deep Hydration Mask",
        "Full Kit Provision with Premium Linens",
        "Professional & Secure Sanctuary"
      ],
      targetAreas: ["Dull skin", "Dry texture", "Total body relaxation"],
      price: "Contact for quote"
    }
  ];
  res.json(services);
});

/**
 * API: Get therapist information (About page)
 */
app.get('/api/therapist-info', (req, res) => {
  const therapistInfo = {
    name: "Certified Expert Therapist",
    title: "Premium Wellness Therapist",
    specialty: "Deep Tissue & Aromatic Oil Therapy",
    certifications: [
      "Professional Conduct & Boundaries Certification",
      "Advanced Deep Tissue Massage",
      "Aromatherapy Specialist"
    ],
    expertise: [
      "Chronic pain management",
      "Tension relief",
      "Professional boundary respect",
      "Women's wellness focus"
    ],
    hygiene: {
      protocol: "Spotless equipment setup",
      sanitization: "Professional-grade sanitizing supplies",
      boundaries: "Absolute respect for client boundaries and preferences"
    }
  };
  res.json(therapistInfo);
});

/**
 * API: Get all reviews (FUNCTION D)
 */
app.get('/api/reviews', (req, res) => {
  // Retrieve and sanitize existing reviews
  const sanitizedReviews = existingReviews.map(review => ({
    clientName: review.clientName,
    location: review.location,
    rating: review.rating,
    comment: review.comment,
    date: review.date
  }));
  res.json(sanitizedReviews);
});

// ============================================================================
// FUNCTION B: APPOINTMENT BOOKING LOGIC
// ============================================================================

/**
 * Handle appointment booking form submission
 * Required Fields: Client Name, Contact Number (WhatsApp), Address Area,
 * Service Type, Preferred Weekend Date/Time
 */
app.post('/api/book-appointment', (req, res) => {
  const { clientName, gender, contactNumber, addressArea, serviceType, preferredDate, preferredTime } = req.body;

  // Validation Logic
  const errors = [];
  
  if (!clientName || clientName.trim() === '') {
    errors.push('Client Name is required');
  }
  
  if (!gender || gender === '') {
    errors.push('Gender is required');
  }
  
  if (!contactNumber || !/^\d{10}$/.test(contactNumber.replace(/\D/g, ''))) {
    errors.push('Valid 10-digit WhatsApp contact number is required');
  }
  
  if (!addressArea || addressArea.trim() === '') {
    errors.push('Address Area is required');
  }
  
  if (!serviceType || serviceType === '') {
    errors.push('Service Type is required');
  }
  
  if (!preferredDate || preferredDate.trim() === '') {
    errors.push('Preferred date is required');
  }
  
  if (!preferredTime || preferredTime === '') {
    errors.push('Preferred time is required');
  }

  // Check if validation failed
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Booking validation failed',
      errors: errors
    });
  }

  // Validate date is not in the past
  const bookingDate = new Date(preferredDate);
  const today = new Date();
  if (bookingDate < today) {
    return res.status(400).json({
      success: false,
      message: 'Please select a future date',
      errors: ['Date must be in the future']
    });
  }

  // Create booking record (Mock Implementation)
  const booking = {
    id: bookings.length + 1,
    clientName: clientName.trim(),
    gender: gender,
    contactNumber: contactNumber,
    addressArea: addressArea.trim(),
    serviceType: serviceType,
    preferredDate: preferredDate,
    preferredTime: preferredTime,
    status: 'pending',
    bookingDate: new Date().toISOString(),
    confirmationCode: `RHS-${Date.now()}`
  };

  bookings.push(booking);

  // Mock success response
  res.json({
    success: true,
    message: 'Appointment booking received successfully!',
    confirmationCode: booking.confirmationCode,
    nextSteps: 'Our therapist will contact you via WhatsApp to confirm your appointment.',
    booking: {
      name: booking.clientName,
      date: booking.preferredDate,
      time: booking.preferredTime,
      service: booking.serviceType
    }
  });
});

/**
 * API: Get available time slots (Mock Implementation)
 */
app.get('/api/available-slots', (req, res) => {
  const slots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];
  res.json({ slots: slots });
});

// ============================================================================
// FUNCTION C: FEEDBACK COLLECTION LOGIC
// ============================================================================

/**
 * Collect and process new client testimonials/feedback
 * Required Fields: Client Name (Adyar/Chennai focus), Star Rating (1-5), Comment text
 */
app.post('/api/submit-feedback', (req, res) => {
  const { clientName, location, rating, comment } = req.body;

  // Validation Logic
  const errors = [];

  if (!clientName || clientName.trim() === '') {
    errors.push('Client Name is required');
  }

  if (!location || location.trim() === '') {
    errors.push('Location/Area is required');
  }

  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(parseInt(rating))) {
    errors.push('Star Rating must be between 1 and 5');
  }

  if (!comment || comment.trim().length < 10) {
    errors.push('Comment must be at least 10 characters long');
  }

  if (comment && comment.trim().length > 500) {
    errors.push('Comment cannot exceed 500 characters');
  }

  // Check if validation failed
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Feedback validation failed',
      errors: errors
    });
  }

  // Create feedback record (Mock Implementation)
  const feedback = {
    id: feedbackSubmissions.length + 1,
    clientName: clientName.trim(),
    location: location.trim(),
    rating: parseInt(rating),
    comment: comment.trim(),
    submissionDate: new Date().toISOString(),
    status: 'pending_moderation'
  };

  feedbackSubmissions.push(feedback);

  // Mock success response
  res.json({
    success: true,
    message: 'Thank you for your feedback! Your testimonial has been received and will be reviewed.',
    feedbackId: feedback.id
  });
});

// ============================================================================
// FUNCTION D: EXISTING REVIEW RETRIEVAL LOGIC
// ============================================================================

/**
 * Get all sanitized reviews with basic filtering
 * Returns: Array of reviews with Client Name, Location, Rating, and Comment
 */
function getAllReviews() {
  return existingReviews.map(review => ({
    clientName: review.clientName,
    location: review.location,
    rating: review.rating,
    comment: review.comment,
    date: review.date
  }));
}

/**
 * API: Get filtered reviews by rating
 */
app.get('/api/reviews/filter', (req, res) => {
  const { minRating = 1 } = req.query;
  const filtered = getAllReviews().filter(r => r.rating >= parseInt(minRating));
  res.json({
    total: filtered.length,
    reviews: filtered
  });
});

/**
 * API: Get reviews statistics
 */
app.get('/api/reviews/stats', (req, res) => {
  const reviews = getAllReviews();
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  
  res.json({
    totalReviews: reviews.length,
    averageRating: parseFloat(avgRating),
    fiveStarCount: reviews.filter(r => r.rating === 5).length
  });
});

/**
 * API: Admin panel - Get all bookings (Mock)
 */
app.get('/api/admin/bookings', (req, res) => {
  res.json({
    total: bookings.length,
    bookings: bookings
  });
});

/**
 * API: Admin panel - Get all feedback (Mock)
 */
app.get('/api/admin/feedback', (req, res) => {
  res.json({
    total: feedbackSubmissions.length,
    feedback: feedbackSubmissions
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(70)}`);
  console.log('Relaxology Woman Spa - Premium Spa Services');
  console.log(`${'='.repeat(70)}`);
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log('\n📍 Service: Deep Tissue & Aromatic Oil Therapy');
  console.log('👩‍⚕️ Therapist: Certified Expert Therapist Mani');
  console.log('📍 Locations: Chennai (Primary) | Gachibowli, Hyderabad (Legacy)');
  console.log('\nAvailable Endpoints:');
  console.log('  GET  / - Home page');
  console.log('  GET  /api/home-data - Spa information');
  console.log('  GET  /api/services - Services list');
  console.log('  GET  /api/therapist-info - Therapist details');
  console.log('  GET  /api/reviews - All reviews');
  console.log('  POST /api/book-appointment - Book appointment');
  console.log('  GET  /api/available-slots - Available time slots');
  console.log('  POST /api/submit-feedback - Submit testimonial');
  console.log(`\n${'='.repeat(70)}\n`);
});

module.exports = app;
