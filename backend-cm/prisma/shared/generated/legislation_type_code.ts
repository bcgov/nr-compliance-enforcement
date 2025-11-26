import { legislation } from "./legislation";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class legislation_type_code {
  @ApiProperty({ type: String })
  legislation_type_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiProperty({ type: String })
  long_description: string;

  @ApiProperty({ type: Number })
  display_order: number;

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

  @ApiProperty({ isArray: true, type: () => legislation })
  legislation_legislation_legislation_type_codeTolegislation_type_code: legislation[];
}
