import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { contravention } from "../../../../prisma/investigation/generated/contravention";
import { Field, InputType } from "@nestjs/graphql";
import { InvestigationParty } from "src/investigation/investigation_party/dto/investigation_party";

export class Contravention {
  contraventionIdentifier: string;
  investigationIdentifier: string;
  legislationIdentifierRef: string;
  investigationParty: InvestigationParty[];
  isActive: boolean;
  date: Date;
  community: string;
  selectedPartyGuid?: string;
}

@InputType()
export class CreateUpdateContraventionInput {
  @Field(() => String)
  investigationGuid: string;

  @Field(() => String)
  investigationPartyGuids: string[];

  @Field(() => String)
  legislationReference: string;

  @Field(() => Date)
  date: Date;

  @Field(() => String)
  community: string;

  @Field(() => String, { nullable: true })
  selectedPartyGuid?: string | null;
}

export const mapPrismaContreventionToContravention = (mapper: Mapper) => {
  createMap<contravention, Contravention>(
    mapper,
    "contravention",
    "Contravention",
    forMember(
      (dest) => dest.contraventionIdentifier,
      mapFrom((src) => src.contravention_guid),
    ),
    forMember(
      (dest) => dest.investigationIdentifier,
      mapFrom((src) => src.investigation_guid),
    ),
    forMember(
      (dest) => dest.legislationIdentifierRef,
      mapFrom((src) => src.legislation_guid_ref),
    ),
    forMember(
      (dest) => dest.investigationParty,
      mapFrom((src) =>
        (src.contravention_party_xref ?? []).map(
          (x) =>
            ({
              ...mapper.map(x.investigation_party, "investigation_party", "InvestigationParty"),
              enforcementActions: mapper.mapArray(
                x.enforcement_action ?? [],
                "enforcement_action",
                "EnforcementAction",
              ),
            }) as InvestigationParty,
        ),
      ),
    ),
    forMember(
      (dest) => dest.isActive,
      mapFrom((src) => src.active_ind),
    ),
    forMember(
      (dest) => dest.date,
      mapFrom((src) => src.contravention_date),
    ),
    forMember(
      (dest) => dest.community,
      mapFrom((src) => src.geo_organization_unit_code_ref),
    ),
  );
};
