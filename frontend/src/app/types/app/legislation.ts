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
  CLAUSE = "CL",
  SUBCLAUSE = "SUBCL",
  DEFINITION = "DEF",
  TEXT = "TEXT",
}

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
  SUBPAR = "ms-4",
  CL = "ms-5", //NOSONAR - same indent as subparagraph
  SUBCL = "ms-5", //NOSONAR - same indent as subparagraph
  DEF = "ms-0", //NOSONAR - this is an intentional duplication due to legislation formatting rules
  TEXT = "ms-0", //NOSONAR - text segments inheret parent's indent level but lets set a default
}
