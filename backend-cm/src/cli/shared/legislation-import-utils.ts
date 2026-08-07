import { Logger } from "@nestjs/common";
import { LegislationService } from "../../shared/legislation/legislation.service";
import { LegislationVersionService } from "../../shared/legislation_version/legislation_version.service";
import { ParsedLegislationNode } from "../../shared/legislation/utils/bc-laws-xml-parser";
import { Regulation } from "../../external_api/laws-service";

export interface RegulationComparison {
  addedRegs: string[];
  removedRegs: string[];
}

/**
 * Context for inserting legislation tree
 */
export interface InsertLegislationContext {
  actTitle: string;
  legislationVersionGuid: string;
  legislationService: LegislationService;
  logger: Logger;
  errors: string[];
  rootLegislationGuid?: string;
}

/**
 * Parses a date string
 */
export function parseEffectiveDate(dateString: string | null): Date | null {
  if (!dateString) {
    return null;
  }
  try {
    const parsed = new Date(dateString);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * Compares the regulations found in this run against those imported under the previous version of the act
 */
export async function compareRegulationsToPreviousVersion(
  actVersionGuid: string,
  regulations: Regulation[],
  legislationVersionService: LegislationVersionService,
): Promise<RegulationComparison> {
  const previousSources = await legislationVersionService.getPreviousRegulationSources(actVersionGuid);

  // Nothing current imported so all regulations are new
  if (previousSources.length === 0) {
    return { addedRegs: [], removedRegs: [] };
  }

  const previousKeys = new Set(previousSources.map((previous) => previous.externalKey));
  const currentKeys = new Set(regulations.map((reg) => reg.id));

  return {
    addedRegs: regulations.filter((reg) => !previousKeys.has(reg.id)).map((reg) => reg.title),
    removedRegs: previousSources
      .filter((previous) => !currentKeys.has(previous.externalKey ?? ""))
      .map((previous) => previous.shortDescription),
  };
}

/**
 * Builds the citation string for a legislation node
 */
export function buildFullCitation(
  actTitle: string,
  node: ParsedLegislationNode,
  parentFullCitation: string | null,
): string {
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
      case "CL":
      case "SUBCL":
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
 * @param isRegulationRoot - Stores the node as a REG regardless of the type the document is parsed as
 */
export async function insertLegislationTree(
  node: ParsedLegislationNode,
  context: InsertLegislationContext,
  agencyCode: string,
  parentGuid: string | null = null,
  parentFullCitation: string | null = null,
  isRegulationRoot: boolean = false,
): Promise<number> {
  const { actTitle, legislationVersionGuid, legislationService, logger } = context;
  let count = 0;

  const fullCitation = buildFullCitation(actTitle, node, parentFullCitation);
  const typeCode = isRegulationRoot ? "REG" : node.typeCode;

  try {
    logger.log(`Importing: ${typeCode} - ${node.citation || node.sectionTitle || "(root)"}`);

    const created = await legislationService.create({
      legislationTypeCode: typeCode,
      legislationVersionGuid: legislationVersionGuid,
      parentLegislationGuid: parentGuid,
      citation: node.citation ?? null,
      fullCitation: fullCitation,
      sectionTitle: node.sectionTitle ?? null,
      legislationText: node.legislationText,
      displayOrder: node.displayOrder,
      createUserId: "system",
      agencyCode: agencyCode,
    });

    count++;

    if (parentGuid === null) {
      context.rootLegislationGuid = created.legislation_guid;
    }

    for (const child of node.children) {
      count += await insertLegislationTree(child, context, agencyCode, created.legislation_guid, fullCitation);
    }
  } catch (error) {
    const errorMsg = `${typeCode} - ${node.citation}: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(`Error inserting legislation: ${errorMsg}`);
    context.errors.push(errorMsg);
    // Continue with other nodes even if one fails
  }

  return count;
}
