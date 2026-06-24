import { useAppSelector } from "@/app/hooks/hooks";
import { selectModalData } from "@/app/store/reducers/app";
import { FC, useEffect, useMemo, useState } from "react";
import { Alert, Button, Col, Modal, Row } from "react-bootstrap";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import { CompInput } from "@components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import { FormField } from "@components/common/form-field";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { selectOfficers, selectOfficerListByAgencyCode } from "@/app/store/reducers/officer";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { CreateUpdateExhibitInput, Exhibit } from "@/generated/graphql";
import { getUserAgency } from "@/app/service/user-service";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import {
  CREATE_EXHIBIT,
  DELETE_EXHIBIT,
  UPDATE_EXHIBIT,
} from "@/app/components/containers/investigations/details/investigation-task/detail/exhibit/task-exhibits";
import { PROPERTY_TYPE_OPTIONS, PropertyTypeEnum } from "@/app/types/app/investigation/exhibits";
import { ValidationPhoneInput } from "@/app/common/validation-phone-input";

type ExhibitValidatorApi = { form: { getFieldValue: (field: string) => unknown } };

// Seized-from fields are only required when the property type is Seized.
const requiredWhenSeized =
  (message: string) =>
  ({ value, fieldApi }: { value: string; fieldApi: ExhibitValidatorApi }) =>
    fieldApi.form.getFieldValue("propertyType") === PropertyTypeEnum.SEIZED && !value?.trim() ? message : undefined;

