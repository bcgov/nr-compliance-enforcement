import { useRequest } from '@/graphql/client'
import { gql } from 'graphql-request'

// GraphQL query
const GET_USERS = gql`
  query GetUsers {
    people {
      personGuid
      firstName
      middleName
      middleName2
      lastName
    }
  }
`

export const GET_PERSON = gql`
  query GetPerson($personGuid: String!) {
    person(personGuid: $personGuid) {
      personGuid
      firstName
      middleName
      middleName2
      lastName
      contactMethods {
        typeCode
        typeDescription
        value
      }
    }
  }
`

// Mutations
export const CREATE_PERSON = gql`
  mutation CreatePerson($input: PersonInput!) {
    createPerson(input: $input) {
      personGuid
      firstName
      middleName
      middleName2
      lastName
      # contactMethods {
      #   typeCode
      #   typeShortDescription
      #   typeDescription
      #   value
      # }
    }
  }
`

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($personGuid: String!, $input: PersonInput!) {
    updatePerson(personGuid: $personGuid, input: $input) {
      personGuid
      firstName
      middleName
      middleName2
      lastName
      # contactMethods {
      #   typeCode
      #   typeShortDescription
      #   typeDescription
      #   value
      # }
    }
  }
`

export const DELETE_PERSON = gql`
  mutation DeletePerson($personGuid: String!) {
    deletePerson(personGuid: $personGuid) {
      personGuid
      firstName
      lastName
    }
  }
`
// Types - manual for now
export interface Person {
  personGuid: string
  firstName: string
  middleName?: string | null
  middleName2?: string | null
  lastName: string
  contactMethods?: ContactMethod[]
}

export interface ContactMethod {
  typeCode: string
  typeShortDescription: string
  typeDescription: string
  value: string
}

export interface PersonInput {
  firstName: string
  middleName?: string
  middleName2?: string
  lastName: string
  contactMethods?: { typeCode: string; value: string }[]
}

// Mutation fetchers
export const fetchPersons = async (): Promise<Person[]> => {
  const data = await useRequest(GET_USERS)
  return data.people
}

export const fetchPerson = async (id: string): Promise<Person> => {
  const data = await useRequest(GET_PERSON, { personGuid: id })
  return data.person
}

export const createPerson = async (input: PersonInput) => {
  const data = await useRequest(CREATE_PERSON, { input })
  return data.createPerson
}

export const updatePerson = async (personGuid: string, input: PersonInput) => {
  const data = await useRequest(UPDATE_PERSON, { personGuid, input })
  return data.updatePerson
}

export const deletePerson = async (personGuid: string) => {
  const data = await useRequest(DELETE_PERSON, { personGuid })
  return data.deletePerson
}
