import { randomUUID } from "node:crypto";
import { PARTY_TYPES } from "../../common/party";
import { AddressInput } from "../../shared/address/dto/address";
import { Alias } from "../../shared/alias/dto/alias";
import { BusinessInput } from "../../shared/business/dto/business";
import { BusinessIdentifier } from "../../shared/business_identifier/dto/business_identifier";
import { BusinessPersonXrefInput } from "../../shared/business_person_xref/dto/business_person_xref";
import { ContactMethod } from "../../shared/contact_method/dto/contact_method";
import { PartyCreateInput } from "../../shared/party/dto/party";
import { PersonFacialHairStyleCodeInput } from "../../shared/person_facial_hair_style_code/dto/person_facial_hair_style_code";
import { InvestigationAddress } from "../investigation_address/dto/investigation_address";
import { InvestigationBusiness } from "../investigation_business/dto/investigation_business";
import { InvestigationBusinessPersonXref } from "../investigation_business_person_xref/dto/investigation_business_person_xref";
import { InvestigationContactMethod } from "../investigation_contact_method/dto/investigation_contact_method";
import { InvestigationPerson } from "../investigation_person/dto/investigation_person";
import { InvestigationPersonFacialHairStyleCodeRef } from "../investigation_person_facial_hair_style_code_ref/dto/InvestigationPersonFacialHairStyleCodeRef";
import { InvestigationParty } from "./dto/investigation_party";
import { PersonInput } from "src/shared/person/dto/person.input";

export interface SharedChildGuids {
  addressGuids: Map<string, string>;
  contactMethodGuids: Map<string, string>;
  aliasGuids: Map<string, string>;
  businessIdentifierGuids: Map<string, string>;
  businessPersonXrefGuids: Map<string, string>;
  facialHairStyleGuids: Map<string, string>;
}

export interface MappedSharedParty {
  input: PartyCreateInput;
  childGuids: SharedChildGuids;
}

const isActive = (record?: { isActive?: boolean } | null): boolean => !!record && record.isActive !== false;

const hasValue = (value?: string | null): boolean => (value ?? "").trim().length > 0;

const emptyChildGuids = (): SharedChildGuids => ({
  addressGuids: new Map<string, string>(),
  contactMethodGuids: new Map<string, string>(),
  aliasGuids: new Map<string, string>(),
  businessIdentifierGuids: new Map<string, string>(),
  businessPersonXrefGuids: new Map<string, string>(),
  facialHairStyleGuids: new Map<string, string>(),
});

// Each child row gets a generated shared guid, recorded against its investigation-local guid so
// the local *_guid_ref column can be pointed at the row the shared registry is about to create.
const takeSharedGuid = (guids: Map<string, string>, localGuid?: string): string => {
  const sharedGuid = randomUUID();
  if (localGuid) {
    guids.set(localGuid, sharedGuid);
  }
  return sharedGuid;
};

const mapContactMethods = (contactMethods: InvestigationContactMethod[], guids: Map<string, string>): ContactMethod[] =>
  (contactMethods ?? [])
    .filter((cm) => isActive(cm) && hasValue(cm.value))
    .map(
      (cm) =>
        ({
          contactMethodGuid: takeSharedGuid(guids, cm.contactMethodGuid),
          typeCode: cm.typeCode,
          value: cm.value,
          isPrimary: cm.isPrimary ?? false,
        }) as ContactMethod,
    );

const mapAddress = (address: InvestigationAddress, addressGuid: string, guids: SharedChildGuids): AddressInput =>
  ({
    addressGuid,
    addressName: address.addressName,
    address: address.address,
    city: address.city,
    province: address.province,
    postalCode: address.postalCode,
    country: address.country,
    isPrimary: address.isPrimary ?? false,
    displayInInvestigation: address.displayInInvestigation ?? true,
    contactMethods: mapContactMethods(address.contactMethods, guids.contactMethodGuids),
  }) as AddressInput;

