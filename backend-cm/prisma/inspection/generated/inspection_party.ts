import { inspection_business } from "./inspection_business";
import { inspection } from "./inspection";
import { inspection_person } from "./inspection_person";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class inspection_party {
  @ApiProperty({ type: String })
  inspection_party_guid: string;

  @ApiPropertyOptional({ type: String })
  party_guid_ref?: string;

  @ApiProperty({ type: String })
  party_type_code_ref: string;

  @ApiProperty({ type: String })
  inspection_guid: string;

  @ApiProperty({ type: Boolean })
  active_ind: boolean = true;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ isArray: true, type: () => inspection_business })
  inspection_business: inspection_business[];

  @ApiProperty({ type: () => inspection })
  inspection: inspection;

  @ApiProperty({ isArray: true, type: () => inspection_person })
  inspection_person: inspection_person[];
}
