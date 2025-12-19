import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { task } from "../../../../prisma/investigation/generated/task";

export class Task {
  taskIdentifier: string;
  investigationIdentifier: string;
  taskTypeCode: string;
  taskStatusCode: string;
  assignedUserIdentifier: string;
  createdByUserIdentifier: string;
  createdDate: Date;
  taskNumber: number;
  description: string;
  activeIndicator: boolean;
}

export class CreateUpdateTaskInput {
  taskIdentifier?: string;
  investigationIdentifier?: string;
  taskTypeCode?: string;
  taskStatusCode?: string;
  assignedUserIdentifier?: string;
  appUserIdentifier?: string;
  description?: string;
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
      (dest) => dest.createdByUserIdentifier,
      mapFrom((src) => src.app_create_user_guid_ref),
    ),
    forMember(
      (dest) => dest.createdDate,
      mapFrom((src) => src.create_utc_timestamp),
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
