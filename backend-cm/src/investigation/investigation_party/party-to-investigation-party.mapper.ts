import { randomUUID } from "node:crypto";
import { PARTY_TYPES } from "../../common/party";
import { Address } from "../../shared/address/dto/address";
import { Alias } from "../../shared/alias/dto/alias";
import { Business } from "../../shared/business/dto/business";
import { BusinessPersonAddressXref } from "../../shared/business_person_address_xref/dto/business_person_address_xref";
import { BusinessPersonXref } from "../../shared/business_person_xref/dto/business_person_xref";
import { ContactMethod } from "../../shared/contact_method/dto/contact_method";
import { Party } from "../../shared/party/dto/party";
import { Person } from "../../shared/person/dto/person";
import { PersonFacialHairStyleCode } from "../../shared/person_facial_hair_style_code/dto/person_facial_hair_style_code";
import {
  CreateInvestigationAddressInput,
  InvestigationAddress,
} from "../investigation_address/dto/investigation_address";
import { UpdateInvestigationAliasInput } from "../investigation_alias/dto/investigation_alias";
import { CreateInvestigationAttachmentReferenceInput } from "../investigation_attachment_reference/dto/investigation_attachment_reference";
import {
  CreateInvestigationBusinessInput,
  InvestigationBusiness,
} from "../investigation_business/dto/investigation_business";
import {
  CreateInvestigationBusinessContactInput,
  InvestigationBusinessPersonXref,
} from "../investigation_business_person_xref/dto/investigation_business_person_xref";
import {
  InvestigationContactMethod,
  UpdateInvestigationContactMethodInput,
} from "../investigation_contact_method/dto/investigation_contact_method";
import { InvestigationPerson, UpdateInvestigationPersonInput } from "../investigation_person/dto/investigation_person";
import {
  InvestigationPersonFacialHairStyleCodeRef,
  InvestigationPersonFacialHairStyleCodeRefInput,
} from "../investigation_person_facial_hair_style_code_ref/dto/InvestigationPersonFacialHairStyleCodeRef";
import {
  CreateInvestigationPartyInput,
  InvestigationParty,
  UpdateInvestigationPartyInput,
} from "./dto/investigation_party";

const mapContactMethods = (
  contactMethods: ContactMethod[],
  existingContactMethods: InvestigationContactMethod[],
): UpdateInvestigationContactMethodInput[] =>
  contactMethods.map((cm) => ({
    contactMethodGuid: existingContactMethods.find((e) => e.contactMethodReference === cm.contactMethodGuid)
      ?.contactMethodGuid,
    contactMethodReference: cm.contactMethodGuid,
    typeCode: cm.typeCode,
    value: cm.value,
    isPrimary: cm.isPrimary,
  }));

const mapAddress = (
  address: Address,
  addressGuid: string,
  existingAddress?: InvestigationAddress,
): CreateInvestigationAddressInput => ({
  addressGuid,
  addressReference: address.addressGuid,
  addressName: address.addressName ?? null,
  address: address.address ?? null,
  city: address.city ?? null,
  province: address.province ?? null,
  postalCode: address.postalCode ?? null,
  country: address.country ?? null,
  isPrimary: address.isPrimary,
  displayInInvestigation: address.displayInInvestigation,
  contactMethods: mapContactMethods(address.contactMethods ?? [], existingAddress?.contactMethods ?? []),
});

