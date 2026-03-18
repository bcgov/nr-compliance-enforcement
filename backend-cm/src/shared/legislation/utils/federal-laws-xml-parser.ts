import { XMLParser } from "fast-xml-parser";
import { ParsedLegislationNode } from "./bc-laws-xml-parser";

export interface FederalLawsMetadata {
  title: string;
  longTitle: string | null;
  consolidatedNumber: string | null;
  inForceStartDate: string | null;
  documentType: "ACT" | "REG";
}

export interface ParsedFederalLawsDocument {
  metadata: FederalLawsMetadata;
  root: ParsedLegislationNode;
}

type ElementParser = (el: any, order: number) => ParsedLegislationNode;

const stripXmlTags = (raw: string): string =>
  raw
    .replaceAll(/<br\s*\/?>/gi, " ")
    .replaceAll(/<DefinedTermEn>([^<]*)<\/DefinedTermEn>/g, '"$1"')
    .replaceAll(/<[^>]+>/g, "") // NOSONAR no backtracking per warning because of negated class [^] with fixed delimiters
    .replaceAll(/\s+/g, " ")
    .trim();

// Get the position of an element in the original XML string by its lims:fid attribute
// Used to determine document order since fid values are not always sequential
const getXmlPosition = (el: any, xmlString: string): number => {
  const fid = el?.["@_lims:fid"] || el?.["@_lims:id"];
  if (!fid || !xmlString) return Infinity;
  const pos = xmlString.indexOf(`lims:fid="${fid}"`);
  return pos > -1 ? pos : Infinity;
};

function toArray(v: any): any[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function extractText(node: any): string {
  if (node == null) return "";
  if (typeof node === "string") return stripXmlTags(node);
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node !== "object") return "";

  if (node["Numerator"] !== undefined && node["Denominator"] !== undefined)
    return `${extractText(node["Numerator"])}/${extractText(node["Denominator"])}`;

  const contentKeys = Object.keys(node).filter((k) => !k.startsWith("@_") && k !== "#text");

  if (node["#text"] !== undefined) {
    const raw = node["#text"];
    const coerce = (v: unknown): string => {
      if (typeof v === "string") return v;
      if (typeof v === "number") return String(v);
      return "";
    };
    const text = Array.isArray(raw) ? raw.map(coerce).join("") : coerce(raw);
    if (text.trim() === "" && contentKeys.length > 0) return contentKeys.map((k) => extractText(node[k])).join("");
    return contentKeys.reduce((acc, k) => acc + " " + extractText(node[k]), text);
  }

  return contentKeys.map((k) => extractText(node[k])).join("");
}

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

const getLabel = (node: any): string | null =>
  node?.Label ? extractText(node.Label).trim().replace(/^\(/, "").replace(/\)$/, "") || null : null;

const getMarginalNote = (node: any): string | null =>
  node?.MarginalNote ? extractText(node.MarginalNote).trim() || null : null;

const getTextContent = (node: any): string | null => {
  const parts = toArray(node?.Text)
    .map((t: any) => (typeof t === "string" ? stripXmlTags(t) : extractText(t).trim()))
    .filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
};

const getDefinedTerm = (node: any): string | null => {
  for (const t of toArray(node?.Text)) {
    if (typeof t === "string") {
      const match = /<DefinedTermEn>([^<]+)<\/DefinedTermEn>/.exec(t);
      if (match) return match[1].trim() || null;
    }
  }
  return null;
};

// -- Table-driven element parsers --

const parsers: Record<string, ElementParser> = {};

function parseChildren(parent: any, tags: string[]): ParsedLegislationNode[] {
  const children: ParsedLegislationNode[] = [];
  let order = 1;
  for (const tag of tags) {
    for (const el of toArray(parent?.[tag])) {
      children.push(parsers[tag](el, order++));
    }
  }
  return children;
}

