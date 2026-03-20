import { getUserAgency } from "@/app/service/user-service";
import { Contravention, LegislationSource } from "@/generated/graphql";
import { useForm, useStore } from "@tanstack/react-form";
import { useCallback, useEffect, useState } from "react";
import {
  convertLegislationToHierarchicalOptions,
  convertLegislationToOption,
  useLegislation,
  useLegislationSearchQuery,
} from "@/app/graphql/hooks/useLegislationSearchQuery";
import { indentByType, LegislationType } from "@/app/types/app/legislation";
import { FormField } from "@/app/components/common/form-field";
import { CompSelect } from "@/app/components/common/comp-select";
import { LegislationText } from "@/app/components/common/legislation-text";
import { LegislationTable } from "@/app/components/common/legislation-table";
import z from "zod";
import { useLegislationSources } from "@/app/graphql/hooks/useLegislationSourceQuery";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCommunityCodeDropdown } from "@/app/store/reducers/code-table";
import { format } from "date-fns";

export interface ContraventionDetailsFormValues {
  contraventionDate: string;
  communityCode: string;
  selectedSection: string;
}

interface ContraventionDetailsFormProps {
  contravention?: Contravention;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  onRequestValidate?: (validateForm: () => Promise<boolean>) => void;
  onRequestValues?: (getValues: () => ContraventionDetailsFormValues) => void;
}

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

