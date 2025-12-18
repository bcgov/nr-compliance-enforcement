import { FC, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { gql } from "graphql-request";
import { InspectionEditHeader } from "./inspection-edit-header";
import { CompSelect } from "@components/common/comp-select";
import { CompInput } from "@components/common/comp-input";
import { FormField } from "@components/common/form-field";
import { ValidationTextArea } from "@common/validation-textarea";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { selectAgencyDropdown, selectComplaintStatusCodeDropdown } from "@store/reducers/code-table";
import { useGraphQLQuery } from "@graphql/hooks/useGraphQLQuery";
import { useGraphQLMutation } from "@graphql/hooks/useGraphQLMutation";
import { graphqlRequest as GraphQLRequest } from "@/app/graphql/client";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { openModal, appUserGuid } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { CreateInspectionInput, UpdateInspectionInput } from "@/generated/graphql";
import { getUserAgency } from "@/app/service/user-service";
import { CompCoordinateInput } from "@components/common/comp-coordinate-input";
import Option from "@apptypes/app/option";
import { bcUtmZoneNumbers } from "@common/methods";

const CHECK_INSPECTION_NAME_EXISTS = gql`
  query CheckInspectionNameExists($name: String!, $leadAgency: String!, $excludeInspectionGuid: String) {
    checkInspectionNameExists(name: $name, leadAgency: $leadAgency, excludeInspectionGuid: $excludeInspectionGuid)
  }
`;

const CREATE_INSPECTION_MUTATION = gql`
  mutation CreateInspection($input: CreateInspectionInput!) {
    createInspection(input: $input) {
      inspectionGuid
      description
      name
      inspectionStatus {
        inspectionStatusCode
        shortDescription
        longDescription
      }
      leadAgency
      locationAddress
      locationDescription
      locationGeometry
    }
  }
`;

const UPDATE_INSPECTION_MUTATION = gql`
  mutation UpdateInspection($inspectionGuid: String!, $input: UpdateInspectionInput!) {
    updateInspection(inspectionGuid: $inspectionGuid, input: $input) {
      inspectionGuid
      description
      name
      inspectionStatus {
        inspectionStatusCode
        shortDescription
        longDescription
      }
      leadAgency
      locationAddress
      locationDescription
      locationGeometry
    }
  }
`;

const GET_INSPECTION = gql`
  query GetInspection($inspectionGuid: String!) {
    getInspection(inspectionGuid: $inspectionGuid) {
      __typename
      inspectionGuid
      description
      name
      openedTimestamp
      inspectionStatus {
        inspectionStatusCode
        shortDescription
        longDescription
      }
      leadAgency
      locationAddress
      locationDescription
      locationGeometry
    }
    caseFilesByActivityIds(activityIdentifiers: [$inspectionGuid]) {
      caseIdentifier
      name
    }
  }
`;

const InspectionEdit: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { caseIdentifier, id } = useParams<{ caseIdentifier?: string; id?: string }>();

  const isEditMode = !!id;

  const statusOptions = useAppSelector(selectComplaintStatusCodeDropdown);
  const agencyOptions = useAppSelector(selectAgencyDropdown);
  const currentAppUserGuid = useAppSelector(appUserGuid);

  const { data: inspectionData, isLoading } = useGraphQLQuery(GET_INSPECTION, {
    queryKey: ["getInspection", id],
    variables: { inspectionGuid: id },
    enabled: isEditMode,
  });

  const createInspectionMutation = useGraphQLMutation(CREATE_INSPECTION_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Inspection created successfully");
      navigate(`/inspection/${data.createInspection.inspectionGuid}`);
    },
    onError: (error: any) => {
      console.error("Error creating inspection:", error);
      ToggleError("Failed to create inspection");
    },
  });

  const updateInspectionMutation = useGraphQLMutation(UPDATE_INSPECTION_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Inspection updated successfully");
      navigate(`/inspection/${id}`);
    },
    onError: (error: any) => {
      console.error("Error updating inspection:", error);
      ToggleError("Failed to update inspection");
    },
  });

  const defaultValues = useMemo(() => {
    // If there is inspection data set the default state of the form to the inspection data
    if (isEditMode && inspectionData?.getInspection) {
      return {
        inspectionStatus: inspectionData.getInspection.inspectionStatus?.inspectionStatusCode || "",
        leadAgency: inspectionData.getInspection.leadAgency || "",
        description: inspectionData.getInspection.description || "",
        name: inspectionData.getInspection.name || "",
        locationAddress: inspectionData.getInspection.locationAddress || "",
        locationDescription: inspectionData.getInspection.locationDescription || "",
        locationGeometry: inspectionData.getInspection.locationGeometry || null,
      };
    }
    return {
      inspectionStatus: statusOptions.find((opt) => opt.value === "OPEN")?.value,
      leadAgency: getUserAgency(),
      description: "",
      name: "",
      locationAddress: "",
      locationDescription: "",
      locationGeometry: null,
    };
  }, [isEditMode, inspectionData]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (isEditMode) {
        const updateInput: UpdateInspectionInput = {
          leadAgency: value.leadAgency,
          inspectionStatus: value.inspectionStatus,
          description: value.description,
          name: value.name,
          locationAddress: value.locationAddress,
          locationDescription: value.locationDescription,
          locationGeometry: value.locationGeometry,
        };

        updateInspectionMutation.mutate({
          inspectionGuid: id,
          input: updateInput,
        });
      } else {
        const createInput: CreateInspectionInput = {
          caseIdentifier: caseIdentifier as string,
          leadAgency: value.leadAgency,
          description: value.description,
          name: value.name,
          inspectionStatus: value.inspectionStatus,
          locationAddress: value.locationAddress,
          locationDescription: value.locationDescription,
          locationGeometry: value.locationGeometry,
          createdByAppUserGuid: currentAppUserGuid || "",
        };

        createInspectionMutation.mutate({ input: createInput });
      }
    },
  });

  const confirmCancelChanges = useCallback(() => {
    form.reset();

    if (id) {
      navigate(`/inspection/${id}`);
    } else if (caseIdentifier) {
      navigate(`/case/${caseIdentifier}`);
    } else {
      navigate(`/inspections`);
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

  const isSubmitting = createInspectionMutation.isPending || updateInspectionMutation.isPending;
  const isDisabled = isSubmitting || isLoading;

  return (
    <div className="comp-complaintinspection-edit-headerdetails">
      <InspectionEditHeader
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        isEditMode={isEditMode}
        caseIdentifier={caseIdentifier}
        inspectionGuid={id}
        inspectionName={inspectionData?.getInspection?.name}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Inspection Details</h2>
        </div>

        <form onSubmit={form.handleSubmit}>
          <fieldset disabled={isDisabled}>
            <FormField
              form={form}
              name="name"
              label="Inspection ID"
              required
              validators={{
                onChange: z
                  .string()
                  .min(1, "Inspection ID is required")
                  .max(100, "Inspection ID must be 100 characters or less"),
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async ({ value }: { value: string }) => {
                  if (!value || value.length < 1) return "Inspection ID is required";
                  const leadAgency = form.getFieldValue("leadAgency");
                  if (!leadAgency) return undefined;
                  const result: { checkInspectionNameExists: boolean } = await GraphQLRequest(
                    CHECK_INSPECTION_NAME_EXISTS,
                    {
                      name: value,
                      leadAgency: leadAgency,
                      excludeInspectionGuid: isEditMode ? id : undefined,
                    },
                  );
                  if (result.checkInspectionNameExists) {
                    return "This Inspection ID is already in use for this agency. Please choose a different Inspection ID.";
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
                    placeholder="Enter Inspection ID"
                  />
                </div>
              )}
            />

            <FormField
              form={form}
              name="inspectionStatus"
              label="Inspection status"
              required
              validators={{ onChange: z.string().min(1, "Inspection status is required") }}
              render={(field) => (
                <CompSelect
                  id="inspection-status-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={statusOptions}
                  value={statusOptions.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select inspection status"
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
              name="description"
              label="Inspection description"
              required
              validators={{ onChange: z.string().min(1, "Description is required") }}
              render={(field) => (
                <ValidationTextArea
                  id="description"
                  className="comp-form-control comp-details-input"
                  rows={4}
                  defaultValue={field.state.value}
                  onChange={(value: string) => field.handleChange(value)}
                  placeholderText="Enter inspection description..."
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
                  placeholderText="Enter the address of the inspection..."
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
                  placeholderText="Enter a description of the location of this inspection..."
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
                    id="inspection-coordinates"
                    mode="inspection"
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

export default InspectionEdit;
