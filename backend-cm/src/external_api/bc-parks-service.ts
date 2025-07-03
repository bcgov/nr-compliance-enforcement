import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

const URL = process.env.BC_PARKS_API_URL;
const token = process.env.BC_PARKS_API_KEY;
const httpsProxyAgent = process.env.HTTPS_PROXY ? new HttpsProxyAgent(process.env.HTTPS_PROXY) : undefined;

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  return Promise.reject(error as Error);
});

export const getAllParks = () => {
  let config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "None",
      "x-api-key": `${token}`,
    },
  };

  if (process.env.HTTPS_PROXY) {
    config = {
      ...config,
      proxy: false,
      httpsAgent: httpsProxyAgent,
    };
  }

  const getAllParksUrl = `${URL}/parks/names?status=established`;

  return axios
    .get(getAllParksUrl, config)
    .then((response: AxiosResponse) => {
      const { data } = response;
      return data.data.items;
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        const data = error.response?.data as any;
        throw new Error(
          `BC Parks API Request Failed: ${URL}, ${token}, ${error.message}, ${process.env.HTTPS_PROXY}, ${JSON.stringify(data?.errors)}`,
        );
      } else if (error.request) {
        throw new Error(
          `No response received from the BC Parks API: ${URL}, ${token}, ${error.message}, ${process.env.HTTPS_PROXY}, ${JSON.stringify(error)}`,
        );
      } else {
        throw new Error(`BC Parks API Error: ${error.message}`);
      }
    });
};
