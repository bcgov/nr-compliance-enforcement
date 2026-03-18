import { Logger } from "@nestjs/common";
import { LegislationService } from "../../shared/legislation/legislation.service";
import { LegislationSourceService } from "../../shared/legislation_source/legislation_source.service";
import { LegislationSource } from "../../shared/legislation_source/dto/legislation-source";
import {
  fetchXml,
  getFederalRegulations,
  getFederalRegulationXmlUrl,
  Regulation,
} from "../../external_api/laws-service";
import {
  parseFederalLawsXml,
  parseFederalRegulationXml,
  ParsedFederalLawsDocument,
} from "../../shared/legislation/utils/federal-laws-xml-parser";
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

// Imports regulations for a federal Act by looking up related regulations via the Justice Canada's github where
// a lookup.xml file contains references to the related regulations, then fetches each regulation
async function importRegulations(
  source: LegislationSource,
  actRootGuid: string,
  consolidatedNumber: string,
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

  logger.log(`\nFetching regulations for ${consolidatedNumber}...`);

  try {
    const regulations = await getFederalRegulations(consolidatedNumber);
    result.totalRegulations = regulations.length;
    logger.log(`Found ${regulations.length} regulation(s) to import`);

    for (const reg of regulations) {
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
      } else if (recordCount === -1) {
        result.skippedRegs++;
      } else {
        result.failedRegs++;
      }
    }

    if (regulations.length > 0) {
      logger.log(`\nRegulations summary: ${result.successfulRegs} of ${regulations.length} imported successfully`);
      if (result.skippedRegs > 0) {
        logger.warn(`  ${result.skippedRegs} regulation(s) skipped (no body content in XML)`);
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
    const xmlUrl = getFederalRegulationXmlUrl(reg.id);
    logger.log(`  URL: ${xmlUrl}`);
    const xmlString = await fetchXml(xmlUrl, "Federal Laws API");
    const parsedDocument = parseFederalRegulationXml(xmlString);

    // Skip regulations whose XML has no body content
    if (parsedDocument.root.children.length === 0) {
      logger.warn(`  Skipped: ${parsedDocument.metadata.title} (XML contains no body content)`);
      return -1;
    }

    const effectiveDate = parseEffectiveDate(parsedDocument.metadata.inForceStartDate);

    const regSource = await legislationSourceService.createRegulationSource(
      actSource.agencyCode,
      parsedDocument.metadata.title,
      reg.url,
      "FEDERAL",
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
      actSource.agencyCode,
      null,
      null,
      regSource.legislationSourceGuid,
      actRootGuid,
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
    const xmlString = await fetchXml(source.sourceUrl, "Federal Laws API");
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
    let insertedCount = await insertLegislationTree(
      parsedDocument.root,
      context,
      source.agencyCode,
      null,
      null,
      source.legislationSourceGuid,
    );

    // Import regulations
    let regResult: RegulationImportResult | null = null;
    if (parsedDocument.metadata.consolidatedNumber && context.rootLegislationGuid) {
      regResult = await importRegulations(
        source,
        context.rootLegislationGuid,
        parsedDocument.metadata.consolidatedNumber,
        legislationService,
        legislationSourceService,
        logger,
        context.errors,
      );
      insertedCount += regResult.totalRecords;
    }

    const buildLogMessage = () => {
      let msg = `Imported ${insertedCount} records from ${parsedDocument.metadata.title}`;
      if (regResult && regResult.totalRegulations > 0) {
        msg += `\nRegulations: ${regResult.successfulRegs} of ${regResult.totalRegulations} imported successfully`;
        if (regResult.skippedRegs > 0) {
          msg += `, ${regResult.skippedRegs} skipped (no content)`;
        }
        if (regResult.failedRegs > 0) {
          msg += `, ${regResult.failedRegs} failed`;
        }
      }
      return msg;
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
