import { contact_method } from "./contact_method";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class person {
  @ApiProperty({ type: String })
  person_guid: string;

  @ApiProperty({ type: String })
  first_name: string;

  @ApiPropertyOptional({ type: String })
  middle_name?: string;

  @ApiPropertyOptional({ type: String })
  middle_name_2?: string;

  @ApiProperty({ type: String })
  last_name: string;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ isArray: true, type: () => contact_method })
  contact_method: contact_method[];
}
