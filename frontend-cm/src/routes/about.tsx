import { createProtectedRoute } from '@/auth/auth'

export const Route = createProtectedRoute('/about')({
  component: About,
})

function About() {
  return <div>Wow another route 🤔</div>
}
