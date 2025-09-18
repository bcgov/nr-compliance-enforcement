import { legal_document } from "./legal_document";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class legal_document_node {
  @ApiProperty({ type: String })
  legal_document_node_guid: string;

  @ApiProperty({ type: String })
  legal_document_guid: string;

  @ApiPropertyOptional({ type: String })
  parent_node_guid?: string;

  @ApiProperty({ type: String })
  element_name: string;

  @ApiPropertyOptional({ type: String })
  element_id?: string;

  @ApiPropertyOptional({ type: String })
  element_number?: string;

  @ApiPropertyOptional({ type: String })
  element_text?: string;

  @ApiPropertyOptional({ type: Object })
  attributes?: object;

  @ApiProperty({ type: Number })
  sort_order: number;

  @ApiProperty({ type: String })
  create_user_id: string = "FLYWAY";

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ type: () => legal_document })
  legal_document: legal_document;

  @ApiPropertyOptional({ type: () => legal_document_node })
  legal_document_node?: legal_document_node;

  @ApiProperty({ isArray: true, type: () => legal_document_node })
  other_legal_document_node: legal_document_node[];
}
