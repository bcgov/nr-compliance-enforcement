import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { task_type_code } from "../../../../prisma/investigation/generated/task_type_code";

export class TaskTypeCode {
  taskTypeCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaTaskTypeCodeToTaskTypeCode = (mapper: Mapper) => {
  createMap<task_type_code, TaskTypeCode>(
    mapper,
    "task_type_code",
    "TaskTypeCode",
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
