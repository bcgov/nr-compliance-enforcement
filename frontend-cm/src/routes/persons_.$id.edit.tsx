import { Link } from '@tanstack/react-router'
import { createProtectedRoute } from '@/auth/auth'

export const Route = createProtectedRoute('/persons_/$id/edit')({
  component: EditPerson,
})

function EditPerson() {
  const { id } = Route.useParams()
  return (
    <div>
      <h5>Editing person {id}</h5>
      <Link to="..">Go back</Link>
    </div>
  )
}
