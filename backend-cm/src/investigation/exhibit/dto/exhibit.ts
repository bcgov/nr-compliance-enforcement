import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { exhibit } from "../../../../prisma/investigation/generated/exhibit";
import { PaginatedResult, PaginationMetadata } from "../../../common/pagination.utility";

export class Exhibit {
  exhibitGuid: string;
  taskGuid: string;
  investigationGuid: string;
  exhibitNumber: number;
  exhibitDisplayNumber: string;
  propertyType: string;
  description: string;
  quantity: number;
  seizedFromFirstName: string;
  seizedFromLastName: string;
  seizedFromAddress: string;
  seizedFromPhoneNumber: string;
  intakeDate: Date;
  intakeTime: Date;
  collectedAppUserGuidRef: string;
  locationOfIntake: string;
  propertyTagNumber: string;
  activeIndicator: boolean;
  createdDate: Date;
  updatedDate: Date;
}

export class CreateUpdateExhibitInput {
  exhibitGuid?: string;
  taskGuid?: string;
  investigationGuid?: string;
  description?: string;
  propertyType: string;
  quantity?: number;
  seizedFromFirstName: string;
  seizedFromLastName?: string;
  seizedFromAddress?: string;
  seizedFromPhoneNumber?: string;
  intakeDate?: Date;
  intakeTime?: Date;
  collectedAppUserGuidRef?: string;
  locationOfIntake?: string;
  propertyTagNumber?: string;
}

export class ExhibitFilters {
  investigationGuid: string;
  search?: string;
  taskFilter?: string;
  propertyTypeFilter?: string;
  officerFilter?: string;
  intakeStartDate?: string;
  intakeEndDate?: string;
  sortBy?: string;
  sortOrder?: string;
}

export class ExhibitResult implements PaginatedResult<Exhibit> {
  items: Exhibit[];
  pageInfo: PaginationMetadata;
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
      (dest) => dest.exhibitDisplayNumber,
      mapFrom((src) => src.exhibit_display_number),
    ),
    forMember(
      (dest) => dest.propertyType,
      mapFrom((src) => src.property_type),
    ),
    forMember(
      (dest) => dest.description,
      mapFrom((src) => src.description_text),
    ),
    forMember(
      (dest) => dest.quantity,
      mapFrom((src) => src.quantity_amount),
    ),
    forMember(
      (dest) => dest.seizedFromFirstName,
      mapFrom((src) => src.seized_from_first_name),
    ),
    forMember(
      (dest) => dest.seizedFromLastName,
      mapFrom((src) => src.seized_from_last_name),
    ),
    forMember(
      (dest) => dest.seizedFromAddress,
      mapFrom((src) => src.seized_from_address),
    ),
    forMember(
      (dest) => dest.seizedFromPhoneNumber,
      mapFrom((src) => src.seized_from_phone_number),
    ),
    forMember(
      (dest) => dest.intakeDate,
      mapFrom((src) => src.collected_utc_date),
    ),
    forMember(
      (dest) => dest.intakeTime,
      mapFrom((src) => src.collected_utc_time),
    ),
    forMember(
      (dest) => dest.collectedAppUserGuidRef,
      mapFrom((src) => src.collected_by_app_user_guid_ref),
    ),
    forMember(
      (dest) => dest.locationOfIntake,
      mapFrom((src) => src.location_of_intake_text),
    ),
    forMember(
      (dest) => dest.propertyTagNumber,
      mapFrom((src) => src.property_tag_number),
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
