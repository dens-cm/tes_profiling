import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import Router from './routes/Router'

createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <StrictMode>
      <Router />
    </StrictMode>
  </ChakraProvider>

)