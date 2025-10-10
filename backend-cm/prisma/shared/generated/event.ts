import { event_entity_type_code } from "./event_entity_type_code";
import { event_verb_type_code } from "./event_verb_type_code";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class event {
  @ApiProperty({ type: String })
  event_guid: string;

  @ApiProperty({ type: String })
  event_verb_type_code: string;

  @ApiProperty({ type: Date })
  published_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  source_id?: string;

  @ApiPropertyOptional({ type: String })
  source_entity_type_code?: string;

  @ApiProperty({ type: String })
  actor_id: string;

  @ApiProperty({ type: String })
  actor_entity_type_code: string;

  @ApiProperty({ type: String })
  target_id: string;

  @ApiProperty({ type: String })
  target_entity_type_code: string;

  @ApiPropertyOptional({ type: Object })
  content?: object;

  @ApiProperty({ type: String })
  create_user_id: string;

  @ApiProperty({ type: Date })
  create_utc_timestamp: Date;

  @ApiPropertyOptional({ type: String })
  update_user_id?: string;

  @ApiPropertyOptional({ type: Date })
  update_utc_timestamp?: Date;

  @ApiProperty({ type: () => event_entity_type_code })
  event_entity_type_code_event_actor_entity_type_codeToevent_entity_type_code: event_entity_type_code;

  @ApiProperty({ type: () => event_verb_type_code })
  event_verb_type_code_event_event_verb_type_codeToevent_verb_type_code: event_verb_type_code;

  @ApiPropertyOptional({ type: () => event_entity_type_code })
  event_entity_type_code_event_source_entity_type_codeToevent_entity_type_code?: event_entity_type_code;

  @ApiProperty({ type: () => event_entity_type_code })
  event_entity_type_code_event_target_entity_type_codeToevent_entity_type_code: event_entity_type_code;
}
