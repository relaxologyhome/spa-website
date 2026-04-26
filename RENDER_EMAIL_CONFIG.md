# Email Configuration on Render - Complete Guide

Step-by-step guide to configure email notifications on Render.

---

## Overview

Your app uses **Gmail + Nodemailer** to send emails when:
- Someone books an appointment
- Someone submits feedback

Render needs two environment variables:
- `GMAIL_USER` - Email address
- `GMAIL_PASSWORD` - App Password (not your regular password)

---

## Step 1: Get Gmail App Password

This is the most important step. You CANNOT use your regular Gmail password.

### 1.1 Go to Google Account Settings

Open in browser:
```
https://myaccount.google.com/security
```

### 1.2 Enable 2-Step Verification (if not already done)

1. Click "2-Step Verification"
2. Follow Google's setup process
3. Verify your phone number
4. Confirm

### 1.3 Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select:
   - **Application**: Mail
   - **Device**: Windows Computer
3. Click "Generate"
4. Google creates a 16-character password
5. **COPY THIS PASSWORD** (example format: `xxxx xxxx xxxx xxxx`)

✅ **You now have the 16-character App Password**

---

## Step 2: Set Environment Variables in Render

### 2.1 Go to Render Dashboard

1. Open https://render.com
2. Login with GitHub
3. Click your "spa-website" service

### 2.2 Open Environment Tab

In service page:
1. Click "Environment" tab (in top menu)
2. You'll see "Add Environment Variable" button

### 2.3 Add GMAIL_USER

Click "Add Environment Variable"

Fill in:
- **Key**: `GMAIL_USER`
- **Value**: `relaxologyhome@gmail.com`

Click "Add" or "Save"

### 2.4 Add GMAIL_PASSWORD

Click "Add Environment Variable" again

Fill in:
- **Key**: `GMAIL_PASSWORD`
- **Value**: `xxxx_xxxx_xxxx_xxxx` (Your 16-char password, **remove spaces**)

⚠️ **IMPORTANT**: Remove spaces from the password. If Google gave you `xxxx xxxx xxxx xxxx`, remove spaces to make it `xxxx_xxxx_xxxx_xxxx` or just `xxxxxxxxxxxxxxxx`

Click "Add" or "Save"

### 2.5 Optional: Add NODE_ENV

For production:

- **Key**: `NODE_ENV`
- **Value**: `production`

### 2.6 Save All Variables

1. Click "Save" button if available
2. Render will restart your service automatically

⏳ **Wait 1-2 minutes for restart**

---

## Step 3: Verify Email Configuration

### 3.1 Check Render Logs

After restart, Render logs should show:

```
✓ Email service configured and ready
```

### 3.2 Access Render Logs

1. Dashboard → Your service
2. Click "Logs" tab
3. Scroll down to see startup messages
4. Look for email configuration line

### 3.3 If Logs Show Error

If you see:
```
⚠️  Email configuration issue: Invalid login
```

**Check:**
1. GMAIL_PASSWORD is correct (16 characters)
2. No spaces in password
3. 2-Step Verification is enabled on Gmail
4. Password was generated from app passwords page

---

## Step 4: Test Email Configuration

### 4.1 Open PowerShell

```powershell
cd d:\Learning\Spa_website
```

### 4.2 Test Booking Email

Replace with your live Render URL:

```powershell
$url = "https://spa-website.onrender.com/api/book-appointment"
$body = @{
    clientName = "Test Email"
    gender = "Female"
    contactNumber = "9876543210"
    addressArea = "Test Area"
    serviceType = "60-Minute Signature Deep Tissue & Oil Therapy"
    preferredDate = "2026-05-15"
    preferredTime = "10:00 AM"
} | ConvertTo-Json

Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json" | ConvertFrom-Json
```

Expected response:
```json
{
  "success": true,
  "message": "Appointment booking received successfully!",
  "confirmationCode": "RHS-..."
}
```

### 4.3 Check Gmail Inbox

1. Open https://gmail.com
2. Login with `relaxologyhome@gmail.com`
3. Check inbox for email with subject:
   ```
   📅 New Appointment Booking - RHS-...
   ```

✅ **If email appears = Email configured correctly!**

### 4.4 Test Feedback Email

```powershell
$url = "https://spa-website.onrender.com/api/submit-feedback"
$body = @{
    clientName = "Test Feedback"
    location = "Test City"
    rating = 5
    comment = "Testing email configuration on Render successfully"
} | ConvertTo-Json

Invoke-WebRequest -Uri $url -Method POST -Body $body -ContentType "application/json" | ConvertFrom-Json
```

