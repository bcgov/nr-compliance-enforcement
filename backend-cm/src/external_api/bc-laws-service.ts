import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { XMLParser } from "fast-xml-parser";

export interface Regulation {
  id: string;
  title: string;
  url: string;
  status: string | null;
}

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

/**
 * Fetches the regulations from the BC Laws Content API and parses it
 * @param contentApiUrl - The Content API URL for the regulations
 * @returns Set of regulation documents with their URLs
 */
export const getBcLawsRegulations = async (contentApiUrl: string): Promise<Regulation[]> => {
  const xmlString = await getBcLawsXml(contentApiUrl);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const parsed = parser.parse(xmlString);

  // The Content API returns a structure where documents are under a root element
  // The root element name varies (e.g., "dir" or the folder ID like "reg96157")
  // Find the first key that contains a "document" property
  let documents: any[] = [];

  for (const key of Object.keys(parsed)) {
    const element = parsed[key];
    if (element && typeof element === "object" && element.document) {
      let docs = element.document;
      if (!Array.isArray(docs)) {
        docs = [docs];
      }
      documents = docs;
      break;
    }
  }

  if (documents.length === 0) {
    return [];
  }

  const regulations: Regulation[] = [];

  for (const doc of documents) {
    const id = doc.CIVIX_DOCUMENT_ID;
    const title = doc.CIVIX_DOCUMENT_TITLE;
    const status = doc.CIVIX_DOCUMENT_STATUS || null;

    if (id && title) {
      const url = `https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/${id}/xml`;
      regulations.push({
        id,
        title,
        url,
        status,
      });
    }
  }

  return regulations;
};
