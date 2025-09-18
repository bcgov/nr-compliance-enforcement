import { Logger, UseGuards } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { LegalDocumentService } from "./legal_document.service";

@UseGuards(JwtRoleGuard)
@Resolver("LegalDocument")
export class LegalDocumentResolver {
  private readonly logger = new Logger(LegalDocumentResolver.name);

  constructor(private readonly service: LegalDocumentService) {}

  private mapDoc(row: any) {
    if (!row) return null;
    return {
      legalDocumentGuid: row.legal_document_guid,
      documentType: row.document_type,
      externalIdentifier: row.external_identifier,
      title: row.title,
      xmlContent: row.xml_content,
      chapter: row.chapter,
      yearEnacted: row.year_enacted,
      assentedTo: row.assented_to,
      legalDocumentSourceGuid: row.legal_document_source_guid,
    };
  }

  private mapNode(row: any) {
    if (!row) return null;
    return {
      legalDocumentNodeGuid: row.legal_document_node_guid,
      legalDocumentGuid: row.legal_document_guid,
      parentNodeGuid: row.parent_node_guid,
      elementName: row.element_name,
      elementId: row.element_id,
      elementNumber: row.element_number,
      elementText: row.element_text,
      sortOrder: row.sort_order,
      // keep original attributes for attributesJson resolver
      attributes: row.attributes,
    };
  }

  private mapSource(row: any) {
    if (!row) return null;
    return {
      legalDocumentSourceGuid: row.legal_document_source_guid,
      sourceUrl: row.source_url,
      lastProcessedUtcTimestamp: row.last_processed_utc_timestamp?.toISOString?.() ?? row.last_processed_utc_timestamp,
    };
  }

  @Query("legalDocuments")
  @Roles(coreRoles)
  async legalDocuments(@Args("documentType") documentType?: string) {
    const rows = await this.service.list(documentType);
    return rows.map((r: any) => this.mapDoc(r));
  }

  @Query("legalDocument")
  @Roles(coreRoles)
  async legalDocument(@Args("legalDocumentGuid") id: string) {
    const row = await this.service.get(id);
    return this.mapDoc(row);
  }

  @Query("legalDocumentNodes")
  @Roles(coreRoles)
  async legalDocumentNodes(
    @Args("legalDocumentGuid") legalDocumentGuid: string,
    @Args("parentNodeGuid") parentNodeGuid?: string,
  ) {
    const rows = await this.service.listNodes(legalDocumentGuid, parentNodeGuid);
    return rows.map((r: any) => this.mapNode(r));
  }

  @Query("legalDocumentNodeByElementId")
  @Roles(coreRoles)
  async legalDocumentNodeByElementId(
    @Args("legalDocumentGuid") legalDocumentGuid: string,
    @Args("elementId") elementId: string,
  ) {
    const row = await this.service.getNodeByElementId(legalDocumentGuid, elementId);
    return this.mapNode(row);
  }

  @Query("legalDocumentWithNodes")
  @Roles(coreRoles)
  async legalDocumentWithNodes(@Args("legalDocumentGuid") id: string) {
    const doc = await this.service.get(id);
    const nodes = await this.service.listNodes(id, undefined);
    return {
      legalDocument: this.mapDoc(doc),
      nodes: nodes.map((n: any) => this.mapNode(n)),
    };
  }

  @ResolveField("source")
  async source(@Parent() doc: any) {
    const row = await this.service.getSource(doc.legalDocumentSourceGuid);
    return this.mapSource(row);
  }

  @ResolveField("nodes")
  async nodes(@Parent() doc: any, @Args("parentNodeGuid") parentNodeGuid?: string) {
    const rows = await this.service.listNodes(doc.legalDocumentGuid, parentNodeGuid);
    return rows.map((r: any) => this.mapNode(r));
  }
}

@UseGuards(JwtRoleGuard)
@Resolver("LegalDocumentNode")
export class LegalDocumentNodeResolver {
  private readonly logger = new Logger(LegalDocumentNodeResolver.name);
  constructor(private readonly service: LegalDocumentService) {}

  // Expose attributes as JSON string for now
  @ResolveField("attributesJson")
  async attributesJson(@Parent() node: any) {
    return node?.attributes ? JSON.stringify(node.attributes) : null;
  }
}
