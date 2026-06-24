import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { Field, InputType } from "@nestjs/graphql";
import { investigation_attachment_reference } from "prisma/investigation/generated/investigation_attachment_reference";

export class InvestigationAttachmentReference {
  objectId: string;
  version: string;
  fileName: string;
  createdAt: Date;
  thumbObjectId: string;
  thumbVersion: string;
  activeInd: boolean;
}

@InputType()
export class CreateInvestigationAttachmentReferenceInput {
  @Field(() => String)
  objectId: string;

  @Field(() => String)
  version: string;

  @Field(() => String)
  thumbObjectId: string;

  @Field(() => String)
  thumbVersion: string;

  @Field(() => String)
  fileName: string;

  @Field(() => Date)
  createdAt: string;
}

@InputType()
export class DeactivateInvestigationAttachmentReferenceInput {
  @Field(() => String)
  objectId: string;

  @Field(() => String)
  investigationPartyGuid: string;
}

export const mapPrismaInvestigationAttachmentReferenceToInvestigationAttachmentReference = (mapper: Mapper) => {
  createMap<investigation_attachment_reference, InvestigationAttachmentReference>(
    mapper,
    "investigation_attachment_reference",
    "InvestigationAttachmentReference",
    forMember(
      (dest) => dest.objectId,
      mapFrom((src) => src.object_guid_ref),
    ),
    forMember(
      (dest) => dest.version,
      mapFrom((src) => src.s3_version_ref),
    ),
    forMember(
      (dest) => dest.activeInd,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.fileName,
      mapFrom((src) => src.filename_text),
    ),
    forMember(
      (dest) => dest.createdAt,
      mapFrom((src) => src.coms_created_date),
    ),
    forMember(
      (dest) => dest.thumbObjectId,
      mapFrom((src) => src.thumb_object_guid_ref),
    ),
    forMember(
      (dest) => dest.thumbVersion,
      mapFrom((src) => src.thumb_s3_version_ref),
    ),
  );
};
