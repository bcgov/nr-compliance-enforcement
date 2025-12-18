import { XMLParser } from "fast-xml-parser";

/**
 * Represents a parsed legislation node from BC Laws XML
 * Supports types from all BC Laws schemas:
 * - http://www.bclaws.ca/standards/act.xsd
 * - http://www.bclaws.ca/standards/regulation.xsd
 * - http://www.bclaws.ca/standards/bylaw.xsd
 */
export interface ParsedLegislationNode {
  typeCode: string; // ACT, REG, BYLAW, PART, DIV, RULE, SCHED, SEC, SUBSEC, PAR, SUBPAR, CL, SUBCL, DEF, TEXT
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

// Tags that may contain nested bcl:text for sandwiches or clubhouses
const NESTING_TAGS = ["paragraph", "definition", "subsection", "subparagraph", "clause"];

/**
 * Extracts text content from a node handling various types of content
 */
const extractText = (node: any): string => {
  if (node == null) return "";
  if (typeof node === "string") return node; // Don't trim
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object") {
    const textKeys = ["#text", "in:term", "in:doc", "in:desc", "in:em", "in:strong"];
    const foundKey = textKeys.find((key) => node[key] !== undefined);
    if (foundKey) return extractText(node[foundKey]);
    return Object.keys(node)
      .filter((key) => !key.startsWith("@_"))
      .map((key) => extractText(node[key]))
      .join("");
  }
  return "";
};

let originalXmlString = "";

/**
 * Extracts text from XML string, preserving order of text and inline elements
 */
const extractTextFromXml = (xmlContent: string): string => {
  return xmlContent
    .replaceAll(/<[^<>]*>/g, "") // Remove XML tags
    .replaceAll(/\s+/g, " ") // Whitespace
    .replaceAll(/ {1,10}([,.:;!?])/g, "$1") // Remove spaces before punctuation
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
  if (!textElement) return "";
  if (typeof textElement === "string") return textElement.trim();

  const inlineKeys = ["in:term", "in:doc", "in:desc", "in:em", "in:strong", "bcl:link"];
  const hasInlineElements = inlineKeys.some((key) => textElement[key] !== undefined);

  if (hasInlineElements) {
    const elementId = element?.["@_id"];
    if (elementId && originalXmlString) {
      const rawContent = findBclTextById(elementId, originalXmlString);
      if (rawContent) return extractTextFromXml(rawContent);
    }
  }

  return extractText(textElement).replaceAll(/\s+/g, " ").trim();
};

/**
 * Gets citation number from bcl:num element
 */
const getBclNum = (element: any): string | null => {
  const num = element?.[`${NS_BCL}num`];
  return num ? extractText(num).trim() || null : null;
};

/**
 * Gets marginal note from bcl:marginalnote element
 */
const getMarginalnote = (element: any): string | null => {
  const note = element?.[`${NS_BCL}marginalnote`];
  return note ? extractText(note).replaceAll(/\s+/g, " ").trim() || null : null;
};

/**
 * Ensures a value is an array
 */
const ensureArray = <T>(value: T | T[] | undefined): T[] => {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
};

/**
 * Gets the position of an element from the original XML
 */
const getXmlPosition = (element: any): number => {
  const id = element?.["@_id"];
  if (!id || !originalXmlString) return Infinity;
  const pos = originalXmlString.indexOf(`id="${id}"`);
  return pos > -1 ? pos : Infinity;
};

/**
 * Creates a legislation node
 */
const createNode = (
  typeCode: string,
  order: number,
  overrides: Partial<ParsedLegislationNode> = {},
): ParsedLegislationNode => ({
  typeCode,
  citation: null,
  sectionTitle: null,
  legislationText: null,
  displayOrder: order,
  children: [],
  ...overrides,
});

/**
 * Gets depth for nested elements
 */
const getDepth = (content: string, i: number): number => {
  for (const tag of NESTING_TAGS) {
    if (content.substring(i, i + tag.length + 5) === `<bcl:${tag}`) return 1;
    if (content.substring(i, i + tag.length + 6) === `</bcl:${tag}`) return -1;
  }
  return 0;
};

/**
 * Gets the position bounds of an element
 */
const getBounds = (parentId: string): { content: string; offset: number } | null => {
  if (!parentId || !originalXmlString) return null;

  const parentIdPos = originalXmlString.indexOf(`id="${parentId}"`);
  if (parentIdPos === -1) return null;

  const tagStart = originalXmlString.lastIndexOf("<", parentIdPos);
  const tagEnd = originalXmlString.indexOf(">", parentIdPos);
  if (tagStart === -1 || tagEnd === -1) return null;

  const tagMatch = /^(\S+)/.exec(originalXmlString.substring(tagStart + 1, tagEnd));
  if (!tagMatch) return null;

  const closingPos = originalXmlString.indexOf(`</${tagMatch[1]}>`, tagEnd);
  if (closingPos === -1) return null;

  return { content: originalXmlString.substring(tagEnd + 1, closingPos), offset: tagEnd + 1 };
};

