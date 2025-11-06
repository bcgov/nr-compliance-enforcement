import { team } from "./team";
import { app_user } from "./app_user";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class app_user_team_xref {
  @ApiProperty({ type: String })
  app_user_team_xref_guid: string;

  @ApiProperty({ type: String })
  app_user_guid: string;

  @ApiProperty({ type: String })
  team_guid: string;

  @ApiProperty({ type: Boolean })
  active_ind: boolean;

  @ApiPropertyOptional({ type: String })
  create_user_id?: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiProperty({ type: Date })
  update_utc_timestamp: Date;

  @ApiProperty({ type: () => team })
  team: team;

  @ApiProperty({ type: () => app_user })
  app_user: app_user;
}
