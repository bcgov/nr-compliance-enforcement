import { inspection_status_code } from "./inspection_status_code";
import { officer_inspection_xref } from "./officer_inspection_xref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class inspection {
  @ApiProperty({ type: String })
  inspection_guid: string;

  @ApiPropertyOptional({ type: String })
  inspection_description?: string;

  @ApiProperty({ type: String })
  owned_by_agency_ref: string;

  @ApiProperty({ type: String })
  inspection_status: string;

  @ApiProperty({ type: Date })
  inspection_opened_utc_timestamp: Date;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ type: () => inspection_status_code })
  inspection_status_code: inspection_status_code;

  @ApiProperty({ isArray: true, type: () => officer_inspection_xref })
  officer_inspection_xref: officer_inspection_xref[];
}
