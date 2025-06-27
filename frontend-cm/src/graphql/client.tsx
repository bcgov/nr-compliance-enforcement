import { GraphQLClient } from 'graphql-request'
import { config } from '@/config'
import { getAccessToken } from '@/auth/oidc'

const GRAPHQL_URL = config.VITE_GRAPHQL_URL || 'http://localhost:3003/graphql'

const getClient = async () => {
  console.log('getClient')
  const accessToken = await getAccessToken()
  console.log('getClient accessToken', accessToken)
  return new GraphQLClient(GRAPHQL_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const useRequest = async (QUERY: any, input = {}) => {
  const client = await getClient()
  return client.request<any>(QUERY, input)
}
