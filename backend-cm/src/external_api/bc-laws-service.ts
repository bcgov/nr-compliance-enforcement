import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

const httpsProxyAgent = process.env.HTTPS_PROXY ? new HttpsProxyAgent(process.env.HTTPS_PROXY) : undefined;

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  return Promise.reject(error as Error);
});

/**
 * Fetches BC Laws XML document from the BC Laws API
 * @param url - The full URL to the BC Laws XML document
 * @returns The raw XML string
 */
export const getBcLawsXml = async (url: string): Promise<string> => {
  let config: AxiosRequestConfig = {
    headers: {
      Accept: "application/xml",
    },
    responseType: "text",
  };

  if (process.env.HTTPS_PROXY) {
    config = {
      ...config,
      proxy: false,
      httpsAgent: httpsProxyAgent,
    };
  }

  return axios
    .get(url, config)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        throw new Error(`BC Laws API Request Failed: ${url}, ${error.message}`);
      } else if (error.request) {
        throw new Error(`No response received from BC Laws API: ${url}, ${error.message}`);
      } else {
        throw new Error(`BC Laws API Error: ${error.message}`);
      }
    });
};

