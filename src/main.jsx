import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'

// Clear old stale cached sessions that pre-date the new local-auth system
// (identified by having no 'users' array in the stored auth state)
try {
  const raw = localStorage.getItem('medivision-auth');
  if (raw) {
    const parsed = JSON.parse(raw);
    // Old format had no 'users' array — wipe it so the new store initialises cleanly
    if (!Array.isArray(parsed?.state?.users)) {
      localStorage.removeItem('medivision-auth');
    }
  }
} catch (_) {
  localStorage.removeItem('medivision-auth');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
