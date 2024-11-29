import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { HelmetProvider } from 'react-helmet-async'
import Router from './routes/Router'

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <ChakraProvider>
      <StrictMode>
        <Router />
      </StrictMode>
    </ChakraProvider>
  </HelmetProvider>
)