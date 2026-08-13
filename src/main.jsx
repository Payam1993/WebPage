import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import './index.css'
import App from './App.jsx'

// Guest Identity Pool credentials are required for public Storage getUrl()
// on website-images/* (and room-pictures/*). Without allowGuestAccess, Amplify
// throws "No current user" for unauthenticated visitors and images stay blank.
Amplify.configure(outputs, {
  Auth: {
    Cognito: {
      allowGuestAccess: true,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
