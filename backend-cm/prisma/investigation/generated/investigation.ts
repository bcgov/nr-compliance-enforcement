import { investigation_status_code } from "./investigation_status_code";
import { investigation_party } from "./investigation_party";
import { officer_investigation_xref } from "./officer_investigation_xref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class investigation {
  @ApiProperty({ type: String })
  investigation_guid: string;

  @ApiPropertyOptional({ type: String })
  investigation_description?: string;

  @ApiProperty({ type: String })
  owned_by_agency_ref: string;

  @ApiProperty({ type: String })
  investigation_status: string;

  @ApiProperty({ type: Date })
  investigation_opened_utc_timestamp: Date;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  location_address?: string;

  @ApiPropertyOptional({ type: String })
  location_description?: string;

  @ApiPropertyOptional({ type: String })
  created_by_app_user_guid_ref?: string;

  @ApiProperty({ type: () => investigation_status_code })
  investigation_status_code: investigation_status_code;

  @ApiProperty({ isArray: true, type: () => investigation_party })
  investigation_party: investigation_party[];

  @ApiProperty({ isArray: true, type: () => officer_investigation_xref })
  officer_investigation_xref: officer_investigation_xref[];
}
