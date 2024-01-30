import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class GraphqlService {

    async fetchUsers(): Promise<any> {
        const query = `query { users { id name email } }`;
        const graphqlEndpoint = `${process.env.CASE_MANAGEMENT_API_URL}/graphql`; // Replace with actual endpoint
    
        try {
          const response: AxiosResponse = await axios.post(graphqlEndpoint, {
            query: query,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

}
