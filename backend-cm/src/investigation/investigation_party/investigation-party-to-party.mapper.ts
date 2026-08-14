import { randomUUID } from "node:crypto";
import { PARTY_TYPES } from "../../common/party";
import { AddressInput } from "../../shared/address/dto/address";
import { Alias, AliasInput } from "../../shared/alias/dto/alias";
import { BusinessInput } from "../../shared/business/dto/business";
import { BusinessIdentifier } from "../../shared/business_identifier/dto/business_identifier";
import { BusinessPersonXrefInput } from "../../shared/business_person_xref/dto/business_person_xref";
import { ContactMethod, ContactMethodInput } from "../../shared/contact_method/dto/contact_method";
import { PartyCreateInput, PartyUpdateInput } from "../../shared/party/dto/party";
import { PersonFacialHairStyleCodeInput } from "../../shared/person_facial_hair_style_code/dto/person_facial_hair_style_code";
import { InvestigationAddress } from "../investigation_address/dto/investigation_address";
import { InvestigationBusiness } from "../investigation_business/dto/investigation_business";
import { InvestigationBusinessPersonXref } from "../investigation_business_person_xref/dto/investigation_business_person_xref";
import { InvestigationContactMethod } from "../investigation_contact_method/dto/investigation_contact_method";
import { InvestigationPerson } from "../investigation_person/dto/investigation_person";
import { InvestigationPersonFacialHairStyleCodeRef } from "../investigation_person_facial_hair_style_code_ref/dto/InvestigationPersonFacialHairStyleCodeRef";
import { InvestigationParty, UpdateInvestigationPartyInput } from "./dto/investigation_party";
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

// Update Mapping
export const mapInvestigationPartyToPartyUpdateInput = (
  existingParty: InvestigationParty,
  input: UpdateInvestigationPartyInput,
): PartyUpdateInput => {
  const findAddressReference = (addressGuid?: string) =>
    (input.addresses ?? []).find((a) => a.addressGuid === addressGuid)?.addressReference;

  const addresses: AddressInput[] = (input.addresses ?? []).map((a) => ({
    addressGuid: a.addressReference ?? "",
    addressName: a.addressName,
    address: a.address,
    city: a.city,
    province: a.province,
    postalCode: a.postalCode,
    country: a.country,
    isPrimary: a.isPrimary,
    displayInInvestigation: a.displayInInvestigation,
    contactMethods: (a.contactMethods ?? []).map((cm) => ({
      contactMethodGuid: cm.contactMethodReference,
      typeCode: cm.typeCode,
      value: cm.value,
      isPrimary: cm.isPrimary,
    })),
  }));

  const contactMethods: ContactMethodInput[] = (input.contactMethods ?? []).map((cm) => ({
    contactMethodGuid: cm.contactMethodReference,
    typeCode: cm.typeCode,
    value: cm.value ?? "",
    isPrimary: cm.isPrimary ?? false,
  }));

  const aliases: AliasInput[] = (input.aliases ?? []).map((a) => ({
    aliasGuid: a.aliasReference ?? "",
    name: a.name,
  }));

  const person: PersonInput | undefined = input.person
    ? {
        firstName: input.person.firstName,
        middleNames: input.person.middleNames,
        lastName: input.person.lastName,
        dateOfBirth: input.person.dateOfBirth,
        approximateAgeCode: input.person.approximateAgeCode,
        driversLicenseNumber: input.person.driversLicenseNumber,
        driversLicenseClass: input.person.driversLicenseClass,
        driversLicenseCountryCode: input.person.driversLicenseCountryCode,
        driversLicenseCountrySubdivisionCode: input.person.driversLicenseCountrySubdivisionCode,
        genderCode: input.person.genderCode,
        sexCode: input.person.sexCode,
        heightInCm: input.person.heightInCm,
        weightInKg: input.person.weightInKg,
        complexionCode: input.person.complexionCode,
        buildCode: input.person.buildCode,
        hairColourCode: input.person.hairColourCode,
        hairLengthCode: input.person.hairLengthCode,
        hairColourOther: input.person.hairColourOther,
        eyeColourCode: input.person.eyeColourCode,
        eyeColourOther: input.person.eyeColourOther,
        facialHairIndicator: input.person.facialHairIndicator,
        facialHairStyleCodes: (input.person.facialHairStyleCodes ?? []).map((fhs) => ({
          personFacialStyleHairCodeGuid: fhs.personFacialHairStyleCodeReference,
          facialHairStyleCode: fhs.facialHairStyleCode,
          activeIndicator: fhs.activeIndicator,
        })),
        additionalHairDescriptors: input.person.additionalHairDescriptors,
        tattooIndicator: input.person.tattooIndicator,
        tattooDescription: input.person.tattooDescription,
        additionalDescriptors: input.person.additionalDescriptors,
        comments: input.person.comments,
        safetyConcernIndicator: input.person.safetyConcernIndicator,
        safetyConcernReason: input.person.safetyConcernReason,
      }
    : undefined;

  const business: BusinessInput | undefined = input.business
    ? {
        businessGuid: existingParty.business?.businessGuid ?? "",
        partyGuid: existingParty.partyReference!,
        name: input.business.name,
        safetyConcernIndicator: input.business.safetyConcernIndicator,
        safetyConcernReason: input.business.safetyConcernReason,
        businessIdentifiers: (input.business.businessIdentifiers ?? []).map((bi) => ({
          businessIdentifierGuid: bi.businessIdentifierReference ?? "",
          businessGuid: existingParty.business?.businessGuid ?? "",
          identifierCode: bi.identifierCode,
          identifierValue: bi.identifierValue,
        })),
        contactPeople: (input.business.contactPeople ?? []).map((c) => ({
          businessPersonXrefGuid: c.businessPersonXrefReference,
          title: c.title,
          displayInInvestigation: c.displayInInvestigation,
          isPrimary: c.isPrimary,
          person: {
            firstName: c.person?.firstName ?? "",
            middleNames: c.person?.middleNames,
            lastName: c.person?.lastName ?? "",
          },
          contactMethods: (c.contactMethods ?? []).map((cm) => ({
            contactMethodGuid: cm.contactMethodReference,
            typeCode: cm.typeCode,
            value: cm.value ?? "",
            isPrimary: cm.isPrimary,
          })),
          officeAddressGuids: (c.officeAddressGuids ?? [])
            .map((guid) => findAddressReference(guid))
            .filter((guid): guid is string => !!guid),
        })),
      }
    : undefined;

  return {
    partyIdentifier: existingParty.partyReference,
    partyTypeCode: existingParty.partyTypeCode,
    person,
    business,
    addresses,
    contactMethods,
    aliases,
    images: input.images ?? [],
  };
};

