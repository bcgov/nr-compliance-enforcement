import { Logger } from "@nestjs/common";
import { LegislationService } from "../../shared/legislation/legislation.service";
import { LegislationSourceService } from "../../shared/legislation_source/legislation_source.service";
import { LegislationVersionService } from "../../shared/legislation_version/legislation_version.service";
import { ImportableLegislationVersion } from "../../shared/legislation_version/dto/legislation-version";
import { fetchXml, getBcLawsRegulations, Regulation } from "../../external_api/laws-service";
import { parseBcLawsXml, ParsedBcLawsDocument } from "../../shared/legislation/utils/bc-laws-xml-parser";
import { getLegislationFetchUrl } from "../../shared/legislation/utils/legislation-url-builder";
import {
  compareRegulationsToPreviousVersion,
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
  addedRegs: string[];
  removedRegs: string[];
}

/**
 * Imports regulations for an Act version from its regulationsSourceUrl
 */
async function importRegulations(
  actVersion: ImportableLegislationVersion,
  actRootGuid: string,
  legislationService: LegislationService,
  legislationSourceService: LegislationSourceService,
  legislationVersionService: LegislationVersionService,
  logger: Logger,
  errors: string[],
): Promise<RegulationImportResult> {
  const result: RegulationImportResult = {
    totalRecords: 0,
    totalRegulations: 0,
    successfulRegs: 0,
    failedRegs: 0,
    skippedRegs: 0,
    addedRegs: [],
    removedRegs: [],
  };

  if (!actVersion.source.regulationsSourceUrl) {
    return result;
  }

  logger.log(`\nFetching regulations...`);

  try {
    const regulations = await getBcLawsRegulations(actVersion.source.regulationsSourceUrl);
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
        actVersion,
        legislationService,
        legislationSourceService,
        legislationVersionService,
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

    const comparison = await compareRegulationsToPreviousVersion(
      actVersion.legislationVersionGuid,
      regulations.filter((reg) => reg.status !== "Repealed"),
      legislationVersionService,
    );
    result.addedRegs = comparison.addedRegs;
    result.removedRegs = comparison.removedRegs;

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
  actVersion: ImportableLegislationVersion,
  legislationService: LegislationService,
  legislationSourceService: LegislationSourceService,
  legislationVersionService: LegislationVersionService,
  logger: Logger,
  errors: string[],
): Promise<number> {
  logger.log(`  Importing: ${reg.title}`);

  try {
    const fetchUrl = getLegislationFetchUrl(actVersion.source.sourceType, reg.id);
    logger.log(`  URL: ${fetchUrl}`);
    const xmlString = await fetchXml(fetchUrl, "BC Laws API");
    const parsedDocument = parseBcLawsXml(xmlString);

    const regSource = await legislationSourceService.upsertRegulationSource(
      actVersion.source.legislationSourceGuid,
      reg.id,
      parsedDocument.metadata.title,
      actVersion.source.sourceType,
    );

    const regVersion = await legislationVersionService.upsertRegulationVersion(
      actVersion.legislationVersionGuid,
      regSource.legislationSourceGuid,
    );

    await legislationVersionService.recordFetchedDocument(
      regVersion.legislationVersionGuid,
      fetchUrl,
      parseEffectiveDate(parsedDocument.metadata.assentedTo),
    );

    const context: InsertLegislationContext = {
      actTitle: parsedDocument.metadata.title,
      legislationVersionGuid: regVersion.legislationVersionGuid,
      legislationService,
      logger,
      errors: [],
    };

    const count = await insertLegislationTree(
      parsedDocument.root,
      context,
      actVersion.source.agencyCode,
      actRootGuid, // Link regulation to parent Act
      null, // parentFullCitation
      true, // isRegulationRoot
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
 * Imports a single BC Laws XML document for a legislation version
 */
async function importLegislationVersion(
  version: ImportableLegislationVersion,
  legislationService: LegislationService,
  legislationSourceService: LegislationSourceService,
  legislationVersionService: LegislationVersionService,
  logger: Logger,
): Promise<number> {
  const source = version.source;

  logger.log(`\n--- Importing: ${source.shortDescription} ---`);
  logger.log(`URL: ${source.sourceUrl}`);
  logger.log(`Agency: ${source.agencyCode}`);
  logger.log(`Effective date: ${version.effectiveDate}`);

  try {
    // Clear anything an earlier run of this version imported
    await legislationService.deleteByVersion(
      await legislationVersionService.getActAndRegulationVersionGuids(version.legislationVersionGuid),
    );

    // Fetch the XML document
    const xmlString = await fetchXml(source.sourceUrl, "BC Laws API");
    logger.log(`Received XML document (${xmlString.length} characters)`);

    // Parse the XML
    const parsedDocument: ParsedBcLawsDocument = parseBcLawsXml(xmlString);
    logger.log(`Parsed legislation: ${parsedDocument.metadata.title}`);
    logger.log(`Document type: ${parsedDocument.metadata.documentType}`);
    logger.log(`Chapter: ${parsedDocument.metadata.chapter}, Year: ${parsedDocument.metadata.yearEnacted}`);

    await legislationVersionService.recordFetchedDocument(
      version.legislationVersionGuid,
      source.sourceUrl,
      parseEffectiveDate(parsedDocument.metadata.assentedTo),
    );

    // Build full citation prefix
    const actTitle = parsedDocument.metadata.title;

    // Insert the legislation tree recursively
    const context: InsertLegislationContext = {
      actTitle,
      legislationVersionGuid: version.legislationVersionGuid,
      legislationService,
      logger,
      errors: [],
    };
    let insertedCount = await insertLegislationTree(parsedDocument.root, context, source.agencyCode);

    // Import regulations if regulationsSourceUrl is provided
    let regResult: RegulationImportResult | null = null;
    if (source.regulationsSourceUrl && context.rootLegislationGuid) {
      regResult = await importRegulations(
        version,
        context.rootLegislationGuid,
        legislationService,
        legislationSourceService,
        legislationVersionService,
        logger,
        context.errors,
      );
      insertedCount += regResult.totalRecords;
    }

    // Build the success/error log with regulation stats
    const buildLogMessage = () => {
      let msg = `Imported ${insertedCount} records from ${parsedDocument.metadata.title}`;
      if (!regResult) {
        return msg;
      }
      if (regResult.totalRegulations > 0) {
        msg += `\nRegulations: ${regResult.successfulRegs} of ${regResult.totalRegulations} imported successfully`;
        if (regResult.skippedRegs > 0) {
          msg += `, ${regResult.skippedRegs} skipped (Repealed)`;
        }
        if (regResult.failedRegs > 0) {
          msg += `, ${regResult.failedRegs} failed`;
        }
      }
      if (regResult.addedRegs.length > 0) {
        msg += `\nNew regulation(s) since the previous version: ${regResult.addedRegs.join(", ")}`;
      }
      if (regResult.removedRegs.length > 0) {
        msg += `\nRegulation(s) from the previous version not found in this import: ${regResult.removedRegs.join(", ")}`;
      }
      return msg;
    };

    // Check if there were any errors during import
    if (context.errors.length > 0) {
      const errorLog = `Import completed with ${context.errors.length} error(s):\n${buildLogMessage()}\n\nErrors:\n${context.errors.join("\n")}`;
      await legislationVersionService.markFailed(version.legislationVersionGuid, errorLog);
      logger.warn(
        `Completed with errors: ${source.shortDescription} - ${insertedCount} records, ${context.errors.length} errors`,
      );
      return insertedCount;
    }

    await legislationVersionService.markImported(version.legislationVersionGuid, buildLogMessage());

    logger.log(`Completed: ${source.shortDescription} - ${insertedCount} records imported/updated`);
    return insertedCount;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const stackTrace = errorStack ? "\n\nStack trace:\n" + errorStack : "";
    const errorLog = "Import failed: " + errorMessage + stackTrace;

    // Mark the version as failed with error log
    try {
      await legislationVersionService.markFailed(version.legislationVersionGuid, errorLog);
    } catch (markError) {
      logger.error(`Failed to update import status for ${source.shortDescription}:`, markError);
    }

    logger.error(`Error importing ${source.shortDescription}:`, error);
    throw error;
  }
}

/**
 * Imports BC Laws documents for the legislation versions waiting to be imported
 * Versions that have already been imported are skipped
 */
export async function runBcLawsImport(
  legislationService: LegislationService,
  legislationSourceService: LegislationSourceService,
  legislationVersionService: LegislationVersionService,
  logger: Logger,
): Promise<void> {
  logger.log("Starting BC Laws import...");
  logger.log("Fetching legislation versions to import from database...");

  try {
    // Get the pending and failed BC Laws versions of active sources
    const versions = await legislationVersionService.getImportableVersions("BCLAWS");

    if (versions.length === 0) {
      logger.log("No legislation versions to import. All versions have already been imported.");
      logger.log("To re-import a version, set its import_status to PENDING in the legislation_version table.");
      return;
    }

    logger.log(`Found ${versions.length} legislation version(s) to import:`);
    versions.forEach((version, idx) => {
      logger.log(
        `  ${idx + 1}. ${version.source.shortDescription} (${version.source.agencyCode}) effective ${version.effectiveDate}`,
      );
    });

    let totalCount = 0;
    let successCount = 0;
    let failCount = 0;

    // Import each version
    for (const version of versions) {
      try {
        const count = await importLegislationVersion(
          version,
          legislationService,
          legislationSourceService,
          legislationVersionService,
          logger,
        );
        totalCount += count;
        successCount++;
      } catch {
        failCount++;
        // Continue with next version even if one fails
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
