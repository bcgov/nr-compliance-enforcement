import { Logger } from "@nestjs/common";
import { LegislationService } from "../../shared/legislation/legislation.service";
import { ParsedLegislationNode } from "../../shared/legislation/utils/bc-laws-xml-parser";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Context for inserting legislation tree
 */
export interface InsertLegislationContext {
  actTitle: string;
  effectiveDate: Date | null;
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
 * @param legislationSourceGuid - Only set on the root node to link back to the import source
 * @param actGuid - For regulation documents, the parent Act's legislation_guid
 */
export async function insertLegislationTree(
  node: ParsedLegislationNode,
  context: InsertLegislationContext,
  agencyCode: string,
  parentGuid: string | null = null,
  parentFullCitation: string | null = null,
  legislationSourceGuid: string | null = null,
  actGuid: string | null = null,
): Promise<number> {
  const { actTitle, effectiveDate, legislationService, logger } = context;
  let count = 0;

  const fullCitation = buildFullCitation(actTitle, node, parentFullCitation);

  // Only set legislationSourceGuid on root node (when parentGuid is null)
  const sourceGuidForThisNode = parentGuid === null ? legislationSourceGuid : null;

  // For regulation root nodes link to parent Act if provided
  const parentLegislationGuid = parentGuid === null && node.typeCode === "REG" && actGuid ? actGuid : parentGuid;

  try {
    logger.log(`Importing: ${node.typeCode} - ${node.citation || node.sectionTitle || "(root)"}`);
    //await sleep(25); // Rate limiting

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
      agencyCode: agencyCode,
    });

    count++;

    if (parentGuid === null) {
      context.rootLegislationGuid = created.legislation_guid;
    }

    // Recursively insert children (don't pass legislationSourceGuid - only for root)
    for (const child of node.children) {
      count += await insertLegislationTree(child, context, agencyCode, created.legislation_guid, fullCitation, null);
    }
  } catch (error) {
    const errorMsg = `${node.typeCode} - ${node.citation}: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(`Error inserting legislation: ${errorMsg}`);
    context.errors.push(errorMsg);
    // Continue with other nodes even if one fails
  }

  return count;
}
