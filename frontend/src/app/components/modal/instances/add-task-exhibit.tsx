import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid, selectModalData } from "@/app/store/reducers/app";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import { CompInput } from "@components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import { FormField } from "@components/common/form-field";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { selectOfficerByAppUserGuid, selectOfficerListByAgencyCode } from "@/app/store/reducers/officer";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { CreateUpdateExhibitInput, Exhibit } from "@/generated/graphql";
import { getUserAgency } from "@/app/service/user-service";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import {
  CREATE_EXHIBIT,
  DELETE_EXHIBIT,
  UPDATE_EXHIBIT,
} from "@/app/components/containers/investigations/details/investigation-task/detail/exhibit/task-exhibits";

type AddEditTaskExhibitModalProps = {
  close: () => void;
  submit: () => void;
};

export const AddEditTaskExhibitModal: FC<AddEditTaskExhibitModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const userAgency = getUserAgency();
  const currentUserGuid = useAppSelector(appUserGuid);

  const officerSelector = useMemo(() => selectOfficerListByAgencyCode(userAgency), [userAgency]);
  const assignableOfficers = useAppSelector(officerSelector);

  const {
    title,
    investigationIdentifier,
    taskIdentifier,
    exhibit,
    onDirtyChange,
  }: {
    title: string;
    investigationIdentifier: string;
    taskIdentifier: string;
    exhibit?: Exhibit;
    onDirtyChange?: any;
  } = modalData;

  const collectedByInitialValue = exhibit?.collectedAppUserGuidRef ?? currentUserGuid ?? "";
  const collectedByOfficer = useAppSelector(
    useMemo(() => selectOfficerByAppUserGuid(collectedByInitialValue), [collectedByInitialValue]),
  );

  const assignableOfficersExtended =
    collectedByOfficer && !assignableOfficers.some((opt) => opt.value === collectedByOfficer.app_user_guid)
      ? [
          ...assignableOfficers,
          {
            value: collectedByOfficer.app_user_guid,
            label: `${collectedByOfficer.last_name}, ${collectedByOfficer.first_name}`,
          },
        ]
      : assignableOfficers;

  const assignableOfficersSorted = [...assignableOfficersExtended].sort((a, b) =>
    String(a.label ?? "").localeCompare(String(b.label ?? ""), undefined, { sensitivity: "base" }),
  );

  // State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Mutations
  const createMutation = useGraphQLMutation(CREATE_EXHIBIT, {
    onSuccess: () => {
      ToggleSuccess("Exhibit saved successfully");
      submit();
    },
    onError: () => {
      ToggleError("Failed to create exhibit");
    },
  });

  const updateMutation = useGraphQLMutation(UPDATE_EXHIBIT, {
    onSuccess: () => {
      ToggleSuccess("Exhibit saved successfully");
      submit();
    },
    onError: () => {
      ToggleError("Failed to update exhibit");
    },
  });

  const deleteMutation = useGraphQLMutation(DELETE_EXHIBIT, {
    onSuccess: () => {
      ToggleSuccess("Exhibit deleted successfully");
      submit();
    },
    onError: () => {
      ToggleError("Failed to delete exhibit");
    },
  });

  // Form Definition
  const form = useForm({
    defaultValues: {
      description: exhibit?.description ?? "",
      dateCollected: exhibit?.dateCollected ? new Date(exhibit.dateCollected) : new Date(),
      collectedAppUserGuidRef: collectedByInitialValue,
    },
    onSubmitInvalid: () => {
      ToggleError("Errors in form");
    },
    onSubmit: async ({ value }) => {
      if (showDeleteConfirm) {
        await handleDelete();
      } else if (exhibit) {
        await handleUpdate(value);
      } else {
        await handleCreate(value);
      }
    },
  });

  type FormValues = typeof form.state.values;

  // Dirty tracking
  const { markDirty } = useFormDirtyState(onDirtyChange);
  const isFormDirty = useStore(form.baseStore, (state) =>
    Object.values(state.fieldMetaBase).some((field) => field?.isTouched),
  );

  useEffect(() => {
    if (isFormDirty) markDirty();
  }, [isFormDirty, markDirty]);

  // Handlers
  const handleCreate = async (value: FormValues) => {
    const input: CreateUpdateExhibitInput = {
      taskGuid: taskIdentifier,
      investigationGuid: investigationIdentifier,
      description: value.description,
      dateCollected: value.dateCollected as Date,
      collectedAppUserGuidRef: value.collectedAppUserGuidRef,
      appUserIdentifier: "",
    };
    await createMutation.mutateAsync({ input });
    submit();
  };

  const handleUpdate = async (value: FormValues) => {
    const input: CreateUpdateExhibitInput = {
      exhibitGuid: exhibit!.exhibitGuid,
      taskGuid: taskIdentifier,
      investigationGuid: investigationIdentifier,
      description: value.description,
      dateCollected: value.dateCollected as Date,
      collectedAppUserGuidRef: value.collectedAppUserGuidRef,
    };
    await updateMutation.mutateAsync({ input });
    submit();
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ exhibitGuid: exhibit!.exhibitGuid });
    submit();
  };

  const handleSubmit = async () => {
    await form.handleSubmit();
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}

      <Modal.Body>
        <form onSubmit={form.handleSubmit}>
          <fieldset>
            {/* Description */}
            <FormField
              form={form}
              name="description"
              label="Description"
              required
              validators={{ onChange: z.string().min(1, "Description is required") }}
              render={(field) => (
                <CompInput
                  id="exhibit-description"
                  divid="exhibit-description-value"
                  type="input"
                  inputClass="comp-form-control"
                  error={field.state.meta.errors.map((error: any) => error.message || error).join(", ")}
                  onChange={(evt: any) => field.handleChange(evt.target.value)}
                  value={field.state.value}
                  placeholder="Enter description"
                />
              )}
            />

            {/* Date Collected */}
            <FormField
              form={form}
              name="dateCollected"
              label="Date collected"
              required
              validators={{
                onChange: z
                  .date()
                  .nullable()
                  .refine((val) => val !== null, { message: "Date collected is required" })
                  .refine((val) => val === null || val <= new Date(), {
                    message: "Date collected cannot be in the future",
                  }),
              }}
              render={(field) => (
                <ValidationDatePicker
                  id="exhibit-date-collected"
                  classNamePrefix="comp-details-input"
                  className="comp-form-control comp-details-input"
                  selectedDate={field.state.value}
                  maxDate={new Date()}
                  onChange={(date: Date | undefined) => field.handleChange(date ?? null)}
                  errMsg={field.state.meta.errors?.[0]?.message || ""}
                />
              )}
            />

            {/* Officer Collected */}
            <FormField
              form={form}
              name="collectedAppUserGuidRef"
              label="Officer collected"
              required
              validators={{ onChange: z.string().min(1, "Officer collected is required") }}
              render={(field) => (
                <CompSelect
                  id="officer-collected-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={assignableOfficersSorted}
                  value={assignableOfficersSorted.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select officer"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                />
              )}
            />
          </fieldset>
        </form>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <Alert
            variant="danger"
            className="comp-complaint-details-alert mt-3"
            id="exhibit-delete-confirm-alert"
          >
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-info-circle mt-2" />
              <span>
                <strong>Delete exhibit</strong>
                <p className="mb-3">
                  Are you sure you want to delete exhibit #{exhibit?.exhibitNumber}? This action cannot be undone.
                </p>
              </span>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-primary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleSubmit}
              >
                <i className="bi bi-trash me-1" />
                <span>Confirm delete</span>
              </Button>
            </div>
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="comp-details-form-buttons w-100 d-flex justify-content-between">
          {/* Delete button — only shown when editing an existing exhibit */}
          {exhibit && (
            <Button
              variant="outline-danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={showDeleteConfirm}
            >
              <i className="bi bi-trash me-1" />
              <span>Delete</span>
            </Button>
          )}
          <div className="d-flex gap-2 ms-auto">
            <Button
              variant="outline-primary"
              onClick={close}
              disabled={showDeleteConfirm}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={showDeleteConfirm}
            >
              <span>Save and close</span>
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </>
  );
};
