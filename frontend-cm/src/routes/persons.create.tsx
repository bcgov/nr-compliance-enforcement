import { createProtectedRoute } from '@/auth/auth'
import PersonForm from '@/components/Person/PersonForm'

export const Route = createProtectedRoute('/persons/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PersonForm />
}
