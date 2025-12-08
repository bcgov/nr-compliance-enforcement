import { XMLParser } from "fast-xml-parser";

/**
 * Represents a parsed legislation node from BC Laws XML
 * Supports types from all BC Laws schemas:
 * - http://www.bclaws.ca/standards/act.xsd
 * - http://www.bclaws.ca/standards/regulation.xsd
 * - http://www.bclaws.ca/standards/bylaw.xsd
 */
export interface ParsedLegislationNode {
  typeCode: string; // ACT, REG, BYLAW, PART, DIV, RULE, SCHED, SEC, SUBSEC, PAR, SUBPAR, DEF
  citation: string | null; // e.g., "1", "1(a)", "(a)"
  sectionTitle: string | null; // marginal note or title
  legislationText: string | null;
  displayOrder: number;
  children: ParsedLegislationNode[];
}

/**
 * Metadata extracted from the act/regulation/bylaw
 */
export interface LegislationMetadata {
  title: string;
  chapter: string | null;
  yearEnacted: string | null;
  assentedTo: string | null;
  documentType: "ACT" | "REG" | "BYLAW";
}

/**
 * Result of parsing BC Laws XML
 */
export interface ParsedBcLawsDocument {
  metadata: LegislationMetadata;
  root: ParsedLegislationNode;
}

// XML namespaces used in BC Laws documents
const NS_ACT = "act:";
const NS_REG = "reg:";
const NS_BCL = "bcl:";
const NS_IN = "in:";

/**
 * Extracts text content from a node, handling mixed content (text with inline elements)
 */
const extractText = (node: any): string => {
  if (node === null || node === undefined) {
    return "";
  }
  if (typeof node === "string") {
    return node.trim();
  }
  if (typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join(" ").trim();
  }
  if (typeof node === "object") {
    // Handle text content with inline elements
    if (node["#text"] !== undefined) {
      return extractText(node["#text"]);
    }
    // Try to extract text from common text-containing elements
    const textKeys = ["in:term", "in:doc", "in:desc", "#text"];
    for (const key of textKeys) {
      if (node[key] !== undefined) {
        return extractText(node[key]);
      }
    }
    // Collect all text from nested elements
    let result = "";
    for (const key of Object.keys(node)) {
      if (!key.startsWith("@_")) {
        result += " " + extractText(node[key]);
      }
    }
    return result.trim();
  }
  return "";
};

/**
 * Gets text content from bcl:text element, handling inline elements
 */
const getBclText = (element: any): string => {
  const textElement = element?.[`${NS_BCL}text`];
  if (!textElement) {
    return "";
  }
  return extractText(textElement);
};

/**
 * Gets citation number from bcl:num element
 */
const getBclNum = (element: any): string | null => {
  const numElement = element?.[`${NS_BCL}num`];
  if (!numElement) {
    return null;
  }
  return extractText(numElement) || null;
};

/**
 * Gets marginal note from bcl:marginalnote element
 */
const getMarginalnote = (element: any): string | null => {
  const marginalnote = element?.[`${NS_BCL}marginalnote`];
  if (!marginalnote) {
    return null;
  }
  return extractText(marginalnote) || null;
};

/**
 * Ensures a value is an array
 */
