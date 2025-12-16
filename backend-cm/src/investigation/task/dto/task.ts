import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { task } from "../../../../prisma/investigation/generated/task";

export class Task {
  taskIdentifier: string;
  investigationIdentifier: string;
  taskTypeCode: string;
  taskSubTypeCode: string;
  taskStatusCode: string;
  assignedUserIdentifier: string;
  taskNumber: number;
  description: string;
  activeIndicator: boolean;
}

export const mapPrismaTaskToTask = (mapper: Mapper) => {
  createMap<task, Task>(
    mapper,
    "task",
    "Task",
    forMember(
      (dest) => dest.taskIdentifier,
      mapFrom((src) => src.task_guid),
    ),
    forMember(
      (dest) => dest.investigationIdentifier,
      mapFrom((src) => src.investigation_guid),
    ),
    forMember(
      (dest) => dest.taskSubTypeCode,
      mapFrom((src) => src.task_sub_type_code),
    ),
    forMember(
      (dest) => dest.taskTypeCode,
      mapFrom((src) => src.task_type_code),
    ),
    forMember(
      (dest) => dest.taskStatusCode,
      mapFrom((src) => src.task_status_code),
    ),
    forMember(
      (dest) => dest.assignedUserIdentifier,
      mapFrom((src) => src.assigned_app_user_guid_ref),
    ),
    forMember(
      (dest) => dest.taskNumber,
      mapFrom((src) => src.task_number),
    ),
    forMember(
      (dest) => dest.description,
      mapFrom((src) => src.description),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
  );
};
