# Staff Auth Verification Checklist

## Cognito Test User
- In AWS Console → Cognito → User Pools → Users → **Create user**
- Set **Username = email** and **Email verified = true**
- Set a **Temporary password** and share it with the tester

## First Login: New Password Required
- Sign in at `/staff` with the temporary password
- App should show the **Set New Password** form
- Submit a new password that meets policy
- Confirm redirect to `/staff/reports`

## Local Amplify Outputs
- Ensure `amplify_outputs.json` exists in the repo root
- If missing, run `ampx sandbox` (Gen 2) to create it locally
- Keep `amplify_outputs.json` **ignored** (do not commit)

## Local Test Steps
- `npm ci`
- `npm run dev`
- Visit `/staff`
- Sign in → should land on `/staff/reports`
- Navigate sidebar routes: Reports, Costs, Reservations, Calendar, Profile
- Click **Logout** → should sign out and redirect to `/staff`

## Deployed Test Steps
- Deploy (Amplify Hosting or your current pipeline)
- Visit `/staff` on the deployed site
- Sign in → confirm `/staff/reports`
- Validate sidebar navigation and logout behavior
