import { Command, CommandRunner, Option } from "nest-commander";
import { Inject, Logger } from "@nestjs/common";
import { ParkService } from "./shared/park/park.service";
import { ParkAreaMappingService } from "./shared/park/parkAreaMapping.service";
import { getAllParks } from "./external_api/bc-parks-service";
import { ParkArea } from "./shared/park/dto/park_area";
import axios from "axios";
import { SharedPrismaService } from "./prisma/shared/prisma.shared.service";
import { XMLParser } from "fast-xml-parser";

interface ImportCommandOptions {
  job?: string;
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Command({ name: "import", description: "Import functions" })
export class ImportCommand extends CommandRunner {
  constructor(
    @Inject(ParkService) private readonly _parkService: ParkService,
    @Inject(ParkAreaMappingService) private readonly _parkAreaMappingService: ParkAreaMappingService,
    private readonly sharedPrisma: SharedPrismaService,
  ) {
    super();
  }

  private readonly logger = new Logger(ImportCommand.name);

  async run(params: string[], options?: ImportCommandOptions): Promise<void> {
    if (options?.job === "parks") {
      this.runParksImport();
    } else if (options?.job === "legal-docs") {
      await this.runLegalDocumentsImport();
    } else {
      return;
    }
  }

  @Option({
    flags: "-j, --job <jobName>",
    description: "Job name to run",
  })
  parseString(val: string): string {
    return val;
  }

  async runParksImport(): Promise<void> {
    this.logger.log("Importing parks...");
    const parks = await getAllParks();
    for (const park of parks) {
      try {
        this.logger.log(`Importing park: ${park.displayId}`);
        await sleep(100);
        const existingPark = await this._parkService.findOneByExternalId(park.displayId);
        const parkAreaMapping = await this._parkAreaMappingService.findByExternalId(park.displayId);
        const parkAreas = parkAreaMapping
          ? parkAreaMapping.map((pam) => {
              return {
                parkAreaGuid: pam.parkAreaGuid,
              } as ParkArea;
            })
          : [];
        if (existingPark) {
          this.logger.log(`Updating existing park.`);
          await this._parkService.update(existingPark.parkGuid, {
            ...existingPark,
            name: park.displayName.slice(0, 255),
            legalName: park.legalName.slice(0, 255),
            parkAreas: parkAreas,
          });
        } else {
          this.logger.log(`Creating new park.`);
          await this._parkService.create({
            externalId: park.displayId,
            name: park.displayName.slice(0, 255),
            legalName: park.legalName.slice(0, 255),
            parkAreas: parkAreas,
          });
        }
        this.logger.log(`Success!`);
      } catch (error) {
        this.logger.error(`ERROR IMPORTING PARK: ${park.displayName}`, error);
      }
    }
  }

  async runLegalDocumentsImport(): Promise<void> {
    this.logger.log("Importing legal documents...");
    try {
      const prismaAny = this.sharedPrisma as any;
      const sources: { legal_document_source_guid: string; source_url: string }[] =
        await prismaAny.legal_document_source.findMany({
          select: { legal_document_source_guid: true, source_url: true },
        });

      if (!sources || sources.length === 0) {
        this.logger.log("No unprocessed legal document sources found.");
        return;
      }

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        allowBooleanAttributes: true,
        ignoreDeclaration: true,
        trimValues: true,
        preserveOrder: false,
        removeNSPrefix: true,
      });

