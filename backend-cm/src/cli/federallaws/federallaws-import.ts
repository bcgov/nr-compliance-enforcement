import { Logger } from "@nestjs/common";
import { LegislationService } from "../../shared/legislation/legislation.service";
import { LegislationSourceService } from "../../shared/legislation_source/legislation_source.service";
import { LegislationSource } from "../../shared/legislation_source/dto/legislation-source";
import { getFederalLawsXml } from "../../external_api/federal-laws-service";
import { parseFederalLawsXml, ParsedFederalLawsDocument } from "../../shared/legislation/utils/federal-laws-xml-parser";
import {
  InsertLegislationContext,
  insertLegislationTree,
  parseEffectiveDate,
} from "../shared/legislation-import-utils";

/**
 * Imports a Federal Laws XML document
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
    // Fetch the XML
    const xmlString = await getFederalLawsXml(source.sourceUrl);
    logger.log(`Received XML document (${xmlString.length} characters)`);

    // Parse the XML
    const parsedDocument: ParsedFederalLawsDocument = parseFederalLawsXml(xmlString);
    logger.log(`Parsed legislation: ${parsedDocument.metadata.title}`);
    logger.log(`Document type: ${parsedDocument.metadata.documentType}`);
    logger.log(`Consolidated number: ${parsedDocument.metadata.consolidatedNumber}`);

    const effectiveDate = parseEffectiveDate(parsedDocument.metadata.inForceStartDate);

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
    const insertedCount = await insertLegislationTree(
      parsedDocument.root,
      context,
      null,
      null,
      source.legislationSourceGuid,
    );

    const buildLogMessage = () => {
      return `Imported ${insertedCount} records from ${parsedDocument.metadata.title}`;
    };

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
 * Imports pending Federal Laws documents from the legislation_source table
 * Sources that have already been imported (imported_ind = true) are skipped
 */
export async function runFederalLawsImport(
  legislationService: LegislationService,
  legislationSourceService: LegislationSourceService,
  logger: Logger,
): Promise<void> {
  logger.log("Starting Federal Laws import...");
  logger.log("Fetching pending legislation sources from database...");

  try {
    // Get pending federal legislation sources
    const sources = await legislationSourceService.getPendingBySourceType("FEDERAL");

    if (sources.length === 0) {
      logger.log("No pending legislation sources to import. All sources have already been imported.");
      logger.log("To re-import a source, set imported_ind = false in the legislation_source table.");
      return;
    }

    logger.log(`Found ${sources.length} pending federal legislation source(s) to import:`);
    sources.forEach((source, idx) => {
      logger.log(`  ${idx + 1}. ${source.shortDescription} (${source.agencyCode})`);
    });

    let totalCount = 0;
    let successCount = 0;
    let failCount = 0;

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
      }
    }

    logger.log(
      `Total legislation records imported/updated: ${totalCount}, succeeded: ${successCount}, failed: ${failCount}`,
    );
    logger.log("Federal Laws import is complete");
  } catch (error) {
    logger.error("Error(s) during Federal Laws import:", error);
    throw error;
  }
}
