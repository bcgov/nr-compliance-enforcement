import { FC, useCallback, useEffect, useMemo, useState } from "react";
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
import { ContactMethod, PartyCreateInput, PartyUpdateInput } from "@/generated/graphql";
import { CompInput } from "@/app/components/common/comp-input";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";
import { selectSexDropdown } from "@/app/store/reducers/code-table";
import { PhoneNumberField } from "@/app/components/containers/parties/edit/phone-number";
import { Button } from "react-bootstrap";

export type PartyFormValues = {
  partyType: string | null;
  firstName: string;
  middleName: string;
  middleName2: string;
  lastName: string;
  dateOfBirth: string;
  driversLicenseNumber: string;
  driversLicenseJurisdiction: string;
  sexCode: string;
  businessName: string;
  phoneNumbers: { value: string; isPrimary: boolean }[];
};

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
        middleName
        middleName2
        dateOfBirth
        driversLicenseNumber
        driversLicenseJurisdiction
        sexCode
        contactMethods {
          typeCode
          value
          isPrimary
        }
      }
      business {
        businessGuid
        name
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
        middleName
        middleName2
        dateOfBirth
        driversLicenseNumber
        driversLicenseJurisdiction
        sexCode
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
        middleName
        middleName2
        dateOfBirth
        driversLicenseNumber
        driversLicenseJurisdiction
        sexCode
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
  const sexCodes = useAppSelector(selectSexDropdown);

  const { data: partyData, isLoading } = useGraphQLQuery(GET_PARTY, {
    queryKey: ["party", id],
    variables: { partyIdentifier: id },
    enabled: isEditMode,
  });

  const partyTypeCodes = partyTypes
    ?.sort((left: any, right: any) => left.displayOrder - right.displayOrder)
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

  const emptyDefaultValues: PartyFormValues = useMemo(
    () => ({
      partyType: null,
      firstName: "",
      middleName: "",
      middleName2: "",
      lastName: "",
      dateOfBirth: "",
      driversLicenseNumber: "",
      driversLicenseJurisdiction: "",
      sexCode: "",
      businessName: "",
      phoneNumbers: [],
    }),
    [],
  );

  const [initialFormValues, setInitialFormValues] = useState<PartyFormValues | null>(() =>
    isEditMode ? null : emptyDefaultValues,
  );

  useEffect(() => {
    if (!isEditMode) {
      setInitialFormValues(emptyDefaultValues);
      return;
    }
    if (!partyData?.party || partyData.party.partyIdentifier !== id) {
      setInitialFormValues(null);
      return;
    }

    const party = partyData.party;
    if (party.partyTypeCode === "PRS") {
      const contactMethods = party.person?.contactMethods ?? [];
      const phoneNumbers = contactMethods
        .filter((c: ContactMethod) => c?.typeCode === "PHONE")
        .map((c: ContactMethod, index: number) => ({
          value: c?.value ?? "",
          isPrimary: c?.isPrimary ?? index === 0,
        }));
      setInitialFormValues({
        partyType: party.partyTypeCode || "",
        firstName: party.person?.firstName || "",
        middleName: party.person?.middleName || "",
        middleName2: party.person?.middleName2 || "",
        lastName: party.person?.lastName || "",
        dateOfBirth: party.person?.dateOfBirth || "",
        driversLicenseNumber: party.person?.driversLicenseNumber || "",
        driversLicenseJurisdiction: party.person?.driversLicenseJurisdiction || "",
        sexCode: party.person?.sexCode || "",
        businessName: party.business?.name || "",
        phoneNumbers: [...phoneNumbers],
      });
    }
  }, [isEditMode, partyData, id, emptyDefaultValues]);

  if (isEditMode && (isLoading || !partyData?.party || initialFormValues === null)) {
    return (
      <div className="comp-complaint-details">
        <div className="comp-details-body comp-details-form comp-container">
          <p className="text-muted">Loading party...</p>
        </div>
      </div>
    );
  }

  return (
    <PartyEditForm
      key={id ?? "create"}
      defaultValues={initialFormValues ?? emptyDefaultValues}
      isEditMode={isEditMode}
      partyIdentifier={id}
      partyTypeCodes={partyTypeCodes}
      sexCodes={sexCodes}
      createPartyMutation={createPartyMutation}
      updatePartyMutation={updatePartyMutation}
      isLoading={isLoading}
      dispatch={dispatch}
      navigate={navigate}
    />
  );
};

type PartyEditFormProps = {
  defaultValues: PartyFormValues;
  isEditMode: boolean;
  partyIdentifier: string | undefined;
  partyTypeCodes: { value: string; label: string }[] | undefined;
  sexCodes: { value: string; label: string }[] | undefined;
  createPartyMutation: ReturnType<typeof useGraphQLMutation>;
  updatePartyMutation: ReturnType<typeof useGraphQLMutation>;
  isLoading: boolean;
  dispatch: ReturnType<typeof useAppDispatch>;
  navigate: ReturnType<typeof useNavigate>;
};

