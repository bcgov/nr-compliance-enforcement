import { ContraventionForm } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-form";
import { ContraventionTable } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-table";
import { useAppDispatch } from "@/app/hooks/hooks";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { openModal } from "@/app/store/reducers/app";
import { ADD_EDIT_ENFORCEMENT_ACTION, MULTI_STEP_MODAL } from "@/app/types/modal/modal-types";
import { Contravention, Investigation, InvestigationParty } from "@/generated/graphql";
import { FC, useMemo } from "react";
import { Button } from "react-bootstrap";

interface InvestigationContraventionProps {
  investigationGuid: string;
  investigationData?: Investigation;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

export const InvestigationContraventions: FC<InvestigationContraventionProps> = ({
  investigationGuid,
  investigationData,
  onDirtyChange,
}) => {
  const dispatch = useAppDispatch();
  const contraventions = investigationData?.contraventions;
  const parties = investigationData?.parties as InvestigationParty[];

  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning(onDirtyChange);

  const openContraventionModal = (contraventionId?: string, partyGuid?: string | null) => {
    const contravention = contraventionId
      ? contraventions?.find((c) => c?.contraventionIdentifier === contraventionId)
      : undefined;

    const isEdit = !!contravention;

    dispatch(
      openModal({
        modalSize: "lg",
        modalType: MULTI_STEP_MODAL,
        data: {
          titles: isEdit ? ["Edit contravention", "Edit party"] : ["Add contravention", "Add party"],
          totalSteps: isEdit ? 1 : 2,
          isEdit,
          content: (
            currentStep: number,
            onRequestValidate: (fn: (step: number) => Promise<boolean>) => void,
            onRequestSave: (fn: () => Promise<void>) => void,
            onRequestDelete: (fn: () => Promise<void>) => void,
            onClose: () => void,
            // eslint-disable-next-line react/no-unstable-nested-components
          ) => (
            <ContraventionForm
              currentStep={currentStep}
              activityGuid={investigationGuid}
              contravention={contravention ?? undefined}
              partyGuid={partyGuid ?? null}
              parties={investigationData?.parties as InvestigationParty[]}
              onDirtyChange={handleChildDirtyChange}
              onRequestValidate={onRequestValidate}
              onRequestSave={onRequestSave}
              onRequestDelete={onRequestDelete}
              onClose={onClose}
            />
          ),
          handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  const onAddEnforcementAction = (contraventionId: string, partyGuid: string) => {
    const contravention = contraventionId
      ? contraventions?.find((c) => c?.contraventionIdentifier === contraventionId)
      : undefined;

    const party = partyGuid ? investigationData?.parties?.find((p) => p?.partyIdentifier === partyGuid) : undefined;

    dispatch(
      openModal({
        modalType: ADD_EDIT_ENFORCEMENT_ACTION,
        modalSize: "lg",
        data: {
          contravention,
          party,
          onDirtyChange: handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  // Group contraventions by party name
  const allGroups = useMemo(() => {
    const grouped = groupContraventionsByParty(contraventions as Contravention[]);
    const groupedByPartyGuid = new Map(grouped.map((g) => [g.partyGuid, g]));
    // Order by parties of interest
    const knownGroups = parties.map((party) => {
      const existing = groupedByPartyGuid.get(party.partyIdentifier ?? null);
      return {
        partyName: getPartyLabel(party),
        partyGuid: party.partyIdentifier ?? null,
        contraventions: existing?.contraventions ?? [],
      };
    });
    // Unknown group always last
    const unknownGroups = groupedByPartyGuid.has(null)
      ? [
          {
            partyName: "Unknown Party",
            partyGuid: null,
            contraventions: groupedByPartyGuid.get(null)?.contraventions ?? [],
          },
        ]
      : [];

    return { knownGroups, unknownGroups };
  }, [contraventions, parties]);

  const { knownGroups, unknownGroups } = allGroups;

  return (
    <div className="comp-details-view">
      <div className="row">
        <div
          className={
            knownGroups.length > 0 || unknownGroups.length > 0
              ? "d-flex align-items-center justify-content-between my-2"
              : "col-12"
          }
        >
          <h2>Outcomes</h2>
          <Button
            variant="primary"
            size="sm"
            id="details-screen-edit-button"
            onClick={() => openContraventionModal()}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add contravention</span>
          </Button>
        </div>
      </div>

      {knownGroups.length > 0 && (
        <div className="row mb-4">
          <h3>Known parties</h3>
        </div>
      )}
      {knownGroups.map(({ partyName, contraventions: groupedContraventions, partyGuid }) => (
        <div
          key={partyName}
          className="mb-4"
        >
          <h5 className="mb-3 fw-bold">
            {partyName} {groupedContraventions.length > 0 ? `(${groupedContraventions.length})` : ""}
          </h5>
          <div className="comp-data-container">
            <ContraventionTable
              contraventions={groupedContraventions}
              investigationGuid={investigationGuid}
              partyGuid={partyGuid}
              onAddEnforcementAction={(id) => onAddEnforcementAction(id, partyGuid)}
              onEdit={(id, partyGuid) => openContraventionModal(id, partyGuid)}
            />
          </div>
        </div>
      ))}

      {(parties.length > 0 || unknownGroups.length > 0) && (
        <div className="mb-4">
          <h3 className="mb-3">Unknown parties</h3>
          {unknownGroups.length > 0 && (
            <div className="comp-data-container">
              <ContraventionTable
                contraventions={unknownGroups.flatMap((g) => g.contraventions)}
                investigationGuid={investigationGuid}
                partyGuid={null}
                onAddEnforcementAction={(id, pGuid) => onAddEnforcementAction(id, pGuid)}
                onEdit={(id, pGuid) => openContraventionModal(id, pGuid)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper
export function getPartyLabel(party: InvestigationParty): string {
  if (party.business) return party.business.name;
  if (party.person) return `${party.person.lastName}, ${party.person.firstName}`;
  return "Unknown parties";
}

function groupContraventionsByParty(
  contraventions: Contravention[] | null | undefined,
): { partyName: string; partyGuid: string | null; contraventions: Contravention[] }[] {
  if (!contraventions?.length) return [];

  const map = new Map<string, { partyGuid: string | null; contraventions: Contravention[] }>();

  for (const contravention of contraventions) {
    const parties = contravention.investigationParty as InvestigationParty[] | undefined;

    if (parties?.length) {
      for (const party of parties) {
        const key = getPartyLabel(party);
        const existing = map.get(key);
        map.set(key, {
          partyGuid: party.partyIdentifier ?? null,
          contraventions: [...(existing?.contraventions ?? []), contravention],
        });
      }
    } else {
      const key = "Unknown Party";
      const existing = map.get(key);
      map.set(key, {
        partyGuid: null,
        contraventions: [...(existing?.contraventions ?? []), contravention],
      });
    }
  }

  return Array.from(map.entries()).map(([partyName, { partyGuid, contraventions }]) => ({
    partyName,
    partyGuid,
    contraventions,
  }));
}
