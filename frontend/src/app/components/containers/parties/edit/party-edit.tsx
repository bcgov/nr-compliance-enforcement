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
import { BusinessForm } from "@/app/components/containers/parties/form/business-form";
import { toDateOfBirth } from "@/app/common/methods";
import { PartyAttachments } from "../attachments/party-attachments";

const PARTY_PERSON_FRAGMENT = gql`
  fragment PartyPersonFields on Person {
    personGuid
    firstName
    middleName
    middleName2
    lastName
    dateOfBirth
    driversLicenseNumber
    driversLicenseJurisdiction
    sexCode
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
        contactMethods:
          p.person?.contactMethods
            ?.filter((cm): cm is ContactMethod => cm != null)
            .map((cm: ContactMethod) => ({
              contactMethodGuid: cm.contactMethodGuid,
              typeCode: cm.typeCode,
              value: cm.value,
              isPrimary: determineContactMethodPrimary(cm, p.person?.contactMethods || [], cm.typeCode || ""),
            })) || [],
      },
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
      contactMethods: c.person?.contactMethods
        ?.filter((cm): cm is ContactMethod => cm != null)
        .map((cm: ContactMethod) => ({
          contactMethodGuid: cm.contactMethodGuid,
          typeCode: cm.typeCode ?? "",
          value: cm.value ?? "",
          isPrimary: cm.isPrimary ?? false,
        })),
    },
  }));
};

// Helper to build contact people for creates
const buildContactPeopleForCreate = (contacts: BusinessPerson[]) => {
  return contacts.map((c: BusinessPerson) => ({
    person: {
      firstName: c.person?.firstName ?? "",
      lastName: c.person?.lastName ?? "",
      contactMethods: c.person?.contactMethods?.length
        ? c.person.contactMethods
            .filter((cm): cm is ContactMethod => cm != null)
            .map((cm: ContactMethod) => ({
              typeCode: cm.typeCode ?? "",
              value: cm.value ?? "",
              isPrimary: cm.isPrimary ?? false,
            }))
        : undefined,
    },
  }));
};

// Helper to build identifiers array
const buildIdentifiers = (businessNumber: any, worksafeBCNumber: any, isUpdate: boolean) => {
  const identifiers = [];

  if (businessNumber?.identifierValue) {
    identifiers.push({
      ...(isUpdate && { businessIdentifierGuid: businessNumber.identifierGuid }),
      identifierCode: BusinessIdentifiers.BUSINESS_NUMBER,
      identifierValue: businessNumber.identifierValue,
    });
  }

  if (worksafeBCNumber?.identifierValue) {
    identifiers.push({
      ...(isUpdate && { businessIdentifierGuid: worksafeBCNumber.identifierGuid }),
      identifierCode: BusinessIdentifiers.WSBC_NUMBER,
      identifierValue: worksafeBCNumber.identifierValue,
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

// Helper to build business object for updates
const buildBusinessUpdate = (value: any) => {
  return {
    name: value.businessName,
    aliases: value.aliases?.map((a: Alias) => ({ name: a.name })) || [],
    identifiers: buildIdentifiers(value.businessNumber, value.worksafeBCNumber, true),
    contactMethods: buildContactMethods(value.phoneNumbers, value.emailAddresses, true),
    contactPeople: value.contacts?.length ? buildContactPeopleForUpdate(value.contacts) : undefined,
  };
};

// Helper to build business object for creates
const buildBusinessCreate = (value: any) => {
  return {
    name: value.businessName,
    aliases: value.aliases?.map((a: Alias) => ({ name: a.name })) || [],
    identifiers: buildIdentifiers(value.businessNumber, value.worksafeBCNumber, false),
    contactMethods: buildContactMethods(value.phoneNumbers, value.emailAddresses, false),
    contactPeople: value.contacts?.length ? buildContactPeopleForCreate(value.contacts) : undefined,
  };
};

const parseDateOnly = (dateStr: string) => parse(dateStr.slice(0, 10), "yyyy-MM-dd", new Date());

// Shared base fields for person create/update.
function buildPersonBase(value: any, isUpdate: boolean) {
  return {
    firstName: value.firstName,
    middleName: value.middleName?.trim() || null,
    middleName2: value.middleName2?.trim() || null,
    lastName: value.lastName,
    dateOfBirth: toDateOfBirth(value),
    driversLicenseNumber: value.driversLicenseNumber || undefined,
    driversLicenseJurisdiction: value.driversLicenseJurisdiction || undefined,
    sexCode: value.sexCode || undefined,
    contactMethods: buildContactMethods(value.phoneNumbers ?? [], [], isUpdate),
  };
}

function buildPersonForCreate(value: any): PersonInput {
  return buildPersonBase(value, false);
}

function buildPersonForUpdate(value: any): PersonUpdateInput {
  return { personGuid: value.personGuid, ...buildPersonBase(value, true) };
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

  const createPartyMutation = useGraphQLMutation(CREATE_PARTY_MUTATION, {
    onError: (error: any) => {
      console.error("Error creating party:", error);
      ToggleError("Failed to create party");
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
        navigate(`/party/${newPartyIdentifier}`);
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
      ToggleError("Failed to update party");
    },
  });

  const defaultValues = useMemo(() => {
    if (isEditMode && partyData?.party) {
      const person = partyData.party.person;
      return {
        partyType: partyData.party.partyTypeCode || "",
        personGuid: person?.personGuid || "",
        firstName: person?.firstName || "",
        middleName: person?.middleName || "",
        middleName2: person?.middleName2 || "",
        lastName: person?.lastName || "",
        dateOfBirth: person?.dateOfBirth ? parseDateOnly(String(person.dateOfBirth)) : undefined,
        driversLicenseNumber: person?.driversLicenseNumber || "",
        driversLicenseJurisdiction: person?.driversLicenseJurisdiction || "",
        sexCode: person?.sexCode || "",
        businessName: partyData.party.business?.name || "",
        businessNumber: partyData.party.business?.identifiers?.find(
          (i: BusinessIdentifier) => i.identifierCode?.businessIdentifierCode === BusinessIdentifiers.BUSINESS_NUMBER,
        ),
        worksafeBCNumber: partyData.party.business?.identifiers?.find(
          (i: BusinessIdentifier) => i.identifierCode?.businessIdentifierCode === BusinessIdentifiers.WSBC_NUMBER,
        ),
        aliases:
          partyData.party.business?.aliases?.map((a: Alias) => ({
            aliasGuid: a.aliasGuid,
            name: a.name,
          })) || [],
        phoneNumbers: partyData.party.business
          ? mapContactMethodsFromPartyData(partyData.party.business.contactMethods, ContactMethods.PHONE)
          : mapContactMethodsFromPartyData(partyData.party.person?.contactMethods, ContactMethods.PHONE),
        emailAddresses: mapContactMethodsFromPartyData(partyData.party.business?.contactMethods, ContactMethods.EMAIL),
        contacts: mapContactsFromPartyData(partyData.party.business?.contactPeople),
      };
    }
    return {
      partyType: null,
      personGuid: "",
      firstName: "",
      middleName: "",
      middleName2: "",
      lastName: "",
      dateOfBirth: undefined,
      driversLicenseNumber: "",
      driversLicenseJurisdiction: "",
      sexCode: "",
      businessName: "",
      businessNumber: {},
      worksafeBCNumber: {},
      aliases: [],
      phoneNumbers: [],
      emailAddresses: [],
      contacts: [],
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
      if (isEditMode) {
        const updateInput: PartyUpdateInput = {
          partyTypeCode: value.partyType,
          business: value.partyType === "CMP" ? buildBusinessUpdate(value) : null,
          person: value.partyType === "PRS" ? buildPersonForUpdate(value) : null,
        };
        updatePartyMutation.mutate({ partyIdentifier: id, input: updateInput });
      } else {
        const createInput: PartyCreateInput = {
          partyTypeCode: value.partyType,
          business: value.partyType === "CMP" ? buildBusinessCreate(value) : null,
          person: value.partyType === "PRS" ? buildPersonForCreate(value) : null,
        };
        createPartyMutation.mutate({ input: createInput });
      }
    },
  });

  const isDirty =
    useStore(form.baseStore, (state) => Object.values(state.fieldMetaBase).some((field) => field?.isTouched)) ||
    attachmentsDirty;
  const { allowNavigation } = useUnsavedChangesWarning(isDirty);

  const partyTypeValue = useStore(form.store, (state) => state.values.partyType);

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

  const saveButtonClick = useCallback(() => {
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
  }, [form, isEditMode]);

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
              <BusinessForm
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
