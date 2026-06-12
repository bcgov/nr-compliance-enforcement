import { FC, useCallback, useMemo, useState } from "react";
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
import {
  buildAddresses,
  buildBusinessCreate,
  buildBusinessUpdate,
  buildContactMethods,
  buildPersonForCreate,
  buildPersonForUpdate,
  mapAddressesFromPartyData,
  mapContactMethodsFromPartyData,
  validateBusinessForm,
} from "@/app/components/containers/parties/form/party-form-utils";
import { handleBusinessPartyMutationError } from "@/app/components/containers/parties/form/party-form-errors";
import { PartyAttachments } from "../attachments/party-attachments";

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

const parseDateOnly = (dateStr: string) => parse(dateStr.slice(0, 10), "yyyy-MM-dd", new Date());

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
        facialHairIndicator: person?.facialHairIndicator || null,
        facialHairStyleCodes:
          person?.facialHairStyleCodes?.map((fhs: PersonFacialHairStyleCode) => ({
            personFacialStyleHairCodeGuid: fhs.personFacialStyleHairCodeGuid,
            personGuid: fhs.personGuid,
            facialHairStyleCode: fhs.facialHairStyleCode,
          })) ?? [],
        additionalHairDescriptors: person?.additionalHairDescriptors || null,
        tattooIndicator: person?.tattooIndicator || null,
        tattooDescription: person?.tattooDescription || null,
        additionalDescriptors: person?.additionalDescriptors || null,
        comments: person?.comments || null,
        boloIndicator: person?.boloIndicator || null,
        businessName: partyData.party.business?.name || "",
        businessNumber: partyData.party.business?.identifiers?.find(
          (i: BusinessIdentifier) => i.identifierCode === BusinessIdentifiers.BUSINESS_NUMBER,
        ),
        worksafeBCNumber: partyData.party.business?.identifiers?.find(
          (i: BusinessIdentifier) => i.identifierCode === BusinessIdentifiers.WSBC_NUMBER,
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
      facialHairIndicator: "",
      facialHairStyleCodes: [],
      additionalHairDescriptors: "",
      boloIndicator: "",
      comments: "",
      tattooIndicator: "",
      tattooDescription: "",
      additionalDescriptors: "",
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

  const [partyIdentifier, setPartyIdentifier] = useState<string>(id || "");
  const [attachmentsDirty, setAttachmentsDirty] = useState(false);
  const [triggerSaveAttachments, setTriggerSaveAttachments] = useState(false);
  const [triggerCancelAttachments, setTriggerCancelAttachments] = useState(false);
  const [pendingAttachmentsSaveAfterCreate, setPendingAttachmentsSaveAfterCreate] = useState(false);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (value.partyType === PartyTypeCodes.BUSINESS) {
        const validationError = await validateBusinessForm(value);
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
          aliases: value.aliases?.map((a: Alias) => ({ aliasGuid: a.aliasGuid, name: a.name })) || [],
          business:
            value.partyType === "CMP" ? buildBusinessUpdate(value, buildContactPeopleForUpdate(value.contacts)) : null,
          person: value.partyType === "PRS" ? buildPersonForUpdate(value) : null,
        };
        updatePartyMutation.mutate({ partyIdentifier: id, input: updateInput });
      } else {
        const createInput: PartyCreateInput = {
          partyTypeCode: value.partyType,
          addresses: buildAddresses(value.addresses, true),
          contactMethods: buildContactMethods(value.phoneNumbers, value.emailAddresses, false),
          aliases: value.aliases?.map((a: Alias) => ({ name: a.name })) || [],
          business:
            value.partyType === "CMP" ? buildBusinessCreate(value, buildContactPeopleForCreate(value.contacts)) : null,
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
      setPendingAttachmentsSaveAfterCreate(false);
    },
    onSuccess: (data: any) => {
      const newPartyIdentifier = data.createParty.partyIdentifier;
      setPartyIdentifier(newPartyIdentifier);
      if (pendingAttachmentsSaveAfterCreate) {
        setPendingAttachmentsSaveAfterCreate(false);
        setTriggerSaveAttachments(true);
        setTimeout(() => {
          setTriggerSaveAttachments(false);
        }, 0);
      } else {
        ToggleSuccess("Party created successfully");
        allowNavigation();
        navigate(`/party/${data.createParty.partyIdentifier}`);
      }
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

  const isDirty =
    useStore(form.baseStore, (state) => Object.values(state.fieldMetaBase).some((field) => field?.isTouched)) ||
    attachmentsDirty;
  const { allowNavigation } = useUnsavedChangesWarning(isDirty);

  const partyTypeValue = useStore(form.store, (state) => state.values.partyType);
  const currentFormValues = useStore(form.store, (state) => state.values);

  const navigateToPartyList = () => {
    allowNavigation();
    navigate(`/parties`);
  };

  const confirmCancelChanges = useCallback(() => {
    setTriggerCancelAttachments(true);
    setTimeout(() => {
      setTriggerCancelAttachments(false);
      form.reset();
      allowNavigation();
      if (isEditMode && id) {
        navigate(`/party/${id}`);
      } else {
        navigateToPartyList();
      }
    }, 0);
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

  const saveButtonClick = useCallback(async () => {
    const currentValues = currentFormValues;
    if (currentValues.partyType === PartyTypeCodes.PERSON) {
      if (!currentValues.partyType || currentValues.firstName?.trim() === "" || currentValues.lastName?.trim() === "") {
        ToggleError("Validation error: Please fill in all required fields.");
        return;
      }
    }

    if (currentValues.partyType === PartyTypeCodes.BUSINESS) {
      const validationError = await validateBusinessForm(currentValues);
      if (validationError) {
        ToggleError(validationError);
        return;
      }
    }
    if (isEditMode) {
      setTriggerSaveAttachments(true);
      setTimeout(() => {
        setTriggerSaveAttachments(false);
        form.handleSubmit();
      }, 0);
    } else {
      setPendingAttachmentsSaveAfterCreate(true);
      form.handleSubmit();
    }
  }, [form, isEditMode, partyData, currentFormValues]);

  const isSubmitting = createPartyMutation.isPending || updatePartyMutation.isPending;
  const isDisabled = isSubmitting || isLoading;

  const handleAttachmentsDirtyChange = (_index: number, dirty: boolean) => {
    setAttachmentsDirty(dirty);
  };

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

        <PartyAttachments
          partyId={partyIdentifier}
          triggerSave={triggerSaveAttachments}
          triggerCancel={triggerCancelAttachments}
          onDirtyChange={(index: number, isDirty: boolean) => handleAttachmentsDirtyChange(index, isDirty)}
          onSaved={() => {
            if (!isEditMode) {
              ToggleSuccess("Party created successfully");
              allowNavigation();
              navigate(`/party/${partyIdentifier}`);
            }
          }}
        />

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