export const ContraventionDetailsForm = ({
  contravention,
  onDirtyChange,
  onRequestValidate,
  onRequestValues,
}: ContraventionDetailsFormProps) => {
  const form = useForm({
    defaultValues: {
      act: "",
      section: "",
      contraventionDate: null as Date | null,
      communityCode: "",
      subsection: "",
    },
    onSubmit: async () => {},
  });

  const { markDirty } = useFormDirtyState(onDirtyChange);

  const isFormDirty = useStore(form.baseStore, (state) =>
    Object.values(state.fieldMetaBase).some((field) => field.isTouched),
  );

  const userAgency = getUserAgency();
  const communityCodes = useAppSelector(selectCommunityCodeDropdown);

  const [act, setAct] = useState("");
  const [regulation, setRegulation] = useState("");
  const [section, setSection] = useState("");
  const [actSource, setActSource] = useState<LegislationSource | null>(null);
  const [regulationSource, setRegulationSource] = useState<LegislationSource | null>(null);

  const contraventionDate = useStore(form.baseStore, (state) => state.values.contraventionDate);
  const formattedContraventionDate = contraventionDate ? format(contraventionDate, "yyyy-MM-dd") : undefined;

  const { data: legislationSources } = useLegislationSources();

  const actsQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [LegislationType.ACT],
    offenseDate: formattedContraventionDate,
    enabled: !!formattedContraventionDate,
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
    excludeRegulations: !!act && !regulation,
    enabled: !!regulation || !!act,
  });

  const legislationTextQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [
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
    ],
    ancestorGuid: section,
    enabled: !!section,
  });

  const legislationQuery = useLegislation(contravention?.legislationIdentifierRef, true);

  const actOptions = convertLegislationToOption(actsQuery.data?.legislations);
  const regOptions = convertLegislationToOption(regulationsQuery.data?.legislations);
  const secOptions = convertLegislationToHierarchicalOptions(sectionsQuery.data?.legislations, regulation || act);

  const findOptionByValue = (options: any[], value: string) =>
    value ? options.find((opt) => opt.value === value) : null;

  const legislationText = legislationTextQuery.data?.legislations?.filter(
    (item) => !!item.legislationText || !!item.sectionTitle,
  );

  const errorMessages = [actsQuery.error, regulationsQuery.error, sectionsQuery.error, legislationTextQuery.error]
    .filter(Boolean)
    .map((err) => (err as Error).message || String(err));

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

  // Expose validate to modal
  const handleValidate = useCallback(async (): Promise<boolean> => {
    const results = await form.validateAllFields("submit");

    const hasErrors = Object.values(results).some((fieldErrors) => fieldErrors && Object.keys(fieldErrors).length > 0);
    return !hasErrors;
  }, [form]);

  // Expose values to modal
  const getValues = useCallback(
    (): ContraventionDetailsFormValues => ({
      contraventionDate: formattedContraventionDate ?? "",
      communityCode: form.getFieldValue("communityCode"),
      selectedSection: form.getFieldValue("subsection"),
    }),
    [formattedContraventionDate, form],
  );

  // Return validation results to parent
  useEffect(() => {
    onRequestValidate?.(handleValidate);
  }, [onRequestValidate, handleValidate]);

  // Return values to parent
  useEffect(() => {
    onRequestValues?.(getValues);
  }, [onRequestValues, getValues]);

  // Edit mode - populate legislation fields
  useEffect(() => {
    const legislation = legislationQuery?.data?.legislation;
    const ancestors = legislation?.ancestors;
    const contraventionId = contravention?.legislationIdentifierRef;
    if (!legislation || !ancestors || !contraventionId) return;
    const findAncestor = (type: string) => ancestors.find((a) => a?.legislationTypeCode === type)?.legislationGuid;
    const actGuid = findAncestor("ACT");
    const regGuid = findAncestor("REG");
    const sectionGuid =
      (legislation.legislationTypeCode === "SCHED" ? contraventionId : null) ??
      findAncestor("SCHED") ??
      (legislation.legislationTypeCode === "SEC" ? contraventionId : null) ??
      findAncestor("SEC");
    if (actGuid) setAct(actGuid);
    if (regGuid) setRegulation(regGuid);
    if (sectionGuid) setSection(sectionGuid);
  }, [legislationQuery?.data, contravention?.legislationIdentifierRef]);

  // Edit mode - sync form field meta
  useEffect(() => {
    if (contravention) {
      form.setFieldValue("act", act);
      form.setFieldValue("section", section);
      form.setFieldMeta("act", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
      form.setFieldMeta("section", (meta) => ({ ...meta, isDirty: false, isTouched: false }));
    }
  }, [contravention, act, section]);

  // Sync act source
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

  // Sync regulation source
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

  // Mark form dirty on changes
  useEffect(() => {
    if (isFormDirty) {
      markDirty();
    }
  }, [isFormDirty, markDirty]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="row mb-3">
          <div className="col-6">
            <FormField
              form={form}
              name="contraventionDate"
              label="Date"
              required
              validators={{
                onChange: z
                  .date()
                  .nullable()
                  .refine((val) => val !== null, { message: "Date is required" }),
                onSubmit: z
                  .date()
                  .nullable()
                  .refine((val) => val !== null, { message: "Date is required" }),
              }}
              render={(field) => (
                <ValidationDatePicker
                  id="contravention-date"
                  classNamePrefix="comp-details-input"
                  className="comp-form-control comp-details-input"
                  selectedDate={field.state.value}
                  maxDate={new Date()}
                  onChange={(date: Date | undefined) => {
                    field.handleChange(date ?? null);
                    setAct("");
                    setRegulation("");
                    setSection("");
                  }}
                  errMsg={field.state.meta.errors?.[0]?.message || ""}
                />
              )}
            />
          </div>
          <div className="col-6">
            <FormField
              form={form}
              name="communityCode"
              label="Community"
              render={(field) => (
                <CompSelect
                  id="community-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={communityCodes}
                  value={communityCodes.find((opt) => opt.value === field.state.value) ?? null}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select community"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={false}
                />
              )}
            />
          </div>
        </div>

        {form.getFieldValue("contraventionDate") && (
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
                    setRegulation("");
                    setSection("");
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
        )}

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
                      setSection("");
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
                  className="comp-details-input mb-1"
                  options={secOptions}
                  value={findOptionByValue(secOptions, section)}
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
        {section && legislationText && legislationText.length > 0 && (
          <FormField
            form={form}
            name="subsection"
            label="Select subsection"
            required
            validators={{
              onSubmit: z.string().min(1, "Please select a subsection."),
            }}
            render={(field) => (
              <div className="contravention-subsection-box">
                {legislationText.map((item) => {
                  const indentClass = indentByType[item.legislationTypeCode as keyof typeof indentByType];

                  if (
                    item.legislationTypeCode === LegislationType.SCHEDULE ||
                    item.legislationTypeCode === LegislationType.DIVISION
                  ) {
                    return (
                      <div
                        key={item.legislationGuid}
                        className="contravention-text-segment"
                      >
                        <p className={`mb-2 ${indentClass}`}>
                          <strong>{item.sectionTitle}</strong>
                        </p>
                      </div>
                    );
                  }

                  if (item.legislationTypeCode === LegislationType.TEXT) {
                    return (
                      <div
                        key={item.legislationGuid}
                        className="contravention-text-segment"
                      >
                        <p className={`mb-2 ${indentClass}`}>
                          <LegislationText>{item.legislationText}</LegislationText>
                        </p>
                      </div>
                    );
                  }

                  if (item.legislationTypeCode === LegislationType.TABLE && item.legislationText) {
                    return (
                      <div
                        key={item.legislationGuid}
                        className={`contravention-text-segment ${indentClass}`}
                      >
                        {item.sectionTitle && (
                          <p className="mb-1">
                            <strong>{item.sectionTitle}</strong>
                          </p>
                        )}
                        <LegislationTable html={item.legislationText} />
                      </div>
                    );
                  }

                  const displayCitation =
                    item.citation || (item.legislationTypeCode === LegislationType.SUBSECTION ? "1" : null);

                  return (
                    <label
                      key={item.legislationGuid}
                      htmlFor={`section-${item.legislationGuid}`}
                      className={"d-flex align-items-start gap-2 contravention-section"}
                    >
                      <input
                        type="radio"
                        name="subsection"
                        id={`section-${item.legislationGuid}`}
                        checked={field.state.value === item.legislationGuid}
                        onChange={() => field.handleChange(item.legislationGuid as string)}
                        className="mt-1"
                      />
                      <span className={`mb-2 ${indentClass}`}>
                        {item.legislationTypeCode !== LegislationType.SECTION && displayCitation && (
                          <>{`(${displayCitation})`} </>
                        )}
                        <LegislationText>{item.legislationText || item.sectionTitle}</LegislationText>
                        {item.alternateText && <div className="contravention-alternate-text">{item.alternateText}</div>}
                      </span>
                    </label>
                  );
                })}
                {field.state.meta.errors?.[0]?.message && (
                  <div className="error-message mt-2">{field.state.meta.errors[0].message}</div>
                )}
              </div>
            )}
          />
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
    </>
  );
};
