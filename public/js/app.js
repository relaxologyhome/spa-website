/**
 * Relaxology Woman Spa - Frontend Application
 * Handles form submissions, API interactions, and UI updates
 */

// ============================================================================
// SERVER HEALTH MONITORING - PREVENT INACTIVITY
// ============================================================================

/**
 * Track visitor action (form submissions, interactions, etc.)
 */
async function trackAction(action, details = {}) {
    try {
        await fetch('/api/track-action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, details })
        });
    } catch (error) {
        console.log('Action tracking (non-critical):', error.message);
    }
}

/**
 * Monitor server health and keep it active
 */
function startServerHealthMonitoring() {
    // Check server health every 2 minutes
    setInterval(async () => {
        try {
            const response = await fetch('/api/health', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✓ Server Health: Active -', data.status, '| Uptime:', data.uptimeFormatted);
            } else {
                console.warn('⚠️  Server returned status:', response.status);
            }
        } catch (error) {
            console.error('❌ Server health check failed:', error);
        }
    }, 2 * 60 * 1000); // Every 2 minutes
}

// ============================================================================
// NAVIGATION - SMOOTH SCROLLING & ACTIVE STATE
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Start server health monitoring
    startServerHealthMonitoring();

    // Set up navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // Load reviews on page load
    loadReviews();

    // Set minimum date to today and restrict to weekends
    setMinDate();
});

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================================================
// DATE & TIME VALIDATION
// ============================================================================

function setMinDate() {
    const dateInput = document.getElementById('preferredDate');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    dateInput.setAttribute('min', `${year}-${month}-${day}`);

    // Add event listener to validate weekend
    dateInput.addEventListener('change', function() {
        validateWeekendDate(this.value);
    });
}

function validateWeekendDate(dateString) {
  // Date validation is optional now
  // Users can book any day of the week
  return true;
}

// ============================================================================
// CAROUSEL FUNCTIONALITY
// ============================================================================

let currentCarouselIndex = 0;
let totalReviews = 0;

/**
 * Initialize carousel controls
 */
function initializeCarousel() {
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showPrevTestimonial();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showNextTestimonial();
        });
    }
}

/**
 * Show next testimonial
 */
function showNextTestimonial() {
    if (totalReviews === 0) return;
    currentCarouselIndex = (currentCarouselIndex + 1) % totalReviews;
    updateCarousel();
}

/**
 * Show previous testimonial
 */
function showPrevTestimonial() {
    if (totalReviews === 0) return;
    currentCarouselIndex = (currentCarouselIndex - 1 + totalReviews) % totalReviews;
    updateCarousel();
}

/**
 * Update carousel display and dots
 */
