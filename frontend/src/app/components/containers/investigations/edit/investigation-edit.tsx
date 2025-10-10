import { FC, useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { gql } from "graphql-request";
import { InvestigationEditHeader } from "./investigation-edit-header";
import { CompSelect } from "@components/common/comp-select";
import { FormField } from "@components/common/form-field";
import { ValidationTextArea } from "@common/validation-textarea";
import { CompCoordinateInput } from "@components/common/comp-coordinate-input";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { selectAgencyDropdown, selectComplaintStatusCodeDropdown } from "@store/reducers/code-table";
import { useGraphQLQuery } from "@graphql/hooks/useGraphQLQuery";
import { useGraphQLMutation } from "@graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { CreateInvestigationInput, UpdateInvestigationInput } from "@/generated/graphql";
import { getUserAgency } from "@/app/service/user-service";
import { bcUtmZoneNumbers } from "@common/methods";
import Option from "@apptypes/app/option";

const CREATE_INVESTIGATION_MUTATION = gql`
  mutation CreateInvestigation($input: CreateInvestigationInput!) {
    createInvestigation(input: $input) {
      investigationGuid
      description
      investigationStatus {
        investigationStatusCode
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

const UPDATE_INVESTIGATION_MUTATION = gql`
  mutation UpdateInvestigation($investigationGuid: String!, $input: UpdateInvestigationInput!) {
    updateInvestigation(investigationGuid: $investigationGuid, input: $input) {
      investigationGuid
      description
      investigationStatus {
        investigationStatusCode
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

const GET_INVESTIGATION = gql`
  query GetInvestigation($investigationGuid: String!) {
    getInvestigation(investigationGuid: $investigationGuid) {
      __typename
      investigationGuid
      description
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
    }
    caseFileByActivityId(activityType: "INVSTGTN", activityIdentifier: $investigationGuid) {
      caseIdentifier
    }
  }
`;

const InvestigationEdit: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { caseIdentifier, id } = useParams<{ caseIdentifier?: string; id?: string }>();

  const isEditMode = !!id;
  const [coordinateErrorsInd, setCoordinateErrorsInd] = useState<boolean>(false);

  const statusOptions = useAppSelector(selectComplaintStatusCodeDropdown);
  const agencyOptions = useAppSelector(selectAgencyDropdown);

  const { data: investigationData, isLoading } = useGraphQLQuery(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", id],
    variables: { investigationGuid: id },
    enabled: isEditMode,
  });

  const createInvestigationMutation = useGraphQLMutation(CREATE_INVESTIGATION_MUTATION, {
    invalidateQueries: ["searchInvestigations", ["caseFile", caseIdentifier]],
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
    invalidateQueries: [["getInvestigation", id], ["getInvestigations", id], "searchInvestiagations"],
    onSuccess: (data: any) => {
      ToggleSuccess("Investigation updated successfully");
      navigate(`/investigation/${id}`);
    },
    onError: (error: any) => {
      console.error("Error updating investigation:", error);
      ToggleError("Failed to update investigation");
    },
  });

  const throwError = (hasError: boolean) => {
    setCoordinateErrorsInd(hasError);
  };

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
      };
    }
    return {
      investigationStatus: statusOptions.filter((opt) => opt.value === "OPEN")[0].value,
      leadAgency: getUserAgency(),
      description: "",
      locationAddress: "",
      locationDescription: "",
      locationGeometry: null,
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
          investigationStatus: value.investigationStatus,
          locationAddress: value.locationAddress,
          locationDescription: value.locationDescription,
          locationGeometry: value.locationGeometry,
        };

        createInvestigationMutation.mutate({ input: createInput });
      }
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
          <h2>Investigation Details</h2>
        </div>

        <form onSubmit={form.handleSubmit}>
          <fieldset disabled={isDisabled}>
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
                    utmZones={bcUtmZoneNumbers.map((zone: string) => ({ value: zone, label: zone } as Option))}
                    initXCoordinate={longitude}
                    initYCoordinate={latitude}
                    syncCoordinates={(yCoordinate, xCoordinate) => {
                      if (yCoordinate && xCoordinate && yCoordinate !== "" && xCoordinate !== "") {
                        field.handleChange({
                          type: "Point",
                          coordinates: [parseFloat(xCoordinate), parseFloat(yCoordinate)],
                        });
                      } else {
                        field.handleChange(null);
                      }
                    }}
                    throwError={throwError}
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
