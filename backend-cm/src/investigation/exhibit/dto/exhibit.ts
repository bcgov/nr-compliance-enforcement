import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { exhibit } from "../../../../prisma/investigation/generated/exhibit";

export class Exhibit {
  exhibitGuid: string;
  taskGuid: string;
  investigationGuid: string;
  exhibitNumber: number;
  description: string;
  dateCollected: Date;
  collectedAppUserGuidRef: string;
  activeIndicator: boolean;
  createdDate: Date;
  updatedDate: Date;
}

export class CreateUpdateExhibitInput {
  exhibitGuid?: string;
  taskGuid?: string;
  investigationGuid?: string;
  description?: string;
  dateCollected?: Date;
  collectedAppUserGuidRef?: string;
  appUserIdentifier?: string;
}

export const mapPrismaExhibitToExhibit = (mapper: Mapper) => {
  createMap<exhibit, Exhibit>(
    mapper,
    "exhibit",
    "Exhibit",
    forMember(
      (dest) => dest.exhibitGuid,
      mapFrom((src) => src.exhibit_guid),
    ),
    forMember(
      (dest) => dest.taskGuid,
      mapFrom((src) => src.task_guid),
    ),
    forMember(
      (dest) => dest.investigationGuid,
      mapFrom((src) => src.investigation_guid),
    ),
    forMember(
      (dest) => dest.exhibitNumber,
      mapFrom((src) => src.exhibit_number),
    ),
    forMember(
      (dest) => dest.description,
      mapFrom((src) => src.description),
    ),
    forMember(
      (dest) => dest.dateCollected,
      mapFrom((src) => src.date_collected),
    ),
    forMember(
      (dest) => dest.collectedAppUserGuidRef,
      mapFrom((src) => src.collected_user_guid_ref),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.createdDate,
      mapFrom((src) => src.create_utc_timestamp),
    ),
    forMember(
      (dest) => dest.updatedDate,
      mapFrom((src) => src.update_utc_timestamp),
    ),
  );
};
