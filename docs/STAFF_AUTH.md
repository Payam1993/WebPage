# Staff Authentication & Admin Area Guide

This document explains how to manage staff authentication and the admin area for the Confession Barcelona website using AWS Amplify Gen 2 and Amazon Cognito.

## Overview

The staff authentication system protects the `/staff/*` routes while keeping the public website accessible to everyone. Staff members must sign in through `/staff-login` to access the admin dashboard.

## Route Structure

### Public Routes (No Authentication Required)
- `/` - Home page
- `/service/:serviceId` - Service details
- `/staff-login` - Staff login page
- `/work-with-us` - Work with us page
- `/our-team` - Team page

### Protected Staff Routes (Authentication Required)
- `/staff` - Redirects to `/staff/reports`
- `/staff/reports` - Reports & analytics dashboard
- `/staff/costs` - Costs management
- `/staff/reservations` - Reservation management
- `/staff/calendar` - Calendar view
- `/staff/profile` - Profile settings

## Authentication Flow

1. **User navigates to any `/staff/*` route**
2. **ProtectedRoute checks authentication** via `getCurrentUser()`
3. **If not authenticated** → Redirect to `/staff-login`
4. **User enters email/password** on login form
5. **On successful sign-in** → Navigate to `/staff/reports`
6. **If NEW_PASSWORD_REQUIRED** → Show new password form, then complete sign-in
7. **Sign out** → Clears session, redirects to `/staff-login`

## Admin Area Features

### Modern Sidebar Layout
- **Logo area** at top with collapsible toggle
- **Main navigation** with icons:
  - Reports
  - Costs Management
  - Reservations
  - Calendar
- **Bottom section** with:
  - Profile Settings
  - User info display
  - Log out button

### Page Features
- **Reports**: Overview stats, recent bookings, period filters
- **Costs Management**: Expense tracking, category breakdown, add/edit forms
- **Reservations**: Booking list, status filters, search functionality
- **Calendar**: Day/week/month views, event display
- **Profile Settings**: User info, security settings, preferences placeholder

## First-Time Login (NEW_PASSWORD_REQUIRED)

When an admin creates a user in Cognito, the user must set a new password on first login:

1. User enters temporary password from admin
2. System detects `CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED` challenge
3. New password form is displayed with requirements checklist:
   - At least 8 characters
   - One uppercase letter
   - One lowercase letter
   - One number
   - One special character
4. User submits new password
5. `confirmSignIn()` completes the authentication
6. User is redirected to the admin dashboard

## Managing Staff Users

### Creating Staff Users in AWS Cognito Console

1. **Access the AWS Console**
   - Go to [AWS Console](https://console.aws.amazon.com/)
   - Navigate to **Amazon Cognito** service

2. **Select Your User Pool**
   - Find the User Pool created by Amplify (check `amplify_outputs.json` for the pool ID)
   - Click on the User Pool name to open it

3. **Create a New User**
   - Go to **Users** tab in the left sidebar
   - Click **Create user** button
   - Fill in the required fields:
     - **User name**: Use the staff member's email address
     - **Email address**: Staff member's email
     - **Temporary password**: Set an initial password
     - **Email verified**: Check this box
   - Click **Create user**

4. **First Login**
   - The staff member logs in with their email and temporary password
   - They will be prompted to set a new password (handled in the app)

### Creating a Staff Group (Optional)

1. In your User Pool, go to **Groups** tab
2. Click **Create group**
3. Set **Group name**: `staff`
4. Click **Create group**
5. Add users to the group as needed

### Using AWS CLI (Alternative)

```bash
# Create a new user
aws cognito-idp admin-create-user \
  --user-pool-id YOUR_USER_POOL_ID \
  --username staff@example.com \
  --user-attributes Name=email,Value=staff@example.com Name=email_verified,Value=true \
  --temporary-password "TempPass123!" \
  --message-action SUPPRESS

# Set permanent password (skip force change password)
aws cognito-idp admin-set-user-password \
  --user-pool-id YOUR_USER_POOL_ID \
  --username staff@example.com \
  --password "PermanentPass123!" \
  --permanent
```

## Security Notes

### Public Signup is Disabled

For staff-only access, public signup should remain disabled. This is controlled in the Amplify auth configuration.

### Password Requirements

Default Cognito password policy requires:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Session Management

- Sessions are managed by Amplify/Cognito automatically
- Tokens are stored securely in browser storage
- Sign out clears all session data

## Troubleshooting

### "User not found" Error
- Verify the user exists in Cognito console
- Check that email is used as the username

### "Invalid email or password" Error
- Verify the password is correct
- Check if the user is in CONFIRMED status

### "Password does not meet requirements" Error
- Ensure password has uppercase, lowercase, number, and special character
- Minimum 8 characters required

### User Stuck in FORCE_CHANGE_PASSWORD
- User should complete the new password flow in the app
- Or use AWS CLI to set a permanent password:
  ```bash
  aws cognito-idp admin-set-user-password \
    --user-pool-id YOUR_POOL_ID \
    --username user@email.com \
    --password "NewPassword123!" \
    --permanent
  ```

## Files Overview

| File | Purpose |
|------|---------|
| `src/components/ProtectedRoute.jsx` | Route guard checking auth status |
| `src/components/StaffLogin.jsx` | Custom login form with Cognito signIn + NEW_PASSWORD_REQUIRED handling |
| `src/pages/staff/AdminLayout.jsx` | Main admin layout with sidebar navigation |
| `src/pages/staff/AdminLayout.css` | Modern sidebar and admin area styles |
| `src/pages/staff/Reports.jsx` | Reports & analytics page |
| `src/pages/staff/CostsManagement.jsx` | Expense tracking page |
| `src/pages/staff/Reservations.jsx` | Booking management page |
| `src/pages/staff/Calendar.jsx` | Calendar view page |
| `src/pages/staff/ProfileSettings.jsx` | User profile settings page |
| `src/App.jsx` | Route configuration with protected routes |

## Environment Files

- `amplify_outputs.json` - Contains Cognito configuration (DO NOT commit to version control)
- This file is already in `.gitignore`

## Related AWS Documentation

- [Amazon Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
- [AWS Amplify Authentication](https://docs.amplify.aws/gen2/build-a-backend/auth/)
- [Managing Users in Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/managing-users.html)
