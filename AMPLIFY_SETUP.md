# AWS Amplify Gen 2 Setup Guide

## Overview

This project uses AWS Amplify Gen 2 for backend services, specifically for staff authentication.

## Files Added/Modified

### New Files:
- `amplify/backend.ts` - Main backend definition
- `amplify/auth/resource.ts` - Email-based authentication configuration
- `amplify/tsconfig.json` - TypeScript configuration for Amplify
- `amplify/package.json` - Package configuration for Amplify
- `amplify_outputs.json` - Amplify configuration output (placeholder, will be generated on deploy)

### Modified Files:
- `src/main.jsx` - Configured Amplify at app initialization
- `src/components/StaffLogin.jsx` - Replaced custom form with Amplify Authenticator
- `src/components/StaffLogin.css` - Added Amplify UI styling overrides

### Installed Packages:
- `aws-amplify` - Core Amplify library
- `@aws-amplify/ui-react` - React UI components including Authenticator
- `@aws-amplify/backend` - Backend definition utilities
- `@aws-amplify/backend-cli` - CLI tools for backend management

## Commands

### Prerequisites
1. Install AWS CLI and configure credentials:
   ```bash
   aws configure
   ```

2. Install Amplify CLI globally (if not installed):
   ```bash
   npm install -g @aws-amplify/backend-cli
   ```

### Initialize Amplify Gen 2 (already done)
```bash
npx ampx sandbox
```

### Deploy Backend to AWS
```bash
# For sandbox/development
npx ampx sandbox

# For production deployment
npx ampx pipeline-deploy --branch main
```

### Run Locally
```bash
# Start Amplify sandbox (in one terminal)
npx ampx sandbox

# Start Vite dev server (in another terminal)
npm run dev
```

### Generate Amplify Outputs
After deploying, the `amplify_outputs.json` file will be automatically generated with your AWS resource IDs.

## Amplify Hosting Build Settings

If deploying to Amplify Hosting, use these build settings in `amplify.yml`:

```yaml
version: 1
backend:
  phases:
    build:
      commands:
        - npm ci --cache .npm --prefer-offline
        - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - .npm/**/*
      - node_modules/**/*
```

## Authentication Features

The Staff Login page (`/staff-login`) now uses AWS Cognito for authentication:

- **Email-based login** - Staff sign in with email and password
- **Password recovery** - Built-in forgot password flow
- **Secure sessions** - JWT tokens managed by Amplify
- **Dashboard** - After login, staff see a dashboard with booking stats

## Important Notes

1. **amplify_outputs.json** - This file is generated after deployment and contains sensitive configuration. It's included in `.gitignore` for security but needs to be available during build.

2. **Sign-up disabled** - New user registration is disabled (`hideSignUp={true}`). Staff accounts should be created by administrators through the AWS Cognito console.

3. **Public website** - The main website (services, booking, etc.) remains public. Only the Staff Portal requires authentication.

## Troubleshooting

### "amplify_outputs.json not found"
Run `npx ampx sandbox` to generate the file, or for CI/CD, ensure the backend is deployed before the frontend build.

### Build fails in Amplify Hosting
1. Ensure backend and frontend build phases are correctly ordered
2. Check that AWS credentials are configured in the Amplify console
3. Verify the `amplify.yml` file is in the repository root

### Authentication not working
1. Check browser console for errors
2. Verify `amplify_outputs.json` has correct values (not placeholders)
3. Ensure Cognito User Pool is properly configured in AWS

