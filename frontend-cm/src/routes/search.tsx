import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { createProtectedRoute } from '@/auth/auth'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { Card, Form, Button } from 'react-bootstrap'

const SortOptions = ['newest', 'oldest'] as const
type SortOptions = (typeof SortOptions)[number]

// Use zod (or other validation library) to define a schema for the search params
const searchSchema = z.object({
  page: z.number().default(1),
  filter: z.string().default(''),
  sort: z.enum(SortOptions).default('newest'),
})

export const Route = createProtectedRoute('/search')({
  component: Search,
  validateSearch: zodValidator(searchSchema),
})

function Search() {
  const { page, filter, sort } = Route.useSearch()
  const navigate = useNavigate({ from: '/search' })
  const [searchOptions, setSearchOptions] = useState({ page, filter, sort })
  return (
    <div>
      <h5>Searching stuff! NEAT</h5>
      <div>
        <p>Page: {page}</p>
        <p>Filter: {filter}</p>
        <p>Sort: {sort}</p>
      </div>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group>
              <Form.Label for="search">Search</Form.Label>
              <Form.Control
                type="text"
                name="search"
                id="search"
                placeholder="Search"
                onChange={(e) =>
                  setSearchOptions({ ...searchOptions, filter: e.target.value })
                }
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label for="sort">Sort</Form.Label>
              <Form.Select
                aria-label="Sort by"
                onChange={(e) =>
                  setSearchOptions({
                    ...searchOptions,
                    sort: e.target.value as SortOptions,
                  })
                }
              >
                {SortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <br />
            <Button
              onClick={() => {
                navigate({ to: '.', search: searchOptions })
              }}
            >
              Search
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}
