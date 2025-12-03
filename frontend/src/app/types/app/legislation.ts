/**
 * Legislation type codes matching the BC Laws XML schemas:
 * - http://www.bclaws.ca/standards/act.xsd
 * - http://www.bclaws.ca/standards/regulation.xsd
 * - http://www.bclaws.ca/standards/bylaw.xsd
 */
export enum Legislation {
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
  DEFINITION = "DEF",
}

/**
 * Human-readable labels for legislation type codes
 */
export const LegislationTypeLabels: Record<string, string> = {
  ACT: "Act",
  REG: "Regulation",
  BYLAW: "Bylaw",
  PART: "Part",
  DIV: "Division",
  RULE: "Rule",
  SCHED: "Schedule",
  SEC: "Section",
  SUBSEC: "Subsection",
  PAR: "Paragraph",
  SUBPAR: "Subparagraph",
  DEF: "Definition",
};

/**
 * Top-level legislation types (root documents)
 */
export const RootLegislationTypes = [Legislation.ACT, Legislation.REGULATION, Legislation.BYLAW];

/**
 * CSS indent classes for displaying legislation hierarchy
 */
export enum indentByType {
  SEC = "ms-0",
  SUBSEC = "ms-0", //NOSONAR - this is an intentional duplication due to legislation formatting rules
  PAR = "ms-3",
  SUBPAR = "ms-5",
  DEF = "ms-0",
}
