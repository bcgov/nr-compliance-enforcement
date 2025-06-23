import { useQuery } from '@tanstack/react-query'
import { Table, Row, Col, Button } from 'react-bootstrap'
import { Link } from '@tanstack/react-router'
import { Person, fetchPersons } from '@/graphql/queries/person'

const PersonList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['persons'],
    queryFn: () => fetchPersons(),
  })

  if (isLoading) return <div>Loading users...</div>
  if (error) {
    console.log(error.message)
    return <div>Error loading users</div>
  }

  return (
    <>
      <Row>
        <Col md={10} className="">
          <h2>Persons</h2>
        </Col>
        <Col md={2}>
          <Link to="/persons/create">
            <Button variant="primary" size="sm" className="float-end">
              Add Person
            </Button>
          </Link>
        </Col>
      </Row>
      <Row className="m-0 mt-3">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((user: Person) => (
              <tr key={user.firstName + user.lastName}>
                <td>
                  <Link
                    to="/persons/$id"
                    params={{ id: user.personGuid }}
                  >{`${user.firstName} ${user.lastName}`}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </>
  )
}

export default PersonList
