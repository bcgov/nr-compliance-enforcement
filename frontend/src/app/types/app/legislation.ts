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