const HIERARCHY: Array<[tag: string, typeCode: string, childTags: string[]]> = [
  ["Subsubclause", "SUBCL", []],
  ["Subclause", "SUBCL", ["Subsubclause"]],
  ["Clause", "CL", ["Subclause"]],
  ["Subparagraph", "SUBPAR", ["Clause"]],
  ["Paragraph", "PAR", ["Subparagraph", "Clause"]],
  ["Subsection", "SUBSEC", ["Paragraph", "Definition"]],
  ["Section", "SEC", ["Subsection", "Paragraph", "Definition"]],
];

// -- table parsing

const getEntryText = (entry: any): string => {
  if (!entry) return "";
  return extractText(entry).replaceAll("\n", " ").replaceAll(/\s+/g, " ").trim();
};

const ENTRY_ATTRS: Array<[string, string, string?]> = [
  ["@_rowspan", "rowspan", "1"],
  ["@_colspan", "colspan", "1"],
  ["@_align", "align"],
  ["@_valign", "valign"],
];

const getEntryAttributes = (entry: any): string => {
  const attrs = ENTRY_ATTRS.map(([key, name, skip]) => {
    const val = entry?.[key];
    return val && val !== skip ? `${name}="${val}"` : null;
  }).filter(Boolean);
  return attrs.length > 0 ? " " + attrs.join(" ") : "";
};

const generateCell = (entry: any, isHeader: boolean): string => {
  const tag = isHeader ? "th" : "td";
  const attrs = getEntryAttributes(entry);
  return `<${tag}${attrs}>${getEntryText(entry)}</${tag}>`;
};

const renderTableSection = (section: any, tag: string, isHeader: boolean): string => {
  if (!section) return "";
  const rows = toArray(section?.row)
    .map((row: any) => {
      const cells = toArray(row?.entry).map((e: any) => generateCell(e, isHeader)).join("");
      return cells ? `<tr>${cells}</tr>` : "";
    })
    .filter(Boolean)
    .join("");
  return rows ? `<${tag}>${rows}</${tag}>` : "";
};

const getTableHtml = (table: any): string => {
  const tgroup = table?.tgroup;
  if (!tgroup) return "";
  return `<table>${renderTableSection(tgroup.thead, "thead", true)}${renderTableSection(tgroup.tbody, "tbody", false)}</table>`;
};

const parseTableGroup = (tg: any): ParsedLegislationNode => {
  const caption = tg?.Caption ? extractText(tg.Caption).trim() : null;
  const title = tg?.table?.title ? extractText(tg.table.title).trim() : null;
  const html = getTableHtml(tg?.table);
  return createNode("TABLE", 0, {
    sectionTitle: [caption, title].filter(Boolean).join(" — ") || null,
    legislationText: html || extractText(tg).trim() || null,
  });
};

const processFormulaXml = (raw: any): string => {
  if (typeof raw !== "string") return extractText(raw).trim();
  return raw
    .replaceAll(/>\s+</g, "><") // NOSONAR collapse whitespace between tags
    .replaceAll(/<[^>]+>/g, "") // NOSONAR strip all XML tags
    .replaceAll(/\s+/g, " ")
    .trim();
};

const formatDefinitionLine = (indent: string, term: string, defText: string): string | null => {
  if (term && defText) return `${indent}${term} \u2014 ${defText}`;
  if (term) return `${indent}${term}`;
  if (defText) return `${indent}${defText}`;
  return null;
};

// Special handling for formula text to preserve formatting as much as possible
function formatFormulaGroup(fg: any, depth: number = 0): string {
  const indent = "\u00A0".repeat(depth * 4);
  const lines: string[] = [];

  for (const formula of toArray(fg?.Formula)) {
    const text = processFormulaXml(formula?.FormulaText);
    if (text) lines.push(`${indent}${text}`);
  }

  const connectorRaw = fg?.FormulaConnector;
  const connectorText = typeof connectorRaw === "string" ? connectorRaw.trim() : extractText(connectorRaw).trim();
  if (connectorText) lines.push(`${indent}${connectorText}`);

  for (const def of toArray(fg?.FormulaDefinition)) {
    const term = processFormulaXml(def?.FormulaTerm);
    const defText = getTextContent(def) || "";

    const line = formatDefinitionLine(indent, term, defText);
    if (line) lines.push(line);

    for (const nestedFg of toArray(def?.FormulaGroup)) {
      lines.push(formatFormulaGroup(nestedFg, depth + 1));
    }
  }

  return lines.join("<br/>");
}

