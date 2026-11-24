import { app_user_activity_xref } from "./app_user_activity_xref";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class app_user_activity_xref_code {
  @ApiProperty({ type: String })
  app_user_activity_xref_code: string;

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

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ isArray: true, type: () => app_user_activity_xref })
  app_user_activity_xref_app_user_activity_xref_app_user_activity_xref_codeToapp_user_activity_xref_code: app_user_activity_xref[];
}
