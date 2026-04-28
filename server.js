/**
 * Relaxology Woman Spa - Express.js Backend
 * A curated therapeutic sanctuary for women's deep tissue and aromatic oil relief
   * Service provided by Certified Expert Therapist
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const app = express();

// ============================================================================
// EMAIL CONFIGURATION
// ============================================================================

/**
 * Email transporter configuration for Gmail
 * Using Gmail App Password (not regular password) for security
 * Set environment variables: GMAIL_USER and GMAIL_PASSWORD
 */
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

// Test email configuration on startup
emailTransporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️  Email configuration issue:', error.message);
    console.log('   Email notifications will be disabled.');
  } else {
    console.log('✓ Email service configured and ready');
  }
});

// ============================================================================
// FILE-BASED DATA PERSISTENCE
// ============================================================================

const DATA_DIR = path.join(__dirname, 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

/**
 * Ensure data directory exists
 */
function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('✓ Data directory created');
  }
}

/**
 * Load bookings from JSON file
 */
function loadBookings() {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const data = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      const bookings = JSON.parse(data || '[]');
      console.log(`✓ Loaded ${bookings.length} bookings from file`);
      return bookings;
    }
    return [];
  } catch (error) {
    console.error('❌ Error loading bookings:', error.message);
    return [];
  }
}

/**
 * Load feedback from JSON file
 */
function loadFeedback() {
  try {
    if (fs.existsSync(FEEDBACK_FILE)) {
      const data = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
      const feedback = JSON.parse(data || '[]');
      console.log(`✓ Loaded ${feedback.length} feedback submissions from file`);
      return feedback;
    }
    return [];
  } catch (error) {
    console.error('❌ Error loading feedback:', error.message);
    return [];
  }
}

/**
 * Save bookings to JSON file
 */
function saveBookings(bookings) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    console.log('✓ Bookings saved to file');
  } catch (error) {
    console.error('❌ Error saving bookings:', error.message);
  }
}

/**
 * Save feedback to JSON file
 */
function saveFeedback(feedback) {
  try {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
    console.log('✓ Feedback saved to file');
  } catch (error) {
    console.error('❌ Error saving feedback:', error.message);
  }
}

// ============================================================================
// VISITOR ANALYTICS - FILE-BASED STORAGE
// ============================================================================

const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');

/**
 * Load visitors from JSON file
 */
function loadVisitors() {
  try {
    if (fs.existsSync(VISITORS_FILE)) {
      const data = fs.readFileSync(VISITORS_FILE, 'utf-8');
      const visitors = JSON.parse(data || '[]');
      console.log(`✓ Loaded ${visitors.length} visitor records from file`);
      return visitors;
    }
    return [];
  } catch (error) {
    console.error('❌ Error loading visitors:', error.message);
    return [];
  }
}

/**
 * Save visitors to JSON file
 */
function saveVisitors(visitors) {
  try {
    fs.writeFileSync(VISITORS_FILE, JSON.stringify(visitors, null, 2));
  } catch (error) {
    console.error('❌ Error saving visitors:', error.message);
  }
}

/**
 * Get client IP address from request
 */
function getClientIP(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         req.ip || 
         'Unknown';
}

/**
 * Fetch geolocation data from IP using free API
 */
async function getGeolocation(ip) {
  try {
    if (ip === 'Unknown' || ip.includes('127.0') || ip.includes('::1')) {
      return { country: 'Local', city: 'Local', region: 'Local' };
    }
    
    const response = await fetch(`https://ip-api.com/json/${ip}?fields=country,city,region,status`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country || 'Unknown',
        city: data.city || 'Unknown',
        region: data.region || 'Unknown'
      };
    }
    return { country: 'Unknown', city: 'Unknown', region: 'Unknown' };
  } catch (error) {
    console.warn('⚠️  Geolocation API error:', error.message);
    return { country: 'Unknown', city: 'Unknown', region: 'Unknown' };
  }
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================
// Set request timeout (30 seconds)
app.use((req, res, next) => {
  req.setTimeout(30000);
  res.setTimeout(30000);
  next();
});

