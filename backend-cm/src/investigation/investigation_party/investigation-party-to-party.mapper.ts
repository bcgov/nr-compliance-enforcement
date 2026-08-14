import { randomUUID } from "node:crypto";
import { PARTY_TYPES } from "../../common/party";
import { AddressInput } from "../../shared/address/dto/address";
import { Alias } from "../../shared/alias/dto/alias";
import { Business } from "../../shared/business/dto/business";
import { BusinessIdentifier } from "../../shared/business_identifier/dto/business_identifier";
import { BusinessPersonXref } from "../../shared/business_person_xref/dto/business_person_xref";
import { ContactMethod } from "../../shared/contact_method/dto/contact_method";
import { PartyCreateInput } from "../../shared/party/dto/party";
import { Person } from "../../shared/person/dto/person";
import { PersonFacialHairStyleCode } from "../../shared/person_facial_hair_style_code/dto/person_facial_hair_style_code";
import { InvestigationAddress } from "../investigation_address/dto/investigation_address";
import { InvestigationBusiness } from "../investigation_business/dto/investigation_business";
import { InvestigationBusinessPersonXref } from "../investigation_business_person_xref/dto/investigation_business_person_xref";
import { InvestigationContactMethod } from "../investigation_contact_method/dto/investigation_contact_method";
import { InvestigationPerson } from "../investigation_person/dto/investigation_person";
import { InvestigationPersonFacialHairStyleCodeRef } from "../investigation_person_facial_hair_style_code_ref/dto/InvestigationPersonFacialHairStyleCodeRef";
import { InvestigationParty } from "./dto/investigation_party";

const isActive = (record?: { isActive?: boolean } | null): boolean => !!record && record.isActive !== false;

const hasValue = (value?: string | null): boolean => (value ?? "").trim().length > 0;

const mapContactMethods = (contactMethods?: InvestigationContactMethod[]): ContactMethod[] =>
  (contactMethods ?? [])
    .filter((cm) => isActive(cm) && hasValue(cm.value))
    .map((cm) => ({ typeCode: cm.typeCode, value: cm.value, isPrimary: cm.isPrimary ?? false }) as ContactMethod);

const mapAddress = (address: InvestigationAddress, addressGuid: string): AddressInput =>
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
    contactMethods: mapContactMethods(address.contactMethods),
  }) as unknown as AddressInput;

const mapPerson = (person?: InvestigationPerson): Person => {
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
      .map((fhs) => ({ facialHairStyleCode: fhs.facialHairStyleCode }) as PersonFacialHairStyleCode),
    additionalHairDescriptors: person?.additionalHairDescriptors,
    tattooIndicator: person?.tattooIndicator,
    tattooDescription: person?.tattooDescription,
    additionalDescriptors: person?.additionalDescriptors,
    comments: person?.comments,
    safetyConcernIndicator: person?.safetyConcernIndicator,
    safetyConcernReason: person?.safetyConcernReason,
  } as Person;
};

const mapBusinessContact = (
  contact: InvestigationBusinessPersonXref,
  sharedAddressGuidByInvestigationGuid: Map<string, string>,
): BusinessPersonXref =>
  ({
    title: contact.title,
    displayInInvestigation: contact.displayInInvestigation ?? true,
    isPrimary: contact.isPrimary ?? false,
    person: {
      firstName: contact.person?.firstName,
      middleNames: contact.person?.middleNames,
      lastName: contact.person?.lastName,
    } as Person,
    contactMethods: mapContactMethods(contact.contactMethods),
    officeAddressGuids: (contact.associatedAddresses ?? [])
      .map((aa) => sharedAddressGuidByInvestigationGuid.get(aa?.address?.addressGuid ?? ""))
      .filter((guid): guid is string => !!guid),
  }) as BusinessPersonXref;

const mapBusiness = (
  business: InvestigationBusiness | undefined,
  sharedAddressGuidByInvestigationGuid: Map<string, string>,
): Business =>
  ({
    name: business?.name,
    safetyConcernIndicator: business?.safetyConcernIndicator,
    safetyConcernReason: business?.safetyConcernReason,
    businessIdentifiers: (business?.businessIdentifiers ?? [])
      .filter((bi) => isActive(bi) && hasValue(bi.identifierValue))
      .map((bi) => ({ identifierCode: bi.identifierCode, identifierValue: bi.identifierValue }) as BusinessIdentifier),
    contactPeople: (business?.contactPeople ?? []).map((contact) =>
      mapBusinessContact(contact, sharedAddressGuidByInvestigationGuid),
    ),
  }) as Business;

/**
 * Maps an investigation ("local") party onto the PartyCreateInput the shared party registry expects,
 * This is the inverse of the frontend's mapPartyToInvestigationPartyInput copy and follows the same rules: child
 * rows are created fresh, and addresses get client-generated GUIDs so business contact office links
 * can resolve to the copies.
 */
export const mapInvestigationPartyToPartyCreateInput = (party: InvestigationParty): PartyCreateInput => {
  const sharedAddressGuidByInvestigationGuid = new Map<string, string>();

  const addresses = (party.addresses ?? []).map((address) => {
    const sharedAddressGuid = randomUUID();
    if (address.addressGuid) {
      sharedAddressGuidByInvestigationGuid.set(address.addressGuid, sharedAddressGuid);
    }
    return mapAddress(address, sharedAddressGuid);
  });

  const common: PartyCreateInput = {
    partyTypeCode: party.partyTypeCode,
    addresses,
    contactMethods: mapContactMethods(party.contactMethods),
    aliases: (party.aliases ?? [])
      .filter((alias) => isActive(alias) && hasValue(alias.name))
      .map((alias) => ({ name: alias.name }) as Alias),
  };

  if (party.partyTypeCode === PARTY_TYPES.Company) {
    return { ...common, business: mapBusiness(party.business, sharedAddressGuidByInvestigationGuid) };
  }

  return { ...common, person: mapPerson(party.person) };
};
