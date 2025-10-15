import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import WorkingApp from './WorkingApp.tsx'
// import TestEnhancedApp from './TestEnhancedApp.tsx'
// import SimpleApp from './SimpleApp.tsx'
// import EnhancedApp from './EnhancedApp.tsx'
import './styles/tailwind.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
