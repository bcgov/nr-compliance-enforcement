export enum Legislation {
  ACT = "ACT",
  REGULATION = "REG",
  SECTION = "SEC",
  SUBSECTION = "SUBSEC",
  PARAGRAPH = "PAR",
  SUBPARAGRAPH = "SUBPAR",
}

export enum indentByType {
  SEC = "ms-0",
  SUBSEC = "ms-0", //NOSONAR - this is an intentional duplication due to legislation formatting rules
  PAR = "ms-3",
  SUBPAR = "ms-5",
}
