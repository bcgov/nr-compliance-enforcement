import { Link } from '@tanstack/react-router'
import { createProtectedRoute } from '@/auth/auth'

export const Route = createProtectedRoute('/investigations/$id')({
  component: ViewInvestigation,
})

function ViewInvestigation() {
  const { id } = Route.useParams()
  return (
    <div>
      <h5>Viewing investigation {id}</h5>
      <Link from={Route.fullPath} to="./edit">
        Edit Investigation
      </Link>
      <br />
      <Link to="..">Go back</Link>
    </div>
  )
}