const mapPerson = (person: InvestigationPerson, guids: Map<string, string>): PersonInput => {
  const facialHairStyleCodes: InvestigationPersonFacialHairStyleCodeRef[] = person?.facialHairStyleCodes ?? [];

  return {
    firstName: person?.firstName,
    middleNames: person?.middleNames,
    lastName: person?.lastName,
    dateOfBirth: person?.dateOfBirth,
    approximateAgeCode: person?.approximateAgeCode,
    driversLicenseNumber: person?.driversLicenseNumber,
    driversLicenseClass: person?.driversLicenseClass,
    driversLicenseCountryCode: person?.driversLicenseCountryCode,
    driversLicenseCountrySubdivisionCode: person?.driversLicenseCountrySubdivisionCode,
    genderCode: person?.genderCode,
    sexCode: person?.sexCode,
    heightInCm: person?.heightInCm,
    weightInKg: person?.weightInKg,
    complexionCode: person?.complexionCode,
    buildCode: person?.buildCode,
    hairColourCode: person?.hairColourCode,
    hairLengthCode: person?.hairLengthCode,
    hairColourOther: person?.hairColourOther,
    eyeColourCode: person?.eyeColourCode,
    eyeColourOther: person?.eyeColourOther,
    facialHairIndicator: person?.facialHairIndicator,
    facialHairStyleCodes: facialHairStyleCodes
      .filter((fhs) => fhs?.activeIndicator !== false)
      .map(
        (fhs) =>
          ({
            personFacialStyleHairCodeGuid: takeSharedGuid(guids, fhs.personFacialStyleHairCodeGuid),
            facialHairStyleCode: fhs.facialHairStyleCode,
          }) as PersonFacialHairStyleCodeInput,
      ),
    additionalHairDescriptors: person?.additionalHairDescriptors,
    tattooIndicator: person?.tattooIndicator,
    tattooDescription: person?.tattooDescription,
    additionalDescriptors: person?.additionalDescriptors,
    comments: person?.comments,
    safetyConcernIndicator: person?.safetyConcernIndicator,
    safetyConcernReason: person?.safetyConcernReason,
  } as PersonInput;
};

const mapBusinessContact = (
  contact: InvestigationBusinessPersonXref,
  guids: SharedChildGuids,
): BusinessPersonXrefInput =>
  ({
    businessPersonXrefGuid: takeSharedGuid(guids.businessPersonXrefGuids, contact.businessPersonXrefGuid),
    title: contact.title,
    displayInInvestigation: contact.displayInInvestigation ?? true,
    isPrimary: contact.isPrimary ?? false,
    person: {
      firstName: contact.person?.firstName,
      middleNames: contact.person?.middleNames,
      lastName: contact.person?.lastName,
    } as PersonInput,
    contactMethods: mapContactMethods(contact.contactMethods, guids.contactMethodGuids),
    officeAddressGuids: (contact.associatedAddresses ?? [])
      .map((aa) => guids.addressGuids.get(aa?.address?.addressGuid ?? ""))
      .filter((guid): guid is string => !!guid),
  }) as BusinessPersonXrefInput;

const mapBusiness = (business: InvestigationBusiness | undefined, guids: SharedChildGuids): BusinessInput =>
  ({
    name: business?.name,
    safetyConcernIndicator: business?.safetyConcernIndicator,
    safetyConcernReason: business?.safetyConcernReason,
    businessIdentifiers: (business?.businessIdentifiers ?? [])
      .filter((bi) => isActive(bi) && hasValue(bi.identifierValue))
      .map(
        (bi) =>
          ({
            businessIdentifierGuid: takeSharedGuid(guids.businessIdentifierGuids, bi.businessIdentifierGuid),
            identifierCode: bi.identifierCode,
            identifierValue: bi.identifierValue,
          }) as BusinessIdentifier,
      ),
    contactPeople: (business?.contactPeople ?? []).map((contact) => mapBusinessContact(contact, guids)),
  }) as BusinessInput;

/**
 * Maps an investigation ("local") party onto the PartyCreateInput the shared party registry expects,
 * This is the inverse of the frontend's mapPartyToInvestigationPartyInput copy and follows the same rules: child
 * rows are created fresh, and addresses get client-generated GUIDs so business contact office links
 * can resolve to the copies.
 */
export const mapInvestigationPartyToPartyCreateInput = (party: InvestigationParty): MappedSharedParty => {
  const childGuids = emptyChildGuids();

  const addresses = (party.addresses ?? []).map((address) =>
    mapAddress(address, takeSharedGuid(childGuids.addressGuids, address.addressGuid), childGuids),
  );

  const common: PartyCreateInput = {
    partyTypeCode: party.partyTypeCode,
    addresses,
    contactMethods: mapContactMethods(party.contactMethods, childGuids.contactMethodGuids),
    aliases: (party.aliases ?? [])
      .filter((alias) => isActive(alias) && hasValue(alias.name))
      .map(
        (alias) => ({ aliasGuid: takeSharedGuid(childGuids.aliasGuids, alias.aliasGuid), name: alias.name }) as Alias,
      ),
  };

  const input =
    party.partyTypeCode === PARTY_TYPES.Company
      ? { ...common, business: mapBusiness(party.business, childGuids) }
      : { ...common, person: mapPerson(party.person, childGuids.facialHairStyleGuids) };

  return { input, childGuids };
};
