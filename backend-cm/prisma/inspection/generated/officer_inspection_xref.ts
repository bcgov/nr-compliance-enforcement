import { inspection } from "./inspection";
import { officer_inspection_xref_code } from "./officer_inspection_xref_code";
import { ApiProperty } from "@nestjs/swagger";

export class officer_inspection_xref {
  @ApiProperty({ type: String })
  officer_inspection_xref_guid: string;

  @ApiProperty({ type: String })
  officer_guid_ref: string;

  @ApiProperty({ type: String })
  inspection_guid: string;

  @ApiProperty({ type: String })
  officer_inspection_xref_code: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiProperty({ type: String })
  update_user_id: string;

  @ApiProperty({ type: Date })
  update_utc_timestamp: Date;

  @ApiProperty({ type: Boolean })
  active_ind: boolean;

  @ApiProperty({ type: () => inspection })
  inspection: inspection;

  @ApiProperty({ type: () => officer_inspection_xref_code })
  officer_inspection_xref_code_officer_inspection_xref_officer_inspection_xref_codeToofficer_inspection_xref_code: officer_inspection_xref_code;
}
