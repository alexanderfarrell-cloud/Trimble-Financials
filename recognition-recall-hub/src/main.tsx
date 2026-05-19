import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { setAssetPath } from '@trimble-oss/moduswebcomponents-react'
import './index.css'
import App from './App.tsx'

setAssetPath(window.location.origin + import.meta.env.BASE_URL)

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>
)
