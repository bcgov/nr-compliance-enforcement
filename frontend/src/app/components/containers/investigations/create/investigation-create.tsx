import { FC, useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { gql } from "graphql-request";
import { CompSelect } from "@components/common/comp-select";
import { CompInput } from "@components/common/comp-input";
import { FormField } from "@components/common/form-field";
import { ValidationTextArea } from "@common/validation-textarea";
import { CompCoordinateInput } from "@components/common/comp-coordinate-input";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { selectAgencyDropdown, selectComplaintStatusCodeDropdown } from "@store/reducers/code-table";
import { useGraphQLQuery } from "@graphql/hooks/useGraphQLQuery";
import { useGraphQLMutation } from "@graphql/hooks/useGraphQLMutation";
import { graphqlRequest as GraphQLRequest } from "@/app/graphql/client";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { openModal, appUserGuid } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { CreateInvestigationInput, UpdateInvestigationInput } from "@/generated/graphql";
import { getUserAgency } from "@/app/service/user-service";
import { bcUtmZoneNumbers } from "@common/methods";
import Option from "@apptypes/app/option";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { RootState } from "@/app/store/store";
import { AppUser } from "@/app/types/app/app_user/app_user";
import { CompDateTimePicker } from "@/app/components/common/comp-date-time-picker";
import { FormErrorBanner } from "@/app/components/common/form-error-banner";
import { InvestigationCreateHeader } from "@/app/components/containers/investigations/create/investigation-create-header";

const CHECK_INVESTIGATION_NAME_EXISTS = gql`
  query CheckInvestigationNameExists($name: String!, $leadAgency: String!, $excludeInvestigationGuid: String) {
    checkInvestigationNameExists(
      name: $name
      leadAgency: $leadAgency
      excludeInvestigationGuid: $excludeInvestigationGuid
    )
  }
`;

const CREATE_INVESTIGATION_MUTATION = gql`
  mutation CreateInvestigation($input: CreateInvestigationInput!) {
    createInvestigation(input: $input) {
      investigationGuid
      description
      name
      investigationStatus {
        investigationStatusCode
        shortDescription
        longDescription
      }
      leadAgency
      locationAddress
      locationDescription
      locationGeometry
      primaryInvestigatorGuid
      supervisorGuid
      fileCoordinatorGuid
      discoveryDate
    }
  }
`;

const InvestigationCreate: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { caseIdentifier } = useParams<{ caseIdentifier?: string }>();

  const statusOptions = useAppSelector(selectComplaintStatusCodeDropdown);
  const agencyOptions = useAppSelector(selectAgencyDropdown);
  const currentAppUserGuid = useAppSelector(appUserGuid);
  const leadAgency = getUserAgency();
  const officersInAgencyList = useSelector((state: RootState) => selectOfficersByAgency(state, leadAgency));
  const [selectedDiscoveryDateTime, setSelectedDiscoveryDateTime] = useState<Date>();

  const assignableOfficers: Option[] =
    officersInAgencyList && officersInAgencyList.length > 0
      ? officersInAgencyList.map((officer: AppUser) => ({
          value: officer.app_user_guid,
          label: `${officer.last_name}, ${officer.first_name}`,
        }))
      : [];

  const createInvestigationMutation = useGraphQLMutation(CREATE_INVESTIGATION_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Investigation created successfully");
      navigate(`/investigation/${data.createInvestigation.investigationGuid}`);
    },
    onError: (error: any) => {
      console.error("Error creating investigation:", error);
      ToggleError("Failed to create investigation");
    },
  });

  const form = useForm({
    defaultValues: {
      investigationStatus: statusOptions.find((opt) => opt.value === "OPEN")?.value,
      leadAgency: getUserAgency(),
      description: "",
      locationAddress: "",
      locationDescription: "",
      locationGeometry: null,
      name: "",
      supervisor: "",
      primaryInvestigator: "",
      fileCoordinator: "",
      discoveryDate: "",
    },
    onSubmit: async ({ value }) => {
      const createInput: CreateInvestigationInput = {
        caseIdentifier: caseIdentifier as string,
        leadAgency: value.leadAgency,
        description: value.description,
        name: value.name,
        investigationStatus: value.investigationStatus,
        locationAddress: value.locationAddress,
        locationDescription: value.locationDescription,
        locationGeometry: value.locationGeometry,
        createdByAppUserGuid: currentAppUserGuid || "",
        supervisorGuid: value.supervisor ?? undefined,
        primaryInvestigatorGuid: value.primaryInvestigator ?? "",
        fileCoordinatorGuid: value.fileCoordinator ?? "",
        discoveryDate: value.discoveryDate,
      };

      createInvestigationMutation.mutate({ input: createInput });
    },
    onSubmitInvalid: () => {
      ToggleError("Errors in form");
    },
  });

  const confirmCancelChanges = useCallback(() => {
    form.reset();

    if (caseIdentifier) {
      navigate(`/case/${caseIdentifier}`);
    } else {
      navigate(`/investigations`);
    }
  }, [navigate, caseIdentifier, form]);

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

  const isSubmitting = createInvestigationMutation.isPending;
  const isDisabled = isSubmitting;

  const handleDiscoveryDateTimeChange = (date: Date | null) => {
    if (date) {
      form.setFieldValue("discoveryDate", new Date(date).toISOString());
      setSelectedDiscoveryDateTime(date);
    } else {
      form.setFieldValue("discoveryDate", "");
    }
  };

  return (
    <div className="comp-investigation-edit-headerdetails">
      <InvestigationCreateHeader
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        caseIdentifier={caseIdentifier}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Investigation details</h2>
        </div>
        <FormErrorBanner form={form} />

        <form onSubmit={form.handleSubmit}>
          <fieldset disabled={isDisabled}>
            <FormField
              form={form}
              name="name"
              label="Investigation ID"
              required
              validators={{
                onChange: z
                  .string()
                  .min(1, "Investigation ID is required")
                  .max(100, "Investigation ID must be 100 characters or less"),
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async ({ value }: { value: string }) => {
                  if (!value || value.length < 1) return "Investigation ID is required";
                  const leadAgency = form.getFieldValue("leadAgency");
                  if (!leadAgency) return undefined;
                  const result: { checkInvestigationNameExists: boolean } = await GraphQLRequest(
                    CHECK_INVESTIGATION_NAME_EXISTS,
                    {
                      name: value,
                      leadAgency: leadAgency,
                      excludeInvestigationGuid: undefined,
                    },
                  );
                  if (result.checkInvestigationNameExists) {
                    return "This Investigation ID is already in use for this agency. Please choose a different Investigation ID.";
                  }
                  return undefined;
                },
              }}
              render={(field) => (
                <div>
                  <CompInput
                    id="display-name"
                    divid="display-name-value"
                    type="input"
                    inputClass="comp-form-control"
                    error={field.state.meta.errors.map((error: any) => error.message || error).join(", ")}
                    maxLength={120}
                    onChange={(evt: any) => field.handleChange(evt.target.value)}
                    value={field.state.value}
                    placeholder="Enter Investigation ID"
                  />
                </div>
              )}
            />
            <FormField
              form={form}
              name="investigationStatus"
              label="Investigation status"
              required
              validators={{ onChange: z.string().min(1, "Investigation status is required") }}
              render={(field) => (
                <CompSelect
                  id="investigation-status-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={statusOptions}
                  value={statusOptions.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select investigation status"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  isDisabled={isDisabled}
                />
              )}
            />
            <FormField
              form={form}
              name="leadAgency"
              label="Lead agency"
              required
              validators={{ onChange: z.string().min(1, "Lead agency is required") }}
              render={(field) => (
                <CompSelect
                  id="lead-agency-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={agencyOptions}
                  value={agencyOptions.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select lead agency"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  isDisabled={true}
                />
              )}
            />
            <FormField
              form={form}
              name="primaryInvestigator"
              label="Primary investigator"
              required
              validators={{ onSubmit: z.string().min(1, "Primary investigator is required") }}
              render={(field) => (
                <CompSelect
                  id="primary-investigator-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={assignableOfficers}
                  value={assignableOfficers.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select investigator"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  isDisabled={isDisabled}
                />
              )}
            />
            <FormField
              form={form}
              name="supervisor"
              label="Supervisor"
              required
              validators={{ onChange: z.string().min(1, "Supervisor is required") }}
              render={(field) => (
                <CompSelect
                  id="supervisor-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={assignableOfficers}
                  value={assignableOfficers.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select supervisor"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  isDisabled={isDisabled}
                />
              )}
            />
            <FormField
              form={form}
              name="fileCoordinator"
              label="File coordinator"
              render={(field) => (
                <CompSelect
                  id="file-coordinator-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={assignableOfficers}
                  value={assignableOfficers.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select coordinator"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  isDisabled={isDisabled}
                />
              )}
            />
            <FormField
              form={form}
              name="discoveryDate"
              label="Discovery date"
              required
              validators={{
                onSubmit: ({ value }: { value: string }) => {
                  const dateValue = value || "";
                  if (!dateValue || dateValue.length < 1) {
                    return "Discovery date is required";
                  } else if (new Date(dateValue) > new Date()) {
                    return "Date and time cannot be in the future";
                  } else {
                    return undefined;
                  }
                },
              }}
              render={(field) => {
                // Flush state to rendered comp if it's available so no-edit saves work
                if (!field.state.value && selectedDiscoveryDateTime) {
                  field.handleChange(selectedDiscoveryDateTime.toISOString());
                }
                return (
                  <CompDateTimePicker
                    value={selectedDiscoveryDateTime}
                    onChange={(date: Date) => {
                      handleDiscoveryDateTimeChange(date);
                      field.handleChange(date ? date.toISOString() : "");
                    }}
                    maxDate={new Date()}
                    errorMessage={field.state.meta.errors?.[0] || ""}
                  />
                );
              }}
            />
            <FormField
              form={form}
              name="description"
              label="Investigation description"
              required
              validators={{ onChange: z.string().min(1, "Description is required") }}
              render={(field) => (
                <ValidationTextArea
                  id="description"
                  className="comp-form-control comp-details-input"
                  rows={4}
                  defaultValue={field.state.value}
                  onChange={(value: string) => field.handleChange(value)}
                  placeholderText="Enter investigation description..."
                  maxLength={4000}
                  errMsg={field.state.meta.errors?.[0]?.message || ""}
                  disabled={isDisabled}
                />
              )}
            />
            <FormField
              form={form}
              name="locationAddress"
              label="Location address"
              // required
              // validators={{ onChange: z.string().min(1, "Location address is required") }}
              render={(field) => (
                <ValidationTextArea
                  id="locationAddress"
                  className="comp-form-control comp-details-input"
                  rows={1}
                  defaultValue={field.state.value}
                  onChange={(value: string) => field.handleChange(value)}
                  placeholderText="Enter the address of the investigation..."
                  maxLength={120}
                  errMsg={field.state.meta.errors?.[0]?.message || ""}
                  disabled={isDisabled}
                />
              )}
            />
            <FormField
              form={form}
              name="locationDescription"
              label="Location description"
              // required
              // validators={{ onChange: z.string().min(1, "Location description is required") }}
              render={(field) => (
                <ValidationTextArea
                  id="locationDescription"
                  className="comp-form-control comp-details-input"
                  rows={4}
                  defaultValue={field.state.value}
                  onChange={(value: string) => field.handleChange(value)}
                  placeholderText="Enter a description of the location of this investigation..."
                  maxLength={4000}
                  errMsg={field.state.meta.errors?.[0]?.message || ""}
                  disabled={isDisabled}
                />
              )}
            />
            <FormField
              form={form}
              name="locationGeometry"
              label="Location"
              render={(field) => {
                const coordinates = field.state.value?.coordinates;
                const longitude = coordinates?.[0]?.toString() || "";
                const latitude = coordinates?.[1]?.toString() || "";

                return (
                  <CompCoordinateInput
                    id="investigation-coordinates"
                    mode="investigation"
                    utmZones={bcUtmZoneNumbers.map((zone: string) => ({ value: zone, label: zone }) as Option)}
                    initXCoordinate={longitude}
                    initYCoordinate={latitude}
                    syncCoordinates={(yCoordinate, xCoordinate) => {
                      if (yCoordinate && xCoordinate && yCoordinate !== "" && xCoordinate !== "") {
                        field.handleChange({
                          type: "Point",
                          coordinates: [Number.parseFloat(xCoordinate), Number.parseFloat(yCoordinate)],
                        });
                      } else {
                        field.handleChange(null);
                      }
                    }}
                    throwError={(hasError: boolean) =>
                      hasError
                        ? field.setMeta({ errorMap: { onChange: "Location Coordinates are invalid" } })
                        : field.setMeta({ errorMap: {} })
                    }
                    enableCopyCoordinates={false}
                    validationRequired={false}
                    sourceXCoordinate={longitude}
                    sourceYCoordinate={latitude}
                  />
                );
              }}
            />
          </fieldset>
        </form>
      </section>
    </div>
  );
};

export default InvestigationCreate;
