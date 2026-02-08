import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './theme-system.css'
import './index.css'
// Ensure page-specific theme CSS is loaded globally so lazy routes render styled
import './LandingPageFiles/landing-theme.css'
import './InterviewModule/interview-clone-theme.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