const mapPerson = (person: Person, existingPerson?: InvestigationPerson): UpdateInvestigationPersonInput => {
  const facialHairStyleCodes: PersonFacialHairStyleCode[] = person?.facialHairStyleCodes ?? [];
  const existingFacialHairStyleCodes: InvestigationPersonFacialHairStyleCodeRef[] =
    existingPerson?.facialHairStyleCodes ?? [];

  return {
    firstName: person?.firstName ?? null,
    middleNames: person?.middleNames ?? null,
    lastName: person?.lastName ?? null,
    dateOfBirth: person?.dateOfBirth ?? null,
    approximateAgeCode: person?.approximateAgeCode ?? null,
    driversLicenseNumber: person?.driversLicenseNumber ?? null,
    driversLicenseClass: person?.driversLicenseClass ?? null,
    driversLicenseCountryCode: person?.driversLicenseCountryCode ?? null,
    driversLicenseCountrySubdivisionCode: person?.driversLicenseCountrySubdivisionCode ?? null,
    genderCode: person?.genderCode ?? null,
    sexCode: person?.sexCode ?? null,
    heightInCm: person?.heightInCm ?? null,
    weightInKg: person?.weightInKg ?? null,
    complexionCode: person?.complexionCode ?? null,
    buildCode: person?.buildCode ?? null,
    hairColourCode: person?.hairColourCode ?? null,
    hairLengthCode: person?.hairLengthCode ?? null,
    hairColourOther: person?.hairColourOther ?? null,
    eyeColourCode: person?.eyeColourCode ?? null,
    eyeColourOther: person?.eyeColourOther ?? null,
    facialHairIndicator: person?.facialHairIndicator ?? null,
    facialHairStyleCodes: facialHairStyleCodes.map(
      (fhs) =>
        ({
          personFacialStyleHairCodeGuid: existingFacialHairStyleCodes.find(
            (f) => f.personFacialHairStyleCodeReference === fhs.personFacialStyleHairCodeGuid,
          )?.personFacialStyleHairCodeGuid,
          personFacialHairStyleCodeReference: fhs.personFacialStyleHairCodeGuid,
          facialHairStyleCode: fhs.facialHairStyleCode,
        }) as InvestigationPersonFacialHairStyleCodeRefInput,
    ),
    additionalHairDescriptors: person?.additionalHairDescriptors ?? null,
    tattooIndicator: person?.tattooIndicator ?? null,
    tattooDescription: person?.tattooDescription ?? null,
    additionalDescriptors: person?.additionalDescriptors ?? null,
    comments: person?.comments ?? null,
    safetyConcernIndicator: person?.safetyConcernIndicator ?? null,
    safetyConcernReason: person?.safetyConcernReason ?? null,
  };
};

const mapBusinessContact = (
  contact: BusinessPersonXref,
  existingContacts: InvestigationBusinessPersonXref[],
  localAddressGuids: Map<string, string>,
): CreateInvestigationBusinessContactInput & { businessPersonXrefGuid?: string } => {
  const existingContact = existingContacts.find(
    (c) => c.businessPersonXrefReference === contact.businessPersonXrefGuid,
  );
  const associatedAddresses: BusinessPersonAddressXref[] = contact.associatedAddresses ?? [];

  return {
    businessPersonXrefGuid: existingContact?.businessPersonXrefGuid,
    businessPersonXrefReference: contact.businessPersonXrefGuid,
    title: contact.title ?? null,
    displayInInvestigation: contact.displayInInvestigation,
    isPrimary: contact.isPrimary,
    person: {
      personReference: contact.person?.personGuid,
      firstName: contact.person?.firstName ?? null,
      middleNames: contact.person?.middleNames ?? null,
      lastName: contact.person?.lastName ?? null,
    },
    contactMethods: mapContactMethods(contact.contactMethods ?? [], existingContact?.contactMethods ?? []),
    // office links are loaded without an active filter so the deactivated ones are dropped
    officeAddressGuids: associatedAddresses
      .filter((aa) => aa.activeInd !== false)
      .map((aa) => localAddressGuids.get(aa?.address?.addressGuid ?? ""))
      .filter((guid): guid is string => !!guid),
  };
};

const mapBusiness = (
  business: Business,
  existingBusiness: InvestigationBusiness | undefined,
  localAddressGuids: Map<string, string>,
): CreateInvestigationBusinessInput => ({
  name: business?.name,
  safetyConcernIndicator: business?.safetyConcernIndicator ?? null,
  safetyConcernReason: business?.safetyConcernReason ?? null,
  businessIdentifiers: (business?.businessIdentifiers ?? []).map((bi) => ({
    businessIdentifierGuid: (existingBusiness?.businessIdentifiers ?? []).find(
      (e) => e.businessIdentifierReference === bi.businessIdentifierGuid,
    )?.businessIdentifierGuid,
    businessIdentifierReference: bi.businessIdentifierGuid,
    identifierCode: bi.identifierCode,
    identifierValue: bi.identifierValue,
  })),
  contactPeople: (business?.contactPeople ?? []).map((contact) =>
    mapBusinessContact(contact, existingBusiness?.contactPeople ?? [], localAddressGuids),
  ),
});

