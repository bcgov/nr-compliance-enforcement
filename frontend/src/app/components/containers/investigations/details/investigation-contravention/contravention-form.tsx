import { getUserAgency } from "@/app/service/user-service";
import {
  Contravention,
  CreateUpdateContraventionInput,
  InspectionParty,
  InvestigationParty,
  LegislationSource,
} from "@/generated/graphql";
import { useForm, useStore } from "@tanstack/react-form";
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
import { indentByType, LegislationType } from "@/app/types/app/legislation";
import { Button, Card } from "react-bootstrap";
import { FormField } from "@/app/components/common/form-field";
import { CompSelect } from "@/app/components/common/comp-select";
import { LegislationText } from "@/app/components/common/legislation-text";
import { LegislationTable } from "@/app/components/common/legislation-table";
import { ValidationMultiSelect } from "@/app/common/validation-multiselect";
import { CANCEL_CONFIRM } from "@/app/types/modal/modal-types";
import { openModal } from "@/app/store/reducers/app";
import { useAppDispatch } from "@/app/hooks/hooks";
import z from "zod";
import { useLegislationSources } from "@/app/graphql/hooks/useLegislationSourceQuery";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

interface ContraventionFormProps {
  activityGuid: string;
  onClose: () => void;
  contraventionNumber?: string;
  contravention?: Contravention;
  parties?: InvestigationParty[];
  onDirtyChange?: (index: number, isDirty: boolean) => void;
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

const getLegislationViewUrl = (source: LegislationSource | null, sourceUrl: string | null): URL | null => {
  if (!sourceUrl) return null;
  if (!source) return new URL(sourceUrl);
  const { sourceType } = source;
  if (sourceType === "BCLAWS" && sourceUrl.endsWith("/xml")) {
    return new URL(sourceUrl.slice(0, -4));
  }
  if (sourceType === "FEDERAL") {
    const regexPattern = /^https:\/\/laws-lois\.justice\.gc\.ca\/eng\/XML\/([A-Za-z0-9-]+)\.xml$/;
    const match = regexPattern.exec(sourceUrl);
    if (match) {
      const code = match[1].toLowerCase();
      return new URL(`https://laws-lois.justice.gc.ca/eng/acts/${code}/`);
    }
    return new URL(sourceUrl);
  }
  return new URL(sourceUrl);
};

const formatLegislationSourceUrl = (source: LegislationSource) => {
  const sourceUrl = source.sourceUrl ?? null;
  const url = getLegislationViewUrl(source, sourceUrl);
  if (!url) return null;

  const { sourceType, shortDescription } = source;
  const site = sourceType === "BCLAWS" ? "BC Laws" : "DoJ Canada";
  const name = shortDescription?.trim() || "legislation";
  return (
    <a
      href={url.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      View <i>{name}</i> on {site}
    </a>
  );
};

export const ContraventionForm = ({
  contravention,
  parties,
  activityGuid,
  onClose,
  onDirtyChange,
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

  const { markDirty, markClean } = useFormDirtyState(onDirtyChange);

  const isFormDirty = useStore(form.baseStore, (state) =>
    Object.values(state.fieldMetaBase).some((field) => field.isTouched),
  );

  useEffect(() => {
    if (isFormDirty) {
      markDirty();
    }
  }, [isFormDirty, markDirty]);

  // Selectors
  const userAgency = getUserAgency();

  // State
  const [act, setAct] = useState("");
  const [regulation, setRegulation] = useState("");
  const [section, setSection] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>();
  const [selectedParties, setSelectedParties] = useState<Option[]>([]);
  const [validationError, setValidationError] = useState<string>("");
  const [actSource, setActSource] = useState<LegislationSource | null>(null);
  const [regulationSource, setRegulationSource] = useState<LegislationSource | null>(null);

  // Fetch legislation sources
  const { data: legislationSources } = useLegislationSources();

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
    legislationTypeCodes: [LegislationType.ACT],
    enabled: true,
  });

  const regulationsQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [LegislationType.REGULATION],
    ancestorGuid: act || "",
    enabled: !!act,
  });

  const sectionsQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [
      LegislationType.PART,
      LegislationType.DIVISION,
      LegislationType.SCHEDULE,
      LegislationType.SECTION,
    ],
    ancestorGuid: regulation || act,
    // When Act is selected but no regulation, exclude sections from child regulations
    excludeRegulations: !!act && !regulation,
    enabled: !!regulation || !!act,
  });

  const legislationTextQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [
<<<<<<< HEAD
      Legislation.SCHEDULE,
      Legislation.DIVISION,
      Legislation.SECTION,
      Legislation.SUBSECTION,
      Legislation.PARAGRAPH,
      Legislation.SUBPARAGRAPH,
      Legislation.CLAUSE,
      Legislation.SUBCLAUSE,
      Legislation.DEFINITION,
      Legislation.TEXT,
      Legislation.TABLE,
=======
      LegislationType.SCHEDULE,
      LegislationType.DIVISION,
      LegislationType.SECTION,
      LegislationType.SUBSECTION,
      LegislationType.PARAGRAPH,
      LegislationType.SUBPARAGRAPH,
      LegislationType.CLAUSE,
      LegislationType.SUBCLAUSE,
      LegislationType.DEFINITION,
      LegislationType.TEXT,
      LegislationType.TABLE,
>>>>>>> release/2.18
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

  // Only filter to items with text or a section title, and DO NOT re-sort. Sorting by displayOrder
  // will group all items with the same displayOrder regardless of parent.
  const legislationText = legislationTextQuery.data?.legislations?.filter(
    (item) => !!item.legislationText || !!item.sectionTitle,
  );

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
    markClean();
    await form.handleSubmit();
  };

  // Manages cancel action after modal is confirmed
  const handleCancel = async () => {
    markClean();
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

    if (!legislation || !ancestors || !contraventionId) return;

    const findAncestor = (type: string) => ancestors.find((a) => a?.legislationTypeCode === type)?.legislationGuid;

    const actGuid = findAncestor("ACT");
    const regGuid = findAncestor("REG");

    // If the legislation itself is a schedule/section use it directly, otherwise find the ancestor
    const sectionGuid =
      (legislation.legislationTypeCode === "SCHED" ? contraventionId : null) ??
      findAncestor("SCHED") ??
      (legislation.legislationTypeCode === "SEC" ? contraventionId : null) ??
      findAncestor("SEC");

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
      form.setFieldMeta("act", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
      form.setFieldMeta("section", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
    }
  }, [contravention, act, section]);

  // Sync act source when act/sources load (for when entering edit mode)
  useEffect(() => {
    if (!act || !legislationSources || !actsQuery.data?.legislations) {
      if (!act) setActSource(null);
      return;
    }
    const actRecord = actsQuery.data?.legislations?.find((l) => l.legislationGuid === act);
    const legislationSourceGuid = actRecord?.legislationSourceGuid ?? null;
    const source = legislationSourceGuid
      ? legislationSources?.find((s) => s.legislationSourceGuid === legislationSourceGuid)
      : null;
    setActSource(source ?? null);
  }, [act, legislationSources, actsQuery.data?.legislations]);

  // Sync regulation source when regulation/sources load (for when entering edit mode)
  useEffect(() => {
    if (!regulation || !legislationSources || !regulationsQuery.data?.legislations) {
      if (!regulation) setRegulationSource(null);
      return;
    }
    const regRecord = regulationsQuery.data?.legislations?.find((l) => l.legislationGuid === regulation);
    const legislationSourceGuid = regRecord?.legislationSourceGuid ?? null;
    const source = legislationSourceGuid
      ? legislationSources?.find((s) => s.legislationSourceGuid === legislationSourceGuid)
      : null;
    setRegulationSource(source ?? null);
  }, [regulation, legislationSources, regulationsQuery.data?.legislations]);

  const handlePartyChange = async (options: Option[]) => {
    setSelectedParties(options);
  };

  const handleActLinkChange = (actGuid: string | null) => {
    if (!actGuid) {
      setActSource(null);
      return;
    }
    const actRecord = actsQuery.data?.legislations?.find((l) => l.legislationGuid === actGuid);
    const legislationSourceGuid = actRecord?.legislationSourceGuid ?? null;
    const source = legislationSourceGuid
      ? legislationSources?.find((s) => s.legislationSourceGuid === legislationSourceGuid)
      : null;
    setActSource(source ?? null);
  };

  const handleRegulationLinkChange = (regulationGuid: string | null) => {
    if (!regulationGuid) {
      setRegulationSource(null);
      return;
    }
    const regRecord = regulationsQuery.data?.legislations?.find((l) => l.legislationGuid === regulationGuid);
    const legislationSourceGuid = regRecord?.legislationSourceGuid ?? null;
    const source = legislationSourceGuid
      ? legislationSources?.find((s) => s.legislationSourceGuid === legislationSourceGuid)
      : null;
    setRegulationSource(source ?? null);
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
              <>
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
                    handleActLinkChange(value);
                    // Reset dependent fields when act changes
                    setRegulation("");
                    setSection("");
                    setSelectedSection("");
                    setRegulationSource(null);
                  }}
                  placeholder="Select act"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                />
                {actSource && <div className="mt-1">{formatLegislationSourceUrl(actSource)}</div>}
              </>
            )}
          />

          {act && (
            <>
              <FormField
                form={form}
                name="regulation"
                label="Regulation"
                render={(field) => (
                  <>
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
                        handleRegulationLinkChange(value || null);
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
                    {regulationSource && <div className="mt-1">{formatLegislationSourceUrl(regulationSource)}</div>}
                  </>
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

                // Schedules and Divisions render as non-clickable headers
                if (
<<<<<<< HEAD
                  section.legislationTypeCode === Legislation.SCHEDULE ||
                  section.legislationTypeCode === Legislation.DIVISION
=======
                  section.legislationTypeCode === LegislationType.SCHEDULE ||
                  section.legislationTypeCode === LegislationType.DIVISION
>>>>>>> release/2.18
                ) {
                  return (
                    <div
                      key={section.legislationGuid}
                      className="contravention-text-segment"
                    >
                      <p className={`mb-2 ${indentClass}`}>
                        <strong>{section.sectionTitle}</strong>
                      </p>
                    </div>
                  );
                }

<<<<<<< HEAD
                if (section.legislationTypeCode === Legislation.TEXT) {
=======
                if (section.legislationTypeCode === LegislationType.TEXT) {
>>>>>>> release/2.18
                  return (
                    <div
                      key={section.legislationGuid}
                      className="contravention-text-segment"
                    >
                      <p className={`mb-2 ${indentClass}`}>
                        <LegislationText>{section.legislationText}</LegislationText>
                      </p>
                    </div>
                  );
                }

                if (section.legislationTypeCode === LegislationType.TABLE && section.legislationText) {
                  return (
                    <div
                      key={section.legislationGuid}
                      className={`contravention-text-segment ${indentClass}`}
                    >
                      <LegislationTable html={section.legislationText} />
                    </div>
                  );
                }

                // For subsections without explicit citation, show (1)
                const displayCitation =
                  section.citation || (section.legislationTypeCode === LegislationType.SUBSECTION ? "1" : null);

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
                        {section.legislationTypeCode !== LegislationType.SECTION && displayCitation && (
                          <>{`(${displayCitation})`} </>
                        )}
                        <LegislationText>{section.legislationText || section.sectionTitle}</LegislationText>
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
