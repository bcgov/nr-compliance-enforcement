import { LegislationText } from "@/app/components/common/legislation-text";
import {
  convertLegislationToHierarchicalOptions,
  convertLegislationToOption,
  useLegislation,
  useLegislationSearchQuery,
} from "@/app/graphql/hooks/useLegislationSearchQuery";
import { parseUTCDateTimeToLocal } from "@/app/common/methods";
import { ContraventionForm } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-form";
import { getUserAgency } from "@/app/service/user-service";
import { LegislationType } from "@/app/types/app/legislation";
import { Contravention, InvestigationParty, Legislation } from "@/generated/graphql";
import { format } from "date-fns";
import { FC, useMemo } from "react";

function getPartyLabel(party: InvestigationParty): string {
  if (party.business) return party.business.name;
  if (party.person) return `${party.person.lastName}, ${party.person.firstName}`;
  return "Unknown Party";
}

// This function is used to wrap subection prefix values in parentheses if they aren't already
function wrapCitationForDisplay(citation: string | null | undefined): string {
  const raw = (citation ?? "").trim();
  if (!raw) return "";
  if (/^\([^)]+\)(\s*\([^)]+\))*$/.test(raw)) {
    return raw.replaceAll(/\s+/g, " ").trim();
  }
  return `(${raw})`;
}

// This function builds the subsection prefix for the citation.
// They can take various forms, from no prefix to a single parenthetical group to multiple groups.
// This reconstructs them
function buildSubsectionCitationPrefix(
  legislationWithAncestors: Legislation | null | undefined,
  sectionGuid: string,
  selected: Legislation | null,
): string {
  if (!selected || selected.legislationTypeCode === LegislationType.SECTION) return "";

  const ancestors = (legislationWithAncestors?.ancestors?.filter(Boolean) ?? []) as Legislation[];

  const displayCitation =
    (selected.citation ?? "").trim() || (selected.legislationTypeCode === LegislationType.SUBSECTION ? "1" : "");

  if (!sectionGuid || ancestors.length === 0) {
    return displayCitation ? wrapCitationForDisplay(displayCitation) : "";
  }

  const sectionIdx = ancestors.findIndex((a) => a.legislationGuid === sectionGuid);
  if (sectionIdx < 0) {
    return displayCitation ? wrapCitationForDisplay(displayCitation) : "";
  }

  // Ancestors with index < sectionIdx are strictly below the section toward the selected node
  const belowSectionTowardLeaf = ancestors.slice(0, sectionIdx).reverse();
  const pieces = belowSectionTowardLeaf.map((a) => wrapCitationForDisplay(a.citation ?? "")).filter(Boolean);

  // Add the citation for the currently selected node to the list of citation pieces,
  // but only if it isn't already the last one in the list. This prevents duplicate, consecutive citations.
  const selectedNode = wrapCitationForDisplay(displayCitation);
  if (selectedNode) {
    const last = pieces.at(-1);
    if (!last || last !== selectedNode) {
      pieces.push(selectedNode);
    }
  }

  return pieces.join(" ").trim();
}

function formatSelectedSubsectionLabel(
  legislationWithAncestors: Legislation | null | undefined,
  sectionGuid: string,
  selected: Legislation | null | undefined,
): {
  prefix: string;
  text: string;
  alt?: string;
} {
  if (!selected) return { prefix: "", text: "—" };

  const prefix = buildSubsectionCitationPrefix(legislationWithAncestors, sectionGuid, selected);

  const text = selected.legislationText ?? selected.sectionTitle ?? "—";
  const alt = selected.alternateText ?? undefined;
  return { prefix, text, alt };
}

type ContraventionReadOnlyPanelProps = {
  contravention: Contravention;
};

