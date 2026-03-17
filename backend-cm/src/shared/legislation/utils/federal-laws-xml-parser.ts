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

const stripXmlTags = (raw: string): string => {
  if (typeof raw === "string") {
    return raw
      .replaceAll(/<br\s*\/?>/gi, " ")
      .replaceAll(/<DefinedTermEn>([^<]*)<\/DefinedTermEn>/g, '"$1"')
      .replaceAll(/<[^>]+>/g, "") // NOSONAR no backtracking per warning because of negated class [^] with fixed delimiters
      .replaceAll(/\s+/g, " ")
      .trim();
  }
  return "";
};

let originalXmlString = "";

/**
 * Finds the position of an element in the original XML string by its lims:fid attribute.
 * Used to determine document order since fid values are not sequential for amended documents.
 */
const getXmlPosition = (el: any): number => {
  const fid = el?.["@_lims:fid"] || el?.["@_lims:id"];
  if (!fid || !originalXmlString) return Infinity;
  const pos = originalXmlString.indexOf(`lims:fid="${fid}"`);
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
  ["Subclause", "SUBCL", []],
  ["Clause", "CL", ["Subclause"]],
  ["Subparagraph", "SUBPAR", ["Clause"]],
  ["Paragraph", "PAR", ["Subparagraph", "Clause"]],
  ["Subsection", "SUBSEC", ["Paragraph", "Definition"]],
  ["Section", "SEC", ["Subsection", "Paragraph", "Definition"]],
];

