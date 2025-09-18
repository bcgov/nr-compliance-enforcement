import { legal_document_source } from "./legal_document_source";
import { legal_document_node } from "./legal_document_node";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class legal_document {
  @ApiProperty({ type: String })
  legal_document_guid: string;

  @ApiProperty({ type: String })
  legal_document_source_guid: string;

  @ApiProperty({ type: String })
  document_type: string;

  @ApiPropertyOptional({ type: String })
  external_identifier?: string;

  @ApiPropertyOptional({ type: String })
  title?: string;

  @ApiProperty({ type: String })
  xml_content: string;

  @ApiProperty({ type: String })
  create_user_id: string = "FLYWAY";

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiPropertyOptional({ type: String })
  chapter?: string;

  @ApiPropertyOptional({ type: Number })
  year_enacted?: number;

  @ApiPropertyOptional({ type: String })
  assented_to?: string;

  @ApiProperty({ type: () => legal_document_source })
  legal_document_source: legal_document_source;

  @ApiProperty({ isArray: true, type: () => legal_document_node })
  legal_document_node: legal_document_node[];
}
