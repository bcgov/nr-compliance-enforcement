import { FC, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { gql } from "graphql-request";
import { InvestigationEditHeader } from "./investigation-edit-header";
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

const UPDATE_INVESTIGATION_MUTATION = gql`
  mutation UpdateInvestigation($investigationGuid: String!, $input: UpdateInvestigationInput!) {
    updateInvestigation(investigationGuid: $investigationGuid, input: $input) {
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

const GET_INVESTIGATION = gql`
  query GetInvestigation($investigationGuid: String!) {
    getInvestigation(investigationGuid: $investigationGuid) {
      __typename
      investigationGuid
      description
      name
      openedTimestamp
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
    caseFilesByActivityIds(activityIdentifiers: [$investigationGuid]) {
      caseIdentifier
      name
    }
  }
`;

const InvestigationEdit: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { caseIdentifier, id } = useParams<{ caseIdentifier?: string; id?: string }>();

  const isEditMode = !!id;

  const statusOptions = useAppSelector(selectComplaintStatusCodeDropdown);
  const agencyOptions = useAppSelector(selectAgencyDropdown);
  const currentAppUserGuid = useAppSelector(appUserGuid);

  const { data: investigationData, isLoading } = useGraphQLQuery(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", id],
    variables: { investigationGuid: id },
    enabled: isEditMode,
  });

  const selectedDiscoveryDateTime = isEditMode ? new Date(investigationData?.getInvestigation?.discoveryDate) : null;

  const leadAgency = getUserAgency();
  const officersInAgencyList = useSelector((state: RootState) => selectOfficersByAgency(state, leadAgency));

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

  const updateInvestigationMutation = useGraphQLMutation(UPDATE_INVESTIGATION_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Investigation updated successfully");
      navigate(`/investigation/${id}`);
    },
    onError: (error: any) => {
      console.error("Error updating investigation:", error);
      ToggleError("Failed to update investigation");
    },
  });

  const defaultValues = useMemo(() => {
    // If there is investigation data set the default state of the form to the investigation data
    if (isEditMode && investigationData?.getInvestigation) {
      return {
        investigationStatus: investigationData.getInvestigation.investigationStatus?.investigationStatusCode || "",
        leadAgency: investigationData.getInvestigation.leadAgency || "",
        description: investigationData.getInvestigation.description || "",
        locationAddress: investigationData.getInvestigation.locationAddress || "",
        locationDescription: investigationData.getInvestigation.locationDescription || "",
        locationGeometry: investigationData.getInvestigation.locationGeometry || null,
        name: investigationData.getInvestigation.name || "",
        supervisor: investigationData.getInvestigation.supervisorGuid || "",
        primaryInvestigator: investigationData.getInvestigation.primaryInvestigatorGuid || "",
        fileCoordinator: investigationData.getInvestigation.fileCoordinatorGuid || "",
        discoveryDate: investigationData.getInvestigation.discoveryDate || null,
      };
    }
    return {
      investigationStatus: statusOptions.filter((opt) => opt.value === "OPEN")[0].value,
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
    };
  }, [isEditMode, investigationData]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (isEditMode) {
        const updateInput: UpdateInvestigationInput = {
          leadAgency: value.leadAgency,
          investigationStatus: value.investigationStatus,
          description: value.description,
          locationAddress: value.locationAddress,
          locationDescription: value.locationDescription,
          locationGeometry: value.locationGeometry,
          name: value.name,
          supervisorGuid: value.supervisor,
          primaryInvestigatorGuid: value.primaryInvestigator,
          fileCoordinatorGuid: value.fileCoordinator,
          discoveryDate: value.discoveryDate,
        };

        updateInvestigationMutation.mutate({
          investigationGuid: id,
          input: updateInput,
        });
      } else {
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
      }
    },
    onSubmitInvalid: async ({ value }) => {
      ToggleError("Errors in form");
    },
  });

  const confirmCancelChanges = useCallback(() => {
    form.reset();

    if (isEditMode && id) {
      navigate(`/investigation/${id}`);
    } else {
      navigate(`/investigations/${id}`);
    }
  }, [navigate, isEditMode, caseIdentifier, id, form]);

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

  const isSubmitting = createInvestigationMutation.isPending || updateInvestigationMutation.isPending;
  const isDisabled = isSubmitting || isLoading;

  const handleDiscoveryDateTimeChange = (date: Date | null) => {
    if (date) {
      form.setFieldValue("discoveryDate", new Date(date).toISOString());
    } else {
      form.setFieldValue("discoveryDate", "");
    }
  };

  return (
    <div className="comp-investigation-edit-headerdetails">
      <InvestigationEditHeader
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        isEditMode={isEditMode}
        caseIdentifier={caseIdentifier}
        investigationGuid={id}
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
                      excludeInvestigationGuid: isEditMode ? id : undefined,
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
              validators={{ onChange: z.string().min(1, "Primary investigator is required") }}
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
                  const dateValue = value || investigationData?.getInvestigation?.discoveryDate || "";
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

export default InvestigationEdit;
