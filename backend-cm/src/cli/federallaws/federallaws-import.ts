import { Logger } from "@nestjs/common";
import { LegislationService } from "../../shared/legislation/legislation.service";
import { LegislationSourceService } from "../../shared/legislation_source/legislation_source.service";
import { LegislationVersionService } from "../../shared/legislation_version/legislation_version.service";
import { ImportableLegislationVersion } from "../../shared/legislation_version/dto/legislation-version";
import { fetchXml, getFederalRegulations, Regulation } from "../../external_api/laws-service";
import {
  parseFederalLawsXml,
  parseFederalRegulationXml,
  ParsedFederalLawsDocument,
} from "../../shared/legislation/utils/federal-laws-xml-parser";
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

type RegulationImportServices = {
  legislationService: LegislationService;
  legislationSourceService: LegislationSourceService;
  legislationVersionService: LegislationVersionService;
};

// Imports regulations for a federal Act by looking up related regulations via the Justice Canada's github where
// a lookup.xml file contains references to the related regulations, then fetches each regulation
async function importRegulations(
  actVersion: ImportableLegislationVersion,
  actRootGuid: string,
  consolidatedNumber: string,
  services: RegulationImportServices,
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

  logger.log(`\nFetching regulations for ${consolidatedNumber}...`);

  try {
    const regulations = await getFederalRegulations(consolidatedNumber);
    result.totalRegulations = regulations.length;
    logger.log(`Found ${regulations.length} regulation(s) to import`);

    for (const reg of regulations) {
      const recordCount = await importSingleRegulation(reg, actRootGuid, actVersion, services, logger, errors);
      if (recordCount > 0) {
        result.successfulRegs++;
        result.totalRecords += recordCount;
      } else if (recordCount === -1) {
        result.skippedRegs++;
      } else {
        result.failedRegs++;
      }
    }

    const comparison = await compareRegulationsToPreviousVersion(
      actVersion.legislationVersionGuid,
      regulations,
      services.legislationVersionService,
    );
    result.addedRegs = comparison.addedRegs;
    result.removedRegs = comparison.removedRegs;

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
  actVersion: ImportableLegislationVersion,
  services: RegulationImportServices,
  logger: Logger,
  errors: string[],
): Promise<number> {
  const { legislationService, legislationSourceService, legislationVersionService } = services;
  logger.log(`  Importing: ${reg.title}`);

  try {
    const fetchUrl = getLegislationFetchUrl(actVersion.source.sourceType, reg.id);
    logger.log(`  URL: ${fetchUrl}`);
    const xmlString = await fetchXml(fetchUrl, "Federal Laws API", true);
    const parsedDocument = parseFederalRegulationXml(xmlString);

    // Skip regulations whose XML has no body content
    if (parsedDocument.root.children.length === 0) {
      logger.warn(`  Skipped: ${parsedDocument.metadata.title} (XML contains no body content)`);
      return -1;
    }

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
      parseEffectiveDate(parsedDocument.metadata.inForceStartDate),
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
 * Imports a Federal Laws XML document for a legislation version
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

    // Fetch the XML
    const xmlString = await fetchXml(source.sourceUrl, "Federal Laws API", true);
    logger.log(`Received XML document (${xmlString.length} characters)`);

    // Parse the XML
    const parsedDocument: ParsedFederalLawsDocument = parseFederalLawsXml(xmlString);
    logger.log(`Parsed legislation: ${parsedDocument.metadata.title}`);
    logger.log(`Document type: ${parsedDocument.metadata.documentType}`);
    logger.log(`Consolidated number: ${parsedDocument.metadata.consolidatedNumber}`);

    await legislationVersionService.recordFetchedDocument(
      version.legislationVersionGuid,
      source.sourceUrl,
      parseEffectiveDate(parsedDocument.metadata.inForceStartDate),
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

    // Import regulations
    let regResult: RegulationImportResult | null = null;
    if (parsedDocument.metadata.consolidatedNumber && context.rootLegislationGuid) {
      regResult = await importRegulations(
        version,
        context.rootLegislationGuid,
        parsedDocument.metadata.consolidatedNumber,
        { legislationService, legislationSourceService, legislationVersionService },
        logger,
        context.errors,
      );
      insertedCount += regResult.totalRecords;
    }

    const buildLogMessage = () => {
      let msg = `Imported ${insertedCount} records from ${parsedDocument.metadata.title}`;
      if (!regResult) {
        return msg;
      }
      if (regResult.totalRegulations > 0) {
        msg += `\nRegulations: ${regResult.successfulRegs} of ${regResult.totalRegulations} imported successfully`;
        if (regResult.skippedRegs > 0) {
          msg += `, ${regResult.skippedRegs} skipped (no content)`;
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
 * Imports Federal Laws documents for the legislation versions waiting to be imported
 * Versions that have already been imported are skipped
 */
export async function runFederalLawsImport(
  legislationService: LegislationService,
  legislationSourceService: LegislationSourceService,
  legislationVersionService: LegislationVersionService,
  logger: Logger,
): Promise<void> {
  logger.log("Starting Federal Laws import...");
  logger.log("Fetching legislation versions to import from database...");

  try {
    // Get the pending and failed federal versions of active sources
    const versions = await legislationVersionService.getImportableVersions("FEDERAL");

    if (versions.length === 0) {
      logger.log("No legislation versions to import. All versions have already been imported.");
      logger.log("To re-import a version, set its import_status to PENDING in the legislation_version table.");
      return;
    }

    logger.log(`Found ${versions.length} federal legislation version(s) to import:`);
    versions.forEach((version, idx) => {
      logger.log(
        `  ${idx + 1}. ${version.source.shortDescription} (${version.source.agencyCode}) effective ${version.effectiveDate}`,
      );
    });

    let totalCount = 0;
    let successCount = 0;
    let failCount = 0;

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
