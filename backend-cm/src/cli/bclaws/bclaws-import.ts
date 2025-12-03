import { Logger } from "@nestjs/common";
import { LegislationService } from "../../shared/legislation/legislation.service";
import { getBcLawsXml } from "../../external_api/bc-laws-service";
import {
  parseBcLawsXml,
  ParsedLegislationNode,
  ParsedBcLawsDocument,
} from "../../shared/legislation/utils/bc-laws-xml-parser";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Hardcoded BC Laws URL for Environmental Management Act
const BC_LAWS_EMA_URL = "https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/03053_00_multi/xml";

// Agency code for legislation associations
const DEFAULT_AGENCY_CODE = "COS";

/**
 * Parses the assented date string (e.g., "October 23, 2003") to a Date
 */
function parseAssentedDate(assentedTo: string | null): Date | null {
  if (!assentedTo) {
    return null;
  }
  try {
    const parsed = new Date(assentedTo);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * Builds the full citation string for a legislation node
 */
function buildFullCitation(actTitle: string, node: ParsedLegislationNode, parentFullCitation: string | null): string {
  if (node.typeCode === "ACT") {
    return actTitle;
  }

  const parts: string[] = [];
  if (parentFullCitation && parentFullCitation !== actTitle) {
    parts.push(parentFullCitation);
  } else {
    parts.push(actTitle);
  }

  // Add section/subsection/paragraph citation
  if (node.citation) {
    switch (node.typeCode) {
      case "PART":
        parts.push(`Part ${node.citation}`);
        break;
      case "SEC":
        parts.push(`s. ${node.citation}`);
        break;
      case "SUBSEC":
        parts.push(`(${node.citation})`);
        break;
      case "PAR":
      case "SUBPAR":
        parts.push(`(${node.citation})`);
        break;
      case "DEF":
        if (node.sectionTitle) {
          parts.push(`"${node.sectionTitle}"`);
        }
        break;
    }
  }

  return parts.join(" ");
}

/**
 * Recursively inserts legislation nodes into the database
 */
async function insertLegislationTree(
  node: ParsedLegislationNode,
  parentGuid: string | null,
  actTitle: string,
  effectiveDate: Date | null,
  legislationService: LegislationService,
  logger: Logger,
  parentFullCitation: string | null = null,
): Promise<number> {
  let count = 0;

  // Build full citation for this node
  const fullCitation = buildFullCitation(actTitle, node, parentFullCitation);

  // Truncate fields to fit database constraints
  const truncatedCitation = node.citation?.slice(0, 64) ?? null;
  const truncatedFullCitation = fullCitation.slice(0, 512);
  const truncatedSectionTitle = node.sectionTitle?.slice(0, 64) ?? null;

  try {
    logger.log(`Importing: ${node.typeCode} - ${truncatedCitation || truncatedSectionTitle || "(root)"}`);
    await sleep(50); // Rate limiting

    // Upsert the legislation record
    const created = await legislationService.upsert({
      legislationTypeCode: node.typeCode,
      parentLegislationGuid: parentGuid,
      citation: truncatedCitation,
      fullCitation: truncatedFullCitation,
      sectionTitle: truncatedSectionTitle,
      legislationText: node.legislationText,
      displayOrder: node.displayOrder,
      effectiveDate: effectiveDate,
      createUserId: "BC_LAWS_IMPORT",
    });

    // Create agency association only for top-level node?
    //if (parentGuid === null) {
    await legislationService.createAgencyXref(created.legislation_guid, DEFAULT_AGENCY_CODE, "BC_LAWS_IMPORT");
    //}

    count++;

    // Recursively insert children
    for (const child of node.children) {
      count += await insertLegislationTree(
        child,
        created.legislation_guid,
        actTitle,
        effectiveDate,
        legislationService,
        logger,
        fullCitation,
      );
    }
  } catch (error) {
    logger.error(`Error inserting legislation: ${node.typeCode} - ${truncatedCitation}`, error);
    // Continue with other nodes even if one fails
  }

  return count;
}

/**
 * Imports BC Laws XML document into the legislation table
 */
export async function runBcLawsImport(legislationService: LegislationService, logger: Logger): Promise<void> {
  logger.log("Starting BC Laws import...");
  logger.log(`Fetching XML from: ${BC_LAWS_EMA_URL}`);

  try {
    // Fetch the XML document
    const xmlString = await getBcLawsXml(BC_LAWS_EMA_URL);
    logger.log(`Received XML document (${xmlString.length} characters)`);

    // Parse the XML
    const parsedDocument: ParsedBcLawsDocument = parseBcLawsXml(xmlString);
    logger.log(`Parsed legislation: ${parsedDocument.metadata.title}`);
    logger.log(`Chapter: ${parsedDocument.metadata.chapter}, Year: ${parsedDocument.metadata.yearEnacted}`);

    // Calculate effective date from assentedTo
    const effectiveDate = parseAssentedDate(parsedDocument.metadata.assentedTo);

    // Build full citation prefix
    const actTitle = parsedDocument.metadata.title;

    // Insert the legislation tree recursively
    const insertedCount = await insertLegislationTree(
      parsedDocument.root,
      null, // No parent for root
      actTitle,
      effectiveDate,
      legislationService,
      logger,
    );

    logger.log(`BC Laws import complete. Inserted/updated ${insertedCount} legislation records.`);
  } catch (error) {
    logger.error("Error importing BC Laws:", error);
    throw error;
  }
}