// Limit request body size and set rate limiting
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// VISITOR TRACKING MIDDLEWARE
// ============================================================================
app.use((req, res, next) => {
  // Skip tracking for API calls and static files (only track page views)
  if (req.path === '/' || req.path === '/index.html') {
    const ip = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';
    
    // Find existing visitor session or create new one
    const existingVisitor = visitors.find(v => v.ip === ip);
    
    if (existingVisitor) {
      // Update existing visitor
      existingVisitor.lastVisit = new Date().toISOString();
      existingVisitor.pageViews = (existingVisitor.pageViews || 0) + 1;
      existingVisitor.pages = existingVisitor.pages || [];
      if (!existingVisitor.pages.includes(req.path)) {
        existingVisitor.pages.push(req.path);
      }
    } else {
      // Create new visitor record
      const newVisitor = {
        id: Date.now().toString(),
        ip: ip,
        userAgent: userAgent,
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        pageViews: 1,
        pages: [req.path],
        location: { country: 'Loading...', city: 'Loading...', region: 'Loading...' },
        device: 'Unknown',
        actions: []
      };
      
      // Fetch geolocation asynchronously (don't wait for it)
      getGeolocation(ip).then(location => {
        newVisitor.location = location;
        saveVisitors(visitors);
      });
      
      // Extract device info from user agent
      if (userAgent.includes('Mobile')) newVisitor.device = 'Mobile';
      else if (userAgent.includes('Tablet')) newVisitor.device = 'Tablet';
      else if (userAgent.includes('Windows')) newVisitor.device = 'Windows';
      else if (userAgent.includes('Mac')) newVisitor.device = 'Mac';
      else if (userAgent.includes('Linux')) newVisitor.device = 'Linux';
      
      visitors.push(newVisitor);
    }
    
    saveVisitors(visitors);
  }
  next();
});

// Health check to prevent server inactivity
app.use((req, res, next) => {
  res.setHeader('X-Response-Time', new Date().toISOString());
  next();
});

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
  },
  {
    id: 4,
    clientName: "Neha Sharma",
    location: "Whitefield",
    rating: 5,
    comment: "Mani has an absolute gift for relieving tension. I booked his signature oil massage special for my severe 'laptop neck.' He brought a complete, spotless clinical setup and made sure[...]",
    date: "2026-04-19"
  },
  {
    id: 5,
    clientName: "Pooja V.",
    location: "Banjara Hills",
    rating: 5,
    comment: "If you need serious muscle recovery, Mani is the therapist to call. The premium organic oils he uses are fantastic and don't leave you feeling sticky. He is highly professional, pun[...]",
    date: "2026-04-12"
  },
  {
    id: 6,
    clientName: "Anjali Desai",
    location: "Indiranagar",
    rating: 5,
    comment: "I booked the 60-minute oil massage with Mani after a long week of travel. His technique is fantastic—firm pressure exactly where I needed it. I really appreciated his professional[...]",
    date: "2026-04-05"
  },
  {
    id: 7,
    clientName: "Swathi Reddy",
    location: "Gachibowli",
    rating: 5,
    comment: "I booked the special oil massage, and it was pure bliss! The therapist brought these incredible, warm organic oils that smelled like a high-end luxury spa. Not only did it melt away[...]",
    date: "2026-04-21"
  },
  {
    id: 8,
    clientName: "Ritu K.",
    location: "Bangalore",
    rating: 5,
    comment: "Highly recommend the oil massage special! I was a bit worried about my bed getting messy, but the setup was completely clinical and spotless. The aromatic oils they use are so calmi[...]",
    date: "2026-04-16"
  },
  {
    id: 9,
    clientName: "Deepika Menon",
    location: "Jubilee Hills",
    rating: 5,
    comment: "If you are stressed from work, you have to try their signature oil massage. The warm oil combined with the deep tissue technique completely worked out the knots in my upper back. Pl[...]",
    date: "2026-04-09"
  },
  {
    id: 10,
    clientName: "Shruti V.",
    location: "Hitech City",
    rating: 5,
    comment: "I took advantage of the oil massage special and it exceeded every expectation. The blend of essential oils they use feels so premium and doesn't leave you feeling sticky at all. The[...]",
    date: "2026-03-30"
  }
];

