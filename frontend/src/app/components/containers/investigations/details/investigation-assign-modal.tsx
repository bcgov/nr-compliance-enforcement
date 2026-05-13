import { FC, useEffect, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { CompSelect } from "@/app/components/common/comp-select";
import { RootState } from "@/app/store/store";
import { useSelector } from "react-redux";
import Option from "@apptypes/app/option";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { AppUser } from "@/app/types/app/app_user/app_user";
import { FormField } from "@/app/components/common/form-field";
import z from "zod";
import { useStore } from "@tanstack/react-form";

interface InvestigationAssignModalProps {
  form: any;
  show: boolean;
  onHide: () => void;
  investigationLeadAgency: string;
  isSaving: boolean;
}

export const InvestigationAssignModal: FC<InvestigationAssignModalProps> = ({
  form,
  show,
  onHide,
  investigationLeadAgency,
  isSaving,
}) => {
  const officersInAgencyList = useSelector((state: RootState) =>
    selectOfficersByAgency(state, investigationLeadAgency),
  );
  const assignableOfficers: Option[] =
    officersInAgencyList && officersInAgencyList.length > 0
      ? officersInAgencyList.map((officer: AppUser) => ({
          value: officer.app_user_guid,
          label: `${officer.last_name}, ${officer.first_name}`,
        }))
      : [];

  const isDirty = useStore(form.store, (state: any) => state.isDirty);

  const handleClose = () => {
    if (isDirty) {
      const confirmed = globalThis.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmed) return;
    }
    onHide();
  };

  const handleSave = useCallback(() => {
    form.handleSubmit();
  }, [form]);

  useEffect(() => {
    if (show) {
      form.reset();
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header
        closeButton
        className="pb-0"
      >
        <Modal.Title>Reassign roles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={form.handleSubmit}>
          <fieldset>
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
                />
              )}
            />
          </fieldset>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={handleClose}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