const PartyEditForm: FC<PartyEditFormProps> = ({
  defaultValues,
  isEditMode,
  partyIdentifier: id,
  partyTypeCodes,
  sexCodes,
  createPartyMutation,
  updatePartyMutation,
  isLoading,
  dispatch,
  navigate,
}) => {
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (isEditMode) {
        const updateInput: PartyUpdateInput = {
          partyTypeCode: value.partyType as string,
          business: value.partyType === "CMP" ? { name: value.businessName } : null,
          person: (
            value.partyType === "PRS"
              ? {
                  firstName: value.firstName,
                  middleName: value.middleName,
                  middleName2: value.middleName2,
                  lastName: value.lastName,
                  dateOfBirth: value.dateOfBirth,
                  driversLicenseNumber: value.driversLicenseNumber,
                  driversLicenseJurisdiction: value.driversLicenseJurisdiction,
                  sexCode: value.sexCode,
                  contactMethods: value.phoneNumbers?.filter((p: { value?: string }) => p.value?.trim()).length
                    ? value.phoneNumbers
                        .filter((p: { value?: string }) => p.value?.trim())
                        .map((p: { value: string; isPrimary: boolean }, i: number) => ({
                          typeCode: "PHONE",
                          value: p.value.trim(),
                          isPrimary: p.isPrimary ?? i === 0,
                        }))
                    : undefined,
                }
              : null
          ) as any,
        };

        updatePartyMutation.mutate({
          partyIdentifier: id,
          input: updateInput,
        });
      } else {
        const createInput: PartyCreateInput = {
          partyTypeCode: value.partyType as string,
          business: value.partyType === "CMP" ? { name: value.businessName } : null,
          person: (
            value.partyType === "PRS"
              ? {
                  firstName: value.firstName,
                  middleName: value.middleName,
                  middleName2: value.middleName2,
                  lastName: value.lastName,
                  dateOfBirth: value.dateOfBirth,
                  driversLicenseNumber: value.driversLicenseNumber,
                  driversLicenseJurisdiction: value.driversLicenseJurisdiction,
                  sexCode: value.sexCode,
                  contactMethods: value.phoneNumbers?.filter((p: { value?: string }) => p.value?.trim()).length
                    ? value.phoneNumbers
                        .filter((p: { value?: string }) => p.value?.trim())
                        .map((p: { value: string; isPrimary: boolean }, i: number) => ({
                          typeCode: "PHONE",
                          value: p.value.trim(),
                          isPrimary: p.isPrimary ?? i === 0,
                        }))
                    : undefined,
                }
              : null
          ) as any,
        };

        createPartyMutation.mutate({ input: createInput });
      }
    },
  });

  const partyTypeValue = useStore(form.store, (state) => state.values.partyType);
  const phoneNumberValue = useStore(form.store, (state) => state.values.phoneNumbers);

  const navigateToPartyList = () => {
    navigate("/parties");
  };

  const focusFieldById = useCallback((fieldId: string) => {
    setTimeout(() => {
      const field = document.getElementById(fieldId);
      field?.focus();
    }, 0);
  }, []);

  const handleAddPhoneNumber = useCallback(() => {
    const currentPhoneNumbers = form.getFieldValue("phoneNumbers") || [];
    const newPhoneNumbers = [
      ...currentPhoneNumbers,
      {
        value: "",
        isPrimary: currentPhoneNumbers.length === 0,
      },
    ];
    form.setFieldValue("phoneNumbers", newPhoneNumbers);
    focusFieldById(`person-phone-number-${currentPhoneNumbers.length}`);
  }, [form, focusFieldById]);

  const handleRemovePhoneNumber = useCallback(
    (indexToRemove: number) => {
      const currentPhoneNumbers = form.getFieldValue("phoneNumbers") || [];
      const removingPrimary = currentPhoneNumbers[indexToRemove]?.isPrimary;
      const newPhoneNumbers = currentPhoneNumbers.filter((_: unknown, index: number) => index !== indexToRemove);

      if (removingPrimary && newPhoneNumbers.length > 0) {
        newPhoneNumbers[0].isPrimary = true;
      }

      form.setFieldValue("phoneNumbers", newPhoneNumbers);
    },
    [form],
  );

  const handleSetPrimaryPhoneNumber = useCallback(
    (index: number) => {
      const currentPhoneNumbers = form.getFieldValue("phoneNumbers") || [];
      const updatedPhones = currentPhoneNumbers.map((p: { value: string; isPrimary: boolean }, i: number) => ({
        ...p,
        isPrimary: i === index,
      }));
      form.setFieldValue("phoneNumbers", updatedPhones);
    },
    [form],
  );

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
                  name="middleName"
                  label="Middle name"
                  render={(field) => (
                    <CompInput
                      id="MiddleName"
                      divid=""
                      type="input"
                      inputClass="comp-form-control comp-details-input"
                      defaultValue={field.state.value}
                      error={field.state.meta.errors?.[0]?.message || ""}
                      maxLength={50}
                      onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                      placeholder="Enter middle name..."
                      disabled={isDisabled}
                    />
                  )}
                />
                <FormField
                  form={form}
                  name="middleName2"
                  label="Middle name 2"
                  render={(field) => (
                    <CompInput
                      id="MiddleName2"
                      divid=""
                      type="input"
                      inputClass="comp-form-control comp-details-input"
                      defaultValue={field.state.value}
                      error={field.state.meta.errors?.[0]?.message || ""}
                      maxLength={50}
                      onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                      placeholder="Enter middle name 2..."
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
                <FormField
                  form={form}
                  name="dateOfBirth"
                  label="Date of birth"
                  render={(field) => {
                    const value = field.state.value;
                    const selectedDate =
                      value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value) : null;
                    return (
                      <ValidationDatePicker
                        id="DateOfBirth"
                        className="comp-details-input full-width"
                        classNamePrefix="comp-details-edit-calendar-input"
                        selectedDate={selectedDate ?? undefined}
                        maxDate={new Date()}
                        minDate={new Date(new Date().getFullYear() - 120, 0, 1)}
                        errMsg={field.state.meta.errors?.[0]?.message ?? ""}
                        isDisabled={isDisabled}
                        showYearDropdown
                        yearDropdownItemNumber={120}
                        onChange={(date: Date | null | undefined) =>
                          field.handleChange(date ? date.toISOString().split("T")[0] : "")
                        }
                      />
                    );
                  }}
                />
                <FormField
                  form={form}
                  name="driversLicenseNumber"
                  label="Driver's licence number"
                  render={(field) => (
                    <CompInput
                      id="DriversLicenseNumber"
                      divid=""
                      type="input"
                      inputClass="comp-form-control comp-details-input"
                      defaultValue={field.state.value}
                      error={field.state.meta.errors?.[0]?.message || ""}
                      maxLength={64}
                      onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                      placeholder="Enter driver's licence number..."
                      disabled={isDisabled}
                    />
                  )}
                />
                <FormField
                  form={form}
                  name="driversLicenseJurisdiction"
                  label="Driver's licence jurisdiction"
                  render={(field) => (
                    <CompInput
                      id="DriversLicenseJurisdiction"
                      divid=""
                      type="input"
                      inputClass="comp-form-control comp-details-input"
                      defaultValue={field.state.value}
                      error={field.state.meta.errors?.[0]?.message || ""}
                      maxLength={64}
                      onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                      placeholder="Enter driver's licence jurisdiction..."
                      disabled={isDisabled}
                    />
                  )}
                />
                <FormField
                  form={form}
                  name="sexCode"
                  label="Sex"
                  render={(field) => (
                    <CompSelect
                      id="sex-select"
                      classNamePrefix="comp-select"
                      className="comp-details-input"
                      options={sexCodes}
                      value={sexCodes?.find((opt: any) => opt.value === field.state.value)}
                      onChange={(option) => field.handleChange(option?.value || "")}
                      placeholder="Select sex"
                      isClearable={true}
                      showInactive={false}
                      enableValidation={false}
                      errorMessage={field.state.meta.errors?.[0]?.message || ""}
                      isDisabled={isDisabled}
                    />
                  )}
                />
                {phoneNumberValue?.map((phoneNumber: { value: string; isPrimary: boolean }, index: number) => (
                  <PhoneNumberField
                    key={index}
                    phoneNumber={phoneNumber}
                    displayIndex={index}
                    form={form}
                    isDisabled={isDisabled}
                    onSetPrimary={() => handleSetPrimaryPhoneNumber(index)}
                    onRemove={() => handleRemovePhoneNumber(index)}
                    fieldName={`phoneNumbers[${index}].value`}
                    radioName="personPrimaryPhoneNumber"
                    radioId={`person-phone-primary-${index}`}
                    inputId={`person-phone-number-${index}`}
                  />
                ))}
                <FormField
                  form={form}
                  name="add-phone-number-placeholder"
                  label=""
                  render={() => (
                    <Button
                      id="add-person-phone-number-button"
                      variant="primary"
                      size="sm"
                      onClick={handleAddPhoneNumber}
                      type="button"
                    >
                      <i className="bi bi-plus-circle" /> Add phone number
                    </Button>
                  )}
                />
              </>
            )}
            {partyTypeValue === "CMP" && (
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
            )}
          </fieldset>
        </form>
      </section>
    </div>
  );
};

export default PartyEdit;
