/**
 * Relaxology Home Support - Frontend Application
 * Handles form submissions, API interactions, and UI updates
 */

// ============================================================================
// NAVIGATION - SMOOTH SCROLLING & ACTIVE STATE
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
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
    if (!dateString) return;

    const date = new Date(dateString + 'T00:00:00');
    const dayOfWeek = date.getDay();
    const errorElement = document.getElementById('error-preferredDate');

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        errorElement.textContent = 'Only weekend dates (Saturday & Sunday) are available';
        errorElement.style.display = 'block';
    } else {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
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
    const contactNumber = document.getElementById('contactNumber').value;
    const addressArea = document.getElementById('addressArea').value;
    const serviceType = document.getElementById('serviceType').value;
    const preferredDate = document.getElementById('preferredDate').value;
    const preferredTime = document.getElementById('preferredTime').value;

    // Prepare request payload
    const bookingData = {
        clientName: clientName,
        contactNumber: contactNumber,
        addressArea: addressArea,
        serviceType: serviceType,
        preferredDate: preferredDate,
        preferredTime: preferredTime
    };

    try {
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
        const response = await fetch('/api/reviews');
        const reviews = await response.json();

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p class="loading">No reviews yet. Be the first to share your experience!</p>';
            return;
        }

        // Clear loading message
        reviewsContainer.innerHTML = '';

        // Display each review
        reviews.forEach(review => {
            const reviewCard = createReviewCard(review);
            reviewsContainer.appendChild(reviewCard);
        });

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

console.log('%c🌿 Relaxology Home Support', 'font-size: 16px; color: #1a4d3e; font-weight: bold;');
console.log('%cPremium Mobile Spa Services for Women', 'font-size: 12px; color: #d4af37;');
console.log('%cCertified Expert Therapist Mani', 'font-size: 11px; color: #4a9b6f;');
