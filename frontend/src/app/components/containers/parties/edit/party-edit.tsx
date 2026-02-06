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
} from "@/generated/graphql";
import { CompInput } from "@/app/components/common/comp-input";
import { selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";
import { Button } from "react-bootstrap";
import { PhoneNumberField } from "@/app/components/containers/parties/edit/phone-number";
import { GET_PARTY } from "@/app/components/containers/parties/view/party-view";
import { ContactPersonFields } from "@/app/components/containers/parties/edit/contact-person";

const UPDATE_PARTY_MUTATION = gql`
  mutation UpdateParty($partyIdentifier: String!, $input: PartyUpdateInput!) {
    updateParty(partyIdentifier: $partyIdentifier, input: $input) {
      partyIdentifier
      partyTypeCode
      shortDescription
      longDescription
      createdDateTime
      person {
        personGuid
        firstName
        lastName
      }
      business {
        businessGuid
        name
      }
    }
  }
`;

const CREATE_PARTY_MUTATION = gql`
  mutation CreateParty($input: PartyCreateInput!) {
    createParty(input: $input) {
      partyIdentifier
      partyTypeCode
      shortDescription
      longDescription
      createdDateTime
      person {
        personGuid
        firstName
        lastName
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
      identifierCode: "BNUM",
      identifierValue: businessNumber.identifierValue,
    });
  }

  if (worksafeBCNumber?.identifierValue) {
    identifiers.push({
      ...(isUpdate && { businessIdentifierGuid: worksafeBCNumber.identifierGuid }),
      identifierCode: "WSBC",
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
        typeCode: "PHONE",
        value: p.value ?? "",
        isPrimary: p.isPrimary ?? false,
      })),
    );
  }

  if (emailAddresses) {
    methods.push(
      ...emailAddresses.map((e: ContactMethod) => ({
        ...(includeGuid && { contactMethodGuid: e.contactMethodGuid }),
        typeCode: "EMAILADDR",
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

// Helper to build person object
const buildPerson = (value: any) => {
  return {
    firstName: value.firstName,
    lastName: value.lastName,
  };
};

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
    },
    onSuccess: (data: any) => {
      ToggleSuccess("Party created successfully");
      navigate(`/party/${data.createParty.partyIdentifier}`);
    },
  });

  const updatePartyMutation = useGraphQLMutation(UPDATE_PARTY_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Party updated successfully");
      navigate(`/party/${id}`);
    },
    onError: (error: any) => {
      console.error("Error updating party:", error);
      ToggleError("Failed to update party");
    },
  });

  const defaultValues = useMemo(() => {
    if (isEditMode && partyData?.party) {
      return {
        partyType: partyData.party.partyTypeCode || "",
        firstName: partyData.party.person?.firstName || "",
        lastName: partyData.party.person?.lastName || "",
        businessName: partyData.party.business?.name || "",
        businessNumber: partyData.party.business?.identifiers?.find(
          (i: BusinessIdentifier) => i.identifierCode?.businessIdentifierCode === "BNUM",
        ),
        worksafeBCNumber: partyData.party.business?.identifiers?.find(
          (i: BusinessIdentifier) => i.identifierCode?.businessIdentifierCode === "WSBC",
        ),
        aliases:
          partyData.party.business?.aliases?.map((a: Alias) => ({
            aliasGuid: a.aliasGuid,
            name: a.name,
          })) || [],
        phoneNumbers: mapContactMethodsFromPartyData(partyData.party.business?.contactMethods, "PHONE"),
        emailAddresses: mapContactMethodsFromPartyData(partyData.party.business?.contactMethods, "EMAILADDR"),
        contacts: mapContactsFromPartyData(partyData.party.business?.contactPeople),
      };
    }
    return {
      partyType: null,
      firstName: "",
      lastName: "",
      businessName: "",
      businessNumber: {},
      worksafeBCNumber: {},
      aliases: [],
      phoneNumbers: [],
      emailAddresses: [],
      contacts: [],
    };
  }, [isEditMode, partyData]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (isEditMode) {
        const updateInput: PartyUpdateInput = {
          partyTypeCode: value.partyType,
          business: value.partyType === "CMP" ? buildBusinessUpdate(value) : null,
          person: value.partyType === "PRS" ? buildPerson(value) : null,
        };
        updatePartyMutation.mutate({ partyIdentifier: id, input: updateInput });
      } else {
        const createInput: PartyCreateInput = {
          partyTypeCode: value.partyType,
          business: value.partyType === "CMP" ? buildBusinessCreate(value) : null,
          person: value.partyType === "PRS" ? buildPerson(value) : null,
        };
        createPartyMutation.mutate({ input: createInput });
      }
    },
  });

  const partyTypeValue = useStore(form.store, (state) => state.values.partyType);
  const aliasesValue = useStore(form.store, (state) => state.values.aliases);
  const phoneNumberValue = useStore(form.store, (state) => state.values.phoneNumbers);
  const emailAddressValue = useStore(form.store, (state) => state.values.emailAddresses);
  const contactValue = useStore(form.store, (state) => state.values.contacts);

  const navigateToPartyList = () => {
    navigate(`/parties`);
  };

  const focusFieldById = useCallback((fieldId: string) => {
    setTimeout(() => {
      const field = document.getElementById(fieldId);
      field?.focus();
    }, 0);
  }, []);

  const confirmCancelChanges = useCallback(() => {
    form.reset();

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

  const handleAddAlias = useCallback(() => {
    const currentAliases = form.getFieldValue("aliases") || [];
    const newAliases = [...currentAliases, { aliasGuid: crypto.randomUUID(), name: "" }];
    form.setFieldValue("aliases", newAliases);
    focusFieldById(`alias-${currentAliases.length}`);
  }, [form]);

  const handleRemoveAlias = useCallback(
    (indexToRemove: number) => {
      const currentAliases = form.getFieldValue("aliases") || [];
      const newAliases = currentAliases.filter((_: Alias, index: number) => index !== indexToRemove);
      form.setFieldValue("aliases", newAliases);
    },
    [form],
  );

  const handleAddPhoneNumber = useCallback(() => {
    const currentPhoneNumbers = form.getFieldValue("phoneNumbers") || [];
    const newPhoneNumbers = [
      ...currentPhoneNumbers,
      {
        contactMethodGuid: "",
        value: "",
        isPrimary: currentPhoneNumbers.length === 0, // First one is primary
      },
    ];
    form.setFieldValue("phoneNumbers", newPhoneNumbers);
    focusFieldById(`phone-number-${currentPhoneNumbers.length}`);
  }, [form]);

  const handleRemovePhoneNumber = useCallback(
    (indexToRemove: number) => {
      const currentPhoneNumbers = form.getFieldValue("phoneNumbers") || [];
      const removingPrimary = currentPhoneNumbers[indexToRemove]?.isPrimary;
      const newPhoneNumbers = currentPhoneNumbers.filter((_: any, index: number) => index !== indexToRemove);

      // If we removed the primary phone and there are still phone numbers left,
      // make the first one primary
      if (removingPrimary && newPhoneNumbers.length > 0) {
        newPhoneNumbers[0].isPrimary = true;
      }

      form.setFieldValue("phoneNumbers", newPhoneNumbers);
    },
    [form],
  );

  const handleAddEmail = useCallback(() => {
    const currentEmails = form.getFieldValue("emailAddresses") || [];
    const newEmails = [
      ...currentEmails,
      {
        contactMethodGuid: "",
        value: "",
        isPrimary: currentEmails.length === 0, // First one is primary
      },
    ];
    form.setFieldValue("emailAddresses", newEmails);
    focusFieldById(`email-${currentEmails.length}`);
  }, [form]);

  const handleRemoveEmail = useCallback(
    (indexToRemove: number) => {
      const currentEmails = form.getFieldValue("emailAddresses") || [];
      const removingPrimary = currentEmails[indexToRemove]?.isPrimary;
      const newEmails = currentEmails.filter((_: any, index: number) => index !== indexToRemove);

      // If we removed the primary phone and there are still phone numbers left,
      // make the first one primary
      if (removingPrimary && newEmails.length > 0) {
        newEmails[0].isPrimary = true;
      }

      form.setFieldValue("emailAddresses", newEmails);
    },
    [form],
  );

  const handleAddContact = useCallback(() => {
    const currentContacts = form.getFieldValue("contacts") || [];
    const newContact = {
      businessPersonXrefGuid: undefined,
      business: {
        businessGuid: partyData?.party?.business?.businessGuid || "",
      },
      person: {
        personGuid: "",
        firstName: "",
        lastName: "",
        contactMethods: [],
      },
    };
    form.setFieldValue("contacts", [...currentContacts, newContact]);
    focusFieldById(`contact-firstName-${currentContacts.length}`);
  }, [form]);

  const handleRemoveContact = useCallback(
    (indexToRemove: number) => {
      const currentContacts = form.getFieldValue("contacts") || [];
      const newContacts = currentContacts.filter((_: BusinessPerson, index: number) => index !== indexToRemove);
      form.setFieldValue("contacts", newContacts);
    },
    [form],
  );

  const handleAddContactMethod = useCallback(
    (contactIndex: number, typeCode: string) => {
      const currentContacts = form.getFieldValue("contacts") || [];

      // Check if this will be the first contact method of this type for this contact
      const existingMethodsOfType =
        currentContacts[contactIndex]?.person?.contactMethods?.filter(
          (cm: ContactMethod) => cm?.typeCode === typeCode,
        ) || [];

      const newContactMethod = {
        contactMethodGuid: undefined, // ← Should be undefined, not empty string
        typeCode: typeCode,
        value: "",
        isPrimary: existingMethodsOfType.length === 0, // First one is primary
      };

      const updatedContacts = currentContacts.map((contact: BusinessPerson, index: number) => {
        if (index === contactIndex) {
          return {
            businessPersonXrefGuid: contact.businessPersonXrefGuid,
            business: { businessGuid: contact.business?.businessGuid },
            person: {
              personGuid: contact.person?.personGuid,
              firstName: contact.person?.firstName,
              lastName: contact.person?.lastName,
              contactMethods: [
                ...(contact.person?.contactMethods || [])
                  .filter((cm): cm is ContactMethod => cm != null)
                  .map((cm) => ({
                    contactMethodGuid: cm.contactMethodGuid,
                    typeCode: cm.typeCode,
                    value: cm.value,
                    isPrimary: cm.isPrimary ?? false,
                  })),
                newContactMethod,
              ],
            },
          };
        }
        return {
          businessPersonXrefGuid: contact.businessPersonXrefGuid,
          business: { businessGuid: contact.business?.businessGuid },
          person: {
            personGuid: contact.person?.personGuid,
            firstName: contact.person?.firstName,
            lastName: contact.person?.lastName,
            contactMethods: (contact.person?.contactMethods || [])
              .filter((cm): cm is ContactMethod => cm != null)
              .map((cm) => ({
                contactMethodGuid: cm.contactMethodGuid,
                typeCode: cm.typeCode,
                value: cm.value,
                isPrimary: cm.isPrimary ?? false,
              })),
          },
        };
      });

      form.setFieldValue("contacts", updatedContacts);

      const fieldId =
        typeCode === "PHONE"
          ? `contact-phone-${contactIndex}-${existingMethodsOfType.length}`
          : `contact-email-${contactIndex}-${existingMethodsOfType.length}`;
      focusFieldById(fieldId);
    },
    [form],
  );

  const handleRemoveContactMethod = useCallback(
    (contactIndex: number, methodIndex: number) => {
      const currentContacts = form.getFieldValue("contacts") || [];

      const updatedContacts = currentContacts.map((contact: BusinessPerson, index: number) => {
        if (index === contactIndex) {
          const contactMethods = (contact.person?.contactMethods || []).filter((cm): cm is ContactMethod => cm != null);

          const methodToRemove = contactMethods[methodIndex];
          const removingPrimary = methodToRemove?.isPrimary || false;
          const removingTypeCode = methodToRemove?.typeCode;
          let newContactMethods = contactMethods
            .filter((_, i) => i !== methodIndex)
            .map((cm) => ({
              contactMethodGuid: cm.contactMethodGuid,
              typeCode: cm.typeCode,
              value: cm.value,
              isPrimary: cm.isPrimary ?? false,
            }));

          // If we removed the primary method and there are still methods of the same type left,
          // make the first one of that type primary
          if (removingPrimary && removingTypeCode && newContactMethods.length > 0) {
            const firstOfSameType = newContactMethods.findIndex((cm) => cm?.typeCode === removingTypeCode);
            if (firstOfSameType !== -1) {
              newContactMethods[firstOfSameType] = {
                ...newContactMethods[firstOfSameType],
                isPrimary: true,
              };
            }
          }

          return {
            businessPersonXrefGuid: contact.businessPersonXrefGuid,
            business: { businessGuid: contact.business?.businessGuid },
            person: {
              personGuid: contact.person?.personGuid,
              firstName: contact.person?.firstName,
              lastName: contact.person?.lastName,
              contactMethods: newContactMethods,
            },
          };
        }
        return {
          businessPersonXrefGuid: contact.businessPersonXrefGuid,
          business: { businessGuid: contact.business?.businessGuid },
          person: {
            personGuid: contact.person?.personGuid,
            firstName: contact.person?.firstName,
            lastName: contact.person?.lastName,
            contactMethods: (contact.person?.contactMethods || [])
              .filter((cm): cm is ContactMethod => cm != null)
              .map((cm) => ({
                contactMethodGuid: cm.contactMethodGuid,
                typeCode: cm.typeCode,
                value: cm.value,
                isPrimary: cm.isPrimary ?? false,
              })),
          },
        };
      });

      form.setFieldValue("contacts", updatedContacts);
    },
    [form],
  );

  const handleSetPrimaryPhoneNumber = useCallback(
    (index: number) => {
      const currentPhoneNumbers = form.getFieldValue("phoneNumbers") || [];
      const updatedPhones = currentPhoneNumbers.map((p: any, i: number) => ({
        ...p,
        isPrimary: i === index,
      }));
      form.setFieldValue("phoneNumbers", updatedPhones);
    },
    [form],
  );

  const handleSetPrimaryEmail = useCallback(
    (index: number) => {
      const currentEmailAddresses = form.getFieldValue("emailAddresses") || [];
      const updatedEmailAddresses = currentEmailAddresses.map((p: any, i: number) => ({
        ...p,
        isPrimary: i === index,
      }));
      form.setFieldValue("emailAddresses", updatedEmailAddresses);
    },
    [form],
  );

  const handleSetPrimaryContact = useCallback(
    (contactIndex: number, contactMethodIndex: number, contactMethodType: string) => {
      const currentContacts = form.getFieldValue("contacts") || [];
      const updatedContacts = currentContacts.map((c: BusinessPerson, cIndex: number) => {
        if (cIndex === contactIndex) {
          return {
            businessPersonXrefGuid: c.businessPersonXrefGuid,
            business: { businessGuid: c.business?.businessGuid },
            person: {
              personGuid: c.person?.personGuid,
              firstName: c.person?.firstName,
              lastName: c.person?.lastName,
              contactMethods: (c.person?.contactMethods || [])
                .filter((cm): cm is ContactMethod => cm != null)
                .map((cm, cmIdx) => {
                  if (cm?.typeCode === contactMethodType) {
                    return {
                      contactMethodGuid: cm.contactMethodGuid,
                      typeCode: cm.typeCode,
                      value: cm.value,
                      isPrimary: cmIdx === contactMethodIndex,
                    };
                  }
                  return {
                    contactMethodGuid: cm.contactMethodGuid,
                    typeCode: cm.typeCode,
                    value: cm.value,
                    isPrimary: cm.isPrimary ?? false, // ← Add default
                  };
                }),
            },
          };
        }
        // Transform the unchanged contact too
        return {
          businessPersonXrefGuid: c.businessPersonXrefGuid,
          business: { businessGuid: c.business?.businessGuid },
          person: {
            personGuid: c.person?.personGuid,
            firstName: c.person?.firstName,
            lastName: c.person?.lastName,
            contactMethods: (c.person?.contactMethods || [])
              .filter((cm): cm is ContactMethod => cm != null)
              .map((cm) => ({
                contactMethodGuid: cm.contactMethodGuid,
                typeCode: cm.typeCode,
                value: cm.value,
                isPrimary: cm.isPrimary ?? false, // ← Add default
              })),
          },
        };
      });
      form.setFieldValue("contacts", updatedContacts);
    },
    [form],
  );

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
              <>
                <FormField
                  form={form}
                  name="firstName"
                  label="First name"
                  required
                  validators={{ onChange: z.string().min(1, "First name is required") }}
                  render={(field) => (
                    <CompInput
                      id="FirstName"
                      divid=""
                      type="input"
                      inputClass="comp-form-control comp-details-input"
                      defaultValue={field.state.value}
                      error={field.state.meta.errors?.[0]?.message || ""}
                      maxLength={50}
                      onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                      placeholder="Enter first name..."
                      disabled={isDisabled}
                    />
                  )}
                />
                <FormField
                  form={form}
                  name="lastName"
                  label="Last name"
                  required
                  validators={{ onChange: z.string().min(1, "Last name is required") }}
                  render={(field) => (
                    <CompInput
                      id="LastName"
                      divid=""
                      type="input"
                      inputClass="comp-form-control comp-details-input"
                      defaultValue={field.state.value}
                      error={field.state.meta.errors?.[0]?.message || ""}
                      maxLength={50}
                      onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                      placeholder="Enter last name..."
                      disabled={isDisabled}
                    />
                  )}
                />
              </>
            )}
            {partyTypeValue === "CMP" && (
              <>
                <FormField
                  form={form}
                  name="businessName"
                  label="Name"
                  required
                  validators={{
                    onChange: z.string().min(1, "Name is required"),
                  }}
                  render={(field) => (
                    <CompInput
                      id="businessName"
                      divid=""
                      type="input"
                      inputClass="comp-form-control comp-details-input"
                      value={field.state.value}
                      error={field.state.meta.errors?.[0]?.message || ""}
                      maxLength={50}
                      onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                      placeholder="Enter name..."
                      disabled={isDisabled}
                    />
                  )}
                />
                {aliasesValue?.map((alias: Alias, index: number) => (
                  <FormField
                    key={alias.aliasGuid}
                    form={form}
                    name={`aliases[${index}].name` as any}
                    label={index === 0 ? "Alias" : ""}
                    render={(field) => (
                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <CompInput
                            id={`alias-${index}`}
                            divid=""
                            type="input"
                            inputClass="comp-form-control comp-details-input"
                            value={field.state.value}
                            error={field.state.meta.errors?.[0]?.message || ""}
                            maxLength={512}
                            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                            placeholder="Enter alias..."
                            disabled={isDisabled}
                          />
                        </div>

                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() => handleRemoveAlias(index)}
                          type="button"
                        >
                          <i className="bi bi-trash" /> {/**/}
                          Remove
                        </Button>
                      </div>
                    )}
                  />
                ))}
                <FormField
                  form={form}
                  name="add-alias-placeholder"
                  label=""
                  render={() => (
                    <Button
                      id="add-task-button"
                      variant="outline-dark"
                      size="sm"
                      onClick={handleAddAlias}
                      type="button"
                    >
                      <i className="bi bi-plus-circle me-1" /> {/**/}
                      Add alias
                    </Button>
                  )}
                />
                <FormField
                  form={form}
                  name="businessNumber.identifierValue"
                  label="Business number"
                  render={(field) => (
                    <CompInput
                      id="businessNumber"
                      divid=""
                      type="input"
                      inputClass="comp-form-control comp-details-input"
                      value={field.state.value}
                      error={field.state.meta.errors?.[0]?.message || ""}
                      maxLength={16}
                      onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                      disabled={isDisabled}
                    />
                  )}
                />
                <FormField
                  form={form}
                  name="worksafeBCNumber.identifierValue"
                  label="WorkSafeBC number"
                  render={(field) => (
                    <CompInput
                      id="worksafeBCNumber"
                      divid=""
                      type="input"
                      inputClass="comp-form-control comp-details-input"
                      value={field.state.value}
                      error={field.state.meta.errors?.[0]?.message || ""}
                      maxLength={16}
                      onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                      disabled={isDisabled}
                    />
                  )}
                />
                {phoneNumberValue?.map((phoneNumber: ContactMethod, index: number) => (
                  <PhoneNumberField
                    key={phoneNumber.contactMethodGuid}
                    phoneNumber={phoneNumber}
                    displayIndex={index}
                    form={form}
                    isDisabled={isDisabled}
                    onSetPrimary={() => handleSetPrimaryPhoneNumber(index)}
                    onRemove={() => handleRemovePhoneNumber(index)}
                    fieldName={`phoneNumbers[${index}].value`}
                    radioName="primaryPhoneNumber"
                    radioId={`phone-primary-${index}`}
                    inputId={`phone-number-${index}`}
                  />
                ))}
                <FormField
                  form={form}
                  name="add-phone-number-placeholder"
                  label=""
                  render={() => (
                    <Button
                      id="add-phone-number-button"
                      variant="outline-dark"
                      size="sm"
                      onClick={handleAddPhoneNumber}
                      type="button"
                    >
                      <i className="bi bi-plus-circle me-1" /> {/**/}
                      Add phone number
                    </Button>
                  )}
                />
                {emailAddressValue?.map((email: ContactMethod, index: number) => (
                  <FormField
                    key={email.contactMethodGuid}
                    form={form}
                    name={`emailAddresses[${index}].value` as any}
                    label={index === 0 ? "Email" : ""}
                    render={(field) => (
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {index === 0 && (
                          <div style={{ width: "60px", fontWeight: "500", fontSize: "14px" }}>Primary</div>
                        )}
                        {index > 0 && <div style={{ width: "60px" }}></div>}

                        <input
                          type="radio"
                          id={`email-primary-${index}`}
                          name="primaryEmail"
                          checked={email.isPrimary || false}
                          onChange={() => handleSetPrimaryEmail(index)}
                          disabled={isDisabled}
                        />

                        <div style={{ flex: 1 }}>
                          <CompInput
                            id={`email-${index}`}
                            divid=""
                            type="input"
                            inputClass="comp-form-control comp-details-input"
                            value={field.state.value}
                            error={field.state.meta.errors?.[0]?.message || ""}
                            maxLength={512}
                            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                            disabled={isDisabled}
                          />
                        </div>
                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() => handleRemoveEmail(index)}
                          type="button"
                        >
                          <i className="bi bi-trash" />
                          {/**/}
                          Remove
                        </Button>
                      </div>
                    )}
                  />
                ))}
                <FormField
                  form={form}
                  name="add-email-placeholder"
                  label=""
                  render={() => (
                    <Button
                      id="add-email-button"
                      variant="outline-dark"
                      size="sm"
                      onClick={handleAddEmail}
                      type="button"
                    >
                      <i className="bi bi-plus-circle me-1" /> {/**/}
                      Add email
                    </Button>
                  )}
                />
                {contactValue?.map((contact: BusinessPerson, contactIndex: number) => (
                  <FormField
                    key={contact.businessPersonXrefGuid}
                    form={form}
                    name={`contact-${contactIndex}.person`}
                    label={contactIndex === 0 ? "Contact" : ""}
                    render={() => (
                      <ContactPersonFields
                        contact={contact}
                        contactIndex={contactIndex}
                        form={form}
                        isDisabled={isDisabled}
                        onRemoveContact={handleRemoveContact}
                        onAddContactMethod={handleAddContactMethod}
                        onRemoveContactMethod={handleRemoveContactMethod}
                        onSetPrimaryContact={handleSetPrimaryContact}
                      />
                    )}
                  />
                ))}

                <FormField
                  form={form}
                  name="add-email-placeholder"
                  label=""
                  render={() => (
                    <Button
                      variant="outline-dark"
                      onClick={handleAddContact}
                      size="sm"
                      type="button"
                    >
                      <i className="bi bi-plus-circle me-1" /> Add contact
                    </Button>
                  )}
                />
              </>
            )}
          </fieldset>
        </form>
      </section>
    </div>
  );
};

export default PartyEdit;