// Ensures every incoming sub-record carries the guid of its shared-party counterpart.
// Records already linked keep their existing reference; unlinked records get a freshly
// generated guid, which is written to both the local *_guid_ref column and the shared
// row's primary key so the two stay linked for future updates.
export const resolveSharedReferences = (
  existingParty: InvestigationParty,
  input: UpdateInvestigationPartyInput,
): void => {
  for (const address of input.addresses ?? []) {
    const existing = (existingParty.addresses ?? []).find((a) => a.addressGuid === address.addressGuid);
    address.addressReference = existing?.addressReference ?? address.addressReference ?? randomUUID();
  }

  for (const alias of input.aliases ?? []) {
    const existing = (existingParty.aliases ?? []).find((a) => a.aliasGuid === alias.aliasGuid);
    alias.aliasReference = existing?.aliasReference ?? alias.aliasReference ?? randomUUID();
  }

  for (const contactMethod of input.contactMethods ?? []) {
    const existing = (existingParty.contactMethods ?? []).find(
      (c) => c.contactMethodGuid === contactMethod.contactMethodGuid,
    );
    contactMethod.contactMethodReference =
      existing?.contactMethodReference ?? contactMethod.contactMethodReference ?? randomUUID();
  }

  for (const address of input.addresses ?? []) {
    const existingAddress = (existingParty.addresses ?? []).find((a) => a.addressGuid === address.addressGuid);
    const existingAddressContactMethods: InvestigationContactMethod[] = existingAddress?.contactMethods ?? [];
    for (const contactMethod of address.contactMethods ?? []) {
      const existing = existingAddressContactMethods.find(
        (c) => c.contactMethodGuid === contactMethod.contactMethodGuid,
      );
      contactMethod.contactMethodReference =
        existing?.contactMethodReference ?? contactMethod.contactMethodReference ?? randomUUID();
    }
  }

  const existingFacialHairStyleCodes: InvestigationPersonFacialHairStyleCodeRef[] =
    existingParty.person?.facialHairStyleCodes ?? [];
  for (const fhs of input.person?.facialHairStyleCodes ?? []) {
    const existing = existingFacialHairStyleCodes.find(
      (f) => f.personFacialStyleHairCodeGuid === fhs.personFacialStyleHairCodeGuid,
    );
    fhs.personFacialHairStyleCodeReference =
      existing?.personFacialHairStyleCodeReference ?? fhs.personFacialHairStyleCodeReference ?? randomUUID();
  }

  for (const identifier of input.business?.businessIdentifiers ?? []) {
    const existing = (existingParty.business?.businessIdentifiers ?? []).find(
      (i) => i.businessIdentifierGuid === identifier.businessIdentifierGuid,
    );
    identifier.businessIdentifierReference =
      existing?.businessIdentifierReference ?? identifier.businessIdentifierReference ?? randomUUID();
  }

  for (const contact of input.business?.contactPeople ?? []) {
    const existingContact = (existingParty.business?.contactPeople ?? []).find(
      (c) => c.businessPersonXrefGuid === contact.businessPersonXrefGuid,
    );
    contact.businessPersonXrefReference =
      existingContact?.businessPersonXrefReference ?? contact.businessPersonXrefReference ?? randomUUID();

    const existingContactMethods: InvestigationContactMethod[] = existingContact?.contactMethods ?? [];
    for (const contactMethod of contact.contactMethods ?? []) {
      const existing = existingContactMethods.find((c) => c.contactMethodGuid === contactMethod.contactMethodGuid);
      contactMethod.contactMethodReference =
        existing?.contactMethodReference ?? contactMethod.contactMethodReference ?? randomUUID();
    }
  }
};
