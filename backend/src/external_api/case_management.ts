import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

const caseManagementlURL = process.env.CASE_MANAGEMENT_API_URL

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  console.error(error.response);
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
      if (error.response) {
        throw new Error(`Case Management Request Failed: ${error.response.data}`);
      } else if (error.request) {
        throw new Error('No response received from the Case Management server');
      } else {
        throw new Error(`Request setup error to Case Management: ${error.message}`);
      }
    });
};

export const post = (token, payload?: {}) => {
  let config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  return axios
    .post(caseManagementlURL, payload, config)
    .then((response: AxiosResponse) => {
      return {response: response, error: null as AxiosError};
    })
    .catch((error: AxiosError) => {
      return {response: null as AxiosResponse, error: error};
    })
};




