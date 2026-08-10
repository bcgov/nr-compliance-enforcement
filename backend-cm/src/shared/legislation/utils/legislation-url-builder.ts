const BCLAWS_DOCUMENT_URL = "https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg";
const FEDERAL_XML_URL = "https://laws-lois.justice.gc.ca/eng/XML";

const formatFederalKey = (externalKey: string): string => externalKey.replaceAll("/", "-").replaceAll(" ", "_");

export const getLegislationFetchUrl = (sourceType: string, externalKey: string): string =>
  sourceType === "FEDERAL"
    ? `${FEDERAL_XML_URL}/${formatFederalKey(externalKey)}.xml`
    : `${BCLAWS_DOCUMENT_URL}/${externalKey}/xml`;
