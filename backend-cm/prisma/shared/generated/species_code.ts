import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class species_code {
  @ApiProperty({ type: String })
  species_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiProperty({ type: Number })
  display_order: number;

  @ApiProperty({ type: Boolean })
  active_ind: boolean = true;

  @ApiProperty({ type: Boolean })
  complaint_ind: boolean = true;

  @ApiProperty({ type: Boolean })
  large_carnivore_ind: boolean;

  @ApiProperty({ type: Boolean })
  display_on_complaint_ind: boolean;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;
}