function collectListItems(el: any): string[] {
  const texts: string[] = [];
  for (const list of toArray(el?.List))
    for (const item of toArray(list?.Item)) {
      const text = extractText(item?.Text).trim();
      if (text) texts.push(text);
    }
  return texts;
}

// Get text from child elements (TableGroup, List, FormulaGroup, Note)
function collectTextChildren(el: any, startOrder: number): ParsedLegislationNode[] {
  const nodes: ParsedLegislationNode[] = [];
  let order = startOrder;
  for (const tg of toArray(el?.TableGroup)) {
    const node = parseTableGroup(tg);
    node.displayOrder = order++;
    nodes.push(node);
  }
  for (const text of collectListItems(el)) {
    nodes.push(createNode("TEXT", order++, { legislationText: text }));
  }
  for (const fg of toArray(el?.FormulaGroup)) {
    const text = formatFormulaGroup(fg);
    if (text) nodes.push(createNode("TEXT", order++, { legislationText: text }));
  }
  for (const note of toArray(el?.Note)) {
    const text = extractText(note).trim();
    if (text) nodes.push(createNode("TEXT", order++, { legislationText: text }));
  }
  for (const rep of toArray(el?.Repealed)) {
    const text = extractText(rep).trim();
    if (text) nodes.push(createNode("TEXT", order++, { legislationText: text }));
  }
  return nodes;
}

// Parses a Heading element into a PART or DIV
function parseHeadingNode(heading: any, order: number): ParsedLegislationNode | null {
  const titleText = extractText(heading?.TitleText).trim();
  if (!titleText) return null;
  const level = heading?.["@_level"] || "1";
  return createNode(level === "1" ? "PART" : "DIV", order, {
    citation: level === "1" ? (/^PART\s+([IVXLCDM]+(?:\.\d+)?)/i.exec(titleText)?.[1] ?? null) : null,
    sectionTitle: titleText,
  });
}

const CONTINUED_TAGS: Record<string, string[]> = {
  Section: ["ContinuedSectionSubsection"],
  Subsection: ["ContinuedSectionSubsection"],
  Paragraph: ["ContinuedParagraph"],
  Subparagraph: ["ContinuedSubparagraph"],
  Clause: ["ContinuedClause"],
  Subclause: ["ContinuedSubclause"],
};

for (const [tag, typeCode, childTags] of HIERARCHY) {
  parsers[tag] = (el, order) => {
    const sectionTitle = getMarginalNote(el);
    let legislationText = getTextContent(el);

    // For Sections with no direct Text use first Subsection's text as fallback so that section titles still have some content
    if (typeCode === "SEC" && !sectionTitle && !legislationText) {
      const firstSub = toArray(el?.Subsection)[0];
      if (firstSub) legislationText = getTextContent(firstSub);
    }

    const children = parseChildren(el, childTags);

    children.push(...collectTextChildren(el, children.length + 1));

    for (const contTag of CONTINUED_TAGS[tag] ?? []) {
      for (const cont of toArray(el?.[contTag])) {
        children.push(createNode("TEXT", children.length + 1, { legislationText: getTextContent(cont) }));
      }
    }

    return createNode(typeCode, order, {
      citation: getLabel(el),
      sectionTitle,
      legislationText,
      children,
    });
  };
}

parsers["Definition"] = (el, order) => {
  const term = getDefinedTerm(el);
  const children = parseChildren(el, ["Paragraph"]);
  for (const cont of toArray(el?.ContinuedDefinition))
    children.push(createNode("TEXT", children.length + 1, { legislationText: getTextContent(cont) }));
  return createNode("DEF", order, {
    citation: term,
    sectionTitle: term,
    legislationText: getTextContent(el),
    children,
  });
};

