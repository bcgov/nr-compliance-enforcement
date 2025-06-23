import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import {
  fetchPerson,
  updatePerson,
  deletePerson,
  Person,
  PersonInput,
} from '@/graphql/queries/person'
import { Button, Card, Form } from 'react-bootstrap'
import { useNavigate } from '@tanstack/react-router'

interface PersonDetailsProps {
  id: string // personGuid
}

const PersonDetails = ({ id }: PersonDetailsProps) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Fetch person data
  const { data, isLoading, error } = useQuery<Person, Error>({
    queryKey: ['person', id],
    queryFn: () => fetchPerson(id),
  })

  // Form setup with fetched data as default values
  const form = useForm({
    defaultValues: {
      firstName: data?.firstName ?? '',
      middleName: data?.middleName ?? '',
      middleName2: data?.middleName2 ?? '',
      lastName: data?.lastName ?? '',
      contactMethodValue: data?.contactMethods?.[0]?.value ?? '',
      contactMethodType: data?.contactMethods?.[0]?.typeDescription ?? '',
    },
    validators: {
      onChange: z.object({
        firstName: z
          .string()
          .min(1, 'First Name is required')
          .min(3, 'First Name must be at least 3 characters'),
        middleName: z.string(),
        middleName2: z.string(),
        lastName: z.string().min(1, 'Last Name is required'),
        contactMethodValue: z.string(),
        contactMethodType: z.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      const input: PersonInput = {
        firstName: value.firstName,
        // middleName: value.middleName || undefined,
        // middleName2: value.middleName2 || undefined,
        lastName: value.lastName,
        // contactMethods: value.contactMethodValue
        //   ? [
        //       {
        //         typeCode: data?.contactMethods?.[0].typeCode ?? 'PRIMPHONE',
        //         value: value.contactMethodValue,
        //       },
        //     ]
        //   : undefined,
      }
      updateMutation.mutate({ personGuid: id, input })
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      personGuid,
      input,
    }: {
      personGuid: string
      input: PersonInput
    }) => updatePerson(personGuid, input),
    onSuccess: (updatedPerson) => {
      queryClient.setQueryData(['person', id], updatedPerson)
      queryClient.invalidateQueries({ queryKey: ['persons'] }) // Update list if exists
      alert('Person updated successfully!')
    },
    onError: (error) => {
      console.error('Update error:', error)
      alert(`Failed to update person: ${error.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (personGuid: string) => deletePerson(personGuid),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['person', id] }) // Remove from cache
      queryClient.invalidateQueries({ queryKey: ['persons'] }) // Refresh list
      alert('Person deleted successfully!')
      navigate({ to: '/persons' }) // Redirect to persons list (adjust route as needed)
    },
    onError: (error) => {
      console.error('Delete error:', error)
      alert(`Failed to delete person: ${error.message}`)
    },
  })

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete ${data?.firstName} ${data?.lastName}?`,
      )
    ) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) return <div>Loading person details...</div>
  if (error) {
    console.error('Error fetching person:', error.message)
    return <div>Error loading person details: {error.message}</div>
  }
  if (!data) return <div>No person found with ID: {id}</div>

  return (
    <div>
      <h2 style={{ marginBottom: '10px' }}>Person Details</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <Card>
          <Card.Header>Contact information</Card.Header>
          <Card.Body
            style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}
          >
            <div>
              <form.Field name="firstName">
                {(field) => (
                  <>
                    <Form.Label htmlFor={field.name}>First name</Form.Label>
                    <Form.Control
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <span style={{ color: 'red' }}>
                        {field.state.meta.errors.join(', ')}
                      </span>
                    )}
                  </>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name="middleName">
                {(field) => (
                  <>
                    <Form.Label htmlFor={field.name}>Middle name</Form.Label>
                    <Form.Control
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name="middleName2">
                {(field) => (
                  <>
                    <Form.Label htmlFor={field.name}>Middle name 2</Form.Label>
                    <Form.Control
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </>
                )}
              </form.Field>
            </div>

            <div>
              {/* <label htmlFor="lastName">Last Name</label> */}
              <form.Field name="lastName">
                {(field) => (
                  <>
                    <Form.Label htmlFor={field.name}>Last name</Form.Label>
                    <Form.Control
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <span style={{ color: 'red' }}>
                        {field.state.meta.errors.join(', ')}
                      </span>
                    )}
                  </>
                )}
              </form.Field>
            </div>

            <div>
              {/* <label htmlFor="contactMethodType">Contact Method Type</label> */}
              <form.Field name="contactMethodType">
                {(field) => (
                  <>
                    <Form.Label htmlFor={field.name}>
                      Contact method type
                    </Form.Label>
                    <Form.Control
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </>
                )}
              </form.Field>
            </div>

            <div>
              {/* <label htmlFor="contactMethodValue">Contact Method Value</label> */}
              <form.Field name="contactMethodValue">
                {(field) => (
                  <>
                    {/* <Form.Label htmlFor={field.name}>Email</Form.Label> */}
                    <Form.Control
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </>
                )}
              </form.Field>
            </div>
          </Card.Body>
        </Card>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <div style={{ marginTop: '1rem' }}>
              <Button
                type="submit"
                disabled={
                  !canSubmit || isSubmitting || updateMutation.isPending
                }
              >
                {isSubmitting || updateMutation.isPending
                  ? 'Updating...'
                  : 'Update Person'}
              </Button>
              <Button
                type="button"
                onClick={() => form.reset()}
                disabled={isSubmitting || updateMutation.isPending}
                style={{ marginLeft: '1rem' }}
              >
                Cancel
              </Button>
              {updateMutation.isError && (
                <p style={{ color: 'red', marginTop: '0.5rem' }}>
                  Error: {updateMutation.error?.message}
                </p>
              )}
            </div>
          )}
        </form.Subscribe>
      </form>

      <Button
        variant="outline-danger"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
        className="mt-2"
      >
        {deleteMutation.isPending ? 'Deleting...' : 'Delete Person'}
      </Button>
    </div>
  )
}

export default PersonDetails