/**
 * Finds positions of multiple bcl:text elements at the same level
 */
const getTextPositions = (parentId: string): Array<{ start: number; end: number }> | null => {
  const bounds = getBounds(parentId);
  if (!bounds) return null;

  const { content, offset } = bounds;
  const positions: Array<{ start: number; end: number }> = [];
  let depth = 0;

  for (let i = 0; i < content.length; i++) {
    if (depth === 0 && content.substring(i, i + 10) === "<bcl:text>") {
      const endIdx = content.indexOf("</bcl:text>", i);
      if (endIdx !== -1) positions.push({ start: offset + i, end: offset + endIdx + 11 });
    }
    depth += getDepth(content, i);
  }

  return positions.length > 1 ? positions : null;
};

/**
 * Parses a paragraph element
 */
const parseText = (parentId: string): ParsedLegislationNode[] => {
  const positions = getTextPositions(parentId);
  if (!positions) return [];

  return positions.map((pos) =>
    createNode("TEXT", pos.start, {
      legislationText: extractTextFromXml(originalXmlString.substring(pos.start + 10, pos.end - 11)) || null,
    }),
  );
};

/**
 * Merges TEXT nodes sorted by position
 * If first child is TEXT use it to set parent legislationText instead of adding it as a node
 */
const mergeText = (children: ParsedLegislationNode[], textNodes: ParsedLegislationNode[]): string | null => {
  if (textNodes.length === 0) return null;

  children.push(...textNodes);
  children.sort((a, b) => a.displayOrder - b.displayOrder);

  const firstText = children[0]?.typeCode === "TEXT" ? (children.shift()?.legislationText ?? null) : null;

  return firstText;
};

type ElementParser = (element: any, order: number) => ParsedLegislationNode;

/**
 * Parses child elements by type, sorted by XML position
 */
const parseOrderedChildren = (
  parent: any,
  childTypes: Array<{ tag: string; parse: ElementParser }>,
): ParsedLegislationNode[] => {
  const elements: Array<{ element: any; xmlPos: number; parse: ElementParser }> = [];

  for (const { tag, parse } of childTypes) {
    ensureArray(parent?.[`${NS_BCL}${tag}`]).forEach((el) => {
      elements.push({ element: el, xmlPos: getXmlPosition(el), parse });
    });
  }

  elements.sort((a, b) => a.xmlPos - b.xmlPos);
  // Use XML position as displayOrder so TEXT nodes can be ordered correctly
  return elements.map((item) => item.parse(item.element, item.xmlPos));
};

/**
 * Parse child elements in sequence, using XML positions as displayOrder
 */
const parseSequentialChildren = (
  parent: any,
  childTypes: Array<{ tag: string; parse: ElementParser }>,
): ParsedLegislationNode[] => {
  const children: ParsedLegislationNode[] = [];

  for (const { tag, parse } of childTypes) {
    ensureArray(parent?.[`${NS_BCL}${tag}`]).forEach((el) => {
      const xmlPos = getXmlPosition(el);
      children.push(parse(el, xmlPos));
    });
  }

  // Sort by XML position to ensure correct order
  children.sort((a, b) => a.displayOrder - b.displayOrder);

  return children;
};

const parseSubclause: ElementParser = (el, order) =>
  createNode("SUBCL", order, {
    citation: getBclNum(el),
    legislationText: getBclText(el) || null,
  });

const parseClause: ElementParser = (el, order) =>
  createNode("CL", order, {
    citation: getBclNum(el),
    legislationText: getBclText(el) || null,
    children: parseSequentialChildren(el, [{ tag: "subclause", parse: parseSubclause }]),
  });

const parseSubparagraph: ElementParser = (el, order) =>
  createNode("SUBPAR", order, {
    citation: getBclNum(el),
    legislationText: getBclText(el) || null,
    children: parseSequentialChildren(el, [{ tag: "clause", parse: parseClause }]),
  });

const parseDefinition: ElementParser = (el, order) => {
  const term = el?.[`${NS_IN}term`] || el?.[`${NS_BCL}text`]?.[`${NS_IN}term`];
  return createNode("DEF", order, {
    sectionTitle: extractText(term) || null,
    legislationText: getBclText(el) || null,
    children: parseSequentialChildren(el, [{ tag: "paragraph", parse: parseParagraph }]),
  });
};

const parseParagraph: ElementParser = (el, order) => {
  const text = parseText(el?.["@_id"]);
  const children = parseOrderedChildren(el, [
    { tag: "subparagraph", parse: parseSubparagraph },
    { tag: "clause", parse: parseClause },
  ]);

  const extractedText = mergeText(children, text);

  return createNode("PAR", order, {
    citation: getBclNum(el),
    legislationText: extractedText ?? (getBclText(el) || null),
    children,
  });
};

