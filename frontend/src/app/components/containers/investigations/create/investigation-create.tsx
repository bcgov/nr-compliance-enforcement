import { FC, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm, useStore } from "@tanstack/react-form";
import { gql } from "graphql-request";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { selectComplaintStatusCodeDropdown } from "@store/reducers/code-table";
import { useGraphQLMutation } from "@graphql/hooks/useGraphQLMutation";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { openModal, appUserGuid } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { CreateInvestigationInput, Investigation, UpdateInvestigationInput } from "@/generated/graphql";
import { getUserAgency } from "@/app/service/user-service";
import { InvestigationCreateHeader } from "@/app/components/containers/investigations/create/investigation-create-header";
import { InvestigationForm } from "@/app/components/containers/investigations/details/investigation-summary/investigation-form";
import { GET_INVESTIGATION } from "@/app/components/containers/investigations/details/investigation-details";
import useUnsavedChangesWarning from "@/app/hooks/use-unsaved-changes-warning";

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
      discoveryTime
      community
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
      discoveryTime
      community
    }
  }
`;

const InvestigationCreate: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { caseIdentifier, investigationGuid } = useParams<{
    caseIdentifier?: string;
    investigationGuid?: string;
  }>();
  const [searchParams] = useSearchParams();
  const complaintId = searchParams.get("complaintId");

  const isEditMode = Boolean(investigationGuid);

  const statusOptions = useAppSelector(selectComplaintStatusCodeDropdown);
  const currentAppUserGuid = useAppSelector(appUserGuid);

  const { data: investigationData, isLoading: isLoadingInvestigation } = useGraphQLQuery<{
    getInvestigation: Investigation;
  }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid ?? ""],
    variables: { investigationGuid: investigationGuid ?? "" },
    enabled: isEditMode,
  });

  const createInvestigationMutation = useGraphQLMutation(CREATE_INVESTIGATION_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Investigation created successfully");
      allowNavigation();
      navigate(`/investigation/${data.createInvestigation.investigationGuid}`);
    },
    onError: (error: any) => {
      console.error("Error creating investigation:", error);
      ToggleError("Failed to create investigation");
    },
  });

  const updateInvestigationMutation = useGraphQLMutation(UPDATE_INVESTIGATION_MUTATION, {
    onSuccess: () => {
      ToggleSuccess("Investigation updated successfully");
      allowNavigation();
      navigate(`/investigation/${investigationGuid}`);
    },
    onError: (error: any) => {
      console.error("Error updating investigation:", error);
      ToggleError("Failed to update investigation");
    },
  });

  const defaultValues = useMemo(() => {
    if (isEditMode && investigationData?.getInvestigation) {
      const inv = investigationData.getInvestigation;
      return {
        investigationStatus: inv.investigationStatus?.investigationStatusCode || "",
        leadAgency: inv.leadAgency || "",
        description: inv.description || "",
        locationAddress: inv.locationAddress || "",
        locationDescription: inv.locationDescription || "",
        locationGeometry: inv.locationGeometry || null,
        name: inv.name || "",
        supervisor: inv.supervisorGuid || "",
        primaryInvestigator: inv.primaryInvestigatorGuid || "",
        fileCoordinator: inv.fileCoordinatorGuid || "",
        discoveryDate: inv.discoveryDate || null,
        discoveryTime: inv.discoveryTime || null,
        community: inv.community || "",
      };
    }
    return {
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
      discoveryTime: null,
      community: "",
    };
  }, [investigationData, isEditMode, statusOptions]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (isEditMode && investigationGuid) {
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
          discoveryTime: value.discoveryTime,
          community: value.community,
        };
        updateInvestigationMutation.mutate({
          investigationGuid,
          input: updateInput,
        });
      } else {
        const createInput: CreateInvestigationInput = {
          caseIdentifier: caseIdentifier ?? undefined,
          complaintIdentifier: complaintId ?? undefined,
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
          discoveryTime: value.discoveryTime,
          community: value.community || undefined,
        };
        createInvestigationMutation.mutate({ input: createInput });
      }
    },
    onSubmitInvalid: () => {
      ToggleError("Errors in form");
    },
  });

  useEffect(() => {
    if (isEditMode && investigationData?.getInvestigation) {
      form.reset(defaultValues);
    }
  }, [investigationData?.getInvestigation]);

  const isDirty = useStore(form.baseStore, (state) =>
    Object.values(state.fieldMetaBase).some((field) => field?.isTouched),
  );
  const { allowNavigation } = useUnsavedChangesWarning(isDirty);

  const confirmCancelChanges = useCallback(() => {
    allowNavigation();
    form.reset();

    if (isEditMode && investigationGuid) {
      navigate(`/investigation/${investigationGuid}`);
    } else if (caseIdentifier) {
      navigate(`/case/${caseIdentifier}`);
    } else {
      navigate("/investigations");
    }
  }, [navigate, caseIdentifier, investigationGuid, isEditMode, form, allowNavigation]);

  const cancelButtonClick = useCallback(() => {
    if (!isDirty) {
      confirmCancelChanges();
      return;
    }
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
  }, [dispatch, isDirty, confirmCancelChanges]);

  const saveButtonClick = useCallback(() => {
    form.handleSubmit();
  }, [form]);

  const isSubmitting = createInvestigationMutation.isPending || updateInvestigationMutation.isPending;
  const isDisabled = isSubmitting || (isEditMode && isLoadingInvestigation);

  return (
    <div className="comp-investigation-edit-headerdetails">
      <InvestigationCreateHeader
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        caseIdentifier={caseIdentifier}
        isEditMode={isEditMode}
        investigationGuid={investigationGuid}
        investigationName={investigationData?.getInvestigation?.name ?? undefined}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Investigation details</h2>
        </div>
        <InvestigationForm
          id={investigationGuid}
          form={form}
          isDisabled={isDisabled}
          discoveryDate={investigationData?.getInvestigation?.discoveryDate ?? undefined}
          discoveryTime={investigationData?.getInvestigation?.discoveryTime ?? undefined}
          isEditMode={isEditMode}
        />
      </section>
    </div>
  );
};

export default InvestigationCreate;
