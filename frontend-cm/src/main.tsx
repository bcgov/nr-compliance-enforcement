import '@bcgov/bc-sans/css/BC_Sans.css'
import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OidcProvider } from '@/auth/oidc'

// Import bootstrap styles
import '@/scss/styles.scss'

// Import the generated route tree
import { routeTree } from './routeTree.gen'


// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - adjust as needed
    },
  },
})

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <OidcProvider>
          <RouterProvider router={router} />
        </OidcProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
