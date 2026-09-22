import { getPartyName } from "@/app/common/party-name";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectSpeciesCodeDropdown, selectWildlifeManagementUnitCodeDropdown } from "@/app/store/reducers/code-table";
import { Contravention, InvestigationParty } from "@/generated/graphql";
import Option from "@apptypes/app/option";
import { FC, ReactNode } from "react";

// Species, quantity and WMU are only recorded on animal related contraventions, so the list is
// empty for the rest. "Other" species shows the officer's description alongside the label.
const buildAnimalInformation = (
  contravention: Contravention | undefined,
  speciesCodes: Option[],
  wildlifeManagementUnitCodes: Option[],
): { label: string; value: string }[] => {
  if (!contravention?.speciesCode) return [];

  const speciesLabel =
    speciesCodes.find((option) => option.value === contravention.speciesCode)?.label ?? contravention.speciesCode;
  const entries = [
    {
      label: "Species",
      value:
        contravention.speciesCode === "OTHER" && contravention.speciesOtherText
          ? `${speciesLabel} (${contravention.speciesOtherText})`
          : speciesLabel,
    },
  ];

  if (contravention.quantity != null) {
    entries.push({ label: "Quantity", value: String(contravention.quantity) });
  }

  if (contravention.wildlifeManagementUnitCode) {
    entries.push({
      label: "Wildlife management unit",
      value:
        wildlifeManagementUnitCodes.find((option) => option.value === contravention.wildlifeManagementUnitCode)
          ?.label ?? contravention.wildlifeManagementUnitCode,
    });
  }

  return entries;
};

interface ContraventionSummaryProps {
  contravention: Contravention;
  party?: InvestigationParty;
  contraventionLabel: ReactNode;
  // Rendered above the summary, inside the box, for warnings that belong with it
  notice?: ReactNode;
}

export const ContraventionSummary: FC<ContraventionSummaryProps> = ({
  contravention,
  party,
  contraventionLabel,
  notice,
}) => {
  const speciesCodes = useAppSelector(selectSpeciesCodeDropdown);
  const wildlifeManagementUnitCodes = useAppSelector(selectWildlifeManagementUnitCodeDropdown);
  const animalInformation = buildAnimalInformation(contravention, speciesCodes, wildlifeManagementUnitCodes);

  return (
    <div className="border rounded bg-bc-brand-background-light-gray text-dark px-3 py-3 mb-4">
      {notice}
      <div className="text-muted small mb-1">Party</div>
      <div className="mb-2">{getPartyName(party)}</div>
      <div className="text-muted small mb-1">Contravention</div>
      <div>{contraventionLabel}</div>
      <div className="row">
        {animalInformation.map((entry) => (
          <div
            key={entry.label}
            className="col-12 col-lg-4"
          >
            <div className="text-muted small mb-1 mt-2">{entry.label}</div>
            <div>{entry.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
