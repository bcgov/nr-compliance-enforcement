import { createMap, forMember, mapFrom, Mapper, mapWithArguments } from "@automapper/core";
import { investigation_business_person_address_xref } from "prisma/investigation/generated/investigation_business_person_address_xref";
import { InvestigationAddress } from "src/investigation/investigation_address/dto/investigation_address";
import { InvestigationBusinessPersonXref } from "src/investigation/investigation_business_person_xref/dto/investigation_business_person_xref";

export class InvestigationBusinessPersonAddressXref {
  businessPersonAddressXrefGuid: string;
  businessPerson: InvestigationBusinessPersonXref;
  address: InvestigationAddress;
  activeInd: boolean;
}

export const mapPrismaInvestigationBusinessPersonAddressXrefToInvestigationBusinessPersonAddressXref = (
  mapper: Mapper,
) => {
  createMap<investigation_business_person_address_xref, InvestigationBusinessPersonAddressXref>(
    mapper,
    "investigation_business_person_address_xref",
    "InvestigationBusinessPersonAddressXref",
    forMember(
      (dest) => dest.businessPersonAddressXrefGuid,
      mapFrom((src) => src.investigation_business_person_address_xref_guid),
    ),
    forMember(
      (dest) => dest.businessPerson,
      mapWithArguments((src) =>
        mapper.map(
          src.investigation_business_person_xref,
          "investigation_business_person_xref",
          "InvestigationBusinessPersonXref",
        ),
      ),
    ),
    forMember(
      (dest) => dest.address,
      mapWithArguments((src) => mapper.map(src.investigation_address, "investigation_address", "InvestigationAddress")),
    ),
    forMember(
      (dest) => dest.activeInd,
      mapFrom((src) => src.active_ind),
    ),
  );
};
