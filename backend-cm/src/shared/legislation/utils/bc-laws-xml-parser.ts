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

/**
 * Extracts text content from a node handling various types of content
 *
 * NOTE: This is a bit hacky and specific to extracting text out of more deeply nested XML tags in the few
 * examples found. It might not be possible to handle all cases with this approach and we may need to store
 * the other elements in the tree.
 */
const extractText = (node: any): string => {
  if (node == null) return "";
  if (typeof node === "string") return node; // Don't trim
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object") {
    // Keys containing text content - check inline elements first, then #text
    const textKeys = ["in:term", "in:doc", "in:desc", "in:em", "in:strong", "bcl:link", "oasis:line"];
    const foundKey = textKeys.find((key) => node[key] !== undefined);
    if (foundKey) return extractText(node[foundKey]);

    // Check #text last - if it's whitespace-only and other content exists, skip it
    if (node["#text"] !== undefined) {
      const textContent = String(node["#text"]);
      const otherKeys = Object.keys(node).filter((key) => !key.startsWith("@_") && key !== "#text");
      // If #text is whitespace and there are other content keys, extract from those instead
      if (textContent.trim() === "" && otherKeys.length > 0) {
        return otherKeys.map((key) => extractText(node[key])).join("");
      }
      return textContent;
    }

    // Fallback: recursively extract from all non-attribute keys
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
 * Converts a citation string to a sortable number
 */
const getCitationSortOrder = (citation: string | null): number => {
  if (!citation) return Infinity;
  const num = parseFloat(citation);
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

  // Re-sequence displayOrder for consistent ordering
  children.forEach((child, index) => {
    child.displayOrder = index + 1;
  });

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
  const children = elements.map((item) => item.parse(item.element, item.xmlPos));

  children.forEach((child, index) => {
    child.displayOrder = index + 1;
  });

  return children;
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

  // Parse tables in sections
  ensureArray(el?.[`${NS_OASIS}table`]).forEach((table) => {
    const xmlPos = getXmlPosition(table);
    const tableText = getTableText(table);
    if (tableText) {
      children.push(
        createNode("TABLE", xmlPos, {
          legislationText: tableText,
        }),
      );
    }
  });

  // mergeText handles sorting/re-sequencing when there are TEXT nodes
  const extractedText = mergeText(children, text);

  // If no TEXT nodes, still need to sort and re-sequence children (for TABLE nodes)
  if (text.length === 0 && children.length > 0) {
    children.sort((a, b) => a.displayOrder - b.displayOrder);
    children.forEach((child, index) => {
      child.displayOrder = index + 1;
    });
  }

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

/**
 * Parses centertext elements
 */
const parseCentertext: ElementParser = (el, order) =>
  createNode("TEXT", order, {
    legislationText: extractText(el).replaceAll(/\s+/g, " ").trim() || null,
  });

/**
 * Parses lefttext elements (indented text blocks)
 */
const parseLefttext: ElementParser = (el, order) =>
  createNode("TEXT", order, {
    legislationText: extractText(el).replaceAll(/\s+/g, " ").trim() || null,
  });

/**
 * Parses form elements within schedules
 */
const parseForm: ElementParser = (el, order) => {
  // Forms can contain various elements - extract all text content
  const formTitle = el?.[`${NS_BCL}formtitle`];
  return createNode("TEXT", order, {
    sectionTitle: formTitle ? extractText(formTitle).trim() : null,
    legislationText: extractText(el).replaceAll(/\s+/g, " ").trim() || null,
  });
};

/**
 * Parses list elements
 */
const parseList: ElementParser = (el, order) =>
  createNode("TEXT", order, {
    legislationText: extractText(el).replaceAll(/\s+/g, " ").trim() || null,
  });

/**
 * Parses schedulesubtitle elements
 */
const parseScheduleSubtitle: ElementParser = (el, order) =>
  createNode("TEXT", order, {
    legislationText: extractText(el).replaceAll(/\s+/g, " ").trim() || null,
  });

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

  // Parse text/content elements
  const textChildren = parseSequentialChildren(el, [
    { tag: "centertext", parse: parseCentertext },
    { tag: "lefttext", parse: parseLefttext },
    { tag: "form", parse: parseForm },
    { tag: "list", parse: parseList },
    { tag: "schedulesubtitle", parse: parseScheduleSubtitle },
  ]);
  children.push(...textChildren);

  // Parse tables
  ensureArray(el?.[`${NS_OASIS}table`]).forEach((table) => {
    const xmlPos = getXmlPosition(table);
    const tableText = getTableText(table);
    if (tableText) {
      children.push(
        createNode("TABLE", xmlPos, {
          legislationText: tableText,
        }),
      );
    }
  });

  // Sort by XML position and re-sequence
  children.sort((a, b) => a.displayOrder - b.displayOrder);
  children.forEach((child, index) => {
    child.displayOrder = index + 1;
  });

  return createNode("SCHED", order, {
    citation: getBclNum(el),
    sectionTitle: extractText(scheduleTitle) || null,
    children,
  });
};

/**
 * Extracts text from a table entry, handling various content structures
 */
const getEntryText = (entry: any): string => {
  if (!entry) return "";

  // Entry may contain oasis:line elements with the actual text
  const lines = entry[`${NS_OASIS}line`];
  if (lines) {
    return ensureArray(lines)
      .map((line) => extractText(line))
      .join(" ")
      .trim();
  }

  // Direct bcl:link
  const link = entry[`${NS_BCL}link`];
  if (link) {
    return extractText(link).trim();
  }

  // Fallback to generic text extraction
  return extractText(entry).trim();
};

/**
 * Extracts content from table elements
 */
const getTableText = (table: any): string => {
  if (!table) return "";
  const rows: string[] = [];

  const tgroup = table[`${NS_OASIS}tgroup`];
  if (!tgroup) return "";

  // Process header rows (BC Laws uses trow, not row)
  const thead = tgroup[`${NS_OASIS}thead`];
  if (thead) {
    ensureArray(thead[`${NS_OASIS}trow`]).forEach((row) => {
      const cells = ensureArray(row[`${NS_OASIS}entry`]).map((entry) => getEntryText(entry));
      if (cells.length > 0) rows.push(cells.join(" | "));
    });
  }

  // Process body rows
  const tbody = tgroup[`${NS_OASIS}tbody`];
  if (tbody) {
    ensureArray(tbody[`${NS_OASIS}trow`]).forEach((row) => {
      const cells = ensureArray(row[`${NS_OASIS}entry`]).map((entry) => getEntryText(entry));
      if (cells.length > 0) rows.push(cells.join(" | "));
    });
  }

  return rows.join("\n");
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

  // Parse tables as TABLE type nodes
  ensureArray(el?.[`${NS_OASIS}table`]).forEach((table) => {
    const xmlPos = getXmlPosition(table);
    const tableText = getTableText(table);
    if (tableText) {
      children.push(
        createNode("TABLE", xmlPos, {
          legislationText: tableText,
        }),
      );
    }
  });

  children.sort((a, b) => a.displayOrder - b.displayOrder);

  children.forEach((child, index) => {
    child.displayOrder = index + 1;
  });

  return createNode("SEC", order, {
    citation: getBclNum(el),
    sectionTitle: getBclText(el) || "Consequential and Related Amendments",
    children,
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

/**
 * Parses subheading elements
 */
const parseSubheading: ElementParser = (el, order) =>
  createNode("TEXT", order, {
    legislationText: extractText(el).replaceAll(/\s+/g, " ").trim() || null,
  });

const parseContent = (content: any): ParsedLegislationNode[] => {
  if (!content) return [];

  const children = parseSequentialChildren(content, [
    { tag: "preamble", parse: parsePreamble },
    { tag: "subheading", parse: parseSubheading },
    { tag: "lefttext", parse: parseLefttext },
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
