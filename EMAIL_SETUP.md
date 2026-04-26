# Email Notification Setup Guide

This guide will help you set up email notifications for appointment bookings and feedback submissions.

## Features

✅ **Automatic Email Notifications** for:
- New appointment bookings
- Feedback/testimonial submissions

✅ **Professional HTML Email Templates** with:
- Booking details and confirmation codes
- Client information
- Service details
- Rating and feedback comments
- Beautiful formatted emails

## Setup Instructions

### Step 1: Install Dependencies

First, make sure Node.js and npm are installed on your system.

```bash
cd d:\Learning\Spa_website
npm install
```

This will install the `nodemailer` package required for email sending.

### Step 2: Gmail Configuration

The system uses Gmail to send emails. You have two options:

#### Option A: Using Gmail App Password (Recommended - More Secure)

1. **Enable 2-Step Verification** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Google will generate a 16-character password
   - Copy this password

3. **Set Environment Variables**:
   - Create a `.env` file in the project root:
   ```
   GMAIL_USER=relaxologyhome@gmail.com
   GMAIL_PASSWORD=your_16_char_app_password_here
   ```

#### Option B: Using Regular Gmail Password

1. **Enable "Less Secure App Access"**:
   - Go to https://myaccount.google.com/lesssecureapps
   - Turn ON "Allow less secure apps"

2. **Set Environment Variables**:
   - Create a `.env` file in the project root:
   ```
   GMAIL_USER=relaxologyhome@gmail.com
   GMAIL_PASSWORD=your_gmail_password
   ```

### Step 3: Start the Server

```bash
npm start
```

### Step 4: Test the Email Setup

When the server starts, you should see:
```
✓ Email service configured and ready
```

If there's an issue, you'll see:
```
⚠️  Email configuration issue: [error details]
```

## Email Notifications in Action

### When Someone Books an Appointment:
1. User fills out booking form on the website
2. Server sends a professional email to `relaxologyhome@gmail.com`
3. Email includes:
   - Confirmation code
   - Client name, gender, contact number
   - Address area
   - Service type, date, and time
   - Status (Pending)
   - Next steps reminder

### When Someone Submits Feedback:
1. User submits feedback/testimonial on website
2. Server sends a professional email to `relaxologyhome@gmail.com`
3. Email includes:
   - Client name and location
   - Star rating (with visual stars)
   - Full feedback comment
   - Feedback ID
   - Submission date and time

## Troubleshooting

### Email Not Sending?

**Check Server Logs:**
- Look for "✗ Error sending booking email:" or "✗ Error sending feedback email:"
- The error message will tell you what went wrong

**Common Issues:**

1. **"Invalid login"**
   - Gmail credentials are incorrect
   - Check `.env` file for typos
   - If using App Password, make sure it's the 16-character one without spaces

2. **"Less Secure Apps is off"**
   - Enable it at: https://myaccount.google.com/lesssecureapps
   - OR use App Password method instead

3. **"2-Step Verification not enabled"**
   - Required for App Passwords
   - Enable at: https://myaccount.google.com/security

4. **Emails go to Spam?**
   - Check your Gmail spam folder
   - Mark emails as "Not Spam"
   - Add the sender to contacts to improve delivery

### Email Service Disabled?

If email isn't configured, the website still works fine - bookings and feedback are processed normally. Emails are optional. To enable them, just complete the setup above.

## Production Deployment

For production, consider:

1. **Use Environment Variables**: Store credentials securely (never commit to git)
2. **Use a Dedicated Email Service**: Consider services like:
   - SendGrid
   - Mailgun
   - AWS SES
3. **Add Email Logging**: Track which emails were sent
4. **Implement Retry Logic**: Retry failed emails automatically

## Email Template Customization

To customize email templates, edit the `sendBookingEmail()` and `sendFeedbackEmail()` functions in [server.js](server.js#L183-L320).

You can modify:
- Colors and styling
- Text content
- HTML layout
- Table formatting

## API Endpoints

- `POST /api/book-appointment` → Triggers booking email
- `POST /api/submit-feedback` → Triggers feedback email
- `GET /api/health` → Server status (no email)

## Questions?

Refer to [Nodemailer Documentation](https://nodemailer.com/) for advanced configuration options.

---

**Last Updated:** April 26, 2026