const ContraventionReadOnlyPanel = ({ contravention }: ContraventionReadOnlyPanelProps) => {
  const userAgency = getUserAgency();
  const contraventionGuid = contravention.legislationIdentifierRef;
  const contraventionDate = contravention.date ? parseUTCDateTimeToLocal(contravention.date, null) : null;
  const formattedContraventionDate = contraventionDate ? format(contraventionDate, "yyyy-MM-dd") : undefined;

  // Same as edit modal: useLegislation(includeAncestors: true) only to infer selected GUIDs.
  const legislationQuery = useLegislation(contraventionGuid, true);
  const legislation = legislationQuery?.data?.legislation;

  const selectedNodeQuery = useLegislation(contraventionGuid, false);
  const selectedNode = selectedNodeQuery?.data?.legislation ?? null;

  const { actGuid, regGuid, sectionGuid } = useMemo(() => {
    const empty = { actGuid: "", regGuid: "", sectionGuid: "" };
    if (!contraventionGuid || !legislation?.ancestors?.length) return empty;

    const ancestors = legislation.ancestors.filter(Boolean);
    const findAncestor = (type: string) =>
      ancestors.find((a) => a?.legislationTypeCode === type)?.legislationGuid ?? "";
    const act = findAncestor(LegislationType.ACT);
    const reg = findAncestor(LegislationType.REGULATION);
    const section =
      (legislation.legislationTypeCode === LegislationType.SCHEDULE ? contraventionGuid : "") ||
      findAncestor(LegislationType.SCHEDULE) ||
      (legislation.legislationTypeCode === LegislationType.SECTION ? contraventionGuid : "") ||
      findAncestor(LegislationType.SECTION);

    return { actGuid: act, regGuid: reg, sectionGuid: section };
  }, [legislation, contraventionGuid]);

  // Same as edit modal: use search queries to build labels, then pick selected item.
  const actsQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [LegislationType.ACT],
    offenseDate: formattedContraventionDate,
    enabled: !!formattedContraventionDate,
  });

  const regsQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [LegislationType.REGULATION],
    ancestorGuid: actGuid || "",
    enabled: !!actGuid,
  });

  const sectionsQuery = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [
      LegislationType.PART,
      LegislationType.DIVISION,
      LegislationType.SCHEDULE,
      LegislationType.SECTION,
    ],
    ancestorGuid: regGuid || actGuid,
    excludeRegulations: !!actGuid && !regGuid,
    enabled: !!regGuid || !!actGuid,
  });

  const actOptions = convertLegislationToOption(actsQuery.data?.legislations);
  const regOptions = convertLegislationToOption(regsQuery.data?.legislations);
  const secOptions = convertLegislationToHierarchicalOptions(sectionsQuery.data?.legislations, regGuid || actGuid);

  const actLabel = useMemo(() => actOptions.find((o) => o.value === actGuid)?.label ?? "—", [actOptions, actGuid]);
  const regulationLabel = useMemo(
    () => (regGuid ? (regOptions.find((o) => o.value === regGuid)?.label ?? "—") : null),
    [regOptions, regGuid],
  );
  const sectionLabel = useMemo(
    () => secOptions.find((o) => o.value === sectionGuid)?.label ?? "—",
    [secOptions, sectionGuid],
  );

  const subsection = useMemo(
    () => formatSelectedSubsectionLabel(legislation, sectionGuid, selectedNode),
    [legislation, sectionGuid, selectedNode],
  );

  const partyLine = useMemo(() => {
    const p = (contravention.investigationParty ?? []) as InvestigationParty[];
    if (!p.length) return "Unknown party";
    return p.map(getPartyLabel).join(", ");
  }, [contravention.investigationParty]);

  const hasRegulation = !!regGuid;
  const isLoading =
    legislationQuery.isLoading ||
    selectedNodeQuery.isLoading ||
    actsQuery.isLoading ||
    regsQuery.isLoading ||
    sectionsQuery.isLoading;

  return (
    <>
      <div className="border rounded bg-bc-brand-background-light-gray text-dark px-3 py-3 mb-4">
        <div className="text-muted small mb-1">Party</div>
        <div>{partyLine}</div>
      </div>

      <div className="mb-4">
        <div className="text-muted small mb-1">Act</div>
        <div>{isLoading ? <span className="text-muted">Loading…</span> : actLabel}</div>
      </div>

      {hasRegulation && (
        <div className="mb-4">
          <div className="text-muted small mb-1">Regulation</div>
          <div>{regulationLabel}</div>
        </div>
      )}

      <div className="mb-4">
        <div className="text-muted small mb-1">Section</div>
        <div>{isLoading ? <span className="text-muted">Loading…</span> : sectionLabel}</div>
      </div>

      <div className="mb-0">
        <div className="text-muted small mb-1">Subsection</div>
        <div>
          {isLoading ? (
            <span className="text-muted">Loading…</span>
          ) : (
            <span>
              {subsection.prefix ? `${subsection.prefix} ` : ""}
              <LegislationText>{subsection.text}</LegislationText>
              {subsection.alt && <div className="contravention-alternate-text">{subsection.alt}</div>}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

type ContraventionViewEditModalContentProps = {
  currentStep: number;
  investigationGuid: string;
  investigationParties: InvestigationParty[];
  contravention: Contravention;
  partyGuid?: string | null;
  handleChildDirtyChange: (index: number, isDirty: boolean) => void;
  onRequestValidate: (fn: (step: number) => Promise<boolean>) => void;
  onRequestSave: (fn: () => Promise<void>) => void;
  onRequestDelete: (fn: () => Promise<void>) => void;
  onClose: () => void;
  onIsSavingChange: (isSaving: boolean) => void;
};

export const ContraventionViewEditModalContent: FC<ContraventionViewEditModalContentProps> = ({
  currentStep,
  investigationGuid,
  investigationParties,
  contravention,
  partyGuid,
  handleChildDirtyChange,
  onRequestValidate,
  onRequestSave,
  onRequestDelete,
  onClose,
  onIsSavingChange,
}) => (
  <>
    <div className={currentStep === 0 ? "" : "d-none"}>
      <ContraventionReadOnlyPanel contravention={contravention} />
    </div>
    <div className={currentStep === 1 ? "" : "d-none"}>
      <ContraventionForm
        currentStep={0}
        activityGuid={investigationGuid}
        contravention={contravention}
        partyGuid={partyGuid ?? null}
        parties={investigationParties}
        onDirtyChange={handleChildDirtyChange}
        onRequestValidate={onRequestValidate}
        onRequestSave={onRequestSave}
        onRequestDelete={onRequestDelete}
        onIsSavingChange={onIsSavingChange}
        onClose={onClose}
      />
    </div>
  </>
);
