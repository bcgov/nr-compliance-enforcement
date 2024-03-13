import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

const caseManagementlURL = process.env.CASE_MANAGEMENT_API_URL

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  console.error(error);
  return Promise.reject(error)
})

export const get = (token, params? : {}) => {
  let config: AxiosRequestConfig = { headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    } };

  if (params) {
    config.params = params;
  }
  return axios
    .get(caseManagementlURL, config)
    .then((response: AxiosResponse) => {
      const { data } = response;
      return data
    })
    .catch((error: AxiosError) => {
      console.log(error)
    })
};

export const post = (token, payload?: {}) => {
  let config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  return axios
    .post(caseManagementlURL, payload)
    .then((response: AxiosResponse) => {
      return {response: response, error: null};
    })
    .catch((error: AxiosError) => {
      console.log("error", error);
      return {response: null, error: error};
    })
};




