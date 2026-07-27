import axios, { AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { XMLParser } from "fast-xml-parser";

export interface Regulation {
  id: string;
  title: string;
  url: string;
  status: string | null;
}

const httpsProxyAgent = process.env.HTTPS_PROXY ? new HttpsProxyAgent(process.env.HTTPS_PROXY) : undefined;

const proxyConfig: AxiosRequestConfig = httpsProxyAgent ? { proxy: false, httpsAgent: httpsProxyAgent } : {};

export const fetchXml = async (url: string, apiName: string): Promise<string> => {
  try {
    const response = await axios.get(url, proxyConfig);
    return response.data;
  } catch (error: any) {
    const msg = error?.message || String(error);
    let prefix = "Error";
    if (error?.response) prefix = "Request Failed";
    else if (error?.request) prefix = "No response received from";
    throw new Error(`${apiName} ${prefix}: ${url}, ${msg}`);
  }
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
  const xmlString = await fetchXml(contentApiUrl, "BC Laws API");
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

// Federal Laws lookup.xml parsing

const FEDERAL_LOOKUP_URL = "https://raw.githubusercontent.com/justicecanada/laws-lois-xml/master/lookup/lookup.xml";

interface FederalLookupData {
  statutes: any[];
  regulations: any[];
}

let cachedLookup: FederalLookupData | null = null;

const fetchFederalLookup = async (): Promise<FederalLookupData> => {
  if (cachedLookup) return cachedLookup;

  const xmlString = await fetchXml(FEDERAL_LOOKUP_URL, "Federal Laws Lookup");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    isArray: (tagName: string) => ["Statute", "Regulation", "Relationship"].includes(tagName),
  });

  const parsed = parser.parse(xmlString);
  const db = parsed?.Database;

  cachedLookup = {
    statutes: toArray(db?.Statutes?.Statute),
    regulations: toArray(db?.Regulations?.Regulation),
  };
  return cachedLookup;
};

const normalizeFederalId = (alphaNumber: string): string => alphaNumber.replaceAll("/", "-").replaceAll(" ", "_");

export const getFederalRegulationXmlUrl = (alphaNumber: string): string =>
  `https://laws-lois.justice.gc.ca/eng/XML/${normalizeFederalId(alphaNumber)}.xml`;

/**
 * Fetches the list of regulations associated with a federal act by looking up the
 * Justice Canada lookup.xml from GitHub.
 * @param consolidatedNumber - The act's consolidated number (e.g., "C-46")
 * @returns Array of regulations with their XML URLs
 */
export const getFederalRegulations = async (consolidatedNumber: string): Promise<Regulation[]> => {
  const lookup = await fetchFederalLookup();

  // Find the English statute matching the consolidated number
  const statute = lookup.statutes.find((s: any) => s.ChapterNumber === consolidatedNumber && s.Language === "en");

  if (!statute?.Relationships?.Relationship) {
    return [];
  }

  const rids = new Set(toArray(statute.Relationships.Relationship).map((r: any) => r["@_rid"]));
  const regMap = new Map(lookup.regulations.map((r: any) => [r["@_id"], r]));

  const regulations: Regulation[] = [];
  for (const rid of rids) {
    const reg = regMap.get(rid);
    if (!reg) continue;

    const alphaNumber: string = reg.AlphaNumber;
    const url = `https://laws-lois.justice.gc.ca/eng/regulations/${normalizeFederalId(alphaNumber)}/index.html`;
    regulations.push({ id: alphaNumber, title: reg.ShortTitle || alphaNumber, url, status: null });
  }

  return regulations;
};
