import { FC, memo, useState, useEffect, useMemo } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { useForm } from "@tanstack/react-form";
import { FormField } from "@/app/components/common/form-field";
import { CompSelect } from "@/app/components/common/comp-select";
import {
  convertLegislationToOption,
  useLegislationSearchQuery,
  useLegislationDirectChildren,
} from "@/app/graphql/hooks/useLegislationSearchQuery";
import { getUserAgency } from "@/app/service/user-service";
import { indentByType, Legislation, LegislationTypeLabels, RootLegislationTypes } from "@/app/types/app/legislation";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import Option from "@/app/types/app/option";

const ADD_CONTRAVENTION = gql`
  mutation CreateContravention($investigationGuid: String!, $legislationReference: String!) {
    createContravention(investigationGuid: $investigationGuid, legislationReference: $legislationReference) {
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

// Represents a selection at a level in the hierarchy
interface HierarchyLevel {
  typeCode: string;
  selectedGuid: string;
  options: Option[]; // Store the options available at this level
}

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

  // State - track the hierarchy of selections with their options
  const [hierarchyLevels, setHierarchyLevels] = useState<HierarchyLevel[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>();

  // Get the current parent GUID (last selection in hierarchy, or undefined for root)
  const currentParentGuid = useMemo(() => {
    if (hierarchyLevels.length === 0) return undefined;
    return hierarchyLevels[hierarchyLevels.length - 1].selectedGuid;
  }, [hierarchyLevels]);

  // Hooks
  const addContraventionMutation = useGraphQLMutation(ADD_CONTRAVENTION, {
    onSuccess: () => {
      ToggleSuccess("Contravention added successfully");
    },
    onError: (error: any) => {
      console.error("Error adding contravention:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to add contravention");
    },
  });

  // For root document selection (Act, Regulation, or Bylaw)
  const rootDocumentsQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: RootLegislationTypes,
    enabled: true,
  });

  // Query for direct children of the current selection
  const childrenQuery = useLegislationDirectChildren({
    agencyCode: userAgency,
    parentGuid: currentParentGuid ?? "",
    enabled: !!currentParentGuid,
  });

  // Query for legislation text when we have a section selected
  const lastSelection = hierarchyLevels[hierarchyLevels.length - 1];
  const showLegislationText =
    lastSelection &&
    (lastSelection.typeCode === "SEC" ||
      lastSelection.typeCode === "SUBSEC" ||
      lastSelection.typeCode === "PAR" ||
      lastSelection.typeCode === "SUBPAR" ||
      lastSelection.typeCode === "DEF");

  const legislationTextQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [
      Legislation.SECTION,
      Legislation.SUBSECTION,
      Legislation.PARAGRAPH,
      Legislation.SUBPARAGRAPH,
      Legislation.DEFINITION,
    ],
    ancestorGuid: currentParentGuid,
    enabled: showLegislationText,
  });

  // Data - root document options with type info
  const rootDocumentOptions = useMemo(() => {
    const docs = rootDocumentsQuery.data?.legislations ?? [];
    return docs.map((doc) => ({
      label: doc.sectionTitle ?? doc.legislationText ?? "",
      value: doc.legislationGuid ?? "",
      typeCode: doc.legislationTypeCode ?? "",
    }));
  }, [rootDocumentsQuery.data?.legislations]);

  const legislationText = legislationTextQuery.data?.legislations?.filter((section) => !!section.legislationText) ?? [];

  // Group children by type for the next level dropdown
  const nextLevelOptions = useMemo(() => {
    const children = childrenQuery.data?.legislationDirectChildren ?? [];
    if (children.length === 0) return [];

    // Convert to options with type info
    return children.map((child) => ({
      label: child.sectionTitle ?? child.citation ?? child.legislationText ?? "",
      value: child.legislationGuid ?? "",
      typeCode: child.legislationTypeCode ?? "",
    }));
  }, [childrenQuery.data?.legislationDirectChildren]);

  // Get the type label for the next level (if there are options)
  const nextLevelTypeCode = nextLevelOptions.length > 0 ? nextLevelOptions[0].typeCode : null;
  const nextLevelLabel = nextLevelTypeCode ? LegislationTypeLabels[nextLevelTypeCode] || nextLevelTypeCode : "";

  const isLoading = rootDocumentsQuery.isLoading || childrenQuery.isLoading || legislationTextQuery.isLoading;

  const errorMessages = [rootDocumentsQuery.error, childrenQuery.error, legislationTextQuery.error]
    .filter(Boolean)
    .map((err) => (err as Error).message || String(err));

  // Handle root document selection (Act/Regulation/Bylaw at level 0)
  const handleRootSelection = (option: (Option & { typeCode?: string }) | null) => {
    if (option?.value) {
      setHierarchyLevels([
        {
          typeCode: option.typeCode ?? Legislation.ACT,
          selectedGuid: option.value,
          options: rootDocumentOptions,
        },
      ]);
    } else {
      setHierarchyLevels([]);
    }
    setSelectedSection(undefined);
  };

  // Handle selection at a deeper level
  const handleLevelSelection = (levelIndex: number, option: Option | null, typeCode: string, options: Option[]) => {
    setHierarchyLevels((prev) => {
      // Keep levels up to and including the current level
      const newLevels = prev.slice(0, levelIndex);

      if (option?.value) {
        newLevels.push({
          typeCode,
          selectedGuid: option.value,
          options,
        });
      }

      return newLevels;
    });
    setSelectedSection(undefined);
  };

  const handleAddContravention = async () => {
    if (!selectedSection) {
      ToggleError("Please select a contravention to add.");
      return;
    }

    addContraventionMutation.mutate({ investigationGuid: activityGuid, legislationReference: selectedSection });

    submit();
    close();
  };

  // Get the selected value for root document dropdown
  const selectedRootDocument = hierarchyLevels.length > 0 ? hierarchyLevels[0].selectedGuid : undefined;

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
            {/* Level 0: Root document selection (Act/Regulation/Bylaw) */}
            <FormField
              form={form}
              name="rootDocument"
              label="Act / Regulation / Bylaw"
              required
              render={(field) => (
                <CompSelect
                  id="root-document-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={rootDocumentOptions}
                  value={rootDocumentOptions.find((opt) => opt.value === selectedRootDocument) ?? null}
                  onChange={(option) => {
                    field.handleChange(option?.value || "");
                    handleRootSelection(option);
                  }}
                  placeholder="Select act, regulation, or bylaw"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                />
              )}
            />

            {/* Render dropdowns for each level in the hierarchy (after Act) */}
            {hierarchyLevels.slice(1).map((level, idx) => {
              const levelIndex = idx + 1; // +1 because we sliced off Act
              const typeLabel = LegislationTypeLabels[level.typeCode] || level.typeCode;

              return (
                <FormField
                  key={`level-${levelIndex}-${level.typeCode}`}
                  form={form}
                  name={`level-${levelIndex}`}
                  label={typeLabel}
                  render={(field) => (
                    <CompSelect
                      id={`${level.typeCode}-select-${levelIndex}`}
                      classNamePrefix="comp-select"
                      className="comp-details-input"
                      options={level.options}
                      value={level.options.find((opt) => opt.value === level.selectedGuid) ?? null}
                      onChange={(option) => {
                        field.handleChange(option?.value || "");
                        handleLevelSelection(levelIndex, option, level.typeCode, level.options);
                      }}
                      placeholder={`Select ${typeLabel.toLowerCase()}`}
                      isClearable={true}
                      showInactive={false}
                      enableValidation={true}
                      errorMessage={field.state.meta.errors?.[0]?.message || ""}
                    />
                  )}
                />
              );
            })}

            {/* Render next level dropdown if there are options */}
            {hierarchyLevels.length > 0 && nextLevelOptions.length > 0 && !showLegislationText && (
              <FormField
                form={form}
                name={`level-${hierarchyLevels.length}`}
                label={nextLevelLabel}
                render={(field) => (
                  <CompSelect
                    id={`${nextLevelTypeCode}-select-${hierarchyLevels.length}`}
                    classNamePrefix="comp-select"
                    className="comp-details-input"
                    options={nextLevelOptions}
                    value={null}
                    onChange={(option) => {
                      field.handleChange(option?.value || "");
                      if (option?.value && nextLevelTypeCode) {
                        handleLevelSelection(hierarchyLevels.length, option, nextLevelTypeCode, nextLevelOptions);
                      }
                    }}
                    placeholder={`Select ${nextLevelLabel.toLowerCase()}`}
                    isClearable={true}
                    showInactive={false}
                    enableValidation={true}
                    errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  />
                )}
              />
            )}

            {/* Show legislation text for selection when at section level */}
            {showLegislationText && legislationText.length > 0 && (
              <div className="mt-4">
                <label className="form-label">Select Contravention</label>
                {legislationText.map((section) => {
                  const indentClass = indentByType[section.legislationTypeCode as keyof typeof indentByType] ?? "";
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
              </div>
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