const parseSubsection: ElementParser = (el, order) => {
  const text = parseText(el?.["@_id"]);
  const children = parseOrderedChildren(el, [
    { tag: "definition", parse: parseDefinition },
    { tag: "paragraph", parse: parseParagraph },
  ]);

  const extractedText = mergeText(children, text);

  return createNode("SUBSEC", order, {
    citation: getBclNum(el),
    legislationText: extractedText ?? (getBclText(el) || null),
    children,
  });
};

const parseSection: ElementParser = (el, order) => {
  const text = parseText(el?.["@_id"]);
  const children = parseOrderedChildren(el, [
    { tag: "subsection", parse: parseSubsection },
    { tag: "definition", parse: parseDefinition },
    { tag: "paragraph", parse: parseParagraph },
  ]);

  const extractedText = mergeText(children, text);

  return createNode("SEC", order, {
    citation: getBclNum(el),
    sectionTitle: getMarginalnote(el),
    legislationText: extractedText ?? (getBclText(el) || null),
    children,
  });
};

const parseRule: ElementParser = (el, order) =>
  createNode("RULE", order, {
    citation: getBclNum(el),
    sectionTitle: getBclText(el) || getMarginalnote(el),
    children: parseSequentialChildren(el, [{ tag: "section", parse: parseSection }]),
  });

const parseDivision: ElementParser = (el, order) =>
  createNode("DIV", order, {
    citation: getBclNum(el),
    sectionTitle: getBclText(el) || getMarginalnote(el),
    children: parseSequentialChildren(el, [
      { tag: "section", parse: parseSection },
      { tag: "rule", parse: parseRule },
    ]),
  });

let parsePart: ElementParser;

const parseSchedule: ElementParser = (el, order) => {
  const scheduleTitle = el?.[`${NS_BCL}scheduletitle`] || el?.[`${NS_BCL}num`];
  return createNode("SCHED", order, {
    citation: getBclNum(el),
    sectionTitle: extractText(scheduleTitle) || null,
    children: parseSequentialChildren(el, [
      { tag: "part", parse: parsePart },
      { tag: "division", parse: parseDivision },
      { tag: "section", parse: parseSection },
    ]),
  });
};

parsePart = (el, order) =>
  createNode("PART", order, {
    citation: getBclNum(el),
    sectionTitle: getBclText(el) || null,
    children: parseSequentialChildren(el, [
      { tag: "division", parse: parseDivision },
      { tag: "rule", parse: parseRule },
      { tag: "section", parse: parseSection },
      { tag: "schedule", parse: parseSchedule },
    ]),
  });

const parseContent = (content: any): ParsedLegislationNode[] => {
  if (!content) return [];

  const parts = ensureArray(content[`${NS_BCL}part`]);
  const divisions = ensureArray(content[`${NS_BCL}division`]);
  const rules = ensureArray(content[`${NS_BCL}rule`]);

  const children: ParsedLegislationNode[] = [];
  let order = 0;

  parts.forEach((el) => children.push(parsePart(el, ++order)));
  divisions.forEach((el) => children.push(parseDivision(el, ++order)));
  rules.forEach((el) => children.push(parseRule(el, ++order)));

  // Only parse sections if no structural elements exist
  if (parts.length === 0 && divisions.length === 0 && rules.length === 0) {
    ensureArray(content[`${NS_BCL}section`]).forEach((el) => children.push(parseSection(el, ++order)));
  }

  ensureArray(content[`${NS_BCL}schedule`]).forEach((el) => children.push(parseSchedule(el, ++order)));

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
    trimValues: false,
    parseAttributeValue: false,
    parseTagValue: false,
  });

  const parsed = parser.parse(xmlString);

  // Detect document type
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

  // Extract metadata
  const metadata: LegislationMetadata = {
    title: extractText(rootElement[`${nsPrefix}title`]) || extractText(rootElement["title"]) || "Unknown Document",
    chapter: extractText(rootElement[`${nsPrefix}chapter`]) || extractText(rootElement["oicnum"]) || null,
    yearEnacted:
      extractText(rootElement[`${nsPrefix}yearenacted`]) || extractText(rootElement[`${nsPrefix}year`]) || null,
    assentedTo:
      extractText(rootElement[`${nsPrefix}assentedto`]) || extractText(rootElement[`${nsPrefix}deposited`]) || null,
    documentType,
  };

  // Parse content
  const children: ParsedLegislationNode[] = [];
  ensureArray(rootElement[`${nsPrefix}content`]).forEach((content) => {
    children.push(...parseContent(content));
  });

  return {
    metadata,
    root: createNode(documentType, 1, {
      citation: metadata.chapter ? `Chapter ${metadata.chapter}` : null,
      sectionTitle: metadata.title,
      children,
    }),
  };
};
