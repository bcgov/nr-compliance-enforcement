import { officer_investigation_xref } from "./officer_investigation_xref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class officer_investigation_xref_code {
  @ApiProperty({ type: String })
  officer_investigation_xref_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiProperty({ type: Number })
  display_order: number;

  @ApiProperty({ type: Boolean })
  active_ind: boolean = true;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiProperty({ type: String })
  update_user_id: string;

  @ApiProperty({ type: Date })
  update_utc_timestamp: Date;

  @ApiProperty({ isArray: true, type: () => officer_investigation_xref })
  officer_investigation_xref_officer_investigation_xref_officer_investigation_xref_codeToofficer_investigation_xref_code: officer_investigation_xref[];
}
