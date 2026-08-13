import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { parseAmplifyConfig } from 'aws-amplify/utils'
import outputs from '../amplify_outputs.json'
import './index.css'
import App from './App.jsx'

/**
 * Configure Amplify from the deployed amplify_outputs.json (existing User Pool).
 *
 * CRITICAL: Do NOT pass `Auth` in Amplify.configure's second argument (libraryOptions).
 * In aws-amplify DefaultAmplify.configure, any `libraryOptions.Auth` takes the early
 * return path and skips wiring cognitoUserPoolsTokenProvider — which surfaces as
 * "Auth UserPool not configured" even though amplify_outputs still has the pool IDs.
 *
 * Guest Storage reads: set allowGuestAccess on ResourcesConfig.Auth.Cognito only
 * (Gen 2 also maps auth.unauthenticated_identities_enabled → allowGuestAccess).
 */
const resourceConfig = parseAmplifyConfig(outputs)

Amplify.configure({
  ...resourceConfig,
  Auth: {
    ...resourceConfig.Auth,
    Cognito: {
      ...resourceConfig.Auth?.Cognito,
      allowGuestAccess: true,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
