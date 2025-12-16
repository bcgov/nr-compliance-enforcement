import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { task_sub_type_code } from "../../../../prisma/investigation/generated/task_sub_type_code";

export class TaskSubTypeCode {
  taskSubTypeCode: string;
  taskTypeCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaTaskSubTypeCodeToTaskSubTypeCode = (mapper: Mapper) => {
  createMap<task_sub_type_code, TaskSubTypeCode>(
    mapper,
    "task_sub_type_code",
    "TaskSubTypeCode",
    forMember(
      (dest) => dest.taskSubTypeCode,
      mapFrom((src) => src.task_sub_type_code),
    ),
    forMember(
      (dest) => dest.taskTypeCode,
      mapFrom((src) => src.task_type_code),
    ),
    forMember(
      (dest) => dest.shortDescription,
      mapFrom((src) => src.short_description),
    ),
    forMember(
      (dest) => dest.longDescription,
      mapFrom((src) => src.long_description),
    ),
    forMember(
      (dest) => dest.displayOrder,
      mapFrom((src) => src.display_order),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
  );
};
