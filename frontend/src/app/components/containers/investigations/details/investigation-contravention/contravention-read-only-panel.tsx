import { useMemo } from "react";
import { LegislationText } from "@/app/components/common/legislation-text";
import { useLegislation } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { Contravention, InvestigationParty, Legislation } from "@/generated/graphql";

function getPartyLabel(party: InvestigationParty): string {
  if (party.business) return party.business.name;
  if (party.person) return `${party.person.lastName}, ${party.person.firstName}`;
  return "Unknown Party";
}

function actOrRegulationLabel(node: Legislation | null | undefined): string {
  if (!node) return "—";
  const text = node.fullCitation?.trim() || node.citation?.trim();
  return text || "—";
}

function legislationTextOnly(node: Legislation | null | undefined): string {
  if (!node) return "—";
  const text = node.sectionTitle?.trim() || node.alternateText?.trim() || node.legislationText?.trim();
  return text || "—";
}

function extractSectionAndSuffixFromFullCitation(fullCitation: string | null | undefined): {
  sectionNumber: string;
  suffix: string;
} {
  const text = fullCitation?.trim() ?? "";
  if (!text) return { sectionNumber: "", suffix: "" };

  // Examples:
  // - "Wildlife Act (RSBC 1996) s. 12 (2) (b)"
  // - "s. 12 (a)"
  // - "section 16.6"
  const re = /(s\.|ss\.|section)\s*([0-9A-Za-z.]+)\s*(.*)$/i;
  const match = re.exec(text);
  if (!match) return { sectionNumber: "", suffix: "" };

  const sectionNumber = (match[2] ?? "").trim();
  const tail = (match[3] ?? "").trim();

  // Keep citation-style groups like "(2)" "(b)" and drop act/version groups like "(RSBC 1996)".
  const groups = tail.match(/\([^()]+\)/g) ?? [];
  const filtered = groups.filter((g) => !g.slice(1, -1).includes(" "));

  return { sectionNumber, suffix: filtered.join(" ").trim() };
}

function extractSectionNumber(fullCitation: string | null | undefined, citation: string | null | undefined): string {
  const { sectionNumber } = extractSectionAndSuffixFromFullCitation(fullCitation);
  return sectionNumber || (citation?.trim() ?? "");
}

function formatSectionLabel(node: Legislation | null | undefined): string {
  if (!node) return "—";
  const num = extractSectionNumber(node.fullCitation, node.citation);
  const text = legislationTextOnly(node);
  if (num && text !== "—") return `${num}. ${text}`;
  return text !== "—" ? text : num || "—";
}

function formatSubsectionLabel(node: Legislation | null | undefined): string {
  if (!node) return "—";
  const { suffix } = extractSectionAndSuffixFromFullCitation(node.fullCitation);

  // Fallback when there is no suffix in the full citation
  const citation = (node.citation ?? "").trim();
  const fallbackId = citation
    ? citation.startsWith("(") && citation.endsWith(")")
      ? citation
      : /^[A-Za-z0-9]+$/.test(citation)
        ? `(${citation})`
        : citation
    : "";

  const id = suffix || fallbackId;
  const text = legislationTextOnly(node);
  if (id && text !== "—") return `${id} ${text}`;
  return text !== "—" ? text : id || "—";
}

type ContraventionReadOnlyPanelProps = {
  contravention: Contravention;
};

export const ContraventionReadOnlyPanel = ({ contravention }: ContraventionReadOnlyPanelProps) => {
  const legislationQuery = useLegislation(contravention.legislationIdentifierRef, true);
  const legislationData = legislationQuery?.data?.legislation;

  const partyLine = useMemo(() => {
    const p = (contravention.investigationParty ?? []) as InvestigationParty[];
    if (!p.length) return "Unknown party";
    return p.map(getPartyLabel).join(", ");
  }, [contravention.investigationParty]);

  const { actLabel, regulationLabel, sectionLabel, subsectionLabel, hasRegulation, legislationReady } = useMemo(() => {
    const empty = {
      actLabel: null as string | null,
      regulationLabel: null as string | null,
      sectionLabel: null as string | null,
      subsectionLabel: null as string | null,
      hasRegulation: false,
      legislationReady: false,
    };

    const legislation = legislationData;
    const contraventionId = contravention.legislationIdentifierRef;
    if (!contraventionId) return empty;

    if (!legislation) {
      return empty;
    }

    const ancestors = (legislation.ancestors?.filter(Boolean) ?? []) as Legislation[];
    const findAncestor = (type: string) => ancestors.find((a) => a?.legislationTypeCode === type);
    const act = findAncestor("ACT");
    const reg = findAncestor("REG");

    const sectionNode =
      (legislation.legislationTypeCode === "SCHED" ? legislation : null) ??
      findAncestor("SCHED") ??
      (legislation.legislationTypeCode === "SEC" ? legislation : null) ??
      findAncestor("SEC") ??
      null;

    return {
      actLabel: actOrRegulationLabel(act),
      regulationLabel: reg ? actOrRegulationLabel(reg) : null,
      sectionLabel: formatSectionLabel(sectionNode),
      subsectionLabel: formatSubsectionLabel(legislation),
      hasRegulation: !!reg,
      legislationReady: true,
    };
  }, [legislationData, contravention.legislationIdentifierRef]);

  const legislationLoading = legislationQuery.isLoading && !legislationReady;

  return (
    <>
      <div className="border rounded bg-bc-brand-background-light-gray text-dark px-3 py-3 mb-4">
        <div className="text-muted small mb-1">Party</div>
        <div>{partyLine}</div>
      </div>

      <div className="mb-4">
        <div className="text-muted small mb-1">Act</div>
        <div>
          {legislationLoading ? (
            <span className="text-muted">Loading…</span>
          ) : legislationReady ? (
            actLabel
          ) : (
            <span className="text-muted">—</span>
          )}
        </div>
      </div>

      {hasRegulation && (
        <div className="mb-4">
          <div className="text-muted small mb-1">Regulation</div>
          <div>{regulationLabel}</div>
        </div>
      )}

      <div className="mb-4">
        <div className="text-muted small mb-1">Section</div>
        <div>
          {legislationLoading ? (
            <span className="text-muted">Loading…</span>
          ) : legislationReady ? (
            sectionLabel
          ) : (
            <span className="text-muted">—</span>
          )}
        </div>
      </div>

      <div className="mb-0">
        <div className="text-muted small mb-1">Subsection</div>
        <div>
          {legislationLoading ? (
            <span className="text-muted">Loading…</span>
          ) : legislationReady ? (
            <LegislationText>{subsectionLabel}</LegislationText>
          ) : (
            <span className="text-muted">—</span>
          )}
        </div>
      </div>
    </>
  );
};