function updateCarousel() {
    const cards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.carousel-dot');

    // Update cards
    cards.forEach((card, index) => {
        if (index === currentCarouselIndex) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    // Update dots
    dots.forEach((dot, index) => {
        if (index === currentCarouselIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/**
 * Create carousel dots
 */
function createCarouselDots() {
    const dotsContainer = document.getElementById('carouselDots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalReviews; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentCarouselIndex = i;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    }
}

// ============================================================================
// APPOINTMENT BOOKING FORM
// ============================================================================

/**
 * Handle appointment booking form submission
 */
async function handleBookingSubmit(event) {
    event.preventDefault();

    // Clear previous messages
    clearMessage('booking-message');

    // Collect form data
    const clientName = document.getElementById('clientName').value;
    const genderRadio = document.querySelector('input[name="gender"]:checked');
    if (!genderRadio) {
        showMessage('booking-message', '✗ Please select a gender', 'error');
        return;
    }
    const gender = genderRadio.value;
    const contactNumber = document.getElementById('contactNumber').value;
    const addressArea = document.getElementById('addressArea').value;
    const serviceType = document.getElementById('serviceType').value;
    const preferredDate = document.getElementById('preferredDate').value;
    const preferredTime = document.getElementById('preferredTime').value;

    // Prepare request payload
    const bookingData = {
        clientName: clientName,
        gender: gender,
        contactNumber: contactNumber,
        addressArea: addressArea,
        serviceType: serviceType,
        preferredDate: preferredDate,
        preferredTime: preferredTime
    };

    try {
        // Track this action
        trackAction('booking_submitted', {
            serviceType: serviceType,
            date: preferredDate
        });

        // Send booking request to server
        const response = await fetch('/api/book-appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Success handling
            showMessage('booking-message', 
                `✓ ${result.message}\n\nConfirmation Code: ${result.confirmationCode}\n${result.nextSteps}`, 
                'success');
            
            // Reset form
            document.getElementById('booking-form').reset();

            // Scroll to message
            setTimeout(() => {
                document.getElementById('booking-message').scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            // Error handling
            const errorText = result.errors ? result.errors.join('\n') : result.message;
            showMessage('booking-message', `✗ Booking Error:\n${errorText}`, 'error');
        }
    } catch (error) {
        console.error('Booking error:', error);
        showMessage('booking-message', 
            `✗ An error occurred while processing your booking. Please try again.`, 
            'error');
    }
}

// ============================================================================
// FEEDBACK SUBMISSION FORM
// ============================================================================

/**
 * Handle feedback form submission
 */
async function handleFeedbackSubmit(event) {
    event.preventDefault();

    // Clear previous messages
    clearMessage('feedback-message');

    // Collect form data
    const clientName = document.getElementById('feedbackName').value;
    const location = document.getElementById('feedbackLocation').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const comment = document.getElementById('feedbackComment').value;

    // Prepare request payload
    const feedbackData = {
        clientName: clientName,
        location: location,
        rating: parseInt(rating),
        comment: comment
    };

    try {
        // Track this action
        trackAction('feedback_submitted', {
            rating: parseInt(rating),
            commentLength: comment.length
        });

        // Send feedback to server
        const response = await fetch('/api/submit-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Success handling
            showMessage('feedback-message', 
                `✓ ${result.message}`, 
                'success');
            
            // Reset form
            document.getElementById('feedback-form').reset();

            // Scroll to message
            setTimeout(() => {
                document.getElementById('feedback-message').scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            // Error handling
            const errorText = result.errors ? result.errors.join('\n') : result.message;
            showMessage('feedback-message', `✗ Error:\n${errorText}`, 'error');
        }
    } catch (error) {
        console.error('Feedback error:', error);
        showMessage('feedback-message', 
            `✗ An error occurred while submitting your feedback. Please try again.`, 
            'error');
    }
}

// ============================================================================
// CHARACTER COUNT FOR FEEDBACK
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    const feedbackComment = document.getElementById('feedbackComment');
    if (feedbackComment) {
        feedbackComment.addEventListener('input', function() {
            const charCount = this.value.length;
            const charCountDisplay = this.parentElement.querySelector('.char-count');
            charCountDisplay.textContent = `${charCount}/500`;
        });
    }
});

// ============================================================================
// REVIEWS LOADING
// ============================================================================

/**
 * Load reviews from API and display them
 */
async function loadReviews() {
    const reviewsContainer = document.getElementById('reviews-container');

    try {
        console.log('Fetching reviews from /api/reviews...');
        const response = await fetch('/api/reviews');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reviews = await response.json();
        console.log('Reviews received:', reviews);

        if (!reviews || reviews.length === 0) {
            reviewsContainer.innerHTML = '<p class="loading">No reviews yet. Be the first to share your experience!</p>';
            return;
        }

        // Clear loading message
        reviewsContainer.innerHTML = '';

        // Set total reviews for carousel
        totalReviews = reviews.length;

        // Display each review
        reviews.forEach((review, index) => {
            const reviewCard = createReviewCard(review);
            if (index === 0) {
                reviewCard.classList.add('active');
            }
            reviewsContainer.appendChild(reviewCard);
        });

        // Initialize carousel controls
        initializeCarousel();
        createCarouselDots();

        console.log('Reviews displayed successfully in carousel format');

    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsContainer.innerHTML = '<p class="loading">Unable to load reviews at this time.</p>';
    }
}

/**
 * Create a review card element
 */
function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';

    const stars = '⭐'.repeat(review.rating);
    const date = new Date(review.date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    card.innerHTML = `
        <div class="review-rating">${stars}</div>
        <p class="review-comment">"${review.comment}"</p>
        <div class="review-author">— ${review.clientName}</div>
        <div class="review-location">${review.location} • ${date}</div>
    `;

    return card;
}

// ============================================================================
// MESSAGE DISPLAY HELPERS
// ============================================================================

/**
 * Show success or error message
 */
function showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = message;
    messageElement.className = `${elementId.split('-')[0]}-message show ${type}`;
}

/**
 * Clear message display
 */
function clearMessage(elementId) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = '';
    messageElement.className = `${elementId.split('-')[0]}-message`;
}

// ============================================================================
// FORM VALIDATION HELPERS
// ============================================================================

/**
 * Validate contact number format
 */
document.addEventListener('DOMContentLoaded', function() {
    const contactInput = document.getElementById('contactNumber');
    if (contactInput) {
        contactInput.addEventListener('blur', function() {
            const number = this.value.replace(/\D/g, '');
            if (number.length > 0 && number.length !== 10) {
                document.getElementById('error-contactNumber').textContent = 
                    'Please enter a valid 10-digit WhatsApp number';
            } else if (number.length === 10) {
                document.getElementById('error-contactNumber').textContent = '';
            }
        });
    }
});

// ============================================================================
// PAGE LOAD ANIMATIONS
// ============================================================================

/**
 * Fade in elements on scroll
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-in-out';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => observer.observe(section));
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================================================
// ACCESSIBILITY IMPROVEMENTS
// ============================================================================

/**
 * Improve keyboard navigation
 */
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.click();
            }
        });
    });
});

console.log('%c🌿 Relaxology Woman Spa', 'font-size: 16px; color: #d81b60; font-weight: bold;');
console.log('%cPremium Mobile Spa Services for Women', 'font-size: 12px; color: #d4af37;');
console.log('%cCertified Expert Therapist Mani', 'font-size: 11px; color: #4a9b6f;');
