import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProductProvider } from "./context/ProductContext";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductProvider>
      <App />
    </ProductProvider>
  </StrictMode>,
)
