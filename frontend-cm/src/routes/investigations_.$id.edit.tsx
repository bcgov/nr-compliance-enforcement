import { Link } from '@tanstack/react-router'
import { createProtectedRoute } from '@/auth/auth'

export const Route = createProtectedRoute('/investigations_/$id/edit')({
  component: EditInvestigation,
})

function EditInvestigation() {
  const { id } = Route.useParams()
  return (
    <div>
      <h5>Editing investigation {id}</h5>
      <Link to="..">Go back</Link>
    </div>
  )
}