parsers["Provision"] = (el, order) => {
  const children = parseChildren(el, ["Provision"]);
  children.push(...collectTextChildren(el, children.length + 1));
  return createNode("TEXT", order, {
    citation: el?.Label ? extractText(el.Label).trim() : null,
    legislationText: getTextContent(el),
    children,
  });
};

// Schedule parsing

function collectBillPieceChildren(bp: any): ParsedLegislationNode[] {
  const nodes: ParsedLegislationNode[] = [];
  for (const rnif of toArray(bp.RelatedOrNotInForce))
    nodes.push(
      createNode("DIV", 0, {
        sectionTitle: extractText(toArray(rnif?.Heading)[0]?.TitleText).trim() || null,
        children: parseChildren(rnif, ["Section"]),
      }),
    );
  for (const sec of toArray(bp.Section)) nodes.push(parsers["Section"](sec, 0));
  return nodes;
}

function collectDocumentInternalChildren(docInternal: any): ParsedLegislationNode[] {
  return toArray(docInternal?.Group).map((group: any) =>
    createNode("DIV", 0, {
      sectionTitle: extractText(group?.GroupHeading?.TitleText).trim() || null,
      children: parseChildren(group, ["Provision"]),
    }),
  );
}

function collectScheduleChildren(schedule: any, xmlString: string): ParsedLegislationNode[] {
  const children: ParsedLegislationNode[] = [];

  for (const fg of toArray(schedule?.FormGroup))
    for (const prov of toArray(fg?.Provision)) children.push(parsers["Provision"](prov, 0));

  for (const prov of toArray(schedule?.Provision)) children.push(parsers["Provision"](prov, 0));

  for (const heading of toArray(schedule?.Heading)) {
    const node = parseHeadingNode(heading, 0);
    if (node) children.push(node);
  }

  if (schedule?.BillPiece) children.push(...collectBillPieceChildren(schedule.BillPiece));

  children.push(...collectTextChildren(schedule, 0), ...collectDocumentInternalChildren(schedule?.DocumentInternal));

  for (const cat of toArray(schedule?.ConventionAgreementTreaty)) children.push(parseConventionAgreementTreaty(cat, xmlString));

  for (const nested of toArray(schedule?.Schedule)) children.push(parseSchedule(nested, 0, xmlString));

  const body = schedule?.RegulationPiece?.Body || schedule?.Body;
  if (body) children.push(...parseBody(body, xmlString));

  children.forEach((child, i) => {
    child.displayOrder = i + 1;
  });
  return children;
}

function parseSchedule(schedule: any, displayOrder: number, xmlString: string): ParsedLegislationNode {
  const h = schedule?.ScheduleFormHeading;
  const label = h?.Label ? extractText(h.Label).trim() : null;
  const titleStr = h
    ? toArray(h.TitleText)
        .map((t: any) => extractText(t).trim())
        .join(" - ") || null
    : null;
  const match = label ? /SCHEDULE\s+(.*)/i.exec(label) : null;
  const citation = match ? match[1].trim() : label;
  const title = [label, titleStr].filter(Boolean).join(" - ") || null;
  const ref = h?.OriginatingRef ? extractText(h.OriginatingRef).trim() || null : null;
  const legislationText = schedule?.Repealed ? extractText(schedule.Repealed).trim() || null : ref;

  return createNode("SCHED", displayOrder, {
    citation,
    sectionTitle: title,
    legislationText,
    children: collectScheduleChildren(schedule, xmlString),
  });
}

// ConventionAgreementTreaty parsing

function parseConventionAgreementTreaty(cat: any, xmlString: string): ParsedLegislationNode {
  const children: ParsedLegislationNode[] = [];

  for (const group of toArray(cat?.Group)) {
    children.push(
      createNode("DIV", children.length + 1, {
        sectionTitle: extractText(group?.Heading?.TitleText).trim() || null,
        children: parseChildren(group, ["Provision"]),
      }),
    );
  }
  for (const prov of toArray(cat?.Provision)) children.push(parsers["Provision"](prov, children.length + 1));
  for (const heading of toArray(cat?.Heading)) {
    const text = extractText(heading?.TitleText).trim();
    if (text) children.push(createNode("DIV", children.length + 1, { sectionTitle: text }));
  }
  for (const sched of toArray(cat?.Schedule)) children.push(parseSchedule(sched, children.length + 1, xmlString));

  return createNode("SCHED", 0, {
    sectionTitle: "Convention/Agreement/Treaty",
    children,
  });
}

