import { officer_inspection_xref } from "./officer_inspection_xref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class officer_inspection_xref_code {
  @ApiProperty({ type: String })
  officer_inspection_xref_code: string;

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

  @ApiProperty({ isArray: true, type: () => officer_inspection_xref })
  officer_inspection_xref_officer_inspection_xref_officer_inspection_xref_codeToofficer_inspection_xref_code: officer_inspection_xref[];
}
