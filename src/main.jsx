import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import './index.css'
import App from './App.jsx'

/**
 * Use the Amplify Hosting–generated amplify_outputs.json as-is.
 *
 * Do NOT pass Auth in libraryOptions (breaks User Pool token provider).
 * Do NOT force allowGuestAccess: true here — that desyncs the client from the
 * Identity Pool’s AllowUnauthenticatedIdentities flag and can leave a guest
 * Cognito Identity ID in localStorage. Authenticated Storage (uploadData) then
 * fails Cognito GetCredentialsForIdentity with:
 *   "Access to Identity 'eu-west-1:…' is forbidden"
 *
 * Guest Storage read follows outputs.auth.unauthenticated_identities_enabled
 * (mapped to allowGuestAccess by parseAmplifyConfig).
 */
Amplify.configure(outputs)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