for (const [tag, typeCode, childTags] of HIERARCHY) {
  parsers[tag] = (el, order) => {
    const sectionTitle = getMarginalNote(el);
    let legislationText = getTextContent(el);

    // For Sections with no MarginalNote and no direct Text, use first Subsection's text as fallback
    if (typeCode === "SEC" && !sectionTitle && !legislationText) {
      const firstSub = toArray(el?.Subsection)[0];
      if (firstSub) legislationText = getTextContent(firstSub);
    }

    return createNode(typeCode, order, {
      citation: getLabel(el),
      sectionTitle,
      legislationText,
      children: parseChildren(el, childTags),
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
  for (const tg of toArray(el?.TableGroup)) {
    const text = extractText(tg).trim();
    if (text) children.push(createNode("TABLE", children.length + 1, { legislationText: text }));
  }
  return createNode("TEXT", order, {
    citation: el?.Label ? extractText(el.Label).trim() : null,
    legislationText: getTextContent(el),
    children,
  });
};

// -- Schedule parsing --

function collectScheduleChildren(schedule: any): ParsedLegislationNode[] {
  const children: ParsedLegislationNode[] = [];

  for (const fg of toArray(schedule?.FormGroup))
    for (const prov of toArray(fg?.Provision)) children.push(parsers["Provision"](prov, 0));

  const bp = schedule?.BillPiece;
  if (bp) {
    for (const rnif of toArray(bp.RelatedOrNotInForce))
      children.push(
        createNode("DIV", 0, {
          sectionTitle: extractText(toArray(rnif?.Heading)[0]?.TitleText).trim() || null,
          children: parseChildren(rnif, ["Section"]),
        }),
      );
    for (const sec of toArray(bp.Section)) children.push(parsers["Section"](sec, 0));
  }

  for (const tg of toArray(schedule?.TableGroup)) {
    const text = extractText(tg).trim();
    if (text) children.push(createNode("TABLE", 0, { legislationText: text }));
  }

  for (const group of toArray(schedule?.DocumentInternal?.Group))
    children.push(
      createNode("DIV", 0, {
        sectionTitle: extractText(group?.GroupHeading?.TitleText).trim() || null,
        children: parseChildren(group, ["Provision"]),
      }),
    );

  const body = schedule?.RegulationPiece?.Body || schedule?.Body;
  if (body) children.push(...parseBody(body));

  children.forEach((child, i) => {
    child.displayOrder = i + 1;
  });
  return children;
}

function parseSchedule(schedule: any, displayOrder: number): ParsedLegislationNode {
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
    children: collectScheduleChildren(schedule),
  });
}

// -- Body parsing --

function parseBody(body: any): ParsedLegislationNode[] {
  const collect = (tag: string) => toArray(body?.[tag]).map((data: any) => ({ tag, data, pos: getXmlPosition(data) }));
  const elements = [...collect("Heading"), ...collect("Section"), ...collect("Schedule"), ...collect("Provision")]
    .sort((a, b) => a.pos - b.pos);

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
    } else if (tag === "Schedule") {
      topChildren.push(parseSchedule(data, order++));
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
  stopNodes: ["*.Text"],
  isArray: (tagName: string) =>
    [
      "Heading",
      "Section",
      "Subsection",
      "Paragraph",
      "Subparagraph",
      "Clause",
      "Subclause",
      "Definition",
      "ContinuedDefinition",
      "Schedule",
      "Text",
      "TitleText",
      "Provision",
      "FormGroup",
      "RelatedOrNotInForce",
      "TableGroup",
      "Group",
      "HistoricalNoteSubItem",
      "LongTitle",
    ].includes(tagName),
};

export function parseFederalLawsXml(xmlString: string): ParsedFederalLawsDocument {
  originalXmlString = xmlString;
  const parser = new XMLParser(FEDERAL_XML_PARSER_OPTIONS);

  const parsed = parser.parse(xmlString);
  const statute = parsed?.Statute;
  if (!statute) throw new Error("No <Statute> root element found in federal laws XML");

  const id = statute?.Identification;
  const shortTitle = extractText(id?.ShortTitle).trim();
  const longTitle = id?.LongTitle
    ? toArray(id.LongTitle)
        .map((lt: any) => extractText(lt).trim())
        .join(" ")
    : null;
  const consolidatedNumber = id?.Chapter?.ConsolidatedNumber ? extractText(id.Chapter.ConsolidatedNumber).trim() : null;

  const metadata: FederalLawsMetadata = {
    title: shortTitle || longTitle || "Unknown Federal Statute",
    longTitle,
    consolidatedNumber,
    inForceStartDate: statute?.["@_lims:inforce-start-date"] || null,
    documentType: "ACT",
  };

  const bodyChildren = statute?.Body ? parseBody(statute.Body) : [];

  let scheduleOrder = bodyChildren.length > 0 ? bodyChildren.at(-1).displayOrder + 1000 : 1000;
  for (const schedule of toArray(statute?.Schedule)) bodyChildren.push(parseSchedule(schedule, scheduleOrder++));

  return {
    metadata,
    root: createNode("ACT", 0, { citation: consolidatedNumber, sectionTitle: metadata.title, children: bodyChildren }),
  };
}

export function parseFederalRegulationXml(xmlString: string): ParsedFederalLawsDocument {
  originalXmlString = xmlString;
  const parser = new XMLParser(FEDERAL_XML_PARSER_OPTIONS);

  const parsed = parser.parse(xmlString);
  const regulation = parsed?.Regulation;
  if (!regulation) throw new Error("No <Regulation> root element found in federal regulation XML");

  const id = regulation?.Identification;
  const instrumentNumber = id?.InstrumentNumber ? extractText(id.InstrumentNumber).trim() : null;
  const longTitle = id?.LongTitle
    ? toArray(id.LongTitle)
        .map((lt: any) => extractText(lt).trim())
        .join(" ")
    : null;

  const metadata: FederalLawsMetadata = {
    title: longTitle || instrumentNumber || "Unknown Federal Regulation",
    longTitle,
    consolidatedNumber: instrumentNumber,
    inForceStartDate: regulation?.["@_lims:inforce-start-date"] || null,
    documentType: "REG",
  };

  const bodyChildren = regulation?.Body ? parseBody(regulation.Body) : [];

  let scheduleOrder = bodyChildren.length > 0 ? bodyChildren.at(-1).displayOrder + 1000 : 1000;
  for (const schedule of toArray(regulation?.Schedule)) bodyChildren.push(parseSchedule(schedule, scheduleOrder++));

  return {
    metadata,
    root: createNode("REG", 0, { citation: instrumentNumber, sectionTitle: metadata.title, children: bodyChildren }),
  };
}
