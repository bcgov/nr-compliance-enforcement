import { Logger } from "@nestjs/common";
import { LegislationService, LegislationSource } from "../../shared/legislation/legislation.service";
import { getBcLawsXml } from "../../external_api/bc-laws-service";
import {
  parseBcLawsXml,
  ParsedLegislationNode,
  ParsedBcLawsDocument,
} from "../../shared/legislation/utils/bc-laws-xml-parser";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Context for inserting legislation tree
 */
interface InsertLegislationContext {
  actTitle: string;
  effectiveDate: Date | null;
  agencyCode: string;
  legislationService: LegislationService;
  logger: Logger;
}

/**
 * Parses the assented date string (e.g., "October 23, 2003") to a Date
 */
function parseAssentedDate(assentedTo: string | null): Date | null {
  if (!assentedTo) {
    return null;
  }
  try {
    const parsed = new Date(assentedTo);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * Builds the full citation string for a legislation node
 */
function buildFullCitation(actTitle: string, node: ParsedLegislationNode, parentFullCitation: string | null): string {
  if (node.typeCode === "ACT" || node.typeCode === "REG" || node.typeCode === "BYLAW") {
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
      case "DIV":
        parts.push(`Division ${node.citation}`);
        break;
      case "SCHED":
        parts.push(`Schedule ${node.citation}`);
        break;
      case "RULE":
        parts.push(`Rule ${node.citation}`);
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
 * @param legislationSourceGuid - Only set on the root node to link back to the import source
 */
async function insertLegislationTree(
  node: ParsedLegislationNode,
  context: InsertLegislationContext,
  parentGuid: string | null = null,
  parentFullCitation: string | null = null,
  legislationSourceGuid: string | null = null,
): Promise<number> {
  const { actTitle, effectiveDate, agencyCode, legislationService, logger } = context;
  let count = 0;

  // Build full citation for this node
  const fullCitation = buildFullCitation(actTitle, node, parentFullCitation);

  // Truncate fields to fit database constraints
  const truncatedCitation = node.citation?.slice(0, 64) ?? null;
  const truncatedFullCitation = fullCitation.slice(0, 512);
  const truncatedSectionTitle = node.sectionTitle?.slice(0, 64) ?? null;

  // Only set legislationSourceGuid on root node (when parentGuid is null)
  const sourceGuidForThisNode = parentGuid === null ? legislationSourceGuid : null;

  try {
    logger.log(`Importing: ${node.typeCode} - ${truncatedCitation || truncatedSectionTitle || "(root)"}`);
    await sleep(50); // Rate limiting

    // Upsert the legislation record
    const created = await legislationService.upsert({
      legislationTypeCode: node.typeCode,
      parentLegislationGuid: parentGuid,
      legislationSourceGuid: sourceGuidForThisNode,
      citation: truncatedCitation,
      fullCitation: truncatedFullCitation,
      sectionTitle: truncatedSectionTitle,
      legislationText: node.legislationText,
      displayOrder: node.displayOrder,
      effectiveDate: effectiveDate,
      createUserId: "system",
    });

    // Create agency association only for top-level node?
    //if (parentGuid === null) {
    await legislationService.createAgencyXref(created.legislation_guid, agencyCode, "BC_LAWS_IMPORT");
    //}

    count++;

    // Recursively insert children (don't pass legislationSourceGuid - only for root)
    for (const child of node.children) {
      count += await insertLegislationTree(
        child,
        context,
        created.legislation_guid,
        fullCitation,
        null, // Children don't get the source GUID
      );
    }
  } catch (error) {
    logger.error(`Error inserting legislation: ${node.typeCode} - ${truncatedCitation}`, error);
    // Continue with other nodes even if one fails
  }

  return count;
}

/**
 * Imports a single BC Laws XML document from a legislation source
 */
async function importLegislationSource(
  source: LegislationSource,
  legislationService: LegislationService,
  logger: Logger,
): Promise<number> {
  logger.log(`\n--- Importing: ${source.shortDescription} ---`);
  logger.log(`URL: ${source.sourceUrl}`);
  logger.log(`Agency: ${source.agencyCode}`);

  try {
    // Fetch the XML document
    const xmlString = await getBcLawsXml(source.sourceUrl);
    logger.log(`Received XML document (${xmlString.length} characters)`);

    // Parse the XML
    const parsedDocument: ParsedBcLawsDocument = parseBcLawsXml(xmlString);
    logger.log(`Parsed legislation: ${parsedDocument.metadata.title}`);
    logger.log(`Document type: ${parsedDocument.metadata.documentType}`);
    logger.log(`Chapter: ${parsedDocument.metadata.chapter}, Year: ${parsedDocument.metadata.yearEnacted}`);

    // Calculate effective date from assentedTo
    const effectiveDate = parseAssentedDate(parsedDocument.metadata.assentedTo);

    // Build full citation prefix
    const actTitle = parsedDocument.metadata.title;

    // Insert the legislation tree recursively
    const context: InsertLegislationContext = {
      actTitle,
      effectiveDate,
      agencyCode: source.agencyCode,
      legislationService,
      logger,
    };
    const insertedCount = await insertLegislationTree(
      parsedDocument.root,
      context,
      null, // No parent for root
      null, // parentFullCitation
      source.legislationSourceGuid, // Link root node to source
    );

    // Mark the source as imported
    await legislationService.markLegislationSourceImported(source.legislationSourceGuid);

    logger.log(`Completed: ${source.shortDescription} - ${insertedCount} records imported/updated`);
    return insertedCount;
  } catch (error) {
    logger.error(`Error importing ${source.shortDescription}:`, error);
    throw error;
  }
}

/**
 * Imports pending BC Laws documents from the legislation_source table
 * Sources that have already been imported (imported_ind = true) are skipped
 */
export async function runBcLawsImport(legislationService: LegislationService, logger: Logger): Promise<void> {
  logger.log("Starting BC Laws import...");
  logger.log("Fetching pending legislation sources from database...");

  try {
    // Get pending legislation sources (active but not yet imported)
    const sources = await legislationService.getPendingLegislationSources();

    if (sources.length === 0) {
      logger.log("No pending legislation sources to import. All sources have already been imported.");
      logger.log("To re-import a source, set imported_ind = false in the legislation_source table.");
      return;
    }

    logger.log(`Found ${sources.length} pending legislation source(s) to import:`);
    sources.forEach((source, idx) => {
      logger.log(`  ${idx + 1}. ${source.shortDescription} (${source.agencyCode})`);
    });

    let totalCount = 0;
    let successCount = 0;
    let failCount = 0;

    // Import each source
    for (const source of sources) {
      try {
        const count = await importLegislationSource(source, legislationService, logger);
        totalCount += count;
        successCount++;
      } catch {
        failCount++;
        // Continue with next source even if one fails
      }
    }

    logger.log(
      `Total legislation records imported/updated: ${totalCount}, succeeded: ${successCount}, failed: ${failCount}`,
    );
    logger.log("BC Laws import complete.");
  } catch (error) {
    logger.error("Error during BC Laws import:", error);
    throw error;
  }
}