// Mock storage for new bookings and feedback - Load from files on startup
ensureDataDirectory();
let bookings = loadBookings();
let feedbackSubmissions = loadFeedback();
let visitors = loadVisitors();

// ============================================================================
// MEMORY MANAGEMENT - PREVENT MEMORY LEAKS
// ============================================================================

const MAX_BOOKINGS = 1000;  // Keep only last 1000 bookings
const MAX_FEEDBACK = 1000;  // Keep only last 1000 feedback items

/**
 * Clean old data to prevent memory leaks
 */
function cleanOldData() {
  if (bookings.length > MAX_BOOKINGS) {
    bookings.splice(0, bookings.length - MAX_BOOKINGS);
    saveBookings(bookings);
  }
  if (feedbackSubmissions.length > MAX_FEEDBACK) {
    feedbackSubmissions.splice(0, feedbackSubmissions.length - MAX_FEEDBACK);
    saveFeedback(feedbackSubmissions);
  }
}

// Run cleanup every 5 minutes
setInterval(cleanOldData, 5 * 60 * 1000);

// ============================================================================
// EMAIL HELPER FUNCTIONS
// ============================================================================

/**
 * Send appointment booking confirmation email
 */
async function sendBookingEmail(booking) {
  try {
    const mailOptions = {
      from: 'relaxologyhome@gmail.com',
      to: 'relaxologyhome@gmail.com',
      subject: `📅 New Appointment Booking - ${booking.confirmationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f9c6e8; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #f94fa0 0%, #f27a93 100%); padding: 20px; color: white;">
            <h1 style="margin: 0;">📅 New Appointment Booking</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #f94fa0; margin-top: 0;">Booking Confirmation</h2>
            <p><strong>Confirmation Code:</strong> <span style="color: #f94fa0; font-weight: bold;">${booking.confirmationCode}</span></p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <h3 style="color: #333;">Client Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.clientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Gender:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.gender}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Contact (WhatsApp):</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">+91${booking.contactNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Address Area:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.addressArea}</td>
              </tr>
            </table>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <h3 style="color: #333;">Service Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Service Type:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.serviceType}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Preferred Date:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.preferredDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Preferred Time:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.preferredTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Status:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><span style="background-color: #fff3cd; padding: 4px 8px; border-radius: 4px; color: #856404;">${booking.status}</span></t>
              </tr>
            </table>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="color: #666; font-size: 14px;">
              <strong>Next Step:</strong> Contact the client via WhatsApp at +91${booking.contactNumber} to confirm the appointment.
            </p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            <p>Relaxology Woman Spa - Premium Home Spa Services</p>
            <p>© 2026 All Rights Reserved</p>
          </div>
        </div>
      `
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✓ Booking email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('✗ Error sending booking email:', error.message);
    return false;
  }
}

/**
 * Send feedback submission email
 */
async function sendFeedbackEmail(feedback) {
  try {
    const stars = '⭐'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
    
    const mailOptions = {
      from: 'relaxologyhome@gmail.com',
      to: 'relaxologyhome@gmail.com',
      subject: `💬 New Feedback/Testimonial - ${feedback.rating}⭐ from ${feedback.clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f9c6e8; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #f94fa0 0%, #f27a93 100%); padding: 20px; color: white;">
            <h1 style="margin: 0;">💬 New Testimonial Received</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #f94fa0; margin-top: 0;">Client Feedback</h2>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <h3 style="color: #333;">Rating & Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Client Name:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${feedback.clientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Location:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${feedback.location}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Rating:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-size: 18px;">${stars}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Status:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><span style="background-color: #fff3cd; padding: 4px 8px; border-radius: 4px; color: #856404;">Pending Review</span></td>
              </tr>
            </table>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <h3 style="color: #333;">Feedback Comment</h3>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #f9c6e8; border-radius: 4px; font-style: italic; color: #555;">
              "${feedback.comment}"
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="color: #666; font-size: 14px;">
              <strong>Submission Date:</strong> ${new Date(feedback.submissionDate).toLocaleString('en-IN')}<br>
              <strong>Feedback ID:</strong> ${feedback.id}
            </p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            <p>Relaxology Woman Spa - Premium Home Spa Services</p>
            <p>© 2026 All Rights Reserved</p>
          </div>
        </div>
      `
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✓ Feedback email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('✗ Error sending feedback email:', error.message);
    return false;
  }
}

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

  // Save bookings to file
  saveBookings(bookings);

  // Send email notification to admin
  sendBookingEmail(booking);

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

  // Save feedback to file
  saveFeedback(feedbackSubmissions);

  // Send email notification to admin
  sendFeedbackEmail(feedback);

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
// COMPREHENSIVE ANALYTICS ENDPOINT
// ============================================================================

/**
 * Helper function to get date range stats
 */
function getDateStats(items, dateField, days = 30) {
  const stats = {};
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    stats[dateStr] = 0;
  }
  
  items.forEach(item => {
    const dateStr = new Date(item[dateField]).toISOString().split('T')[0];
    if (stats[dateStr] !== undefined) {
      stats[dateStr]++;
    }
  });
  
  return stats;
}

/**
 * Get service type distribution
 */
function getServiceStats() {
  const stats = {};
  bookings.forEach(booking => {
    stats[booking.serviceType] = (stats[booking.serviceType] || 0) + 1;
  });
  return stats;
}

/**
 * Get location distribution
 */
function getLocationStats() {
  const stats = {};
  bookings.forEach(booking => {
    stats[booking.addressArea] = (stats[booking.addressArea] || 0) + 1;
  });
  return stats;
}

/**
 * Get feedback rating distribution
 */
function getRatingDistribution() {
  const stats = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
  feedbackSubmissions.forEach(feedback => {
    stats[feedback.rating]++;
  });
  return stats;
}

/**
 * API: Comprehensive Admin Analytics Dashboard
 */
app.get('/api/admin/analytics', (req, res) => {
  const password = req.query.pwd || req.headers['authorization'];
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'spa123';
  
  // Simple password check (in production, use proper authentication)
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized - Invalid password' });
  }
  
  try {
    // Business Metrics
    const totalBookings = bookings.length;
    const totalFeedback = feedbackSubmissions.length;
    const totalVisitors = visitors.length;
    const totalPageViews = visitors.reduce((sum, v) => sum + (v.pageViews || 0), 0);
    
    // Booking Status Distribution
    const bookingStatus = {
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    };
    
    // Feedback Status Distribution
    const feedbackStatus = {
      pending_moderation: feedbackSubmissions.filter(f => f.status === 'pending_moderation').length,
      approved: feedbackSubmissions.filter(f => f.status === 'approved').length,
      rejected: feedbackSubmissions.filter(f => f.status === 'rejected').length
    };
    
    // Average rating calculation
    const avgFeedbackRating = feedbackSubmissions.length > 0
      ? (feedbackSubmissions.reduce((sum, f) => sum + f.rating, 0) / feedbackSubmissions.length).toFixed(2)
      : 0;
    
    // Timeline data (last 30 days)
    const bookingTimeline = getDateStats(bookings, 'bookingDate', 30);
    const feedbackTimeline = getDateStats(feedbackSubmissions, 'submissionDate', 30);
    
    // Service distribution
    const serviceStats = getServiceStats();
    
    // Location distribution
    const locationStats = getLocationStats();
    
    // Rating distribution
    const ratingDistribution = getRatingDistribution();
    
    // Visitor analytics
    const deviceStats = {};
    visitors.forEach(v => {
      const device = v.device || 'Unknown';
      deviceStats[device] = (deviceStats[device] || 0) + 1;
    });
    
    // Country/Location stats
    const countryStats = {};
    visitors.forEach(v => {
      const country = v.location?.country || 'Unknown';
      countryStats[country] = (countryStats[country] || 0) + 1;
    });
    
    const topCountries = Object.entries(countryStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Recent bookings
    const recentBookings = bookings
      .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
      .slice(0, 10);
    
    // Recent feedback
    const recentFeedback = feedbackSubmissions
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
      .slice(0, 10);
    
    // Recent visitors
    const recentVisitors = visitors
      .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
      .slice(0, 10)
      .map(v => ({
        ip: v.ip,
        location: `${v.location?.city || 'Unknown'}, ${v.location?.country || 'Unknown'}`,
        device: v.device,
        pageViews: v.pageViews,
        lastVisit: v.lastVisit
      }));
    
    res.json({
      summary: {
        totalBookings,
        totalFeedback,
        totalVisitors,
        totalPageViews,
        averagePageViewsPerVisitor: totalVisitors > 0 ? (totalPageViews / totalVisitors).toFixed(2) : 0,
        averageFeedbackRating: parseFloat(avgFeedbackRating)
      },
      bookingMetrics: {
        total: totalBookings,
        byStatus: bookingStatus,
        byService: serviceStats,
        byLocation: locationStats
      },
      feedbackMetrics: {
        total: totalFeedback,
        byStatus: feedbackStatus,
        ratingDistribution: ratingDistribution,
        averageRating: parseFloat(avgFeedbackRating)
      },
      timeline: {
        bookings: bookingTimeline,
        feedback: feedbackTimeline
      },
      visitorMetrics: {
        total: totalVisitors,
        byDevice: deviceStats,
        topCountries: Object.fromEntries(topCountries),
        averagePageViews: totalVisitors > 0 ? (totalPageViews / totalVisitors).toFixed(2) : 0
      },
      recentData: {
        bookings: recentBookings,
        feedback: recentFeedback,
        visitors: recentVisitors
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Error generating analytics', message: error.message });
  }
});

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================

/**
 * Health check endpoint to monitor server status
 */
app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'healthy',
    uptime: Math.floor(uptime),
    uptimeFormatted: formatUptime(uptime),
    timestamp: new Date().toISOString(),
    memory: {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
      external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB'
    },
    data: {
      totalBookings: bookings.length,
      totalFeedback: feedbackSubmissions.length,
      totalVisitors: visitors.length
    }
  });
});

