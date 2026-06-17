import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { Field, InputType } from "@nestjs/graphql";
import { investigation_attachment_reference } from "prisma/investigation/generated/investigation_attachment_reference";

export class InvestigationAttachmentReference {
  version: string;
  isActive: boolean;
}

@InputType()
export class CreateInvestigationAttachmentReferenceInput {
  @Field(() => String)
  version: string;
}

export const mapPrismaInvestigationAttachmentReferenceToInvestigationAttachmentReference = (mapper: Mapper) => {
  createMap<investigation_attachment_reference, InvestigationAttachmentReference>(
    mapper,
    "investigation_attachment_reference",
    "InvestigationAttachmentReference",
    forMember(
      (dest) => dest.version,
      mapFrom((src) => src.s3_version_ref),
    ),
    forMember(
      (dest) => dest.isActive,
      mapFrom((src) => src.active_ind),
    ),
  );
};
