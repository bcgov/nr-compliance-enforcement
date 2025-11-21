import { FC, memo, useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { useForm } from "@tanstack/react-form";
import { FormField } from "@/app/components/common/form-field";
import { CompSelect } from "@/app/components/common/comp-select";
import { convertLegislationToOption, useLegislationSearchQuery } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { getUserAgency } from "@/app/service/user-service";
import { indentByType, Legislation } from "@/app/types/app/legislation";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";

const ADD_CONTRAVENTION = gql`
  mutation AddContraventionToInvestigation($investigationGuid: String!, $legislationReference: String!) {
    addContraventionToInvestigation(
      investigationGuid: $investigationGuid
      legislationReference: $legislationReference
    ) {
      investigationGuid
    }
  }
`;

const ModalLoading: FC = memo(() => (
  <div className="modal-loader">
    <div className="comp-overlay-content d-flex align-items-center justify-content-center">
      <Spinner
        animation="border"
        role="loading"
        id="modal-loader"
      />
    </div>
  </div>
));

type AddContraventionModalProps = {
  close: () => void;
  submit: () => void;
};

export const AddContraventionModal: FC<AddContraventionModalProps> = ({ close, submit }) => {
  // Form Definition
  const form = useForm({
    onSubmit: async () => {
      submit();
      close();
    },
  });

  // Selectors
  const modalData = useAppSelector(selectModalData);
  const userAgency = getUserAgency();
  const { title, activityGuid } = modalData;

  // State
  const [act, setAct] = useState("");
  const [regulation, setRegulation] = useState("");
  const [section, setSection] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>();

  // Hooks
  const addContraventionMutation = useGraphQLMutation(ADD_CONTRAVENTION, {
    onSuccess: () => {
      ToggleSuccess("Contravention added successfully");
    },
    onError: (error: any) => {
      console.error("Error adding party:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to add party");
    },
  });

  const actsQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [Legislation.ACT],
    enabled: true,
  });

  const regulationsQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [Legislation.REGULATION],
    ancestorGuid: act || "",
    enabled: !!act,
  });

  const sectionsQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [Legislation.SECTION],
    ancestorGuid: regulation || act,
    enabled: !!regulation || !!act,
  });

  const legislationTextQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [
      Legislation.SECTION,
      Legislation.SUBSECTION,
      Legislation.PARAGRAPH,
      Legislation.SUBPARAGRAPH,
    ],
    ancestorGuid: section,
    enabled: !!section,
  });

  // Data
  const actOptions = convertLegislationToOption(actsQuery.data?.legislation ?? []);
  const regOptions = convertLegislationToOption(regulationsQuery.data?.legislation ?? []);
  const secOptions = convertLegislationToOption(sectionsQuery.data?.legislation ?? []);
  const legislationText = legislationTextQuery.data?.legislation?.filter((section) => !!section.legislationText) ?? [];

  const isLoading =
    actsQuery.isLoading || regulationsQuery.isLoading || sectionsQuery.isLoading || legislationTextQuery.isLoading;

  const errorMessages = [actsQuery.error, regulationsQuery.error, sectionsQuery.error, legislationTextQuery.error]
    .filter(Boolean) // remove undefined/null
    .map((err) => (err as Error).message || String(err));

  const handleAddContravention = async () => {
    if (!selectedSection) {
      errorMessages.push("Please select a contravention to add.");
      return;
    }

    addContraventionMutation.mutate({ investigationGuid: activityGuid, legislationReference: selectedSection });

    submit();
    close();
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="modal-create-add-case">
        {isLoading && <ModalLoading />}
        <div
          className="comp-details-body"
          style={{
            visibility: isLoading ? "hidden" : "inherit",
            display: "inherit",
          }}
        >
          <div>
            <h4 className="contravention-modal-subtitle">Enter Contravention Details</h4>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FormField
              form={form}
              name="act"
              label="Act"
              required
              render={(field) => (
                <CompSelect
                  id="act-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={actOptions}
                  value={actOptions.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => {
                    const value = option?.value || "";
                    field.handleChange(value);
                    setAct(value);
                    // Reset dependent fields when act changes
                    setRegulation("");
                    setSection("");
                  }}
                  placeholder="Select act"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                />
              )}
            />

            {act && (
              <>
                <FormField
                  form={form}
                  name="regulation"
                  label="Regulation"
                  render={(field) => (
                    <CompSelect
                      id="regulation-select"
                      classNamePrefix="comp-select"
                      className="comp-details-input"
                      options={regOptions}
                      value={regOptions.find((opt) => opt.value === field.state.value)}
                      onChange={(option) => {
                        const value = option?.value || "";
                        field.handleChange(value);
                        setRegulation(value);
                        // Reset section when regulation changes
                        setSection("");
                      }}
                      placeholder="Select regulation"
                      isClearable={true}
                      showInactive={false}
                      enableValidation={true}
                      errorMessage={field.state.meta.errors?.[0]?.message || ""}
                    />
                  )}
                />

                <FormField
                  form={form}
                  name="section"
                  label="Section"
                  render={(field) => (
                    <CompSelect
                      id="section-select"
                      classNamePrefix="comp-select"
                      className="comp-details-input mb-4"
                      options={secOptions}
                      value={secOptions.find((opt) => opt.value === field.state.value)}
                      onChange={(option) => {
                        const value = option?.value || "";
                        field.handleChange(value);
                        setSection(value);
                      }}
                      placeholder="Select section"
                      isClearable={true}
                      showInactive={false}
                      enableValidation={true}
                      errorMessage={field.state.meta.errors?.[0]?.message || ""}
                    />
                  )}
                />
              </>
            )}

            {section && legislationText.length > 0 && (
              <>
                {legislationText.map((section) => {
                  const indentClass = indentByType[section.legislationTypeCode as keyof typeof indentByType];
                  return (
                    <button
                      key={section.legislationGuid}
                      type="button"
                      className={`contravention-section ${selectedSection === section.legislationGuid ? "selected" : ""}`}
                      onClick={() => setSelectedSection(section.legislationGuid as string)}
                    >
                      <div>
                        <p className={`mb-2 ${indentClass}`}>
                          {section.legislationTypeCode !== Legislation.SECTION && <>{section.citation}</>}{" "}
                          {section.legislationText}
                        </p>
                        {section.alternateText && (
                          <div className="contravention-alternate-text">{section.alternateText}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </form>
          {errorMessages.length > 0 && (
            <div>
              {errorMessages.map((msg) => (
                <div
                  key={msg}
                  className="error-message"
                >
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="comp-details-form-buttons">
          <Button
            variant="outline-primary"
            id="add-contravention-cancel-button"
            title="Cancel"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            id="add-contravention-save-button"
            title="Save Add Contravention"
            onClick={() => {
              handleAddContravention();
            }}
          >
            <i className="bi bi-check-circle"></i>
            <span>Add Contravention</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