// Order parsing

function parseOrderChildren(order: any): ParsedLegislationNode[] {
  const children: ParsedLegislationNode[] = [];

  for (const group of toArray(order?.Group)) {
    const groupChildren: ParsedLegislationNode[] = parseChildren(group, ["Section", "Provision"]);
    for (const subGroup of toArray(group?.Group)) {
      groupChildren.push(
        createNode("DIV", groupChildren.length + 1, {
          sectionTitle: extractText(subGroup?.Heading?.TitleText).trim() || null,
          children: parseChildren(subGroup, ["Section", "Provision"]),
        }),
      );
    }
    children.push(
      createNode("DIV", 0, {
        sectionTitle: extractText(group?.Heading?.TitleText).trim() || null,
        children: groupChildren,
      }),
    );
  }

  for (const prov of toArray(order?.Provision)) {
    children.push(parsers["Provision"](prov, 0));
  }

  children.forEach((child, i) => {
    child.displayOrder = i + 1;
  });
  return children;
}

// Body parsing

function parseBody(body: any, xmlString: string): ParsedLegislationNode[] {
  const collect = (tag: string) =>
    toArray(body?.[tag]).map((data: any) => ({ tag, data, pos: getXmlPosition(data, xmlString) }));
  const elements = [
    ...collect("Heading"),
    ...collect("Section"),
    ...collect("Schedule"),
    ...collect("Provision"),
    ...collect("Reserved"),
  ].sort((a, b) => a.pos - b.pos);

  const topChildren: ParsedLegislationNode[] = [];
  let currentPart: ParsedLegislationNode | null = null;
  let currentDiv: ParsedLegislationNode | null = null;
  let order = 1;

  const addToContainer = (node: ParsedLegislationNode) => {
    (currentDiv ?? currentPart)?.children.push(node) ?? topChildren.push(node);
  };

  for (const { tag, data } of elements) {
    if (tag === "Heading") {
      const titleText = extractText(data?.TitleText).trim();
      if ((data?.["@_level"] || "1") === "1") {
        currentPart = createNode("PART", order++, {
          citation: /^PART\s+([IVXLCDM]+(?:\.\d+)?)/i.exec(titleText)?.[1] ?? null,
          sectionTitle: titleText,
        });
        currentDiv = null;
        topChildren.push(currentPart);
      } else {
        const div = createNode("DIV", order++, { sectionTitle: titleText });
        currentDiv = div;
        currentPart ? currentPart.children.push(div) : topChildren.push(div);
      }
    } else if (tag === "Section") {
      addToContainer(parsers["Section"](data, order++));
    } else if (tag === "Provision") {
      addToContainer(parsers["Provision"](data, order++));
    } else if (tag === "Reserved") {
      addToContainer(
        createNode("SEC", order++, {
          citation: getLabel(data),
          legislationText: extractText(data).trim() || "[Reserved]",
        }),
      );
    } else if (tag === "Schedule") {
      topChildren.push(parseSchedule(data, order++, xmlString));
    }
  }

  return topChildren;
}

const FEDERAL_XML_PARSER_OPTIONS = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  preserveOrder: false,
  trimValues: false,
  parseAttributeValue: false,
  parseTagValue: false,
  stopNodes: ["*.Text", "*.FormulaText", "*.FormulaTerm"],
  isArray: (tagName: string) =>
    [
      "Heading",
      "Section",
      "Subsection",
      "Paragraph",
      "Subparagraph",
      "Clause",
      "Subclause",
      "Subsubclause",
      "Definition",
      "ContinuedDefinition",
      "ContinuedSectionSubsection",
      "ContinuedParagraph",
      "ContinuedSubparagraph",
      "ContinuedClause",
      "ContinuedSubclause",
      "Schedule",
      "Text",
      "TitleText",
      "Provision",
      "FormulaGroup",
      "Formula",
      "FormulaDefinition",
      "Note",
      "FormGroup",
      "RelatedOrNotInForce",
      "TableGroup",
      "Group",
      "HistoricalNoteSubItem",
      "LongTitle",
      "Order",
      "Reserved",
      "ConventionAgreementTreaty",
      "List",
      "Item",
      "row",
      "entry",
    ].includes(tagName),
};

