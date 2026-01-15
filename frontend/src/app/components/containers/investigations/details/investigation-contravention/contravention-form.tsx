import { getUserAgency } from "@/app/service/user-service";
import {
  Contravention,
  CreateUpdateContraventionInput,
  InspectionParty,
  InvestigationParty,
} from "@/generated/graphql";
import { useForm } from "@tanstack/react-form";
import { gql } from "graphql-request";
import { useEffect, useState } from "react";
import Option from "@apptypes/app/option";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import {
  convertLegislationToHierarchicalOptions,
  convertLegislationToOption,
  useLegislation,
  useLegislationSearchQuery,
} from "@/app/graphql/hooks/useLegislationSearchQuery";
import { indentByType, Legislation } from "@/app/types/app/legislation";
import { Button, Card, Table } from "react-bootstrap";
import { FormField } from "@/app/components/common/form-field";
import { CompSelect } from "@/app/components/common/comp-select";
import { ValidationMultiSelect } from "@/app/common/validation-multiselect";
import { CANCEL_CONFIRM } from "@/app/types/modal/modal-types";
import { openModal } from "@/app/store/reducers/app";
import { useAppDispatch } from "@/app/hooks/hooks";
import z from "zod";

interface ContraventionFormProps {
  activityGuid: string;
  onClose: () => void;
  contraventionNumber?: string;
  contravention?: Contravention;
  parties?: InvestigationParty[];
}

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

export const ContraventionForm = ({
  contravention,
  parties,
  activityGuid,
  onClose,
  contraventionNumber,
}: ContraventionFormProps) => {
  // Form Definition
  const form = useForm({
    defaultValues: {
      act: "",
      section: "",
    },
    onSubmit: async ({ value }) => {
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
        legislationReference: selectedSection ?? "",
      };

      if (isEditMode) {
        editContraventionMutation.mutate({
          contraventionGuid: contravention?.contraventionIdentifier,
          input: input,
        });
      } else {
        addContraventionMutation.mutate({ input: input });
      }
    },
  });

  // Selectors
  const userAgency = getUserAgency();

  // State
  const [act, setAct] = useState("");
  const [regulation, setRegulation] = useState("");
  const [section, setSection] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>();
  const [selectedParties, setSelectedParties] = useState<Option[]>([]);
  const [validationError, setValidationError] = useState<string>("");

  // Hooks
  const dispatch = useAppDispatch();
  const addContraventionMutation = useGraphQLMutation(ADD_CONTRAVENTION, {
    onSuccess: () => {
      ToggleSuccess("Contravention added successfully");
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      console.error("Error adding contravention:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to add contravention");
    },
  });

  const editContraventionMutation = useGraphQLMutation(UPDATE_CONTRAVENTION, {
    onSuccess: () => {
      ToggleSuccess("Contravention updated successfully");
      form.reset();
      onClose();
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
    legislationTypeCodes: [Legislation.PART, Legislation.DIVISION, Legislation.SCHEDULE, Legislation.SECTION],
    ancestorGuid: regulation || act,
    // When Act is selected but no regulation, exclude sections from child regulations
    excludeRegulations: !!act && !regulation,
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
      Legislation.TABLE,
    ],
    ancestorGuid: section,
    enabled: !!section,
  });

  const legislationQuery = useLegislation(contravention?.legislationIdentifierRef, true);

  // Data
  const isEditMode = !!contravention;
  const actOptions = convertLegislationToOption(actsQuery.data?.legislations);
  const regOptions = convertLegislationToOption(regulationsQuery.data?.legislations);
  // Use hierarchical options for sections with Parts/Divisions as disabled headers
  const secOptions = convertLegislationToHierarchicalOptions(sectionsQuery.data?.legislations, regulation || act);
  const legislationText = legislationTextQuery.data?.legislations
    ?.filter((item) => !!item.legislationText)
    .sort((a, b) => {
      if (a.legislationGuid === section) return -1;
      if (b.legislationGuid === section) return 1;
      // Sort by displayOrder for children
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    });

  const partyOptions: Option[] =
    parties
      ?.filter((p: InvestigationParty | InspectionParty) => p.partyAssociationRole === "PTYOFINTRST")
      .map((party: InvestigationParty | InspectionParty) => ({
        value: party.partyIdentifier,
        label: party.business ? party.business.name : `${party?.person?.lastName}, ${party?.person?.firstName}`,
      })) ?? [];

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

  // Manages save click
  const handleSubmit = async () => {
    await form.handleSubmit();
  };

  // Manages cancel action after modal is confirmed
  const handleCancel = async () => {
    form.reset();
    onClose();
  };

  // Manages cancel click
  const cancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: () => handleCancel(),
        },
      }),
    );
  };

  // Helper Function for returning correct value from Options array
  const findOptionByValue = (options: Option[], value: string) =>
    value ? options.find((opt) => opt.value === value) : null;

  // State Management for Legislation and Selected Legislation
  useEffect(() => {
    const legislation = legislationQuery?.data?.legislation;
    const ancestors = legislation?.ancestors;
    const contraventionId = contravention?.legislationIdentifierRef;

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
  }, [legislationQuery?.data, contravention?.legislationIdentifierRef]);

  // State Management for Parties
  useEffect(() => {
    const parties = contravention?.investigationParty;

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
  }, [contravention?.investigationParty]);

  // State Management for validation
  useEffect(() => {
    if (contravention) {
      // Set all form values
      form.setFieldValue("act", act);
      form.setFieldValue("section", section);
    }
  }, [contravention, act, section]);

  const handlePartyChange = async (options: Option[]) => {
    setSelectedParties(options);
  };

  return (
    <Card className="mb-3">
      <Card.Header className="comp-card-header">
        <div className="comp-card-header-title">
          <h5>{isEditMode ? `Edit contravention ${contraventionNumber}` : "Add contravention"}</h5>
        </div>
      </Card.Header>
      <Card.Body>
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
            validators={{
              onChange: z.string().min(1, "Act is required"),
              onSubmit: z.string().min(1, "Act is required"),
            }}
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
                required
                validators={{
                  onChange: z.string().min(1, "Section is required"),
                  onSubmit: z.string().min(1, "Section is required"),
                }}
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

                if (section.legislationTypeCode === Legislation.TABLE && section.legislationText) {
                  const lines = section.legislationText.split("\n").filter((line) => line.trim());
                  const rows = lines.map((line) => line.split("|").map((cell) => cell.trim()));
                  return (
                    <div
                      key={section.legislationGuid}
                      className={`contravention-text-segment ${indentClass}`}
                    >
                      <Table
                        bordered
                        size="sm"
                        className="legislation-table"
                      >
                        <thead>
                          <tr>
                            {rows[0]?.map((cell, i) => (
                              <th key={i}>{cell}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.slice(1).map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  );
                }

                // For subsections without explicit citation, show (1)
                const displayCitation =
                  section.citation || (section.legislationTypeCode === Legislation.SUBSECTION ? "1" : null);

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
                        {section.legislationTypeCode !== Legislation.SECTION && displayCitation && (
                          <>{`(${displayCitation})`} </>
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
        <div className="comp-details-form-buttons">
          <Button
            variant="outline-primary"
            id="add-contravention-cancel-button"
            title="Cancel"
            onClick={() => {
              cancelButtonClick();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            id="add-contravention-save-button"
            title="Save Add Contravention"
            onClick={() => {
              handleSubmit();
            }}
          >
            <i className="bi bi-check-circle"></i>
            <span>Save</span>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
