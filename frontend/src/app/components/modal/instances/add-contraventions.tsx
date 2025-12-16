import { FC, memo, useEffect, useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { useForm } from "@tanstack/react-form";
import { FormField } from "@/app/components/common/form-field";
import { CompSelect } from "@/app/components/common/comp-select";
import {
  convertLegislationToOption,
  convertLegislationToHierarchicalOptions,
  useLegislation,
  useLegislationSearchQuery,
} from "@/app/graphql/hooks/useLegislationSearchQuery";
import { getUserAgency } from "@/app/service/user-service";
import { indentByType, Legislation } from "@/app/types/app/legislation";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import Option from "@apptypes/app/option";
import {
  Contravention,
  CreateUpdateContraventionInput,
  InspectionParty,
  InvestigationParty,
} from "@/generated/graphql";
import { ValidationMultiSelect } from "@/app/common/validation-multiselect";

const ADD_CONTRAVENTION = gql`
  mutation CreateContravention($input: CreateUpdateContraventionInput!) {
    createContravention(input: $input) {
      investigationGuid
    }
  }
`;

const UPDATE_CONTRAVENTION = gql`
  mutation UpdateContravention($contraventionGuid: String!, $input: CreateUpdateContraventionInput!) {
    updateContravention(contraventionGuid: $contraventionGuid, input: $input) {
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
  const {
    title,
    action,
    activityGuid,
    parties,
    existingContravention,
  }: {
    title: string;
    action: string;
    activityGuid: string;
    parties: InvestigationParty[];
    existingContravention?: Contravention;
  } = modalData;

  // State
  const [act, setAct] = useState("");
  const [regulation, setRegulation] = useState("");
  const [section, setSection] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>();
  const [selectedParties, setSelectedParties] = useState<Option[]>([]);
  const [validationError, setValidationError] = useState<string>("");

  // Hooks
  const addContraventionMutation = useGraphQLMutation(ADD_CONTRAVENTION, {
    onSuccess: () => {
      ToggleSuccess("Contravention added successfully");
    },
    onError: (error: any) => {
      console.error("Error adding contravention:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to add contravention");
    },
  });

  const editContraventionMutation = useGraphQLMutation(UPDATE_CONTRAVENTION, {
    onSuccess: () => {
      ToggleSuccess("Contravention updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating contravention:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to update contravention");
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
    legislationTypeCodes: [Legislation.PART, Legislation.DIVISION, Legislation.SECTION],
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
      Legislation.CLAUSE,
      Legislation.SUBCLAUSE,
      Legislation.DEFINITION,
      Legislation.TEXT,
    ],
    ancestorGuid: section,
    enabled: !!section,
  });

  const legislationQuery = useLegislation(existingContravention?.legislationIdentifierRef, true);

  // Data
  const actOptions = convertLegislationToOption(actsQuery.data?.legislations);
  const regOptions = convertLegislationToOption(regulationsQuery.data?.legislations);
  // Use hierarchical options for sections (with Parts/Divisions as disabled headers)
  const secOptions = convertLegislationToHierarchicalOptions(sectionsQuery.data?.legislations, regulation || act);
  const legislationText = legislationTextQuery.data?.legislations?.filter((section) => !!section.legislationText);

  const partyOptions: Option[] = parties
    ?.filter((p: InvestigationParty | InspectionParty) => p.partyAssociationRole === "PTYOFINTRST")
    .map((party: InvestigationParty | InspectionParty) => ({
      value: party.partyIdentifier,
      label: party.business ? party.business.name : `${party?.person?.lastName}, ${party?.person?.firstName}`,
    }));

  const isLoading =
    actsQuery.isLoading || regulationsQuery.isLoading || sectionsQuery.isLoading || legislationTextQuery.isLoading;

  const errorMessages = [
    actsQuery.error,
    regulationsQuery.error,
    sectionsQuery.error,
    legislationTextQuery.error,
    validationError,
  ]
    .filter(Boolean) // remove undefined/null
    .map((err) => (err as Error).message || String(err));

  // Functions

  // Manages the modal button click
  const handleAddEditContravention = async () => {
    // Clear previous validation error
    setValidationError("");

    if (!selectedSection) {
      setValidationError("Please select a contravention.");
      return;
    }

    const input: CreateUpdateContraventionInput = {
      investigationGuid: activityGuid,
      // Convert Option[] → string[]
      // - map each party to its value
      // - drop any parties that don't have a value
      // - avoid returning undefined by flattening to an empty array instead
      investigationPartyGuids: selectedParties?.flatMap((p) => (p.value ? [p.value] : [])),
      legislationReference: selectedSection,
    };

    if (action === "Add") {
      addContraventionMutation.mutate({ input: input });
    } else {
      editContraventionMutation.mutate({
        contraventionGuid: existingContravention?.contraventionIdentifier,
        input: input,
      });
    }

    submit();
    close();
  };

  // Helper Function for returning correct value from Options array
  const findOptionByValue = (options: Option[], value: string) =>
    value ? options.find((opt) => opt.value === value) : null;

  // State Management for Legislation and Selected Legislation
  useEffect(() => {
    const legislation = legislationQuery?.data?.legislation;
    const ancestors = legislation?.ancestors;
    const contraventionId = existingContravention?.legislationIdentifierRef;

    // Exit early until all required data is available
    if (!legislation || !ancestors || !contraventionId) {
      return;
    }

    // Find the ACT and REG ancestors (if present)
    const actGuid = ancestors.find((a) => a?.legislationTypeCode === "ACT")?.legislationGuid;

    const regGuid = ancestors.find((a) => a?.legislationTypeCode === "REG")?.legislationGuid;

    // Section handling:
    // - If the current legislation *is* a section, use the contravention's reference
    // - Otherwise, look up the SEC ancestor
    const sectionGuid =
      legislation.legislationTypeCode === "SEC"
        ? contraventionId
        : ancestors.find((a) => a?.legislationTypeCode === "SEC")?.legislationGuid;

    // Update State
    if (actGuid) setAct(actGuid);
    if (regGuid) setRegulation(regGuid);
    if (sectionGuid) setSection(sectionGuid);
    setSelectedSection(contraventionId);
  }, [legislationQuery?.data, existingContravention?.legislationIdentifierRef]);

  // State Management for Parties
  useEffect(() => {
    const parties = existingContravention?.investigationParty;

    // Exit early until parties are available
    if (!parties) return;

    const options: Option[] = parties
      // Remove any null entries coming from the GraphQL response
      .filter((party): party is NonNullable<typeof party> => party !== null)

      // Map remaining valid parties into <Option> objects for the UI
      .map((party) => ({
        value: party.partyIdentifier,
        label: party.business ? party.business.name : `${party.person?.lastName}, ${party.person?.firstName}`,
      }));

    // Sync local state once real data is available (no fake defaults)
    setSelectedParties(options);
  }, [existingContravention?.investigationParty]);

  const handlePartyChange = async (options: Option[]) => {
    setSelectedParties(options);
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
                  value={findOptionByValue(actOptions, act)}
                  onChange={(option) => {
                    const value = option?.value || "";
                    field.handleChange(value);
                    setAct(value);
                    // Reset dependent fields when act changes
                    setRegulation("");
                    setSection("");
                    setSelectedSection("");
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
                      value={findOptionByValue(regOptions, regulation)}
                      onChange={(option) => {
                        const value = option?.value || "";
                        field.handleChange(value);
                        setRegulation(value);
                        // Reset section when regulation changes
                        setSection("");
                        setSelectedSection("");
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
                      value={findOptionByValue(secOptions, section)}
                      onChange={(option) => {
                        const value = option?.value || "";
                        field.handleChange(value);
                        setSection(value);
                        setSelectedSection("");
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

            {section && legislationText && legislationText.length > 0 && (
              <>
                {legislationText.map((section) => {
                  const indentClass = indentByType[section.legislationTypeCode as keyof typeof indentByType];

                  if (section.legislationTypeCode === Legislation.TEXT) {
                    return (
                      <div
                        key={section.legislationGuid}
                        className="contravention-text-segment"
                      >
                        <p className={`mb-2 ${indentClass}`}>{section.legislationText}</p>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={section.legislationGuid}
                      type="button"
                      className={`contravention-section ${selectedSection === section.legislationGuid ? "selected" : ""}`}
                      onClick={() => {
                        setValidationError("");
                        setSelectedSection(section.legislationGuid as string);
                      }}
                    >
                      <div>
                        <p className={`mb-2 ${indentClass}`}>
                          {section.legislationTypeCode !== Legislation.SECTION && section.citation && (
                            <>{`(${section.citation})`} </>
                          )}
                          {section.legislationText}
                        </p>
                        {section.alternateText && (
                          <div className="contravention-alternate-text">{section.alternateText}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
                <div className="mt-3">
                  <FormField
                    form={form}
                    name="party"
                    label="Party"
                    render={(field) => (
                      <ValidationMultiSelect
                        id="party-select"
                        classNamePrefix="comp-select"
                        className="comp-details-input mt-3"
                        options={partyOptions}
                        values={selectedParties}
                        onChange={handlePartyChange}
                        placeholder="Select party"
                        isClearable={true}
                        errMsg={field.state.meta.errors?.[0]?.message || ""}
                      />
                    )}
                  />
                </div>
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
              handleAddEditContravention();
            }}
          >
            <i className="bi bi-check-circle"></i>
            <span>{action} contravention</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