Expected response:
```json
{
  "success": true,
  "message": "Thank you for your feedback!"
}
```

### 4.5 Check Gmail for Feedback Email

Look for email with subject:
```
💬 New Feedback/Testimonial - 5⭐ from Test Feedback
```

✅ **If email appears = All working!**

---

## Complete Configuration Checklist

### Gmail Setup
- [ ] Gmail account exists (relaxologyhome@gmail.com)
- [ ] 2-Step Verification enabled
- [ ] App Password generated (16 characters)
- [ ] App Password copied (no spaces)

### Render Configuration
- [ ] GMAIL_USER set to `relaxologyhome@gmail.com`
- [ ] GMAIL_PASSWORD set to app password (no spaces)
- [ ] Variables saved
- [ ] Service restarted

### Testing
- [ ] Render logs show "Email service configured and ready"
- [ ] Test booking sent
- [ ] Booking email received in Gmail
- [ ] Test feedback sent
- [ ] Feedback email received in Gmail

---

## Troubleshooting

### Issue: "Email configuration issue: Invalid login"

**Causes & Solutions:**

1. **Wrong password**
   - Go to https://myaccount.google.com/apppasswords
   - Generate new password
   - Copy exactly (no spaces)
   - Update GMAIL_PASSWORD in Render

2. **2-Step Verification not enabled**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Try again

3. **Spaces in password**
   - If Google gave: `xxxx xxxx xxxx xxxx`
   - Remove all spaces: `xxxxxxxxxxxxxxxx`
   - Update in Render

4. **Gmail account issues**
   - Verify email is `relaxologyhome@gmail.com`
   - Try signing into Gmail directly
   - Check for security alerts

### Issue: Emails not arriving

**Check:**
1. Gmail inbox (not spam folder)
2. Render logs for errors
3. Email address spelled correctly
4. GMAIL_PASSWORD not expired (regenerate if needed)

**Solution:**
```
1. Check Render logs for email errors
2. Verify GMAIL_PASSWORD in Environment Variables
3. Regenerate App Password if old
4. Update in Render
5. Test again
```

### Issue: 502 Error After Adding Variables

- This is normal - Render is restarting
- Wait 1-2 minutes
- Service auto-restarts
- Should work after restart

### Issue: Still Getting Errors?

Check Render logs for exact error:

1. Dashboard → Your service
2. Logs tab
3. Search for "Error"
4. Note the exact message

Common messages:
- `Invalid login` → Wrong password
- `Less Secure Apps is off` → This shouldn't happen with App Password
- `2-Step verification required` → Enable 2-Step

---

## Email Configuration Summary

### What Render Knows
- Email sender: `relaxologyhome@gmail.com`
- Email password: Your app password
- Email service: Gmail SMTP

### What Happens on Events
1. **Booking**: Server sends formatted email to admin
2. **Feedback**: Server sends formatted email to admin
3. **Errors**: Server logs to Render console

### Email Templates
- Booking email: Includes confirmation code, client details, service info
- Feedback email: Includes rating, comment, client info

### All Configured & Ready
Once emails arrive in Gmail inbox, everything is working!

---

## Additional Notes

### For Production
- Use the paid Render plan (more reliable)
- Consider SendGrid or Mailgun for higher volume
- Add email retry logic
- Monitor email delivery

### Security
- Never commit `.env` file
- Only use App Passwords (not main password)
- Environment variables are encrypted in Render
- Use separate email for admin

### Monitoring
Check Render logs weekly:
- Look for email errors
- Monitor uptime
- Check memory usage

---

## Quick Reference

| Setting | Value |
|---------|-------|
| **Email Service** | Gmail (SMTP) |
| **Sender Email** | relaxologyhome@gmail.com |
| **Environment Var 1** | GMAIL_USER |
| **Environment Var 2** | GMAIL_PASSWORD |
| **Password Type** | App Password (16 chars) |
| **2-Step Required** | Yes |

---

## Next Steps

1. ✅ Get Gmail App Password
2. ✅ Add to Render Environment Variables
3. ✅ Wait for service restart
4. ✅ Test booking email
5. ✅ Test feedback email
6. ✅ Verify emails in Gmail

**All done!** Your email notifications are now configured on Render.

---

## Need Help?

- **Gmail Issues**: https://support.google.com/accounts
- **Render Issues**: https://render.com/docs
- **Email Not Working**: Check Render logs first
- **Questions**: Refer to [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

---

**Last Updated**: April 26, 2026
**Status**: Email configuration guide for Render
