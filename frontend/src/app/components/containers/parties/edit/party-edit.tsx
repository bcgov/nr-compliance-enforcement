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
import { Alias, ContactMethod, PartyCreateInput, PartyUpdateInput, Person } from "@/generated/graphql";
import { CompInput } from "@/app/components/common/comp-input";
import { selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";
import { Button } from "react-bootstrap";
import { PhoneNumberField } from "@/app/components/containers/parties/edit/phone-number";

const GET_PARTY = gql`
  query GetParty($partyIdentifier: String!) {
    party(partyIdentifier: $partyIdentifier) {
      __typename
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
        name
        businessGuid
        aliases {
          name
        }
        identifiers {
          identifierValue
          identifierCode {
            businessIdentifierCode
            shortDescription
          }
        }
        contactMethods {
          typeCode
          typeDescription
          value
          isPrimary
        }
        contactPeople {
          firstName
          lastName
          contactMethods {
            typeCode
            typeDescription
            value
            isPrimary
          }
        }
      }
    }
  }
`;

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
        aliases: partyData.party.business?.aliases?.map((a: Alias) => a.name) || [],
        phoneNumbers:
          partyData.party.business?.contactMethods
            ?.filter((c: ContactMethod) => c.typeCode === "PHONE")
            .map((c: ContactMethod) => ({ value: c.value, isPrimary: c.isPrimary || false })) || [],
        emailAddresses:
          partyData.party.business?.contactMethods
            ?.filter((c: ContactMethod) => c.typeCode === "EMAIL")
            .map((c: ContactMethod) => c.value) || [],
        contacts:
          partyData.party.business?.contactPeople?.map((p: Person) => ({
            personGuid: p.personGuid,
            firstName: p.firstName,
            lastName: p.lastName,
            contactMethods:
              p.contactMethods
                ?.filter((cm): cm is ContactMethod => cm != null)
                .map((cm: ContactMethod, index: number) => ({
                  typeCode: cm.typeCode,
                  typeDescription: cm.typeDescription,
                  value: cm.value,
                  isPrimary: cm.isPrimary ?? (cm.typeCode === "PHONE" && index === 0),
                })) || [],
          })) || [],
      };
    }
    return {
      partyType: null,
      firstName: "",
      lastName: "",
      businessName: "",
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
          business: value.partyType === "CMP" ? { name: value.businessName } : null,
          person: value.partyType === "PRS" ? { firstName: value.firstName, lastName: value.lastName } : null,
        };

        updatePartyMutation.mutate({
          partyIdentifier: id,
          input: updateInput,
        });
      } else {
        const createInput: PartyCreateInput = {
          partyTypeCode: value.partyType,
          business: value.partyType === "CMP" ? { name: value.businessName } : null,
          person: value.partyType === "PRS" ? { firstName: value.firstName, lastName: value.lastName } : null,
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
    const newAliases = [...currentAliases, ""];
    form.setFieldValue("aliases", newAliases);
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
    const newPhoneNumbers = [...currentPhoneNumbers, { value: "", isPrimary: false }];
    form.setFieldValue("phoneNumbers", newPhoneNumbers);
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
    const newEmails = [...currentEmails, ""];
    form.setFieldValue("emailAddresses", newEmails);
  }, [form]);

  const handleRemoveEmail = useCallback(
    (indexToRemove: number) => {
      const currentEmails = form.getFieldValue("emailAddresses") || [];
      const newEmails = currentEmails.filter((_: ContactMethod, index: number) => index !== indexToRemove);
      form.setFieldValue("emailAddresses", newEmails);
    },
    [form],
  );

  const handleAddContact = useCallback(() => {
    const currentContacts = form.getFieldValue("contacts") || [];
    const newContact = {
      personGuid: "",
      firstName: "",
      lastName: "",
      contactMethods: [],
    };
    form.setFieldValue("contacts", [...currentContacts, newContact]);
  }, [form]);

  const handleRemoveContact = useCallback(
    (indexToRemove: number) => {
      const currentContacts = form.getFieldValue("contacts") || [];
      const newContacts = currentContacts.filter((_: ContactMethod, index: number) => index !== indexToRemove);
      form.setFieldValue("contacts", newContacts);
    },
    [form],
  );

  const handleAddContactMethod = useCallback(
    (contactIndex: number, typeCode: string) => {
      const currentContacts = form.getFieldValue("contacts") || [];
      const newContactMethod = {
        typeCode: typeCode,
        typeDescription: typeCode === "PHONE" ? "Phone" : "Email",
        value: "",
        isPrimary: false,
      };

      const updatedContacts = currentContacts.map((contact: Person, index: number) => {
        if (index === contactIndex) {
          return {
            ...contact,
            contactMethods: [...(contact.contactMethods || []), newContactMethod],
          };
        }
        return contact;
      });

      form.setFieldValue("contacts", updatedContacts);
    },
    [form],
  );

  const handleRemoveContactMethod = useCallback(
    (contactIndex: number, methodIndex: number) => {
      const currentContacts = form.getFieldValue("contacts") || [];

      const updatedContacts = currentContacts.map((contact: Person, index: number) => {
        if (index === contactIndex) {
          const contactMethods = contact.contactMethods || [];
          const methodToRemove = contactMethods[methodIndex];
          const removingPrimary = methodToRemove?.isPrimary || false;
          const removingTypeCode = methodToRemove?.typeCode;
          const newContactMethods = contactMethods.filter((_, i) => i !== methodIndex);

          // If we removed the primary method and there are still methods of the same type left,
          // make the first one of that type primary
          if (removingPrimary && removingTypeCode && newContactMethods.length > 0) {
            const firstOfSameType = newContactMethods.findIndex((cm) => cm?.typeCode === removingTypeCode);
            if (firstOfSameType !== -1 && newContactMethods[firstOfSameType]) {
              newContactMethods[firstOfSameType].isPrimary = true;
            }
          }

          return {
            ...contact,
            contactMethods: newContactMethods,
          };
        }
        return contact;
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

  const handleSetPrimaryContactPhone = useCallback(
    (contactIndex: number, originalIndex: number) => {
      const currentContacts = form.getFieldValue("contacts") || [];
      const updatedContacts = currentContacts.map((c: Person, cIndex: number) => {
        if (cIndex === contactIndex) {
          return {
            ...c,
            contactMethods: (c.contactMethods || []).map((cm, cmIdx) => {
              if (cm?.typeCode === "PHONE") {
                return { ...cm, isPrimary: cmIdx === originalIndex };
              }
              return cm;
            }),
          };
        }
        return c;
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
                    key={index}
                    form={form}
                    name={`aliases[${index}]` as any}
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
                      variant="primary"
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
                  name="businessNumber"
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
                  name="worksafeBCNumber"
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
                {phoneNumberValue?.map((phoneNumber: any, index: number) => (
                  <PhoneNumberField
                    key={index}
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
                      variant="primary"
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
                    key={index}
                    form={form}
                    name={`emailAddresses[${index}]` as any}
                    label={index === 0 ? "Email" : ""}
                    render={(field) => (
                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <CompInput
                            id={`phone-number-${index}`}
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
                      variant="primary"
                      size="sm"
                      onClick={handleAddEmail}
                      type="button"
                    >
                      <i className="bi bi-plus-circle me-1" /> {/**/}
                      Add email
                    </Button>
                  )}
                />
                {contactValue?.map((contact: Person, contactIndex: number) => (
                  <FormField
                    key={contactIndex}
                    form={form}
                    name={`contact-${contactIndex}`}
                    label={contactIndex === 0 ? "Contact" : ""}
                    render={() => (
                      <div
                        key={contact.personGuid}
                        className="party-details-item"
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "12px",
                          }}
                        >
                          <h4>Contact {contactIndex + 1}</h4>
                          <Button
                            variant="outline-dark"
                            size="sm"
                            onClick={() => handleRemoveContact(contactIndex)}
                            type="button"
                          >
                            <i className="bi bi-trash" /> Remove Contact
                          </Button>
                        </div>

                        <FormField
                          form={form}
                          name={`contacts[${contactIndex}].firstName` as any}
                          label="First name"
                          render={(field) => (
                            <CompInput
                              id={`contact-firstName-${contactIndex}`}
                              divid=""
                              type="input"
                              inputClass="comp-form-control comp-details-input"
                              value={field.state.value}
                              onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                              placeholder="Enter first name..."
                              disabled={isDisabled}
                            />
                          )}
                        />

                        <FormField
                          form={form}
                          name={`contacts[${contactIndex}].lastName` as any}
                          label="Last name"
                          render={(field) => (
                            <CompInput
                              id={`contact-lastName-${contactIndex}`}
                              divid=""
                              type="input"
                              inputClass="comp-form-control comp-details-input"
                              value={field.state.value}
                              onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                              placeholder="Enter last name..."
                              disabled={isDisabled}
                            />
                          )}
                        />
                        {/* Phone numbers for this contact */}
                        {contact.contactMethods
                          ?.map((cm, cmIndex) => ({ method: cm, originalIndex: cmIndex }))
                          .filter(
                            (item): item is { method: ContactMethod; originalIndex: number } =>
                              item.method !== null && item.method.typeCode === "PHONE",
                          )
                          .map(({ method, originalIndex }, displayIndex) => (
                            <PhoneNumberField
                              key={originalIndex}
                              phoneNumber={method}
                              displayIndex={displayIndex}
                              form={form}
                              isDisabled={isDisabled}
                              onSetPrimary={() => handleSetPrimaryContactPhone(contactIndex, originalIndex)}
                              onRemove={() => handleRemoveContactMethod(contactIndex, originalIndex)}
                              fieldName={`contacts[${contactIndex}].contactMethods[${originalIndex}].value`}
                              radioName={`primaryContactPhone-${contactIndex}`}
                              radioId={`contact-phone-primary-${contactIndex}-${originalIndex}`}
                              inputId={`contact-phone-${contactIndex}-${originalIndex}`}
                            />
                          ))}

                        <FormField
                          form={form}
                          name={`add-contact-phone-${contactIndex}`}
                          label=""
                          render={() => (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAddContactMethod(contactIndex, "PHONE")}
                              type="button"
                            >
                              <i className="bi bi-plus-circle me-1" /> Add phone number
                            </Button>
                          )}
                        />

                        {/* Phone numbers for this contact */}
                        {contact.contactMethods
                          ?.map((cm, cmIndex) => ({ method: cm, originalIndex: cmIndex }))
                          .filter(({ method }) => method?.typeCode === "EMAIL")
                          .map(({ method, originalIndex }, displayIndex) => (
                            <FormField
                              key={originalIndex}
                              form={form}
                              name={`contacts[${contactIndex}].contactMethods[${originalIndex}].value` as any}
                              label={displayIndex === 0 ? "Email" : ""}
                              render={(field) => (
                                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                                  <div style={{ flex: 1 }}>
                                    <CompInput
                                      id={`contact-email-${contactIndex}-${originalIndex}`}
                                      divid=""
                                      type="input"
                                      inputClass="comp-form-control comp-details-input"
                                      value={field.state.value}
                                      onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                                      disabled={isDisabled}
                                    />
                                  </div>
                                  <Button
                                    variant="outline-dark"
                                    size="sm"
                                    onClick={() => handleRemoveContactMethod(contactIndex, originalIndex)}
                                    type="button"
                                  >
                                    <i className="bi bi-trash" /> Remove
                                  </Button>
                                </div>
                              )}
                            />
                          ))}

                        <FormField
                          form={form}
                          name={`add-contact-email-${contactIndex}`}
                          label=""
                          render={() => (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAddContactMethod(contactIndex, "EMAIL")}
                              type="button"
                            >
                              <i className="bi bi-plus-circle me-1" /> Add email
                            </Button>
                          )}
                        />
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
                      variant="primary"
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
