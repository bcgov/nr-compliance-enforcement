import { FC, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import { gql } from "graphql-request";
import { PartyEditHeader } from "./party-edit-header";
import { CompSelect } from "@components/common/comp-select";
import { FormField } from "@components/common/form-field";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { useGraphQLQuery } from "@graphql/hooks/useGraphQLQuery";
import { useGraphQLMutation } from "@graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import {
  Alias,
  BusinessIdentifier,
  BusinessPerson,
  ContactMethod,
  PartyCreateInput,
  PartyUpdateInput,
  PersonFacialHairStyleCode,
  PersonInput,
  PersonUpdateInput,
} from "@/generated/graphql";
import { selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";
import { GET_PARTY } from "@/app/components/containers/parties/view/party-view";
import { parse } from "date-fns";
import useUnsavedChangesWarning from "@/app/hooks/use-unsaved-changes-warning";
import { ContactMethods } from "@/app/constants/contact-methods";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";
import { PartyTypeCodes } from "@/app/constants/party-types";
import { PersonForm } from "@/app/components/containers/parties/form/person-form";
import { BusinessFormFields } from "@/app/components/containers/parties/form/business-form";
import { AddressFormValue } from "@/app/components/containers/parties/form/party-form-utils";
import { handleBusinessPartyMutationError } from "@/app/components/containers/parties/form/party-form-errors";
import { toDateOfBirth } from "@/app/common/methods";

const PARTY_PERSON_FRAGMENT = gql`
  fragment PartyPersonFields on Person {
    personGuid
    firstName
    middleNames
    lastName
    dateOfBirth
    approximateAgeCode
    driversLicenseNumber
    driversLicenseClass
    driversLicenseCountryCode
    driversLicenseCountrySubdivisionCode
  }
`;

const UPDATE_PARTY_MUTATION = gql`
  ${PARTY_PERSON_FRAGMENT}
  mutation UpdateParty($partyIdentifier: String!, $input: PartyUpdateInput!) {
    updateParty(partyIdentifier: $partyIdentifier, input: $input) {
      partyIdentifier
      partyTypeCode
      shortDescription
      longDescription
      createdDateTime
      person {
        ...PartyPersonFields
      }
      business {
        businessGuid
        name
      }
    }
  }
`;

const CREATE_PARTY_MUTATION = gql`
  ${PARTY_PERSON_FRAGMENT}
  mutation CreateParty($input: PartyCreateInput!) {
    createParty(input: $input) {
      partyIdentifier
      partyTypeCode
      shortDescription
      longDescription
      createdDateTime
      person {
        ...PartyPersonFields
      }
      business {
        businessGuid
        name
      }
    }
  }
`;

// Helper Functions for working with the data

// Helper function to map contact methods from party data
const mapContactMethodsFromPartyData = (contactMethods: ContactMethod[] | undefined, typeCode: string) => {
  return (
    contactMethods
      ?.filter((c: ContactMethod) => c.typeCode === typeCode)
      .map((c: ContactMethod, index: number) => ({
        contactMethodGuid: c.contactMethodGuid,
        value: c.value,
        isPrimary: c.isPrimary ?? index === 0,
      })) || []
  );
};

// Helper function to determine if contact method is primary
const determineContactMethodPrimary = (
  contactMethod: ContactMethod,
  allContactMethods: (ContactMethod | null | undefined)[],
  typeCode: string,
): boolean => {
  if (contactMethod.isPrimary !== null && contactMethod.isPrimary !== undefined) {
    return contactMethod.isPrimary;
  }

  const methodsOfType = allContactMethods.filter((c): c is ContactMethod => c?.typeCode === typeCode);
  const index = methodsOfType.indexOf(contactMethod);
  return index === 0;
};

// Helper function to map contacts from party data
const mapContactsFromPartyData = (contactPeople: BusinessPerson[] | undefined) => {
  return (
    contactPeople?.map((p: BusinessPerson) => ({
      businessPersonXrefGuid: p.businessPersonXrefGuid,
      business: {
        businessGuid: p.business?.businessGuid,
      },
      person: {
        personGuid: p.person?.personGuid,
        firstName: p.person?.firstName,
        lastName: p.person?.lastName,
      },
      contactMethods:
        p.contactMethods
          ?.filter((cm): cm is ContactMethod => cm != null)
          .map((cm: ContactMethod) => ({
            contactMethodGuid: cm.contactMethodGuid,
            typeCode: cm.typeCode,
            value: cm.value,
            isPrimary: determineContactMethodPrimary(cm, p.contactMethods || [], cm.typeCode || ""),
          })) || [],
    })) || []
  );
};

// Helper to build contact people for updates
const buildContactPeopleForUpdate = (contacts: BusinessPerson[]) => {
  return contacts.map((c: BusinessPerson) => ({
    businessPersonXrefGuid: c.businessPersonXrefGuid,
    business: {
      businessGuid: c.business?.businessGuid,
    },
    person: {
      personGuid: c.person?.personGuid ?? "",
      firstName: c.person?.firstName ?? "",
      lastName: c.person?.lastName ?? "",
    },
    contactMethods: c.contactMethods
      ?.filter((cm): cm is ContactMethod => cm != null)
      .map((cm: ContactMethod) => ({
        contactMethodGuid: cm.contactMethodGuid,
        typeCode: cm.typeCode ?? "",
        value: cm.value ?? "",
        isPrimary: cm.isPrimary ?? false,
      })),
  }));
};

// Helper to build contact people for creates
const buildContactPeopleForCreate = (contacts: BusinessPerson[]) => {
  return contacts.map((c: BusinessPerson) => ({
    contactMethods: c.contactMethods?.length
      ? c.contactMethods
          .filter((cm): cm is ContactMethod => cm != null)
          .map((cm: ContactMethod) => ({
            typeCode: cm.typeCode ?? "",
            value: cm.value ?? "",
            isPrimary: cm.isPrimary ?? false,
          }))
      : undefined,
    person: {
      firstName: c.person?.firstName ?? "",
      lastName: c.person?.lastName ?? "",
    },
  }));
};

// Helper to build identifiers array
const buildIdentifiers = (businessNumber: any, worksafeBCNumber: any, isUpdate: boolean) => {
  const identifiers = [];

  if (businessNumber?.identifierValue?.trim()) {
    identifiers.push({
      ...(isUpdate && businessNumber.businessIdentifierGuid
        ? { businessIdentifierGuid: businessNumber.businessIdentifierGuid }
        : {}),
      identifierCode: BusinessIdentifiers.BUSINESS_NUMBER,
      identifierValue: businessNumber.identifierValue.trim(),
    });
  }

  if (worksafeBCNumber?.identifierValue?.trim()) {
    identifiers.push({
      ...(isUpdate && worksafeBCNumber.businessIdentifierGuid
        ? { businessIdentifierGuid: worksafeBCNumber.businessIdentifierGuid }
        : {}),
      identifierCode: BusinessIdentifiers.WSBC_NUMBER,
      identifierValue: worksafeBCNumber.identifierValue.trim(),
    });
  }

  return identifiers;
};

// Helper to build contact methods array
const buildContactMethods = (phoneNumbers: ContactMethod[], emailAddresses: ContactMethod[], includeGuid: boolean) => {
  const methods = [];

  if (phoneNumbers) {
    methods.push(
      ...phoneNumbers.map((p: ContactMethod) => ({
        ...(includeGuid && { contactMethodGuid: p.contactMethodGuid }),
        typeCode: ContactMethods.PHONE,
        value: p.value ?? "",
        isPrimary: p.isPrimary ?? false,
      })),
    );
  }

  if (emailAddresses) {
    methods.push(
      ...emailAddresses.map((e: ContactMethod) => ({
        ...(includeGuid && { contactMethodGuid: e.contactMethodGuid }),
        typeCode: ContactMethods.EMAIL,
        value: e.value ?? "",
        isPrimary: e.isPrimary ?? false,
      })),
    );
  }

  return methods;
};

const buildAddresses = (addresses: AddressFormValue[] | undefined, isUpdate: boolean) =>
  (addresses ?? []).map((address) => ({
    ...(isUpdate && address.addressGuid ? { addressGuid: address.addressGuid } : {}),
    addressName: address.addressName?.trim() ?? "",
    address: address.address?.trim() || null,
    city: address.city?.trim() || null,
    province: address.province?.trim() || null,
    postalCode: address.postalCode?.trim() || null,
    country: address.country?.trim() || null,
    isPrimary: address.isPrimary ?? false,
  }));

const mapAddressesFromPartyData = (addresses: any[] | undefined): AddressFormValue[] =>
  addresses?.map((address, index) => ({
    addressGuid: address.addressGuid,
    addressName: address.addressName ?? "",
    address: address.address ?? "",
    city: address.city ?? "",
    province: address.province ?? "",
    postalCode: address.postalCode ?? "",
    country: address.country ?? "",
    isPrimary: address.isPrimary ?? index === 0,
  })) ?? [];

const validateBusinessForm = async (value: any, businessGuid?: string): Promise<string | null> => {
  if (!value.businessName?.trim()) {
    return "Name is required.";
  }

  if (!value.businessNumber?.identifierValue?.trim()) {
    return "Business number is required.";
  }

  const addresses = (value.addresses as AddressFormValue[] | undefined) ?? [];
  const missingNameIndex = addresses.findIndex((address) => !address.addressName?.trim());
  if (missingNameIndex >= 0) {
    return "Address name is required.";
  }

  return null;
};

// Helper to build business object for updates
const buildBusinessUpdate = (value: any) => {
  return {
    name: value.businessName,
    identifiers: buildIdentifiers(value.businessNumber, value.worksafeBCNumber, true),
    contactPeople: value.contacts?.length ? buildContactPeopleForUpdate(value.contacts) : undefined,
  };
};

// Helper to build business object for creates
const buildBusinessCreate = (value: any) => {
  return {
    name: value.businessName,
    identifiers: buildIdentifiers(value.businessNumber, value.worksafeBCNumber, false),
    contactPeople: value.contacts?.length ? buildContactPeopleForCreate(value.contacts) : undefined,
  };
};

const parseDateOnly = (dateStr: string) => parse(dateStr.slice(0, 10), "yyyy-MM-dd", new Date());

// Shared base fields for person create/update.
function buildPersonBase(value: any) {
  return {
    firstName: value.firstName,
    middleNames: value.middleNames?.trim() || null,
    lastName: value.lastName,
    dateOfBirth: toDateOfBirth(value),
    approximateAgeCode: value.approximateAgeCode || null,
    driversLicenseNumber: value.driversLicenseNumber || null,
    driversLicenseClass: value.driversLicenseClass || null,
    driversLicenseCountryCode: value.driversLicenseCountryCode || null,
    driversLicenseCountrySubdivisionCode: value.driversLicenseCountrySubdivisionCode || null,
    genderCode: value.genderCode || null,
    heightInCm: value.heightInCm || null,
    weightInKg: value.weightInKg || null,
    complexionCode: value.complexionCode || null,
    buildCode: value.buildCode || null,
    hairColourCode: value.hairColourCode || null,
    hairLengthCode: value.hairLengthCode || null,
    hairColourOther: value.hairColourOther || null,
    eyeColourCode: value.eyeColourCode || null,
    eyeColourOther: value.eyeColourOther || null,
    facialHairStyleCodes:
      value.facialHairStyleCodes?.map((fhs: PersonFacialHairStyleCode) => ({
        personFacialStyleHairCodeGuid: fhs.personFacialStyleHairCodeGuid,
        personGuid: fhs.personGuid,
        facialHairStyleCode: fhs.facialHairStyleCode,
      })) || [],
  };
}

function buildPersonForCreate(value: any): PersonInput {
  return buildPersonBase(value);
}

function buildPersonForUpdate(value: any): PersonUpdateInput {
  return { personGuid: value.personGuid, ...buildPersonBase(value) };
}

const PartyEdit: FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const dispatch = useAppDispatch();

  const partyTypes = useAppSelector(selectPartyTypeDropdown);

  const { data: partyData, isLoading } = useGraphQLQuery(GET_PARTY, {
    queryKey: ["party", id],
    variables: { partyIdentifier: id },
    enabled: isEditMode,
  });

  const partyTypeCodes = partyTypes
    ?.toSorted((left: any, right: any) => left.displayOrder - right.displayOrder)
    .filter((party) => [PartyTypeCodes.PERSON, PartyTypeCodes.BUSINESS].includes(party.value))
    .map((code: any) => {
      return {
        value: code.value,
        label: code.label,
      };
    });

  const defaultValues = useMemo(() => {
    if (isEditMode && partyData?.party) {
      const person = partyData.party.person;
      return {
        partyType: partyData.party.partyTypeCode || "",
        personGuid: person?.personGuid || "",
        firstName: person?.firstName || "",
        middleNames: person?.middleNames || "",
        lastName: person?.lastName || "",
        dateOfBirth: person?.dateOfBirth ? parseDateOnly(String(person.dateOfBirth)) : null,
        approximateAgeCode: person?.approximateAgeCode || "",
        driversLicenseNumber: person?.driversLicenseNumber || null,
        driversLicenseClass: person?.driversLicenseClass || null,
        driversLicenseCountryCode: person?.driversLicenseCountryCode || null,
        driversLicenseCountrySubdivisionCode: person?.driversLicenseCountrySubdivisionCode || null,
        genderCode: person?.genderCode || "",
        heightInCm: person?.heightInCm || null,
        weightInKg: person?.weightInKg || null,
        complexionCode: person?.complexionCode || "",
        buildCode: person?.buildCode || "",
        hairColourCode: person?.hairColourCode || "",
        hairLengthCode: person?.hairLengthCode || "",
        hairColourOther: person?.hairColourOther || null,
        eyeColourCode: person?.eyeColourCode || "",
        eyeColourOther: person?.eyeColourOther || null,
        facialHairStyleCodes:
          person?.facialHairStyleCodes?.map((fhs: PersonFacialHairStyleCode) => ({
            personFacialStyleHairCodeGuid: fhs.personFacialStyleHairCodeGuid,
            personGuid: fhs.personGuid,
            facialHairStyleCode: fhs.facialHairStyleCode,
          })) ?? [],
        businessName: partyData.party.business?.name || "",
        businessNumber: partyData.party.business?.identifiers?.find(
          (i: BusinessIdentifier) => i.identifierCode?.businessIdentifierCode === BusinessIdentifiers.BUSINESS_NUMBER,
        ),
        worksafeBCNumber: partyData.party.business?.identifiers?.find(
          (i: BusinessIdentifier) => i.identifierCode?.businessIdentifierCode === BusinessIdentifiers.WSBC_NUMBER,
        ),
        aliases: partyData.party.aliases.map((a: Alias) => ({
          aliasGuid: a.aliasGuid,
          name: a.name,
        })),
        phoneNumbers: mapContactMethodsFromPartyData(partyData.party.contactMethods, ContactMethods.PHONE),
        emailAddresses: mapContactMethodsFromPartyData(partyData.party.contactMethods, ContactMethods.EMAIL),
        contacts: mapContactsFromPartyData(partyData.party.business?.contactPeople),
        addresses: mapAddressesFromPartyData(partyData.party.addresses),
      };
    }
    return {
      partyType: null,
      personGuid: "",
      firstName: "",
      middleNames: "",
      lastName: "",
      dateOfBirth: null,
      approximateAgeCode: "",
      driversLicenseNumber: "",
      driversLicenseClass: "",
      driversLicenseCountryCode: "",
      driversLicenseCountrySubdivisionCode: "",
      genderCode: "",
      heightInCm: null,
      weightInKg: null,
      complexionCode: "",
      buildCode: "",
      hairColourCode: "",
      hairLengthCode: "",
      hairColourOther: "",
      eyeColourCode: "",
      eyeColourOther: "",
      facialHairStyleCodes: [],
      businessName: "",
      businessNumber: {},
      worksafeBCNumber: {},
      aliases: [],
      phoneNumbers: [],
      emailAddresses: [],
      contacts: [],
      addresses: [],
    };
  }, [isEditMode, partyData]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (value.partyType === PartyTypeCodes.BUSINESS) {
        const validationError = await validateBusinessForm(
          value,
          isEditMode ? partyData?.party?.business?.businessGuid : undefined,
        );
        if (validationError) {
          ToggleError(validationError);
          return;
        }
      }

      if (isEditMode) {
        const updateInput: PartyUpdateInput = {
          partyTypeCode: value.partyType,
          addresses: buildAddresses(value.addresses, true),
          contactMethods: buildContactMethods(value.phoneNumbers, value.emailAddresses, true),
          aliases: value.aliases?.map((a: Alias) => ({ name: a.name })) || [],
          business: value.partyType === "CMP" ? buildBusinessUpdate(value) : null,
          person: value.partyType === "PRS" ? buildPersonForUpdate(value) : null,
        };
        updatePartyMutation.mutate({ partyIdentifier: id, input: updateInput });
      } else {
        const createInput: PartyCreateInput = {
          partyTypeCode: value.partyType,
          addresses: buildAddresses(value.addresses, true),
          contactMethods: buildContactMethods(value.phoneNumbers, value.emailAddresses, false),
          aliases: value.aliases?.map((a: Alias) => ({ name: a.name })) || [],
          business: value.partyType === "CMP" ? buildBusinessCreate(value) : null,
          person: value.partyType === "PRS" ? buildPersonForCreate(value) : null,
        };
        createPartyMutation.mutate({ input: createInput });
      }
    },
  });

  const createPartyMutation = useGraphQLMutation(CREATE_PARTY_MUTATION, {
    onError: (error: any) => {
      console.error("Error creating party:", error);
      handleBusinessPartyMutationError(form, error, "Failed to create party");
    },
    onSuccess: (data: any) => {
      ToggleSuccess("Party created successfully");
      allowNavigation();
      navigate(`/party/${data.createParty.partyIdentifier}`);
    },
  });

  const updatePartyMutation = useGraphQLMutation(UPDATE_PARTY_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Party updated successfully");
      allowNavigation();
      navigate(`/party/${id}`);
    },
    onError: (error: any) => {
      console.error("Error updating party:", error);
      handleBusinessPartyMutationError(form, error, "Failed to update party");
    },
  });

  const isDirty = useStore(form.baseStore, (state) =>
    Object.values(state.fieldMetaBase).some((field) => field?.isTouched),
  );
  const { allowNavigation } = useUnsavedChangesWarning(isDirty);

  const partyTypeValue = useStore(form.store, (state) => state.values.partyType);

  const navigateToPartyList = () => {
    allowNavigation();
    navigate(`/parties`);
  };

  const confirmCancelChanges = useCallback(() => {
    form.reset();
    allowNavigation();

    if (isEditMode && id) {
      navigate(`/party/${id}`);
    } else {
      navigateToPartyList();
    }
  }, [navigate, isEditMode, id, form]);

  const cancelButtonClick = useCallback(() => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: confirmCancelChanges,
        },
      }),
    );
  }, [dispatch, confirmCancelChanges]);

  const saveButtonClick = useCallback(() => {
    form.handleSubmit();
  }, [form]);

  const isSubmitting = createPartyMutation.isPending || updatePartyMutation.isPending;
  const isDisabled = isSubmitting || isLoading;

  return (
    <div className="comp-complaint-details">
      <PartyEditHeader
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        isEditMode={isEditMode}
        partyIdentifier={id}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Party Details</h2>
        </div>

        <form onSubmit={form.handleSubmit}>
          <fieldset disabled={isDisabled}>
            <FormField
              form={form}
              name="partyType"
              label="Party Type"
              required
              validators={{ onChange: z.string().min(1, "Party type is required") }}
              render={(field) => (
                <CompSelect
                  id="party-type-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={partyTypeCodes}
                  value={partyTypeCodes?.find((opt: any) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select party type"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  isDisabled={isDisabled || isEditMode}
                />
              )}
            />
            {partyTypeValue === "PRS" && (
              <PersonForm
                form={form}
                isDisabled={isDisabled}
              />
            )}
            {partyTypeValue === "CMP" && (
              <BusinessFormFields
                form={form}
                isDisabled={isDisabled}
                showContactPeople={true}
                businessGuid={partyData?.party?.business?.businessGuid}
              />
            )}
          </fieldset>
        </form>
      </section>
    </div>
  );
};

export default PartyEdit;
