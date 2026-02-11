import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { XMLParser } from "fast-xml-parser";

export interface Regulation {
  id: string;
  title: string;
  url: string;
  status: string | null;
}

const httpsProxyAgent = process.env.HTTPS_PROXY
  ? new HttpsProxyAgent(process.env.HTTPS_PROXY, { rejectUnauthorized: false })
  : undefined;

/**
 * Fetches an XML document from the given URL
 * @param url - The full URL to the XML document
 * @param apiName - Name of the API for error messages
 * @returns The raw XML string
 */
export const fetchXml = async (url: string, apiName: string): Promise<string> => {
  let config: AxiosRequestConfig = {};

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
        throw new Error(`${apiName} Request Failed: ${url}, ${error.message}`);
      } else if (error.request) {
        throw new Error(`No response received from ${apiName}: ${url}, ${error.message}`);
      } else {
        throw new Error(`${apiName} Error: ${error.message}`);
      }
    });
};

/**
 * Fetches BC Laws XML document from the BC Laws API
 * @param url - The full URL to the BC Laws XML document
 * @returns The raw XML string
 */
export const getBcLawsXml = async (url: string): Promise<string> => {
  return fetchXml(url, "BC Laws API");
};

const toArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
};

const parseDocumentsFromXml = (xmlString: string): any[] => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const parsed = parser.parse(xmlString);

  // The Content API returns documents under <document> elements and directories under <dir> elements
  for (const key of Object.keys(parsed)) {
    const element = parsed[key];
    if (element && typeof element === "object") {
      const results = [...toArray(element.document), ...toArray(element.dir)];
      if (results.length > 0) {
        return results;
      }
    }
  }

  return [];
};

/**
 * Fetches the regulations from the BC Laws Content API and parses it
 * Recursively fetch documents from any directories (CIVIX_DOCUMENT_TYPE === "dir")
 * For directories with multipart documents (ID ending in _multi), import only the multipart
 * @param contentApiUrl - The Content API URL for the regulations
 * @returns Set of regulation documents with their URLs
 */
export const getBcLawsRegulations = async (contentApiUrl: string): Promise<Regulation[]> => {
  const xmlString = await getBcLawsXml(contentApiUrl);
  const documents = parseDocumentsFromXml(xmlString);

  if (documents.length === 0) {
    return [];
  }

  // If a directory contains a multipart document only import it
  const multipartDoc = documents.find(
    (doc: any) => String(doc.CIVIX_DOCUMENT_ID ?? "").endsWith("_multi") && doc.CIVIX_DOCUMENT_TYPE === "document",
  );

  if (multipartDoc) {
    const id = multipartDoc.CIVIX_DOCUMENT_ID;
    const title = multipartDoc.CIVIX_DOCUMENT_TITLE;
    const status = multipartDoc.CIVIX_DOCUMENT_STATUS || null;
    const url = `https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/${id}/xml`;
    return [{ id, title, url, status }];
  }

  const regulations: Regulation[] = [];

  for (const doc of documents) {
    const id = doc.CIVIX_DOCUMENT_ID;
    const title = doc.CIVIX_DOCUMENT_TITLE;
    const docType = doc.CIVIX_DOCUMENT_TYPE;
    const status = doc.CIVIX_DOCUMENT_STATUS || null;

    if (docType === "dir" && id) {
      const subFolderUrl = contentApiUrl.endsWith("/") ? `${contentApiUrl}${id}/` : `${contentApiUrl}/${id}/`;
      const subRegulations = await getBcLawsRegulations(subFolderUrl);
      regulations.push(...subRegulations);
    } else if (id && title && !title.startsWith("Table of Contents")) {
      const url = `https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/${id}/xml`;
      regulations.push({ id, title, url, status });
    }
  }

  return regulations;
};
