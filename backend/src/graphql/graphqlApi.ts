import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

const graphqlURL = process.env.CASE_MANAGEMENT_API_URL

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  console.error(error);
  return Promise.reject(error)
})

export const get = (params? : {}) => {
  let config: AxiosRequestConfig = { headers: {
    'Content-Type': 'application/json'
  } };
  if (params) {
    config.params = params;
  }
  return axios
    .get(graphqlURL, config)
    .then((response: AxiosResponse) => {
      const { data } = response;
      return data
    })
};




