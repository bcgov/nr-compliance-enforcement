import { XMLParser } from "fast-xml-parser";

/**
 * Represents a parsed legislation node from BC Laws XML
 * Supports types from all BC Laws schemas:
 * - http://www.bclaws.ca/standards/act.xsd
 * - http://www.bclaws.ca/standards/regulation.xsd
 * - http://www.bclaws.ca/standards/bylaw.xsd
 */
export interface ParsedLegislationNode {
  typeCode: string; // ACT, REG, BYLAW, PART, DIV, RULE, SCHED, SEC, SUBSEC, PAR, SUBPAR, CL, SUBCL, DEF
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
 * Extracts text from an object node
 */
const extractTextFromObject = (node: Record<string, any>, extractFn: (n: any) => string): string => {
  // Keys that contain text content (inline elements)
  const textKeys = ["#text", "in:term", "in:doc", "in:desc", "in:em", "in:strong"];
  const foundKey = textKeys.find((key) => node[key] !== undefined);
  if (foundKey) {
    return extractFn(node[foundKey]);
  }

  // Collect all text from nested elements skipping attributes
  return Object.keys(node)
    .filter((key) => !key.startsWith("@_"))
    .map((key) => extractFn(node[key]))
    .join("");
};

/**
 * Extracts text content from a node handling various types of content
 */
const extractText = (node: any): string => {
  if (node == null) return "";
  if (typeof node === "string") return node; // Don't trim
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object") return extractTextFromObject(node, extractText);
  return "";
};

let originalXmlString = "";

/**
 * Extracts text from XML string, preserving order of text and inline elements
 */
const extractTextFromXml = (xmlContent: string): string => {
  return xmlContent
    .replace(/<[^<>]*>/g, "") // Remove XML tags
    .replace(/\s+/g, " ") // Whitespace
    .replace(/ {1,10}([,.:;!?])/g, "$1") // Remove up to 10 consecutive spaces before punctuation, bound to 10 spaces because sonar
    .trim();
};

/**
 * Finds the <bcl:text> content for an element by ID
 */
const findBclTextById = (elementId: string, xml: string): string | null => {
  const id = xml.indexOf(`id="${elementId}"`);
  const start = id > -1 ? xml.indexOf("<bcl:text>", id) + 10 : -1; // 10 = "<bcl:text>".length
  const end = start > 9 ? xml.indexOf("</bcl:text>", start) : -1;
  return end > -1 ? xml.substring(start, end) : null;
};

/**
 * Gets text content from bcl:text element preserving order of mixed content
 * For elements with inline content (in:desc, in:term, etc.) gets from original XML
 */
const getBclText = (element: any): string => {
  const textElement = element?.[`${NS_BCL}text`];
  if (!textElement) {
    return "";
  }

  // For simple string content, return directly
  if (typeof textElement === "string") {
    return textElement.trim();
  }

  // Check if it has inline elements that need ordered extraction
  const inlineKeys = ["in:term", "in:doc", "in:desc", "in:em", "in:strong", "bcl:link"];
  const hasInlineElements = inlineKeys.some((key) => textElement[key] !== undefined);

  if (!hasInlineElements) {
    // No inline elements, use simple extraction
    return extractText(textElement).replace(/\s+/g, " ").trim();
  }

  // Has inline elements, extract from original XML to preserve text order
  const elementId = element?.["@_id"];
  if (elementId && originalXmlString) {
    const rawContent = findBclTextById(elementId, originalXmlString);
    if (rawContent) {
      return extractTextFromXml(rawContent);
    }
  }

  // No inline elements
  return extractText(textElement).replace(/\s+/g, " ").trim();
};

/**
 * Gets citation number from bcl:num element
 */
const getBclNum = (element: any): string | null => {
  const numElement = element?.[`${NS_BCL}num`];
  if (!numElement) {
    return null;
  }
  return extractText(numElement).trim() || null;
};

/**
 * Gets marginal note from bcl:marginalnote element
 */
const getMarginalnote = (element: any): string | null => {
  const marginalnote = element?.[`${NS_BCL}marginalnote`];
  if (!marginalnote) {
    return null;
  }
  return extractText(marginalnote).replace(/\s+/g, " ").trim() || null;
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
 * Extracts document order from the @_id attribute (e.g., "d2e3905" → 3905)
 */
const getIdOrder = (element: any): number => {
  const id = element?.["@_id"];
  if (!id) return Infinity;
  const match = String(id).match(/\d{1,10}$/);
  return match ? parseInt(match[0], 10) : Infinity;
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
 * Parses a subclause element
 */
const parseSubclause = (subclause: any, order: number): ParsedLegislationNode => {
  return {
    typeCode: "SUBCL",
    citation: getBclNum(subclause),
    sectionTitle: null,
    legislationText: getBclText(subclause) || null,
    displayOrder: order,
    children: [],
  };
};

/**
 * Parses a clause element
 */
const parseClause = (clause: any, order: number): ParsedLegislationNode => {
  const children: ParsedLegislationNode[] = [];

  // Parse subclauses
  const subclauses = ensureArray(clause?.[`${NS_BCL}subclause`]);
  subclauses.forEach((subclause, idx) => {
    children.push(parseSubclause(subclause, idx + 1));
  });

  return {
    typeCode: "CL",
    citation: getBclNum(clause),
    sectionTitle: null,
    legislationText: getBclText(clause) || null,
    displayOrder: order,
    children,
  };
};

/**
 * Parses a subparagraph element
 */
const parseSubparagraph = (subpara: any, order: number): ParsedLegislationNode => {
  const children: ParsedLegislationNode[] = [];

  // Parse clauses
  const clauses = ensureArray(subpara?.[`${NS_BCL}clause`]);
  clauses.forEach((clause, idx) => {
    children.push(parseClause(clause, idx + 1));
  });

  return {
    typeCode: "SUBPAR",
    citation: getBclNum(subpara),
    sectionTitle: null,
    legislationText: getBclText(subpara) || null,
    displayOrder: order,
    children,
  };
};

/**
 * Parses a paragraph element
 */
const parseParagraph = (para: any, order: number): ParsedLegislationNode => {
  const children: ParsedLegislationNode[] = [];
  let childOrder = 0;

  // Parse subparagraphs
  const subparagraphs = ensureArray(para?.[`${NS_BCL}subparagraph`]);
  subparagraphs.forEach((subpara) => {
    children.push(parseSubparagraph(subpara, ++childOrder));
  });

  // Parse clauses (can appear directly under paragraph)
  const clauses = ensureArray(para?.[`${NS_BCL}clause`]);
  clauses.forEach((clause) => {
    children.push(parseClause(clause, ++childOrder));
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
/**
 * Parses a subsection element, sorted by @_id to preserve document order
 */
const parseSubsection = (subsec: any, order: number): ParsedLegislationNode => {
  const elements: Array<{ type: string; element: any; idOrder: number }> = [];

  const definitions = ensureArray(subsec?.[`${NS_BCL}definition`]);
  definitions.forEach((el) => elements.push({ type: "definition", element: el, idOrder: getIdOrder(el) }));

  const paragraphs = ensureArray(subsec?.[`${NS_BCL}paragraph`]);
  paragraphs.forEach((el) => elements.push({ type: "paragraph", element: el, idOrder: getIdOrder(el) }));

  // Sort by document order
  elements.sort((a, b) => a.idOrder - b.idOrder);

  // Parse in document order
  const children: ParsedLegislationNode[] = [];
  elements.forEach((item, idx) => {
    const childOrder = idx + 1;
    if (item.type === "definition") {
      children.push(parseDefinition(item.element, childOrder));
    } else if (item.type === "paragraph") {
      children.push(parseParagraph(item.element, childOrder));
    }
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
 * Parses a section element, sorted by @_id to preserve document order
 */
const parseSection = (section: any, order: number): ParsedLegislationNode => {
  const elements: Array<{ type: string; element: any; idOrder: number }> = [];

  const subsections = ensureArray(section?.[`${NS_BCL}subsection`]);
  subsections.forEach((el) => elements.push({ type: "subsection", element: el, idOrder: getIdOrder(el) }));

  const definitions = ensureArray(section?.[`${NS_BCL}definition`]);
  definitions.forEach((el) => elements.push({ type: "definition", element: el, idOrder: getIdOrder(el) }));

  const paragraphs = ensureArray(section?.[`${NS_BCL}paragraph`]);
  paragraphs.forEach((el) => elements.push({ type: "paragraph", element: el, idOrder: getIdOrder(el) }));

  // Sort by document order
  elements.sort((a, b) => a.idOrder - b.idOrder);

  // Parse in document order
  const children: ParsedLegislationNode[] = [];
  elements.forEach((item, idx) => {
    const childOrder = idx + 1;
    if (item.type === "subsection") {
      children.push(parseSubsection(item.element, childOrder));
    } else if (item.type === "definition") {
      children.push(parseDefinition(item.element, childOrder));
    } else if (item.type === "paragraph") {
      children.push(parseParagraph(item.element, childOrder));
    }
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
  originalXmlString = xmlString;

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    preserveOrder: false,
    trimValues: false, // Preserve whitespace
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
