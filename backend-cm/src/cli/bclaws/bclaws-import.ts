import { Logger } from "@nestjs/common";
import { LegislationService } from "../../shared/legislation/legislation.service";
import { LegislationSourceService } from "../../shared/legislation_source/legislation_source.service";
import { LegislationSource } from "../../shared/legislation_source/dto/legislation-source";
import { getBcLawsXml, getBcLawsRegulations, Regulation } from "../../external_api/laws-service";
import { parseBcLawsXml, ParsedBcLawsDocument } from "../../shared/legislation/utils/bc-laws-xml-parser";
import {
  InsertLegislationContext,
  insertLegislationTree,
  parseEffectiveDate,
} from "../shared/legislation-import-utils";

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
  legislationSourceService: LegislationSourceService,
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

      const recordCount = await importSingleRegulation(
        reg,
        actRootGuid,
        source,
        legislationService,
        legislationSourceService,
        logger,
        errors,
      );
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
  actSource: LegislationSource,
  legislationService: LegislationService,
  legislationSourceService: LegislationSourceService,
  logger: Logger,
  errors: string[],
): Promise<number> {
  logger.log(`  Importing: ${reg.title}`);

  try {
    logger.log(`  URL: ${reg.url}`);
    const xmlString = await getBcLawsXml(reg.url);
    const parsedDocument = parseBcLawsXml(xmlString);
    const effectiveDate = parseEffectiveDate(parsedDocument.metadata.assentedTo);

    const regSource = await legislationSourceService.createRegulationSource(
      actSource.agencyCode,
      parsedDocument.metadata.title,
      reg.url,
    );

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
      regSource.legislationSourceGuid,
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
    const effectiveDate = parseEffectiveDate(parsedDocument.metadata.assentedTo);

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
        legislationSourceService,
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
    // Get pending BC Laws legislation sources (active but not yet imported)
    const sources = await legislationSourceService.getPendingBySourceType("BCLAWS");

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
