import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

const httpsProxyAgent = process.env.HTTPS_PROXY ? new HttpsProxyAgent(process.env.HTTPS_PROXY) : undefined;

/**
 * Fetches Federal Laws XML documents
 * @param url - The full URL to the Federal Laws XML document
 *   e.g., https://laws-lois.justice.gc.ca/eng/XML/C-46.xml
 * @returns The raw XML string
 */
export const getFederalLawsXml = async (url: string): Promise<string> => {
  let config: AxiosRequestConfig = {
    headers: {
      Accept: "text/xml, application/xml, */*",
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
        throw new Error(`Federal Laws API Request Failed: ${url}, ${error.message}`);
      } else if (error.request) {
        throw new Error(`No response received from Federal Laws API: ${url}, ${error.message}`);
      } else {
        throw new Error(`Federal Laws API Error: ${error.message}`);
      }
    });
};