const getLongTitle = (id: any): string | null =>
  id?.LongTitle
    ? toArray(id.LongTitle)
        .map((lt: any) => extractText(lt).trim())
        .join(" ") || null
    : null;

const nextOrder = (children: ParsedLegislationNode[], offset = 1): number =>
  children.length > 0 ? children.at(-1).displayOrder + offset : offset;

const appendSchedules = (children: ParsedLegislationNode[], root: any, xmlString: string) => {
  let order = nextOrder(children, 1000);
  for (const schedule of toArray(root?.Schedule)) children.push(parseSchedule(schedule, order++, xmlString));
};

function parseXml(xmlString: string): any {
  return new XMLParser(FEDERAL_XML_PARSER_OPTIONS).parse(xmlString);
}

export function parseFederalLawsXml(xmlString: string): ParsedFederalLawsDocument {
  const parsed = parseXml(xmlString);
  const statute = parsed?.Statute;
  if (!statute) throw new Error("No <Statute> root element found in federal laws XML");

  const id = statute?.Identification;
  const longTitle = getLongTitle(id);
  const consolidatedNumber = id?.Chapter?.ConsolidatedNumber ? extractText(id.Chapter.ConsolidatedNumber).trim() : null;

  const metadata: FederalLawsMetadata = {
    title: extractText(id?.ShortTitle).trim() || longTitle || "Unknown Federal Statute",
    longTitle,
    consolidatedNumber,
    inForceStartDate: statute?.["@_lims:inforce-start-date"] || null,
    documentType: "ACT",
  };

  const bodyChildren = statute?.Body ? parseBody(statute.Body, xmlString) : [];
  appendSchedules(bodyChildren, statute, xmlString);

  return {
    metadata,
    root: createNode("ACT", 0, { citation: consolidatedNumber, sectionTitle: metadata.title, children: bodyChildren }),
  };
}

export function parseFederalRegulationXml(xmlString: string): ParsedFederalLawsDocument {
  const parsed = parseXml(xmlString);
  const regulation = parsed?.Regulation;
  if (!regulation) throw new Error("No <Regulation> root element found in federal regulation XML");

  const id = regulation?.Identification;
  const instrumentNumber = id?.InstrumentNumber ? extractText(id.InstrumentNumber).trim() : null;
  const longTitle = getLongTitle(id);

  const metadata: FederalLawsMetadata = {
    title: longTitle || instrumentNumber || "Unknown Federal Regulation",
    longTitle,
    consolidatedNumber: instrumentNumber,
    inForceStartDate: regulation?.["@_lims:inforce-start-date"] || null,
    documentType: "REG",
  };

  const bodyChildren = regulation?.Body ? parseBody(regulation.Body, xmlString) : [];

  // Some regulations use Order elements instead of or alongside Body
  let offset = nextOrder(bodyChildren);
  for (const order of toArray(regulation?.Order)) {
    for (const child of parseOrderChildren(order)) {
      child.displayOrder = offset++;
      bodyChildren.push(child);
    }
  }
  for (const cat of toArray(regulation?.ConventionAgreementTreaty)) {
    const node = parseConventionAgreementTreaty(cat, xmlString);
    node.displayOrder = offset++;
    bodyChildren.push(node);
  }

  appendSchedules(bodyChildren, regulation, xmlString);

  return {
    metadata,
    root: createNode("REG", 0, { citation: instrumentNumber, sectionTitle: metadata.title, children: bodyChildren }),
  };
}
