import { Injectable } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";

@Injectable()
export class LegalDocumentService {
  constructor(private readonly prisma: SharedPrismaService) {}

  async list(documentType?: string) {
    const prismaAny = this.prisma as any;
    return prismaAny.legal_document.findMany({
      where: documentType ? { document_type: documentType } : undefined,
      orderBy: { create_utc_timestamp: "desc" },
      select: {
        legal_document_guid: true,
        document_type: true,
        external_identifier: true,
        title: true,
        xml_content: true,
        chapter: true,
        year_enacted: true,
        assented_to: true,
        legal_document_source_guid: true,
      },
    });
  }

  async get(legalDocumentGuid: string) {
    const prismaAny = this.prisma as any;
    return prismaAny.legal_document.findUnique({
      where: { legal_document_guid: legalDocumentGuid },
      select: {
        legal_document_guid: true,
        document_type: true,
        external_identifier: true,
        title: true,
        xml_content: true,
        chapter: true,
        year_enacted: true,
        assented_to: true,
        legal_document_source_guid: true,
      },
    });
  }

  async getSource(legalDocumentSourceGuid: string) {
    const prismaAny = this.prisma as any;
    return prismaAny.legal_document_source.findUnique({
      where: { legal_document_source_guid: legalDocumentSourceGuid },
      select: {
        legal_document_source_guid: true,
        source_url: true,
        last_processed_utc_timestamp: true,
      },
    });
  }

  async listNodes(legalDocumentGuid: string, parentNodeGuid?: string | null) {
    const prismaAny = this.prisma as any;
    return prismaAny.legal_document_node.findMany({
      where: {
        legal_document_guid: legalDocumentGuid,
        ...(parentNodeGuid === undefined ? {} : { parent_node_guid: parentNodeGuid }),
      },
      orderBy: [{ parent_node_guid: "asc" }, { sort_order: "asc" }],
      select: {
        legal_document_node_guid: true,
        legal_document_guid: true,
        parent_node_guid: true,
        element_name: true,
        element_id: true,
        element_number: true,
        element_text: true,
        attributes: true,
        sort_order: true,
      },
    });
  }

  async getNodeByElementId(legalDocumentGuid: string, elementId: string) {
    const prismaAny = this.prisma as any;
    return prismaAny.legal_document_node.findFirst({
      where: { legal_document_guid: legalDocumentGuid, element_id: elementId },
      select: {
        legal_document_node_guid: true,
        legal_document_guid: true,
        parent_node_guid: true,
        element_name: true,
        element_id: true,
        element_number: true,
        element_text: true,
        attributes: true,
        sort_order: true,
      },
      orderBy: { sort_order: "asc" },
    });
  }
}
