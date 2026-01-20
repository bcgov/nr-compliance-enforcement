import { XMLParser } from "fast-xml-parser";

/**
 * Represents a parsed legislation node from BC Laws XML
 * Supports types from all BC Laws schemas:
 * - http://www.bclaws.ca/standards/act.xsd
 * - http://www.bclaws.ca/standards/regulation.xsd
 * - http://www.bclaws.ca/standards/bylaw.xsd
 */
export interface ParsedLegislationNode {
  typeCode: string; // ACT, REG, BYLAW, PART, DIV, RULE, SCHED, SEC, SUBSEC, PAR, SUBPAR, CL, SUBCL, DEF, TEXT, TABLE
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
const NS_OASIS = "oasis:";

// Tags that may contain nested bcl:text for sandwiches or clubhouses
const NESTING_TAGS = ["paragraph", "definition", "subsection", "subparagraph", "clause"];

// Keys that contain inline text content
const TEXT_CONTENT_KEYS = ["in:doc", "in:desc", "in:em", "in:strong", "in:sup", "in:sub", "bcl:link", "oasis:line"];

// Maps special XML keys to HTML markup
const getMarkupForKey = (key: string): string | null => {
  if (key === "in:hr") return " <hr/> ";
  if (key === "in:br") return "<br/>";
  return null;
};

// Gets content keys from a node
const getContentKeys = (node: Record<string, unknown>): string[] =>
  Object.keys(node).filter((key) => !key.startsWith("@_") && key !== "#text");

// Extracts text from object keys converting markup tags
const extractFromKeys = (node: Record<string, unknown>, keys: string[]): string =>
  keys.map((key) => getMarkupForKey(key) ?? extractText(node[key])).join("");

// Converts a value to string if it's a string or number
const toStringOrEmpty = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

// Handles #text node with potential sibling markup tags
const extractTextNode = (node: Record<string, unknown>): string => {
  const rawText = node["#text"];
  // Handle #text as string, number, or array as fast-xml-parser is set to return arrays for all mixed content
  let textContent = "";
  if (typeof rawText === "string") {
    textContent = rawText;
  } else if (typeof rawText === "number") {
    textContent = String(rawText);
  } else if (Array.isArray(rawText)) {
    textContent = rawText.map(toStringOrEmpty).join("");
  }

  const otherKeys = getContentKeys(node);

  // If #text is whitespace and there are other content keys, extract from those instead
  if (textContent.trim() === "" && otherKeys.length > 0) {
    return extractFromKeys(node, otherKeys);
  }

  // Append any markup tags that are siblings to #text
  const hrMarkup = otherKeys.includes("in:hr") ? " <hr/> " : "";
  const brMarkup = otherKeys.includes("in:br") ? "<br/>" : "";
  return textContent + hrMarkup + brMarkup;
};

/**
 * Extracts text content from a node handling various types of content
 */
const extractText = (node: any): string => {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");

  if (typeof node !== "object") return "";

  // Handle definitions by wrapping in quotes
  if (node["in:term"] !== undefined) {
    return `"${extractText(node["in:term"])}"`;
  }

  // Handle #text with potential inline elements
  if (node["#text"] !== undefined) {
    const otherKeys = getContentKeys(node);
    if (otherKeys.length > 0) {
      // Mixed content - extract #text and all other keys
      return extractFromKeys(node, ["#text", ...otherKeys]);
    }
    return extractTextNode(node);
  }

  // Check for inline text content elements (when no #text present)
  const foundKey = TEXT_CONTENT_KEYS.find((key) => node[key] !== undefined);
  if (foundKey) return extractText(node[foundKey]);

  // Extract from all content keys
  return extractFromKeys(node, getContentKeys(node));
};

/**
 * Strips HTML markup tags for cases where we don't want formatting such as titles
 */
const stripMarkupTags = (text: string | null | undefined): string =>
  (text ?? "")
    .replaceAll(/<(?:hr|br)\s*\/?>/gi, " ")
    .replaceAll(/\s+/g, " ")
    .trim();

let originalXmlString = "";

// Current table XML being processed (for scoped line searches)
let currentTableXml = "";

/**
 * Extracts text from XML string, preserving order of text and inline elements
 */
const extractTextFromXml = (xmlContent: string): string => {
  return xmlContent
    .replaceAll(/<in:term[^>]*>([\s\S]*?)<\/in:term>/gi, '"$1"') // Wrap terms in quotes
    .replaceAll(/<in:hr\s*\/?>/gi, " <hr/> ") // Convert horizontal rules to HTML tag
    .replaceAll(/<in:br\s*\/?>/gi, "<br/>") // Convert line breaks to HTML tag
    .replaceAll(/<(?!br\/?>|hr\/?>)[^<>]*>/gi, "") // Remove all tags except <br/> and <hr/>
    .replaceAll(/\s+/g, " ") // Normalize whitespace
    .replaceAll(/ {1,10}([,.:;!?])/g, "$1") // Remove spaces before punctuation
    .trim();
};

/**
 * Strips inline element content from text, keeping only the "base" text.
 * Used for matching when inline content order is wrong.
 */
const stripInlineContent = (xmlContent: string): string => {
  return xmlContent
    .replaceAll(/<in:sup[^>]*>[\s\S]*?<\/in:sup>/gi, "")
    .replaceAll(/<in:sub[^>]*>[\s\S]*?<\/in:sub>/gi, "")
    .replaceAll(/<in:em[^>]*>[\s\S]*?<\/in:em>/gi, "")
    .replaceAll(/<in:strong[^>]*>[\s\S]*?<\/in:strong>/gi, "")
    .replaceAll(/<in:term[^>]*>[\s\S]*?<\/in:term>/gi, "")
    .replaceAll(/<[^>]*>/g, "")
    .replaceAll(/\s+/g, " ")
    .trim()
    .toLowerCase();
};

/**
 * Extracts text from raw XML by finding oasis:line elements with inline markup.
 */
const extractLineContentByText = (textSnippet: string, searchXml: string): string | null => {
  if (!textSnippet || !searchXml || textSnippet.length < 5) return null;

  // Because inline content gets appended at the end, extract text before any trailing content
  const searchText = textSnippet
    .replaceAll(/<[^>]*>/g, "")
    .replaceAll(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (searchText.length < 5) return null;

  const lineRegex = /<oasis:line[^>]*>([\s\S]*?)<\/oasis:line>/g;
  let match: RegExpExecArray | null;
  while ((match = lineRegex.exec(searchXml)) !== null) {
    const content = match[1];
    if (!/<in:/.test(content)) continue;

    const baseText = stripInlineContent(content);

    if (baseText.length >= 5 && (searchText.includes(baseText) || baseText === searchText)) {
      return extractTextFromXml(content);
    }
  }

  return null;
};

/**
 * Gets text content from bcl:text element, using raw XML to preserve mixed content order.
 * fast-xml-parser loses the order of text mixed with inline elements so find by parent id
 */
const getBclText = (element: any): string => {
  const textElements = element?.[`${NS_BCL}text`];
  if (!textElements) return "";

  // Parser returns array for bcl:text due to isArray config
  const textElement = Array.isArray(textElements) ? textElements[0] : textElements;
  if (!textElement) return "";
  if (typeof textElement === "string") return textElement.trim();

  // Check if element has inline content that needs order preservation
  const inlineKeys = ["in:term", "in:doc", "in:desc", "in:em", "in:strong", "in:sup", "in:sub", "bcl:link"];
  if (inlineKeys.some((key) => textElement[key] !== undefined)) {
    // Find bcl:text in raw XML by parent ID to get correct content order
    const parentId = element?.["@_id"];
    if (parentId && originalXmlString) {
      const bounds = getBounds(parentId);
      if (bounds) {
        const textMatch = /<bcl:text[^>]*>([\s\S]*?)<\/bcl:text>/.exec(bounds.content);
        if (textMatch && /<in:/.test(textMatch[1])) {
          return extractTextFromXml(textMatch[1]);
        }
      }
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
  return note ? stripMarkupTags(extractText(note)) || null : null;
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
 * Schedule text element tags that need position-based ordering
 */
const SCHEDULE_TEXT_TAGS = [
  "centertext",
  "lefttext",
  "indent1",
  "indent2",
  "indent3",
  "form",
  "list",
  "schedulesubtitle",
];

/**
 * Finds all schedule text elements with their XML positions from raw XML
 * This is needed because these elements often don't have IDs
 */
const getScheduleTextElementsWithPositions = (
  scheduleId: string,
): Array<{ tag: string; position: number; content: string }> => {
  const bounds = getBounds(scheduleId);
  if (!bounds) return [];

  const { content, offset } = bounds;
  const elements: Array<{ tag: string; position: number; content: string }> = [];

  // Build regex to match all schedule text element tags
  const tagPattern = SCHEDULE_TEXT_TAGS.map((t) => `bcl:${t}`).join("|");
  const regex = new RegExp(`<(${tagPattern})(?:\\s[^>]*)?>([\\s\\S]*?)<\\/\\1>`, "g");

  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const fullTag = match[1];
    const tag = fullTag.replace("bcl:", "");
    elements.push({
      tag,
      position: offset + match.index,
      content: match[2],
    });
  }

  return elements;
};

/**
 * Converts a citation string to a sortable number
 */
const getCitationSortOrder = (citation: string | null): number => {
  if (!citation) return Infinity;
  const num = Number.parseFloat(citation);
  return Number.isNaN(num) ? Infinity : num;
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

// Elements that can contain tables
const CHILD_TAG_PATTERNS = [
  { open: /<bcl:section\b/g, close: /<\/bcl:section>/g },
  { open: /<bcl:subsection\b/g, close: /<\/bcl:subsection>/g },
  { open: /<bcl:paragraph\b/g, close: /<\/bcl:paragraph>/g },
  { open: /<bcl:schedule\b/g, close: /<\/bcl:schedule>/g },
  { open: /<bcl:conseqhead\b/g, close: /<\/bcl:conseqhead>/g },
];

/**
 * Counts nesting depth by counting open/close tags
 */
const getNestingDepth = (content: string): number => {
  let depth = 0;
  for (const { open, close } of CHILD_TAG_PATTERNS) {
    open.lastIndex = 0;
    close.lastIndex = 0;
    while (open.exec(content)) depth++;
    while (close.exec(content)) depth--;
  }
  return depth;
};

/**
 * Finds tables that are direct children of a parent element
 */
const getTablesByParentId = (parentId: string | undefined): Array<{ tableId: string; position: number }> => {
  if (!parentId || !originalXmlString) return [];

  const bounds = getBounds(parentId);
  if (!bounds) return [];

  const { content, offset } = bounds;
  const tables: Array<{ tableId: string; position: number }> = [];
  const tableRegex = /<oasis:table\b[^>]*>/g;
  let match: RegExpExecArray | null;

  while ((match = tableRegex.exec(content)) !== null) {
    const posInContent = match.index;
    const beforeTable = content.substring(0, posInContent);

    // If depth > 0 this table is inside a nested element so skip
    if (getNestingDepth(beforeTable) === 0) {
      const absolutePos = offset + posInContent;
      const idMatch = /\bid\s*=\s*["']([^"']+)["']/i.exec(match[0]);
      const tableId = idMatch ? idMatch[1] : `pos_${absolutePos}`;
      tables.push({ tableId, position: absolutePos });
    }
  }

  return tables;
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
 * Parses a text element
 */
const parseTextElement = (parentId: string): ParsedLegislationNode[] => {
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

  // Re-sequence displayOrder for consistent ordering
  children.forEach((child, index) => {
    child.displayOrder = index + 1;
  });

  return firstText;
};

type ElementParser = (element: any, order: number) => ParsedLegislationNode;

/**
 * Parses child elements by type, sorted by XML position
 * NOTE: Does not re-sequence displayOrder
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
  // Keep XML position as displayOrder so mergeText can correctly interleave TEXT nodes
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

  children.forEach((child, index) => {
    child.displayOrder = index + 1;
  });

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
    sectionTitle: stripMarkupTags(extractText(term)) || null,
    legislationText: getBclText(el) || null,
    children: parseSequentialChildren(el, [{ tag: "paragraph", parse: parseParagraph }]),
  });
};

/**
 * Finds table tag start position by position
 */
const findTableByPosition = (posStr: string): number => {
  const tagStart = Number.parseInt(posStr, 10);
  if (Number.isNaN(tagStart) || tagStart < 0) return -1;
  if (!originalXmlString.substring(tagStart, tagStart + 12).startsWith("<oasis:table")) return -1;
  return tagStart;
};

/**
 * Finds table tag start position by id
 */
const findTableById = (tableId: string): number => {
  let idPos = originalXmlString.indexOf(`id="${tableId}"`);
  if (idPos === -1) idPos = originalXmlString.indexOf(`id='${tableId}'`);
  if (idPos === -1) return -1;
  return originalXmlString.lastIndexOf("<oasis:table", idPos);
};

/**
 * Finds the matching closing tag position
 */
const findTableClosePosition = (tagEnd: number): number => {
  let depth = 1;
  let searchPos = tagEnd + 1;

  while (depth > 0 && searchPos < originalXmlString.length) {
    const nextOpen = originalXmlString.indexOf("<oasis:table", searchPos);
    const nextClose = originalXmlString.indexOf("</oasis:table>", searchPos);

    if (nextClose === -1) return -1;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      const openTagEnd = originalXmlString.indexOf(">", nextOpen);
      if (openTagEnd !== -1 && originalXmlString.charAt(openTagEnd - 1) !== "/") {
        depth++;
      }
      searchPos = openTagEnd + 1;
    } else {
      depth--;
      if (depth === 0) return nextClose;
      searchPos = nextClose + 14;
    }
  }
  return -1;
};

/**
 * Parses table XML and extracts text content
 */
const parseTableXml = (tableXml: string): string => {
  const tableParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    preserveOrder: false,
    trimValues: false,
    parseAttributeValue: false,
    parseTagValue: false,
  });

  try {
    const parsed = tableParser.parse(tableXml);
    const table = parsed?.["oasis:table"];
    currentTableXml = tableXml;
    const result = getTableText(table);
    currentTableXml = "";
    return result;
  } catch {
    currentTableXml = "";
    return "";
  }
};

/**
 * Gets table content from the raw XML by table ID or position
 */
const getTableContentById = (tableId: string): string => {
  if (!tableId || !originalXmlString) return "";

  const tagStart = tableId.startsWith("pos_") ? findTableByPosition(tableId.substring(4)) : findTableById(tableId);

  if (tagStart === -1) return "";

  const tagEnd = originalXmlString.indexOf(">", tagStart);
  if (tagEnd === -1 || originalXmlString.charAt(tagEnd - 1) === "/") return "";

  const tableEnd = findTableClosePosition(tagEnd);
  if (tableEnd === -1) return "";

  return parseTableXml(originalXmlString.substring(tagStart, tableEnd + 14));
};

/**
 * Parser for elements handling text and tables
 */
const parseElement = (
  el: any,
  order: number,
  typeCode: string,
  childTypes: Array<{ tag: string; parse: ElementParser }>,
  includeMarginalNote: boolean = false,
): ParsedLegislationNode => {
  const text = parseTextElement(el?.["@_id"]);
  const children = parseOrderedChildren(el, childTypes);

  // Get tables from our pre-built map (based on raw XML analysis)
  const tablesFromMap = getTablesByParentId(el?.["@_id"]);

  // Add tables from the map - each table becomes its own TABLE node
  for (const tableInfo of tablesFromMap) {
    const tableText = getTableContentById(tableInfo.tableId);
    children.push(
      createNode("TABLE", tableInfo.position, {
        // Use table ID as citation to ensure uniqueness for database saving
        citation: tableInfo.tableId,
        legislationText: tableText || null,
      }),
    );
  }

  const extractedText = mergeText(children, text);

  if (text.length === 0 && children.length > 0) {
    children.sort((a, b) => a.displayOrder - b.displayOrder);
    children.forEach((child, index) => {
      child.displayOrder = index + 1;
    });
  }

  return createNode(typeCode, order, {
    citation: getBclNum(el),
    sectionTitle: includeMarginalNote ? getMarginalnote(el) : null,
    legislationText: extractedText ?? (getBclText(el) || null),
    children,
  });
};

const parseParagraph: ElementParser = (el, order) =>
  parseElement(el, order, "PAR", [
    { tag: "subparagraph", parse: parseSubparagraph },
    { tag: "clause", parse: parseClause },
  ]);

const parseSubsection: ElementParser = (el, order) =>
  parseElement(el, order, "SUBSEC", [
    { tag: "definition", parse: parseDefinition },
    { tag: "paragraph", parse: parseParagraph },
  ]);

const parseSection: ElementParser = (el, order) =>
  parseElement(
    el,
    order,
    "SEC",
    [
      { tag: "subsection", parse: parseSubsection },
      { tag: "definition", parse: parseDefinition },
      { tag: "paragraph", parse: parseParagraph },
    ],
    true, // include marginal note
  );

const parseRule: ElementParser = (el, order) =>
  createNode("RULE", order, {
    citation: getBclNum(el),
    sectionTitle: stripMarkupTags(getBclText(el)) || getMarginalnote(el),
    children: parseSequentialChildren(el, [{ tag: "section", parse: parseSection }]),
  });

const parseDivision: ElementParser = (el, order) =>
  createNode("DIV", order, {
    citation: getBclNum(el),
    sectionTitle: stripMarkupTags(getBclText(el)) || getMarginalnote(el),
    children: parseSequentialChildren(el, [
      { tag: "section", parse: parseSection },
      { tag: "rule", parse: parseRule },
    ]),
  });

let parsePart: ElementParser;

/**
 * Parser simple text elements
 */
const parseText: ElementParser = (el, order) =>
  createNode("TEXT", order, {
    legislationText: extractText(el).replaceAll(/\s+/g, " ").trim() || null,
  });

/**
 * Parses form elements within schedules
 */
const parseForm: ElementParser = (el, order) => {
  const formTitle = el?.[`${NS_BCL}formtitle`];
  return createNode("TEXT", order, {
    sectionTitle: formTitle ? stripMarkupTags(extractText(formTitle)) : null,
    legislationText: extractText(el).replaceAll(/\s+/g, " ").trim() || null,
  });
};

const parseSchedule: ElementParser = (el, order) => {
  const scheduleTitle = el?.[`${NS_BCL}scheduletitle`] || el?.[`${NS_BCL}num`];
  const children: ParsedLegislationNode[] = [];

  // Parse structural elements
  const structuralChildren = parseSequentialChildren(el, [
    { tag: "part", parse: parsePart },
    { tag: "division", parse: parseDivision },
    { tag: "section", parse: parseSection },
  ]);
  children.push(...structuralChildren);

  // Use XML positions for correct ordering
  const scheduleId = el?.["@_id"];
  if (scheduleId) {
    const textElementsWithPositions = getScheduleTextElementsWithPositions(scheduleId);
    for (const { tag, position, content } of textElementsWithPositions) {
      const text = extractTextFromXml(content);
      if (tag === "form") {
        // Extract form title if present
        const formTitleMatch = /<bcl:formtitle[^>]*>([\s\S]*?)<\/bcl:formtitle>/i.exec(content);
        children.push(
          createNode("TEXT", position, {
            sectionTitle: formTitleMatch ? stripMarkupTags(extractTextFromXml(formTitleMatch[1])) : null,
            legislationText: text || null,
          }),
        );
      } else {
        children.push(
          createNode("TEXT", position, {
            legislationText: text || null,
          }),
        );
      }
    }
  } else {
    // Fallback to old method if no schedule ID
    const textChildren = parseSequentialChildren(el, [
      { tag: "centertext", parse: parseText },
      { tag: "lefttext", parse: parseText },
      { tag: "form", parse: parseForm },
      { tag: "list", parse: parseText },
      { tag: "schedulesubtitle", parse: parseText },
      { tag: "indent1", parse: parseText },
      { tag: "indent2", parse: parseText },
      { tag: "indent3", parse: parseText },
    ]);
    children.push(...textChildren);
  }

  // Parse tables
  const scheduleTables = getTablesByParentId(el?.["@_id"]);
  if (scheduleTables.length > 0) {
    for (const tableInfo of scheduleTables) {
      children.push(
        createNode("TABLE", tableInfo.position, {
          citation: tableInfo.tableId,
          legislationText: getTableContentById(tableInfo.tableId) || null,
        }),
      );
    }
  } else {
    // Handle tables with no parent ID
    const tables = el?.[`${NS_OASIS}table`];
    if (tables) {
      ensureArray(tables).forEach((table, idx) => {
        const tableId = table?.["@_id"] || `schedule_table_${idx}`;
        const tableContent = getTableContentById(tableId);
        const content = tableContent || getTableText(table);
        if (content) {
          children.push(
            createNode("TABLE", getXmlPosition(table) || idx, {
              citation: tableId,
              legislationText: content,
            }),
          );
        }
      });
    }
  }

  // Sort by XML position and re-sequence
  children.sort((a, b) => a.displayOrder - b.displayOrder);
  children.forEach((child, index) => {
    child.displayOrder = index + 1;
  });

  return createNode("SCHED", order, {
    citation: getBclNum(el),
    sectionTitle: stripMarkupTags(extractText(scheduleTitle)) || null,
    children,
  });
};

/**
 * Checks if there are inline elements that need order handling
 */
const hasInlineElements = (node: any): boolean => {
  if (!node || typeof node !== "object") return false;
  if (Array.isArray(node)) return node.some(hasInlineElements);
  const inlineKeys = ["in:hr", "in:br", "in:sup", "in:sub", "in:em", "in:strong", "in:term", "in:doc", "in:desc"];
  return inlineKeys.some((key) => node[key] !== undefined) || Object.values(node).some(hasInlineElements);
};

/**
 * Extracts text from a table entry, preserving order of mixed content
 */
const getEntryText = (entry: any): string => {
  if (!entry) return "";

  const lines = entry[`${NS_OASIS}line`];
  let result = "";

  if (lines) {
    result = ensureArray(lines)
      .map((line) => extractText(line))
      .join(" ")
      .trim();
  } else {
    const link = entry[`${NS_BCL}link`];
    result = link ? extractText(link).trim() : extractText(entry).trim();
  }

  if (hasInlineElements(entry) && result.length >= 5) {
    const rawContent =
      extractLineContentByText(result, currentTableXml) || extractLineContentByText(result, originalXmlString);
    if (rawContent) return rawContent;
  }

  return result.replaceAll("\n", " ").replaceAll(/\s+/g, " ").trim();
};

/**
 * Generates HTML attributes from table entry attributes
 */
const getEntryAttributes = (entry: any): string => {
  const attrs: string[] = [];

  const rowspan = entry?.["@_rowspan"];
  if (rowspan && rowspan !== "1") attrs.push(`rowspan="${rowspan}"`);

  const colspan = entry?.["@_colspan"];
  if (colspan && colspan !== "1") attrs.push(`colspan="${colspan}"`);

  const align = entry?.["@_align"];
  if (align) attrs.push(`align="${align}"`);

  const valign = entry?.["@_valign"];
  if (valign) attrs.push(`valign="${valign}"`);

  return attrs.length > 0 ? " " + attrs.join(" ") : "";
};

/**
 * Generates an HTML table cell element (th or td)
 */
const generateCell = (entry: any, isHeader: boolean): string => {
  const tag = isHeader ? "th" : "td";
  const attrs = getEntryAttributes(entry);
  const content = getEntryText(entry);
  return `<${tag}${attrs}>${content}</${tag}>`;
};

/**
 * Extracts content from table elements as HTML
 */
const getTableText = (table: any): string => {
  if (!table) return "";

  const tgroup = table[`${NS_OASIS}tgroup`];
  if (!tgroup) return "";

  const parts: string[] = ["<table>"];

  // Process header rows
  const thead = tgroup[`${NS_OASIS}thead`];
  if (thead) {
    parts.push("<thead>");
    ensureArray(thead[`${NS_OASIS}trow`]).forEach((row) => {
      const cells = ensureArray(row[`${NS_OASIS}entry`])
        .map((entry) => generateCell(entry, true))
        .join("");
      if (cells) parts.push(`<tr>${cells}</tr>`);
    });
    parts.push("</thead>");
  }

  // Process body rows
  const tbody = tgroup[`${NS_OASIS}tbody`];
  if (tbody) {
    parts.push("<tbody>");
    ensureArray(tbody[`${NS_OASIS}trow`]).forEach((row) => {
      const cells = ensureArray(row[`${NS_OASIS}entry`])
        .map((entry) => generateCell(entry, false))
        .join("");
      if (cells) parts.push(`<tr>${cells}</tr>`);
    });
    parts.push("</tbody>");
  }

  parts.push("</table>");

  return parts.join("");
};

/**
 * Parses conseqnote elements
 */
const parseConseqnote: ElementParser = (el, order) => {
  const editorialNote = el?.[`${NS_BCL}editorialnote`];
  const noteText = editorialNote ? extractText(editorialNote).trim() : getBclText(el);
  return createNode("TEXT", order, {
    legislationText: noteText || null,
  });
};

/**
 * Parses conseqhead elements
 */
const parseConseqhead: ElementParser = (el, order) => {
  const children: ParsedLegislationNode[] = [];

  // Parse conseqnotes
  ensureArray(el?.[`${NS_BCL}conseqnote`]).forEach((note) => {
    const xmlPos = getXmlPosition(note);
    children.push(parseConseqnote(note, xmlPos));
  });

  // Parse tables
  for (const tableInfo of getTablesByParentId(el?.["@_id"])) {
    children.push(
      createNode("TABLE", tableInfo.position, {
        citation: tableInfo.tableId,
        legislationText: getTableContentById(tableInfo.tableId) || null,
      }),
    );
  }

  children.sort((a, b) => a.displayOrder - b.displayOrder);

  children.forEach((child, index) => {
    child.displayOrder = index + 1;
  });

  return createNode("SEC", order, {
    citation: getBclNum(el),
    sectionTitle: stripMarkupTags(getBclText(el)) || null,
    children,
  });
};

parsePart = (el, order) =>
  createNode("PART", order, {
    citation: getBclNum(el),
    sectionTitle: stripMarkupTags(getBclText(el)) || null,
    children: parseSequentialChildren(el, [
      { tag: "division", parse: parseDivision },
      { tag: "rule", parse: parseRule },
      { tag: "section", parse: parseSection },
      { tag: "conseqhead", parse: parseConseqhead },
      { tag: "schedule", parse: parseSchedule },
    ]),
  });

/**
 * Parses preamble elements
 */
const parsePreamble: ElementParser = (el, order) =>
  createNode("TEXT", order, {
    sectionTitle: "Preamble",
    legislationText: extractText(el).replaceAll(/\s+/g, " ").trim() || null,
  });

const parseContent = (content: any): ParsedLegislationNode[] => {
  if (!content) return [];

  const children = parseSequentialChildren(content, [
    { tag: "preamble", parse: parsePreamble },
    { tag: "subheading", parse: parseText },
    { tag: "lefttext", parse: parseText },
    { tag: "part", parse: parsePart },
    { tag: "division", parse: parseDivision },
    { tag: "rule", parse: parseRule },
    { tag: "section", parse: parseSection },
    { tag: "conseqhead", parse: parseConseqhead },
    { tag: "schedule", parse: parseSchedule },
  ]);

  // Re-sort parts by citation number to handle decimal ordering
  children.sort((a, b) => {
    // Only apply citation sorting to PART type nodes
    if (a.typeCode === "PART" && b.typeCode === "PART") {
      const aOrder = getCitationSortOrder(a.citation);
      const bOrder = getCitationSortOrder(b.citation);
      if (aOrder !== Infinity || bOrder !== Infinity) {
        return aOrder - bOrder;
      }
    }
    // For non-parts or non-numeric citations use XML position order
    return a.displayOrder - b.displayOrder;
  });

  // Re-sequence displayOrder after sorting
  children.forEach((child, index) => {
    child.displayOrder = index + 1;
  });

  return children;
};

/**
 * Parses BC Laws XML document and returns legislation data
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
    // Ensure elements that can appear multiple times are always arrays
    isArray: (name) =>
      [
        "bcl:text",
        "bcl:section",
        "bcl:subsection",
        "bcl:paragraph",
        "bcl:subparagraph",
        "bcl:clause",
        "bcl:subclause",
        "bcl:definition",
        "bcl:part",
        "bcl:division",
        "bcl:schedule",
        "bcl:content",
        "oasis:table",
        "oasis:trow",
        "oasis:entry",
        "oasis:line",
      ].includes(name),
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
      sectionTitle: stripMarkupTags(metadata.title),
      children,
    }),
  };
};
