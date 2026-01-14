import { Logger } from "@nestjs/common";
import { LegislationService } from "../../shared/legislation/legislation.service";
import { LegislationSourceService } from "../../shared/legislation_source/legislation_source.service";
import { LegislationSource } from "../../shared/legislation_source/dto/legislation-source";
import { getBcLawsXml, getBcLawsRegulations, Regulation } from "../../external_api/bc-laws-service";
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
  errors: string[];
  rootLegislationGuid?: string;
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
 * @param actGuid - For regulation documents, the parent Act's legislation_guid
 */
async function insertLegislationTree(
  node: ParsedLegislationNode,
  context: InsertLegislationContext,
  parentGuid: string | null = null,
  parentFullCitation: string | null = null,
  legislationSourceGuid: string | null = null,
  actGuid: string | null = null,
): Promise<number> {
  const { actTitle, effectiveDate, legislationService, logger } = context;
  let count = 0;

  // Build full citation for this node
  const fullCitation = buildFullCitation(actTitle, node, parentFullCitation);

  // Only set legislationSourceGuid on root node (when parentGuid is null)
  const sourceGuidForThisNode = parentGuid === null ? legislationSourceGuid : null;

  // For regulation root nodes, link to parent Act if provided
  const parentLegislationGuid = parentGuid === null && node.typeCode === "REG" && actGuid ? actGuid : parentGuid;

  try {
    logger.log(`Importing: ${node.typeCode} - ${node.citation || node.sectionTitle || "(root)"}`);
    await sleep(10); // Rate limiting

    // Upsert the legislation record
    const created = await legislationService.upsert({
      legislationTypeCode: node.typeCode,
      parentLegislationGuid: parentLegislationGuid,
      legislationSourceGuid: sourceGuidForThisNode,
      citation: node.citation ?? null,
      fullCitation: fullCitation,
      sectionTitle: node.sectionTitle ?? null,
      legislationText: node.legislationText,
      displayOrder: node.displayOrder,
      effectiveDate: effectiveDate,
      createUserId: "system",
    });

    count++;

    // Track root legislation GUID for linking regulations
    if (parentGuid === null) {
      context.rootLegislationGuid = created.legislation_guid;
    }

    // Recursively insert children (don't pass legislationSourceGuid - only for root)
    for (const child of node.children) {
      count += await insertLegislationTree(child, context, created.legislation_guid, fullCitation, null);
    }
  } catch (error) {
    const errorMsg = `${node.typeCode} - ${node.citation}: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(`Error inserting legislation: ${errorMsg}`);
    context.errors.push(errorMsg);
    // Continue with other nodes even if one fails
  }

  return count;
}

interface RegulationImportResult {
  totalRecords: number;
  totalRegulations: number;
  successfulRegs: number;
  failedRegs: number;
  skippedRegs: number;
}

/**
 * Imports regulations for an Act from its regulationsSourceUrl
 */
async function importRegulations(
  source: LegislationSource,
  actRootGuid: string,
  legislationService: LegislationService,
  logger: Logger,
  errors: string[],
): Promise<RegulationImportResult> {
  const result: RegulationImportResult = {
    totalRecords: 0,
    totalRegulations: 0,
    successfulRegs: 0,
    failedRegs: 0,
    skippedRegs: 0,
  };

  if (!source.regulationsSourceUrl) {
    return result;
  }

  logger.log(`\nFetching regulations...`);

  try {
    const regulations = await getBcLawsRegulations(source.regulationsSourceUrl);
    result.totalRegulations = regulations.length;
    logger.log(`Found ${regulations.length} regulation(s) to import`);

    for (const reg of regulations) {
      // Skip repealed regulations
      if (reg.status === "Repealed") {
        logger.log(`  Skipping (Repealed): ${reg.title}`);
        result.skippedRegs++;
        continue;
      }

      const recordCount = await importSingleRegulation(reg, actRootGuid, legislationService, logger, errors);
      if (recordCount > 0) {
        result.successfulRegs++;
        result.totalRecords += recordCount;
      } else {
        result.failedRegs++;
      }
    }

    // Log summary
    if (regulations.length > 0) {
      logger.log(`\nRegulations summary: ${result.successfulRegs} of ${regulations.length} imported successfully`);
      if (result.skippedRegs > 0) {
        logger.log(`  ${result.skippedRegs} regulation(s) skipped (Repealed)`);
      }
      if (result.failedRegs > 0) {
        logger.warn(`  ${result.failedRegs} regulation(s) failed to import`);
      }
    }
  } catch (error) {
    const errorMsg = `Failed to fetch regulations: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg);
    errors.push(errorMsg);
  }

  return result;
}

async function importSingleRegulation(
  reg: Regulation,
  actRootGuid: string,
  legislationService: LegislationService,
  logger: Logger,
  errors: string[],
): Promise<number> {
  logger.log(`  Importing: ${reg.title}`);

  try {
    logger.log(`  URL: ${reg.url}`);
    const xmlString = await getBcLawsXml(reg.url);
    const parsedDocument = parseBcLawsXml(xmlString);
    const effectiveDate = parseAssentedDate(parsedDocument.metadata.assentedTo);

    const context: InsertLegislationContext = {
      actTitle: parsedDocument.metadata.title,
      effectiveDate,
      legislationService,
      logger,
      errors: [],
    };

    const count = await insertLegislationTree(
      parsedDocument.root,
      context,
      null,
      null,
      null,
      actRootGuid, // Link regulation to parent Act
    );

    errors.push(...context.errors);
    logger.log(`  Completed: ${parsedDocument.metadata.title} - ${count} records`);
    return count;
  } catch (error) {
    const errorMsg = `Regulation ${reg.title}: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(`  Error: ${errorMsg}`);
    errors.push(errorMsg);
    return 0;
  }
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
      errors: [],
    };
    let insertedCount = await insertLegislationTree(
      parsedDocument.root,
      context,
      null, // No parent for root
      null, // parentFullCitation
      source.legislationSourceGuid, // Link root node to source
    );

    // Import regulations if regulationsSourceUrl is provided
    let regResult: RegulationImportResult | null = null;
    if (source.regulationsSourceUrl && context.rootLegislationGuid) {
      regResult = await importRegulations(
        source,
        context.rootLegislationGuid,
        legislationService,
        logger,
        context.errors,
      );
      insertedCount += regResult.totalRecords;
    }

    // Build the success/error log with regulation stats
    const buildLogMessage = () => {
      let msg = `Imported ${insertedCount} records from ${parsedDocument.metadata.title}`;
      if (regResult && regResult.totalRegulations > 0) {
        msg += `\nRegulations: ${regResult.successfulRegs} of ${regResult.totalRegulations} imported successfully`;
        if (regResult.skippedRegs > 0) {
          msg += `, ${regResult.skippedRegs} skipped (Repealed)`;
        }
        if (regResult.failedRegs > 0) {
          msg += `, ${regResult.failedRegs} failed`;
        }
      }
      return msg;
    };

    // Check if there were any errors during import
    if (context.errors.length > 0) {
      const errorLog = `Import completed with ${context.errors.length} error(s):\n${buildLogMessage()}\n\nErrors:\n${context.errors.join("\n")}`;
      await legislationSourceService.markFailed(source.legislationSourceGuid, errorLog);
      logger.warn(
        `Completed with errors: ${source.shortDescription} - ${insertedCount} records, ${context.errors.length} errors`,
      );
      return insertedCount;
    }

    const successLog = buildLogMessage();
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
    logger.log("BC Laws import is complete");
  } catch (error) {
    logger.error("Error(s) during BC Laws import:", error);
    throw error;
  }
}
