import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import './index.css'
import App from '@/App'
import { ServiceProvider } from '@/hooks/use-service'
import { configureServices } from '@/services'

const container = configureServices();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ServiceProvider container={container}>
      <App />
    </ServiceProvider>
  </StrictMode>,
)
