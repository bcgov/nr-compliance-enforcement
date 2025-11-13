import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { office } from "../../../../prisma/shared/generated/office";
import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

export class Office {
  officeGuid: string;
  geoOrganizationUnitCode: string;
  agencyCode: string;
  createUserId: string;
  createTimestamp: Date;
  updateUserId: string;
  updateTimestamp: Date;
  cosGeoOrgUnit?: any;
  appUsers?: any[];
}

@InputType()
export class CreateOfficeInput {
  @Field(() => String)
  geoOrganizationUnitCode: string;

  @Field(() => String)
  agencyCode: string;
}

@InputType()
export class UpdateOfficeInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  geoOrganizationUnitCode?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  agencyCode?: string;
}

export const mapPrismaOfficeToOffice = (mapper: Mapper) => {
  createMap<office, Office>(
    mapper,
    "office",
    "Office",
    forMember(
      (dest) => dest.officeGuid,
      mapFrom((src) => src.office_guid),
    ),
    forMember(
      (dest) => dest.geoOrganizationUnitCode,
      mapFrom((src) => src.geo_organization_unit_code),
    ),
    forMember(
      (dest) => dest.agencyCode,
      mapFrom((src) => src.agency_code_ref),
    ),
    forMember(
      (dest) => dest.createUserId,
      mapFrom((src) => src.create_user_id),
    ),
    forMember(
      (dest) => dest.createTimestamp,
      mapFrom((src) => src.create_utc_timestamp),
    ),
    forMember(
      (dest) => dest.updateUserId,
      mapFrom((src) => src.update_user_id),
    ),
    forMember(
      (dest) => dest.updateTimestamp,
      mapFrom((src) => src.update_utc_timestamp),
    ),
  );
};
