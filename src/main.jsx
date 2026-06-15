import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'

// Clear any stale cached auth so old demo sessions (e.g. "Rahul Kumar") don't persist
// across page reloads. Users must re-authenticate on each session.
const stored = localStorage.getItem('medivision-auth');
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    // Only clear if this is an old demo user (no real email domain)
    const email = parsed?.state?.user?.email || '';
    if (email.includes('demo@medivision.ai') || email.includes('rahul@medivision.ai')) {
      localStorage.removeItem('medivision-auth');
    }
  } catch (_) {
    localStorage.removeItem('medivision-auth');
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
