import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './yourvoice/App'
import './yourvoice/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