// Derive the "HH:mm" time string the picker expects from a stored Date. Returns null when no date is set.
const formatTimeForPicker = (date: Date | null): string | null => {
  if (!date) return null;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Combine a date with an "HH:mm" time string back into a single Date. Falls back to midnight when no time is set.
const combineDateAndTime = (date: Date | null, time: string | null): Date | null => {
  if (!date) return null;
  const combined = new Date(date);
  if (time) {
    const [hours, minutes] = time.split(":").map(Number);
    combined.setHours(hours, minutes, 0, 0);
  } else {
    combined.setHours(0, 0, 0, 0);
  }
  return combined;
};

type AddEditTaskExhibitModalProps = {
  close: () => void;
  submit: () => void;
};

export const AddEditTaskExhibitModal: FC<AddEditTaskExhibitModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const userAgency = getUserAgency();
  const allOfficers = useAppSelector(selectOfficers);

  const officerSelector = useMemo(() => selectOfficerListByAgencyCode(userAgency), [userAgency]);
  const assignableOfficers = useAppSelector(officerSelector);

  const {
    title,
    investigationIdentifier,
    taskIdentifier,
    taskAssignedUserGuid,
    exhibit,
    onDirtyChange,
  }: {
    title: string;
    investigationIdentifier: string;
    taskIdentifier: string;
    taskAssignedUserGuid: string;
    exhibit?: Exhibit;
    onDirtyChange?: any;
  } = modalData;

  // Existing officer on the exhibit being edited (if any)
  const existingOfficer = exhibit?.collectedAppUserGuidRef
    ? allOfficers?.find((item: { app_user_guid: string }) => item.app_user_guid === exhibit.collectedAppUserGuidRef)
    : undefined;

  // For new exhibits default to the task's assigned officer (primary investigator on the investigation)
  const defaultAssignedOfficer = taskAssignedUserGuid
    ? allOfficers?.find((item: { app_user_guid: string }) => item.app_user_guid === taskAssignedUserGuid)
    : undefined;

  const initialOfficer = existingOfficer ?? defaultAssignedOfficer;
  const collectedByInitialValue = initialOfficer?.app_user_guid ?? "";

  // Include the initial officer in the dropdown list even if they're inactive or in a different agency
  const assignableOfficersExtended =
    initialOfficer && !assignableOfficers.some((opt) => opt.value === initialOfficer.app_user_guid)
      ? [
          ...assignableOfficers,
          {
            value: initialOfficer.app_user_guid,
            label: `${initialOfficer.last_name}, ${initialOfficer.first_name}`,
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
      propertyType: exhibit?.propertyType ?? "",
      seizedFromFirstName: exhibit?.seizedFromFirstName ?? "",
      seizedFromLastName: exhibit?.seizedFromLastName ?? "",
      seizedFromAddress: exhibit?.seizedFromAddress ?? "",
      seizedFromPhoneNumber: exhibit?.seizedFromPhoneNumber ?? "",
      description: exhibit?.description ?? "",
      quantity: exhibit?.quantity ?? null,
      dateCollected: exhibit?.dateCollected ? new Date(exhibit.dateCollected) : new Date(),
      collectedAppUserGuidRef: collectedByInitialValue,
      locationOfIntake: exhibit?.locationOfIntake ?? "",
      propertyTagNumber: exhibit?.propertyTagNumber ?? "",
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
    const isSeized = value.propertyType === PropertyTypeEnum.SEIZED;
    const input: CreateUpdateExhibitInput = {
      taskGuid: taskIdentifier,
      investigationGuid: investigationIdentifier,
      propertyType: value.propertyType,
      description: value.description,
      quantity: value.quantity ?? null,
      seizedFromFirstName: isSeized ? value.seizedFromFirstName : null,
      seizedFromLastName: isSeized ? value.seizedFromLastName : null,
      seizedFromAddress: isSeized ? value.seizedFromAddress : null,
      seizedFromPhoneNumber: isSeized ? value.seizedFromPhoneNumber : null,
      dateCollected: value.dateCollected,
      collectedAppUserGuidRef: value.collectedAppUserGuidRef,
      locationOfIntake: value.locationOfIntake?.trim() ? value.locationOfIntake : null,
      propertyTagNumber: value.propertyTagNumber,
      appUserIdentifier: "",
    };
    await createMutation.mutateAsync({ input });
    submit();
  };

  const handleUpdate = async (value: FormValues) => {
    const isSeized = value.propertyType === PropertyTypeEnum.SEIZED;
    const input: CreateUpdateExhibitInput = {
      exhibitGuid: exhibit!.exhibitGuid,
      taskGuid: taskIdentifier,
      investigationGuid: investigationIdentifier,
      propertyType: value.propertyType,
      description: value.description,
      quantity: value.quantity ?? null,
      seizedFromFirstName: isSeized ? value.seizedFromFirstName : null,
      seizedFromLastName: isSeized ? value.seizedFromLastName : null,
      seizedFromAddress: isSeized ? value.seizedFromAddress : null,
      seizedFromPhoneNumber: isSeized ? value.seizedFromPhoneNumber : null,
      dateCollected: value.dateCollected,
      collectedAppUserGuidRef: value.collectedAppUserGuidRef,
      locationOfIntake: value.locationOfIntake?.trim() ? value.locationOfIntake : null,
      propertyTagNumber: value.propertyTagNumber,
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
            {/* Property type */}
            <FormField
              form={form}
              name="propertyType"
              label="Property type"
              required
              validators={{ onChange: z.string().min(1, "Property type is required") }}
              render={(field) => (
                <CompSelect
                  id="exhibit-property-type-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={PROPERTY_TYPE_OPTIONS}
                  value={PROPERTY_TYPE_OPTIONS.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select property type"
                  isClearable={false}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                />
              )}
            />
            {/* Seized from — only shown and required when property type is Seized */}
            <form.Subscribe selector={(state) => state.values.propertyType}>
              {(propertyType) =>
                propertyType === PropertyTypeEnum.SEIZED ? (
                  <>
                    <p className="fw-bold mt-3 mb-1">Seized from</p>
                    <div className="bg-bc-brand-background-light-gray text-dark p-3 mb-3">
                      {/* First name */}
                      <FormField
                        form={form}
                        name="seizedFromFirstName"
                        label="First name"
                        required
                        validators={{ onChange: requiredWhenSeized("First name is required") }}
                        render={(field) => (
                          <CompInput
                            id="exhibit-seized-first-name"
                            divid="exhibit-seized-first-name-value"
                            type="input"
                            inputClass="comp-form-control"
                            error={field.state.meta.errors.map((error: any) => error.message || error).join(", ")}
                            onChange={(evt: any) => field.handleChange(evt.target.value)}
                            value={field.state.value}
                            placeholder="Enter first name"
                          />
                        )}
                      />

                      {/* Last name */}
                      <FormField
                        form={form}
                        name="seizedFromLastName"
                        label="Last name"
                        required
                        validators={{ onChange: requiredWhenSeized("Last name is required") }}
                        render={(field) => (
                          <CompInput
                            id="exhibit-seized-last-name"
                            divid="exhibit-seized-last-name-value"
                            type="input"
                            inputClass="comp-form-control"
                            error={field.state.meta.errors.map((error: any) => error.message || error).join(", ")}
                            onChange={(evt: any) => field.handleChange(evt.target.value)}
                            value={field.state.value}
                            placeholder="Enter last name"
                          />
                        )}
                      />

                      {/* Address */}
                      <FormField
                        form={form}
                        name="seizedFromAddress"
                        label="Address"
                        required
                        validators={{ onChange: requiredWhenSeized("Address is required") }}
                        render={(field) => (
                          <CompInput
                            id="exhibit-seized-address"
                            divid="exhibit-seized-address-value"
                            type="input"
                            inputClass="comp-form-control"
                            error={field.state.meta.errors.map((error: any) => error.message || error).join(", ")}
                            onChange={(evt: any) => field.handleChange(evt.target.value)}
                            value={field.state.value}
                            placeholder="Enter address"
                          />
                        )}
                      />

                      {/* Phone number */}
                      <FormField
                        form={form}
                        name="seizedFromPhoneNumber"
                        label="Phone number"
                        required
                        validators={{ onChange: requiredWhenSeized("Phone number is required") }}
                        render={(field) => (
                          <ValidationPhoneInput
                            className="comp-details-input"
                            value={field.state.value ?? ""}
                            onChange={(value: string) => field.handleChange(value || "")}
                            maxLength={14}
                            international={false}
                            id="exhibit-seized-phone-number"
                            errMsg={field.state.meta.errors?.[0]?.message || ""}
                          />
                        )}
                      />
                    </div>
                  </>
                ) : null
              }
            </form.Subscribe>
            {/* Description */}
            <FormField
              form={form}
              name="description"
              label="Item description"
              required
              validators={{ onChange: z.string().min(1, "Item description is required") }}
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

            {/* Quantity / Date-time of intake / Property tag number */}
            <Row className="my-3">
              <Col
                xs={12}
                md={3}
              >
                {/* Quantity */}
                <FormField
                  form={form}
                  name="quantity"
                  label="Quantity"
                  render={(field) => (
                    <CompInput
                      id="exhibit-quantity"
                      divid="exhibit-quantity-value"
                      type="input"
                      inputClass="comp-form-control"
                      onChange={(evt: any) => {
                        const raw = evt.target.value;
                        if (raw === "") {
                          field.handleChange(null);
                          return;
                        }
                        const parsed = Number(raw);
                        field.handleChange(Number.isInteger(parsed) ? parsed : field.state.value);
                      }}
                      value={field.state.value ?? ""}
                      placeholder="Enter quantity"
                    />
                  )}
                />
              </Col>

              <Col
                xs={12}
                md={5}
              >
                {/* Date/time of intake */}
                <FormField
                  form={form}
                  name="dateCollected"
                  label="Date/time of intake"
                  required
                  validators={{
                    onChange: z
                      .date()
                      .nullable()
                      .refine((val) => val !== null, { message: "Date/time of intake is required" })
                      .refine((val) => val === null || val <= new Date(), {
                        message: "Date/time of intake cannot be in the future",
                      }),
                  }}
                  render={(field) => (
                    <ValidationDatePicker
                      id="exhibit-date-collected"
                      classNamePrefix="comp-details-input"
                      className="comp-form-control comp-details-input"
                      selectedDate={field.state.value}
                      selectedTime={formatTimeForPicker(field.state.value)}
                      maxDate={new Date()}
                      showTimePicker={true}
                      nullableTime={true}
                      onChange={(date: Date | null, time: string | null) =>
                        field.handleChange(combineDateAndTime(date, time))
                      }
                      errMsg={field.state.meta.errors?.[0]?.message || ""}
                    />
                  )}
                />
              </Col>

              <Col
                xs={12}
                md={4}
              >
                {/* Property tag number */}
                <FormField
                  form={form}
                  name="propertyTagNumber"
                  label="Property tag number"
                  required
                  validators={{ onChange: z.string().min(1, "Property tag number is required") }}
                  render={(field) => (
                    <CompInput
                      id="exhibit-property-tag-number"
                      divid="exhibit-property-tag-number-value"
                      type="input"
                      inputClass="comp-form-control"
                      error={field.state.meta.errors.map((error: any) => error.message || error).join(", ")}
                      onChange={(evt: any) => field.handleChange(evt.target.value)}
                      value={field.state.value}
                      placeholder="Enter property tag number"
                    />
                  )}
                />
              </Col>
            </Row>

            {/* Location of intake */}
            <FormField
              form={form}
              name="locationOfIntake"
              label="Location of intake"
              render={(field) => (
                <CompInput
                  id="exhibit-location-of-intake"
                  divid="exhibit-location-of-intake-value"
                  type="input"
                  inputClass="comp-form-control"
                  onChange={(evt: any) => field.handleChange(evt.target.value)}
                  value={field.state.value}
                  placeholder="Enter location of intake"
                />
              )}
            />

            {/* Officer Collected */}
            <FormField
              form={form}
              name="collectedAppUserGuidRef"
              label="Officer"
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
