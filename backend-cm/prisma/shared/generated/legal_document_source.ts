import { legal_document } from "./legal_document";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class legal_document_source {
  @ApiProperty({ type: String })
  legal_document_source_guid: string;

  @ApiProperty({ type: String })
  source_url: string;

  @ApiPropertyOptional({ type: Date })
  last_processed_utc_timestamp?: Date;

  @ApiProperty({ type: String })
  create_user_id: string = "FLYWAY";

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ isArray: true, type: () => legal_document })
  legal_document: legal_document[];
}
