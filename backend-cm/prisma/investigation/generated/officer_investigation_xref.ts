import { investigation } from "./investigation";
import { officer_investigation_xref_code } from "./officer_investigation_xref_code";
import { ApiProperty } from "@nestjs/swagger";

export class officer_investigation_xref {
  @ApiProperty({ type: String })
  officer_investigation_xref_guid: string;

  @ApiProperty({ type: String })
  officer_guid_ref: string;

  @ApiProperty({ type: String })
  investigation_guid: string;

  @ApiProperty({ type: String })
  officer_investigation_xref_code: string;

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

  @ApiProperty({ type: () => investigation })
  investigation: investigation;

  @ApiProperty({ type: () => officer_investigation_xref_code })
  officer_investigation_xref_code_officer_investigation_xref_officer_investigation_xref_codeToofficer_investigation_xref_code: officer_investigation_xref_code;
}
