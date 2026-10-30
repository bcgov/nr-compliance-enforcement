import { Legislation } from "@/generated/graphql";

/**
 * Legislation type codes matching the BC Laws XML schemas:
 * - http://www.bclaws.ca/standards/act.xsd
 * - http://www.bclaws.ca/standards/regulation.xsd
 * - http://www.bclaws.ca/standards/bylaw.xsd
 */
export enum LegislationType {
  // Top-level document types
  ACT = "ACT",
  REGULATION = "REG",
  BYLAW = "BYLAW",

  // Structural elements
  PART = "PART",
  DIVISION = "DIV",
  RULE = "RULE",
  SCHEDULE = "SCHED",

  // Content elements
  SECTION = "SEC",
  SUBSECTION = "SUBSEC",
  PARAGRAPH = "PAR",
  SUBPARAGRAPH = "SUBPAR",
  CLAUSE = "CL",
  SUBCLAUSE = "SUBCL",
  DEFINITION = "DEF",
  TEXT = "TEXT",
  TABLE = "TABLE",
}

/**
 * Top-level legislation types (root documents)
 */
export const RootLegislationTypes = [LegislationType.ACT, LegislationType.REGULATION, LegislationType.BYLAW];

/**
 * CSS indent classes for displaying legislation hierarchy
 */
export enum indentByType {
  SEC = "legislation-indent-0",
  SUBSEC = "legislation-indent-0", //NOSONAR - this is an intentional duplication due to legislation formatting rules
  PAR = "legislation-indent-1",
  SUBPAR = "legislation-indent-2",
  CL = "legislation-indent-3", //NOSONAR - same indent as subparagraph
  SUBCL = "legislation-indent-4", //NOSONAR - same indent as subparagraph
  DEF = "legislation-indent-0", //NOSONAR - this is an intentional duplication due to legislation formatting rules
  TEXT = "legislation-indent-0", //NOSONAR - text segments inherit parent's indent level but lets set a default
  TABLE = "legislation-indent-0", //NOSONAR - tables are displayed at root level
  SCHED = "legislation-indent-0", //NOSONAR - schedules are structural elements like parts
  DIV = "legislation-indent-0", //NOSONAR - divisions are structural elements like parts
}

export interface LegislationCitationLine {
  type: string;
  citation: string;
  text: string;
}

export interface LegislationCitationParts {
  actName: string;
  isRegulation: boolean;
  sectionFullCitation: string;
  sectionTitle: string;
  subsections: LegislationCitationLine[];
}

const getNodeText = (node: Legislation): string => node.alternateText ?? node.legislationText ?? "";

// A subsection without a citation is numbered (1), matching the contravention form and legislation admin
const getNodeCitation = (node: Legislation): string =>
  node.citation || (node.legislationTypeCode === LegislationType.SUBSECTION ? "1" : "");

/**
 * Breaks a legislation node and its ancestors into display parts: the act, the section heading
 * and one line per node below the section. A section with both a title and text also gets a line
 * for its text. Other nodes above the section (part, division) are covered by the section's full
 * citation.
 */
export const buildLegislationCitationParts = (legislation: Legislation): LegislationCitationParts => {
  // Ancestors are returned nearest-first; reverse so the chain runs from the act down to the target
  const ancestors = (legislation.ancestors ?? []).filter((node): node is Legislation => !!node).toReversed();
  const chain = [...ancestors, legislation];

  const subsections: LegislationCitationLine[] = [];
  let actName = "";
  let isRegulation = false;
  let section: Legislation | undefined;

  for (const node of chain) {
    const type = node.legislationTypeCode;
    if (type === LegislationType.ACT) {
      actName = node.sectionTitle ?? "";
    } else if (type === LegislationType.REGULATION) {
      isRegulation = true;
    } else if (type === LegislationType.SECTION) {
      section = node;
      // The title goes in the heading, so the text needs its own line (same as legislation admin)
      if (node.sectionTitle && getNodeText(node)) {
        subsections.push({ type: LegislationType.SECTION, citation: "", text: getNodeText(node) });
      }
    } else if (section) {
      subsections.push({ type: type ?? "", citation: getNodeCitation(node), text: getNodeText(node) });
    }
  }

  return {
    actName,
    isRegulation,
    sectionFullCitation: section?.fullCitation ?? "",
    sectionTitle: section ? (section.sectionTitle ?? getNodeText(section)) : "",
    subsections,
  };
};
