import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './authContext.jsx'
import ProjectRoutes from './routes.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,

  <AuthProvider>
    <Router>

    <ProjectRoutes/>
    </Router>
  </AuthProvider>
)
