import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { event } from "../../../../prisma/shared/generated/event";
import { Field, InputType, ObjectType, Int } from "@nestjs/graphql";
import { IsOptional, IsString, IsNotEmpty } from "class-validator";
import { PaginationMetadata, PaginatedResult } from "../../../common/pagination.utility";
import { GraphQLJSONObject } from "graphql-type-json";
import { EventVerbTypeCode } from "../../event_verb_type_code/dto/event_verb_type_code";
import { EventEntityTypeCode } from "../../event_entity_type_code/dto/event_entity_type_code";

export class Event {
  eventGuid: string;
  eventVerbTypeCode: EventVerbTypeCode;
  publishedTimestamp: Date;
  sourceId?: string;
  sourceEntityTypeCode?: EventEntityTypeCode;
  actorId: string;
  actorEntityTypeCode: EventEntityTypeCode;
  targetId: string;
  targetEntityTypeCode: EventEntityTypeCode;
  content?: any;
}

@InputType()
export class EventCreateInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  eventVerbTypeCode: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  sourceId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  sourceEntityTypeCode?: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  actorId: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  actorEntityTypeCode: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  targetId: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  targetEntityTypeCode: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  content?: any;
}

@InputType()
export class EventFilters {
  @Field(() => String, { nullable: true })
  @IsOptional()
  eventVerbTypeCode?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sourceId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  actorId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  targetId?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  endDate?: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sortOrder?: string;
}

@ObjectType()
export class PageInfo implements PaginationMetadata {
  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  pageSize: number;
}

@ObjectType()
export class EventResult implements PaginatedResult<Event> {
  @Field(() => [Event])
  items: Event[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

export const mapPrismaEventToEvent = (mapper: Mapper) => {
  createMap<event, Event>(
    mapper,
    "event",
    "Event",
    forMember(
      (dest) => dest.eventGuid,
      mapFrom((src) => src.event_guid),
    ),
    forMember(
      (dest) => dest.eventVerbTypeCode,
      mapFrom((src) =>
        mapper.map(
          src.event_verb_type_code_event_event_verb_type_codeToevent_verb_type_code,
          "event_verb_type_code",
          "EventVerbTypeCode",
        ),
      ),
    ),
    forMember(
      (dest) => dest.publishedTimestamp,
      mapFrom((src) => src.published_utc_timestamp),
    ),
    forMember(
      (dest) => dest.sourceId,
      mapFrom((src) => src.source_id),
    ),
    forMember(
      (dest) => dest.sourceEntityTypeCode,
      mapFrom((src) =>
        src.event_entity_type_code_event_source_entity_type_codeToevent_entity_type_code
          ? mapper.map(
              src.event_entity_type_code_event_source_entity_type_codeToevent_entity_type_code,
              "event_entity_type_code",
              "EventEntityTypeCode",
            )
          : undefined,
      ),
    ),
    forMember(
      (dest) => dest.actorId,
      mapFrom((src) => src.actor_id),
    ),
    forMember(
      (dest) => dest.actorEntityTypeCode,
      mapFrom((src) =>
        mapper.map(
          src.event_entity_type_code_event_actor_entity_type_codeToevent_entity_type_code,
          "event_entity_type_code",
          "EventEntityTypeCode",
        ),
      ),
    ),
    forMember(
      (dest) => dest.targetId,
      mapFrom((src) => src.target_id),
    ),
    forMember(
      (dest) => dest.targetEntityTypeCode,
      mapFrom((src) =>
        mapper.map(
          src.event_entity_type_code_event_target_entity_type_codeToevent_entity_type_code,
          "event_entity_type_code",
          "EventEntityTypeCode",
        ),
      ),
    ),
    forMember(
      (dest) => dest.content,
      mapFrom((src) => src.content),
    ),
  );
};
