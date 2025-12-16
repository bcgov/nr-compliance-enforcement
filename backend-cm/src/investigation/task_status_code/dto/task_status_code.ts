import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { task_status_code } from "../../../../prisma/investigation/generated/task_status_code";

export class TaskStatusCode {
  taskStatusCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaTaskStatusCodeToTaskStatusCode = (mapper: Mapper) => {
  createMap<task_status_code, TaskStatusCode>(
    mapper,
    "task_status_code",
    "TaskStatusCode",
    forMember(
      (dest) => dest.taskStatusCode,
      mapFrom((src) => src.task_status_code),
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
