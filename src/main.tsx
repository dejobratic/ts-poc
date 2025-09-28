import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { configureServices } from '@/services'
import { ServiceProvider } from '@/hooks/use-service'

const container = configureServices();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ServiceProvider container={container}>
      <App />
    </ServiceProvider>
  </StrictMode>,
)
