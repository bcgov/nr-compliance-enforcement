const BCLAWS_DOCUMENT_URL = "https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg";
const FEDERAL_XML_URL = "https://laws-lois.justice.gc.ca/eng/XML";
const FEDERAL_VIEW_URL = "https://laws-lois.justice.gc.ca/eng";

const formatFederalKey = (externalKey: string): string => externalKey.replaceAll("/", "-").replaceAll(" ", "_");

export const getLegislationFetchUrl = (sourceType: string, externalKey: string): string =>
  sourceType === "FEDERAL"
    ? `${FEDERAL_XML_URL}/${formatFederalKey(externalKey)}.xml`
    : `${BCLAWS_DOCUMENT_URL}/${externalKey}/xml`;

export const getLegislationViewUrl = (sourceType: string, externalKey: string, isRegulation: boolean): string => {
  if (sourceType === "FEDERAL") {
    return isRegulation
      ? `${FEDERAL_VIEW_URL}/regulations/${formatFederalKey(externalKey)}/index.html`
      : `${FEDERAL_VIEW_URL}/acts/${externalKey.toLowerCase()}/`;
  }

  return `${BCLAWS_DOCUMENT_URL}/${externalKey}`;
};
