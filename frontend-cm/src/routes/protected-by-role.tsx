import { createProtectedRoute } from '@/auth/auth'

export const Route = createProtectedRoute('/protected-by-role', ['COS'])({
  component: ProtectedByRolePage,
})

function ProtectedByRolePage() {
  return <div>You have a valid role! 🤩</div>
}