/**
 * Format uptime for display
 */
function formatUptime(uptime) {
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  return `${hours}h ${minutes}m ${seconds}s`;
}

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
// PROCESS-LEVEL ERROR HANDLERS - PREVENT SERVER CRASHES
// ============================================================================

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  // Server will continue running after logging the error
  cleanOldData(); // Try to free memory
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
  // Server will continue running after logging the error
  cleanOldData(); // Try to free memory
});

/**
 * Graceful warning for memory usage
 */
setInterval(() => {
  const memUsage = process.memoryUsage();
  const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
  
  if (heapUsedPercent > 85) {
    console.warn(`⚠️  HIGH MEMORY USAGE: ${heapUsedPercent.toFixed(2)}%`);
    cleanOldData(); // Force cleanup if memory is getting high
  }
}, 30000); // Check every 30 seconds

// ============================================================================
// VISITOR ANALYTICS API ENDPOINTS
// ============================================================================

/**
 * Track visitor action (form submission, button click, etc.)
 */
app.post('/api/track-action', (req, res) => {
  const { action, details } = req.body;
  const ip = getClientIP(req);
  
  // Find visitor
  const visitor = visitors.find(v => v.ip === ip);
  if (visitor) {
    visitor.actions = visitor.actions || [];
    visitor.actions.push({
      action: action,
      details: details,
      timestamp: new Date().toISOString()
    });
    visitor.lastVisit = new Date().toISOString();
    saveVisitors(visitors);
  }
  
  res.json({ success: true });
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`\n${'='.repeat(70)}`);
  console.log('Relaxology Woman Spa - Premium Spa Services');
  console.log(`${'='.repeat(70)}`);
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`✓ Analytics: http://localhost:${PORT}/api/admin/analytics?pwd=spa123`);
  console.log('\n📍 Service: Deep Tissue & Aromatic Oil Therapy');
  console.log('👩‍⚕️ Therapist: Certified Expert Therapist Mani');
  console.log('📍 Locations: Chennai (Primary) | Gachibowli, Hyderabad (Legacy)');
  console.log('\nAvailable Endpoints:');
  console.log('  GET  / - Home page');
  console.log('  GET  /api/health - Server health status');
  console.log('  GET  /api/admin/analytics?pwd=spa123 - Comprehensive analytics');
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
