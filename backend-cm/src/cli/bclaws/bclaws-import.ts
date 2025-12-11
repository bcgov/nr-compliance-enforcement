import { Logger } from "@nestjs/common";
import { LegislationService } from "../../shared/legislation/legislation.service";
import { LegislationSourceService } from "../../shared/legislation_source/legislation_source.service";
import { LegislationSource } from "../../shared/legislation_source/dto/legislation-source";
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
  const { actTitle, effectiveDate, legislationService, logger } = context;
  let count = 0;

  // Build full citation for this node
  const fullCitation = buildFullCitation(actTitle, node, parentFullCitation);

  // Only set legislationSourceGuid on root node (when parentGuid is null)
  const sourceGuidForThisNode = parentGuid === null ? legislationSourceGuid : null;

  try {
    logger.log(`Importing: ${node.typeCode} - ${node.citation || node.sectionTitle || "(root)"}`);
    await sleep(50); // Rate limiting

    // Upsert the legislation record
    const created = await legislationService.upsert({
      legislationTypeCode: node.typeCode,
      parentLegislationGuid: parentGuid,
      legislationSourceGuid: sourceGuidForThisNode,
      citation: node.citation ?? null,
      fullCitation: fullCitation,
      sectionTitle: node.sectionTitle ?? null,
      legislationText: node.legislationText,
      trailingText: node.trailingText,
      displayOrder: node.displayOrder,
      effectiveDate: effectiveDate,
      createUserId: "system",
    });

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
    logger.error(`Error inserting legislation: ${node.typeCode} - ${node.citation}`, error);
    // Continue with other nodes even if one fails
  }

  return count;
}

/**
 * Imports a single BC Laws XML document from a legislation source
 */
async function importLegislationSourceDocument(
  source: LegislationSource,
  legislationService: LegislationService,
  legislationSourceService: LegislationSourceService,
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

    const successLog = `Successfully imported ${insertedCount} records from ${parsedDocument.metadata.title}`;
    await legislationSourceService.markImported(source.legislationSourceGuid, successLog);

    logger.log(`Completed: ${source.shortDescription} - ${insertedCount} records imported/updated`);
    return insertedCount;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const stackTrace = errorStack ? "\n\nStack trace:\n" + errorStack : "";
    const errorLog = "Import failed: " + errorMessage + stackTrace;

    // Mark the source as failed with error log
    try {
      await legislationSourceService.markFailed(source.legislationSourceGuid, errorLog);
    } catch (markError) {
      logger.error(`Failed to update import status for ${source.shortDescription}:`, markError);
    }

    logger.error(`Error importing ${source.shortDescription}:`, error);
    throw error;
  }
}

/**
 * Imports pending BC Laws documents from the legislation_source table
 * Sources that have already been imported (imported_ind = true) are skipped
 */
export async function runBcLawsImport(
  legislationService: LegislationService,
  legislationSourceService: LegislationSourceService,
  logger: Logger,
): Promise<void> {
  logger.log("Starting BC Laws import...");
  logger.log("Fetching pending legislation sources from database...");

  try {
    // Get pending legislation sources (active but not yet imported)
    const sources = await legislationSourceService.getPending();

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
        const count = await importLegislationSourceDocument(
          source,
          legislationService,
          legislationSourceService,
          logger,
        );
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
    logger.log("BC Laws import is complete.");
  } catch (error) {
    logger.error("Error during BC Laws import:", error);
    throw error;
  }
}
