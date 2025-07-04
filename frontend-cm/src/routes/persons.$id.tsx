import { Link } from '@tanstack/react-router'
import { createProtectedRoute } from '@/auth/auth'
import PersonDetails from '@/components/Person/PersonDetails'

export const Route = createProtectedRoute('/persons/$id')({
  component: ViewPerson,
})

function ViewPerson() {
  const { id } = Route.useParams()
  return (
    <div>
      <PersonDetails id={id} />
    </div>
  )
}