/**
 * Maps the child relationships a shared party and its investigation ("local") copy share. The create
 * path leaves existingParty out because it has no local copy to match against.
 */
const mapPartyChildren = (sharedParty: Party, existingParty?: InvestigationParty) => {
  const sharedAddresses: Address[] = sharedParty.addresses ?? [];
  const sharedContactMethods: ContactMethod[] = sharedParty.contactMethods ?? [];
  const sharedAliases: Alias[] = sharedParty.aliases ?? [];
  const existingAddresses: InvestigationAddress[] = existingParty?.addresses ?? [];

  const localAddressGuids = new Map<string, string>();
  const addresses = sharedAddresses.map((address) => {
    const existingAddress = existingAddresses.find((a) => a.addressReference === address.addressGuid);
    // addresses without a local copy get their guid minted here so business contact office links
    // can point at the copy the create is about to write
    const addressGuid = existingAddress?.addressGuid ?? randomUUID();
    localAddressGuids.set(address.addressGuid, addressGuid);
    return mapAddress(address, addressGuid, existingAddress);
  });

  const aliases: UpdateInvestigationAliasInput[] = sharedAliases.map((alias) => ({
    aliasGuid: (existingParty?.aliases ?? []).find((a) => a.aliasReference === alias.aliasGuid)?.aliasGuid,
    aliasReference: alias.aliasGuid,
    name: alias.name,
  }));

  return {
    localAddressGuids,
    addresses,
    contactMethods: mapContactMethods(sharedContactMethods, existingParty?.contactMethods ?? []),
    aliases,
  };
};

/**
 * Maps a shared party onto the UpdateInvestigationPartyInput that replaces the investigation
 * ("local") copy of it in place. This is the inverse of mapInvestigationPartyToPartyUpdateInput.
 */
export const mapPartyToInvestigationPartyUpdateInput = (
  sharedParty: Party,
  existingParty: InvestigationParty,
): UpdateInvestigationPartyInput => {
  const { localAddressGuids, ...children } = mapPartyChildren(sharedParty, existingParty);

  const common: UpdateInvestigationPartyInput = {
    partyIdentifier: existingParty.partyIdentifier,
    // the role a party plays is investigation-local, so the shared party never overwrites it
    partyAssociationRole: existingParty.partyAssociationRole,
    ...children,
  };

  return existingParty.partyTypeCode === PARTY_TYPES.Company
    ? { ...common, business: mapBusiness(sharedParty.business, existingParty.business, localAddressGuids) }
    : { ...common, person: mapPerson(sharedParty.person, existingParty.person) };
};

/**
 * Maps a shared party onto the CreateInvestigationPartyInput that adds the investigation ("local")
 * copy of it.
 */
export const mapPartyToInvestigationPartyCreateInput = (
  sharedParty: Party,
  partyAssociationRole: string,
  attachmentReferences?: CreateInvestigationAttachmentReferenceInput[],
): CreateInvestigationPartyInput => {
  const isBusiness = sharedParty.partyTypeCode === PARTY_TYPES.Company;
  const { localAddressGuids, ...children } = mapPartyChildren(sharedParty);

  const common: CreateInvestigationPartyInput = {
    partyTypeCode: isBusiness ? PARTY_TYPES.Company : PARTY_TYPES.Person,
    partyReference: sharedParty.partyIdentifier,
    // the role a party plays is not local to the investigation not global
    partyAssociationRole,
    attachmentReferences,
    ...children,
  };

  return isBusiness
    ? {
        ...common,
        business: {
          ...mapBusiness(sharedParty.business, undefined, localAddressGuids),
          businessReference: sharedParty.business?.businessGuid,
        },
      }
    : {
        ...common,
        person: { ...mapPerson(sharedParty.person, undefined), personReference: sharedParty.person?.personGuid },
      };
};