const ensureArray = <T>(value: T | T[] | undefined): T[] => {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

/**
 * Parses a definition element
 */
const parseDefinition = (def: any, order: number): ParsedLegislationNode => {
  const term = def?.[`${NS_IN}term`] || def?.[`${NS_BCL}text`]?.[`${NS_IN}term`];
  const termText = extractText(term);
  const fullText = getBclText(def);

  // Parse nested paragraphs within definition
  const children: ParsedLegislationNode[] = [];
  const paragraphs = ensureArray(def?.[`${NS_BCL}paragraph`]);
  paragraphs.forEach((para, idx) => {
    children.push(parseParagraph(para, idx + 1));
  });

  return {
    typeCode: "DEF",
    citation: null,
    sectionTitle: termText || null,
    legislationText: fullText || null,
    displayOrder: order,
    children,
  };
};

/**
 * Parses a subparagraph element
 */
const parseSubparagraph = (subpara: any, order: number): ParsedLegislationNode => {
  return {
    typeCode: "SUBPAR",
    citation: getBclNum(subpara),
    sectionTitle: null,
    legislationText: getBclText(subpara) || null,
    displayOrder: order,
    children: [],
  };
};

/**
 * Parses a paragraph element
 */
const parseParagraph = (para: any, order: number): ParsedLegislationNode => {
  const children: ParsedLegislationNode[] = [];

  // Parse subparagraphs
  const subparagraphs = ensureArray(para?.[`${NS_BCL}subparagraph`]);
  subparagraphs.forEach((subpara, idx) => {
    children.push(parseSubparagraph(subpara, idx + 1));
  });

  return {
    typeCode: "PAR",
    citation: getBclNum(para),
    sectionTitle: null,
    legislationText: getBclText(para) || null,
    displayOrder: order,
    children,
  };
};

/**
 * Parses a subsection element
 */
const parseSubsection = (subsec: any, order: number): ParsedLegislationNode => {
  const children: ParsedLegislationNode[] = [];

  // Parse definitions
  const definitions = ensureArray(subsec?.[`${NS_BCL}definition`]);
  definitions.forEach((def, idx) => {
    children.push(parseDefinition(def, idx + 1));
  });

  // Parse paragraphs
  const paragraphs = ensureArray(subsec?.[`${NS_BCL}paragraph`]);
  paragraphs.forEach((para, idx) => {
    children.push(parseParagraph(para, definitions.length + idx + 1));
  });

  return {
    typeCode: "SUBSEC",
    citation: getBclNum(subsec),
    sectionTitle: null,
    legislationText: getBclText(subsec) || null,
    displayOrder: order,
    children,
  };
};

/**
 * Parses a section element
 */
const parseSection = (section: any, order: number): ParsedLegislationNode => {
  const children: ParsedLegislationNode[] = [];
  let childOrder = 0;

  // Parse subsections
  const subsections = ensureArray(section?.[`${NS_BCL}subsection`]);
  subsections.forEach((subsec) => {
    children.push(parseSubsection(subsec, ++childOrder));
  });

  // Parse definitions directly in section
  const definitions = ensureArray(section?.[`${NS_BCL}definition`]);
  definitions.forEach((def) => {
    children.push(parseDefinition(def, ++childOrder));
  });

  // Parse paragraphs directly in section
  const paragraphs = ensureArray(section?.[`${NS_BCL}paragraph`]);
  paragraphs.forEach((para) => {
    children.push(parseParagraph(para, ++childOrder));
  });

  // Get the main text content (if any, outside subsections)
  const mainText = getBclText(section);

  return {
    typeCode: "SEC",
    citation: getBclNum(section),
    sectionTitle: getMarginalnote(section),
    legislationText: mainText || null,
    displayOrder: order,
    children,
  };
};

/**
 * Parses a rule element (specific to regulations)
 */
const parseRule = (rule: any, order: number): ParsedLegislationNode => {
  const children: ParsedLegislationNode[] = [];
  let childOrder = 0;

  // Rules can contain sections
  const sections = ensureArray(rule?.[`${NS_BCL}section`]);
  sections.forEach((section) => {
    children.push(parseSection(section, ++childOrder));
  });

  return {
    typeCode: "RULE",
    citation: getBclNum(rule),
    sectionTitle: getBclText(rule) || getMarginalnote(rule),
    legislationText: null,
    displayOrder: order,
    children,
  };
};

/**
 * Parses a division element
 */
const parseDivision = (division: any, order: number): ParsedLegislationNode => {
  const children: ParsedLegislationNode[] = [];
  let childOrder = 0;

  // Divisions can contain sections
  const sections = ensureArray(division?.[`${NS_BCL}section`]);
  sections.forEach((section) => {
    children.push(parseSection(section, ++childOrder));
  });

  // Divisions can contain rules (in regulations)
  const rules = ensureArray(division?.[`${NS_BCL}rule`]);
  rules.forEach((rule) => {
    children.push(parseRule(rule, ++childOrder));
  });

  return {
    typeCode: "DIV",
    citation: getBclNum(division),
    sectionTitle: getBclText(division) || getMarginalnote(division),
    legislationText: null,
    displayOrder: order,
    children,
  };
};

/**
 * Parses a schedule element
 */
const parseSchedule = (schedule: any, order: number): ParsedLegislationNode => {
  const children: ParsedLegislationNode[] = [];
  let childOrder = 0;

  // Schedules can contain parts, divisions, sections
  const parts = ensureArray(schedule?.[`${NS_BCL}part`]);
  parts.forEach((part) => {
    children.push(parsePart(part, ++childOrder));
  });

  const divisions = ensureArray(schedule?.[`${NS_BCL}division`]);
  divisions.forEach((division) => {
    children.push(parseDivision(division, ++childOrder));
  });

  const sections = ensureArray(schedule?.[`${NS_BCL}section`]);
  sections.forEach((section) => {
    children.push(parseSection(section, ++childOrder));
  });

  // Get schedule title/number
  const scheduleTitle = schedule?.[`${NS_BCL}scheduletitle`] || schedule?.[`${NS_BCL}num`];

  return {
    typeCode: "SCHED",
    citation: getBclNum(schedule),
    sectionTitle: extractText(scheduleTitle) || null,
    legislationText: null,
    displayOrder: order,
    children,
  };
};

/**
 * Parses a part element
 */
const parsePart = (part: any, order: number): ParsedLegislationNode => {
  const children: ParsedLegislationNode[] = [];
  let childOrder = 0;

  // Parse divisions within the part
  const divisions = ensureArray(part?.[`${NS_BCL}division`]);
  divisions.forEach((division) => {
    children.push(parseDivision(division, ++childOrder));
  });

  // Parse rules within the part (for regulations)
  const rules = ensureArray(part?.[`${NS_BCL}rule`]);
  rules.forEach((rule) => {
    children.push(parseRule(rule, ++childOrder));
  });

  // Parse sections within the part
  const sections = ensureArray(part?.[`${NS_BCL}section`]);
  sections.forEach((section) => {
    children.push(parseSection(section, ++childOrder));
  });

  // Parse schedules within the part
  const schedules = ensureArray(part?.[`${NS_BCL}schedule`]);
  schedules.forEach((schedule) => {
    children.push(parseSchedule(schedule, ++childOrder));
  });

  return {
    typeCode: "PART",
    citation: getBclNum(part),
    sectionTitle: getBclText(part) || null,
    legislationText: null,
    displayOrder: order,
    children,
  };
};

/**
 * Parses content elements (shared between act and regulation)
 */
const parseContent = (content: any): ParsedLegislationNode[] => {
  const children: ParsedLegislationNode[] = [];
  let childOrder = 0;

  if (!content) return children;

  // Parse parts
  const parts = ensureArray(content[`${NS_BCL}part`]);
  parts.forEach((part) => {
    children.push(parsePart(part, ++childOrder));
  });

  // Parse divisions directly under content
  const divisions = ensureArray(content[`${NS_BCL}division`]);
  divisions.forEach((division) => {
    children.push(parseDivision(division, ++childOrder));
  });

  // Parse rules directly under content (regulations)
  const rules = ensureArray(content[`${NS_BCL}rule`]);
  rules.forEach((rule) => {
    children.push(parseRule(rule, ++childOrder));
  });

  // Parse sections directly under content (if no parts)
  if (parts.length === 0 && divisions.length === 0 && rules.length === 0) {
    const sections = ensureArray(content[`${NS_BCL}section`]);
    sections.forEach((section) => {
      children.push(parseSection(section, ++childOrder));
    });
  }

  // Parse schedules
  const schedules = ensureArray(content[`${NS_BCL}schedule`]);
  schedules.forEach((schedule) => {
    children.push(parseSchedule(schedule, ++childOrder));
  });

  return children;
};

/**
 * Parses BC Laws XML document and returns structured legislation data
 * Supports Act, Regulation, and Bylaw schemas
 */
export const parseBcLawsXml = (xmlString: string): ParsedBcLawsDocument => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    preserveOrder: false,
    trimValues: true,
    parseAttributeValue: false,
    parseTagValue: false,
  });

  const parsed = parser.parse(xmlString);

  // Detect document type and get root element
  let rootElement: any = null;
  let documentType: "ACT" | "REG" | "BYLAW";
  let nsPrefix = NS_ACT;

  if (parsed[`${NS_ACT}act`]) {
    rootElement = parsed[`${NS_ACT}act`];
    documentType = "ACT";
    nsPrefix = NS_ACT;
  } else if (parsed[`${NS_REG}regulation`]) {
    rootElement = parsed[`${NS_REG}regulation`];
    documentType = "REG";
    nsPrefix = NS_REG;
  } else if (parsed[`${NS_REG}bylaw`] || parsed["bylaw:bylaw"]) {
    rootElement = parsed[`${NS_REG}bylaw`] || parsed["bylaw:bylaw"];
    documentType = "BYLAW";
    nsPrefix = NS_REG;
  }

  if (!rootElement) {
    throw new Error("Unable to find root element (act:act, reg:regulation, or bylaw) in BC Laws XML");
  }

  // Extract metadata - field names vary slightly between schemas
  const metadata: LegislationMetadata = {
    title: extractText(rootElement[`${nsPrefix}title`]) || extractText(rootElement["title"]) || "Unknown Document",
    chapter: extractText(rootElement[`${nsPrefix}chapter`]) || extractText(rootElement["oicnum"]) || null,
    yearEnacted:
      extractText(rootElement[`${nsPrefix}yearenacted`]) || extractText(rootElement[`${nsPrefix}year`]) || null,
    assentedTo:
      extractText(rootElement[`${nsPrefix}assentedto`]) || extractText(rootElement[`${nsPrefix}deposited`]) || null,
    documentType,
  };

  // Parse all content elements
  const contentElements = ensureArray(rootElement[`${nsPrefix}content`]);
  const children: ParsedLegislationNode[] = [];

  contentElements.forEach((content) => {
    children.push(...parseContent(content));
  });

  // Create root node representing the document itself
  const root: ParsedLegislationNode = {
    typeCode: documentType,
    citation: metadata.chapter ? `Chapter ${metadata.chapter}` : null,
    sectionTitle: metadata.title,
    legislationText: null,
    displayOrder: 1,
    children,
  };

  return {
    metadata,
    root,
  };
};
