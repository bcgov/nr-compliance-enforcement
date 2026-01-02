import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { task_category_type_code } from "../../../../prisma/investigation/generated/task_category_type_code";

export class TaskCategoryTypeCode {
  taskCategoryTypeCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaTaskCategoryTypeCodeToTaskCategoryTypeCode = (mapper: Mapper) => {
  createMap<task_category_type_code, TaskCategoryTypeCode>(
    mapper,
    "task_category_type_code",
    "TaskCategoryTypeCode",
    forMember(
      (dest) => dest.taskCategoryTypeCode,
      mapFrom((src) => src.task_category_type_code),
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