      for (const src of sources) {
        this.logger.log(`Processing legal document source: ${src.source_url}`);
        try {
          const resp = await axios.get(src.source_url, { responseType: "text" });
          const xmlText = resp.data as string;

          // Detection of document type allowing optional namespace prefixes
          const isAct = /<\s*(?:[A-Za-z_][\w.-]*:)?act[\s>]/i.test(xmlText);
          const isReg = /<\s*(?:[A-Za-z_][\w.-]*:)?regulation[\s>]/i.test(xmlText);
          const isBylaw = /<\s*(?:[A-Za-z_][\w.-]*:)?bylaw[\s>]/i.test(xmlText);
          const docType = isAct ? "ACT" : isReg ? "REGULATION" : isBylaw ? "BYLAW" : "UNKNOWN";

          // Try to get simple metadata via regex allowing optional namespace prefixes
          const titleMatch = xmlText.match(
            /<\s*(?:[A-Za-z_][\w.-]*:)?title[^>]*>([\s\S]*?)<\s*\/\s*(?:[A-Za-z_][\w.-]*:)?title\s*>/i,
          );
          const chapterMatch = xmlText.match(
            /<\s*(?:[A-Za-z_][\w.-]*:)?chapter[^>]*>([\s\S]*?)<\s*\/\s*(?:[A-Za-z_][\w.-]*:)?chapter\s*>/i,
          );
          const yearMatch = xmlText.match(
            /<\s*(?:[A-Za-z_][\w.-]*:)?yearenacted[^>]*>([\s\S]*?)<\s*\/\s*(?:[A-Za-z_][\w.-]*:)?yearenacted\s*>/i,
          );
          const assentedMatch = xmlText.match(
            /<\s*(?:[A-Za-z_][\w.-]*:)?assentedto[^>]*>([\s\S]*?)<\s*\/\s*(?:[A-Za-z_][\w.-]*:)?assentedto\s*>/i,
          );
          const title = titleMatch ? titleMatch[1].trim().slice(0, 1024) : null;
          const chapter = chapterMatch ? chapterMatch[1].trim().slice(0, 32) : null;
          const yearEnacted = yearMatch ? parseInt(yearMatch[1].trim(), 10) : null;
          const assentedTo = assentedMatch ? assentedMatch[1].trim().slice(0, 64) : null;

          const externalId = src.source_url?.slice(0, 256) ?? null;

          // Remove any existing imported document for this source (cascades nodes)
          await prismaAny.legal_document.deleteMany({
            where: { legal_document_source_guid: src.legal_document_source_guid },
          });

          const createdDoc = await prismaAny.legal_document.create({
            data: {
              legal_document_source_guid: src.legal_document_source_guid,
              document_type: docType,
              external_identifier: externalId,
              title: title,
              chapter: chapter,
              year_enacted: yearEnacted,
              assented_to: assentedTo,
              xml_content: xmlText,
              create_user_id: "FLYWAY",
              create_utc_timestamp: new Date(),
            },
            select: { legal_document_guid: true },
          });
          const legalDocumentGuid: string | undefined = createdDoc?.legal_document_guid;
          if (!legalDocumentGuid) {
            this.logger.error("Failed to insert legal_document record.");
            continue;
          }

          // Parse and insert nodes with @id attributes for referenceable elements
          let json: any;
          try {
            json = parser.parse(xmlText);
          } catch (e) {
            this.logger.error("XML parse error", e);
            json = null;
          }

          if (json) {
            const getFirstDescendantText = (nodeObj: any, localNames: string[]): string | null => {
              if (!nodeObj) return null;
              const names = new Set(localNames);
              const visit = (obj: any): string | null => {
                if (!obj) return null;
                if (typeof obj === "string") return null;
                if (Array.isArray(obj)) {
                  for (const item of obj) {
                    const r = visit(item);
                    if (r) return r;
                  }
                  return null;
                }
                if (typeof obj === "object") {
                  for (const [k, v] of Object.entries(obj)) {
                    if (k === "#text" || k === "#cdata") continue;
                    if (!k.startsWith("@_")) {
                      const local = k.includes(":") ? k.split(":").pop()! : k;
                      if (names.has(local)) {
                        if (typeof v === "string") return v;
                        if (v && typeof (v as any)["#text"] === "string") return (v as any)["#text"] as string;
                      }
                      const r = visit(v);
                      if (r) return r;
                    }
                  }
                }
                return null;
              };
              return visit(nodeObj);
            };

            const flattenText = (nodeObj: any): string => {
              const parts: string[] = [];
              const EXCLUDED_TEXT_TAGS = new Set(["num", "n", "number"]);
              const walk = (obj: any) => {
                if (!obj) return;
                if (typeof obj === "string") {
                  parts.push(obj);
                  return;
                }
                if (Array.isArray(obj)) {
                  for (const item of obj) walk(item);
                  return;
                }
                if (typeof obj === "object") {
                  for (const [k, v] of Object.entries(obj)) {
                    if (k === "#text" || k === "#cdata") {
                      if (typeof v === "string") parts.push(v as string);
                    } else if (!k.startsWith("@_")) {
                      const local = k.includes(":") ? k.split(":").pop()! : k;
                      if (EXCLUDED_TEXT_TAGS.has(local)) {
                        continue;
                      }
                      walk(v);
                    }
                  }
                }
              };
              walk(nodeObj);
              return parts.join(" ").replace(/\s+/g, " ").trim();
            };

            const insertNodes = async (
              node: any,
              parentGuid: string | null,
              siblingOrderMap: Map<string | null, number>,
            ) => {
              if (!node || typeof node !== "object") return;
              for (const [key, value] of Object.entries(node)) {
                if (key === "#text" || key === "#cdata") continue;
                const tagName = key;
                const elements = Array.isArray((node as any)[key]) ? (node as any)[key] : [(node as any)[key]];
                for (const el of elements) {
                  const attrs = Object.entries(el || {})
                    .filter(([k]) => k.startsWith("@_"))
                    .reduce(
                      (acc: Record<string, any>, [k, v]) => {
                        acc[k.substring(2)] = v;
                        return acc;
                      },
                      {} as Record<string, any>,
                    );

                  const rawElementId = (attrs && (attrs["id"] as string)) || null;
                  const rawElementNumber =
                    (attrs && ((attrs["num"] as string) || (attrs["n"] as string))) ||
                    getFirstDescendantText(el, ["num", "n", "number"]) ||
                    null;
                  const elementNumber = rawElementNumber ? String(rawElementNumber).trim().slice(0, 64) : null;
                  const elementId = rawElementId ? String(rawElementId).trim().slice(0, 256) : null;
                  const elementName = tagName ? String(tagName).trim().slice(0, 64) : "";
                  const flattened = flattenText(el);
                  const elementText = flattened ? flattened.slice(0, 4000) : null;

                  // Only insert nodes that have an XML id to support referencing
                  let currentParentGuid = parentGuid;
                  if (elementId) {
                    const nextOrder = (siblingOrderMap.get(parentGuid) ?? 0) + 1;
                    siblingOrderMap.set(parentGuid, nextOrder);

                    const createdNode = await prismaAny.legal_document_node.create({
                      data: {
                        legal_document_guid: legalDocumentGuid,
                        parent_node_guid: parentGuid,
                        element_name: elementName,
                        element_id: elementId,
                        element_number: elementNumber,
                        element_text: elementText,
                        attributes: attrs,
                        sort_order: nextOrder,
                        create_user_id: "FLYWAY",
                        create_utc_timestamp: new Date(),
                      },
                      select: { legal_document_node_guid: true },
                    });
                    currentParentGuid = createdNode?.legal_document_node_guid || parentGuid;
                  }

                  // Recurse into children
                  const childObjects = Object.entries(el || {}).filter(
                    ([k, v]) => typeof v === "object" && !k.startsWith("@_") && k !== "#text" && k !== "#cdata",
                  );
                  for (const [childKey, childVal] of childObjects) {
                    const childNode: any = {};
                    (childNode as any)[childKey] = childVal;
                    await insertNodes(childNode, currentParentGuid, siblingOrderMap);
                  }
                }
              }
            };

            await insertNodes(json, null, new Map<string | null, number>());
          }

          await prismaAny.legal_document_source.update({
            where: { legal_document_source_guid: src.legal_document_source_guid },
            data: {
              last_processed_utc_timestamp: new Date(),
              update_user_id: "FLYWAY",
              update_utc_timestamp: new Date(),
            },
          });

          this.logger.log(`Processed: ${src.source_url}`);
        } catch (err) {
          this.logger.error(`ERROR PROCESSING LEGAL DOC SOURCE: ${src.source_url}`, err);
        }
      }
    } catch (e) {
      this.logger.error("Failed to import legal documents", e);
    }
  }
}
