import { event } from "./event";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class event_entity_type_code {
  @ApiProperty({ type: String })
  event_entity_type_code: string;

  @ApiProperty({ type: String })
  short_description: string;

  @ApiPropertyOptional({ type: String })
  long_description?: string;

  @ApiPropertyOptional({ type: Number })
  display_order?: number;

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

  @ApiProperty({ isArray: true, type: () => event })
  event_event_actor_entity_type_codeToevent_entity_type_code: event[];

  @ApiProperty({ isArray: true, type: () => event })
  event_event_source_entity_type_codeToevent_entity_type_code: event[];

  @ApiProperty({ isArray: true, type: () => event })
  event_event_target_entity_type_codeToevent_entity_type_code: event[];
}
