import { ContraventionForm } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-form";
import { ContraventionTable } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-table";
import { useAppDispatch } from "@/app/hooks/hooks";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { openModal } from "@/app/store/reducers/app";
import { MULTI_STEP_MODAL } from "@/app/types/modal/modal-types";
import { Contravention, EnforcementAction, Investigation, InvestigationParty } from "@/generated/graphql";
import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { PartyBadges } from "@/app/components/containers/parties/party-badges";
import { useInvestigationReadOnly } from "../../hooks/use-investigation-read-only";
import { EnforcementActionViewEditContent } from "./enforcement-action-view-edit-content";
import { useEnforcementActionAttachmentIds } from "./hooks/use-enforcement-action-attachment-ids";
import { getPartyName, isPartyProfileComplete } from "@/app/common/party-name";

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
  const navigate = useNavigate();
  const isReadOnly = useInvestigationReadOnly(investigationGuid);
  const enforcementActionsWithAttachments = useEnforcementActionAttachmentIds(investigationGuid);
  const contraventions = investigationData?.contraventions;
  const parties = (investigationData?.parties ?? []) as InvestigationParty[];

  const isPublishedParty = (party: InvestigationParty): boolean => {
    const invParty = party as InvestigationParty;
    if (invParty.person) {
      return !!invParty.person.personReference;
    }
    return !!invParty.partyReference;
  };

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
          deleteEntityLabel: "contravention",
          content: (
            currentStep: number,
            onRequestValidate: (fn: (step: number) => Promise<boolean>) => void,
            onRequestSave: (fn: () => Promise<void>) => void,
            onRequestDelete: (fn: () => Promise<void>) => void,
            onClose: () => void,
            onIsSavingChange: (isSaving: boolean) => void,
            // eslint-disable-next-line react/no-unstable-nested-components
          ) => (
            <ContraventionForm
              currentStep={currentStep}
              activityGuid={investigationGuid}
              contravention={contravention ?? undefined}
              partyGuid={partyGuid ?? null}
              parties={investigationData?.parties as InvestigationParty[]}
              discoveryDate={investigationData?.discoveryDate}
              investigationCommunity={investigationData?.community}
              onDirtyChange={handleChildDirtyChange}
              onRequestValidate={onRequestValidate}
              onRequestSave={onRequestSave}
              onRequestDelete={onRequestDelete}
              onIsSavingChange={onIsSavingChange}
              onClose={onClose}
            />
          ),
          handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  const onAddEnforcementAction = (contraventionId: string, partyGuid: string | null) => {
    const contravention = contraventions?.find((c) => c?.contraventionIdentifier === contraventionId);
    // No party at all for an unknown-party contravention - only the comment-only decisions
    // (Unfounded, Unresolved) are available for those, enforced inside the form itself.
    const party = partyGuid ? investigationData?.parties?.find((p) => p?.partyIdentifier === partyGuid) : undefined;
    if (!contravention || (partyGuid && !party)) return;

    dispatch(
      openModal({
        modalSize: "lg",
        modalType: MULTI_STEP_MODAL,
        data: {
          titles: ["Add decision"],
          totalSteps: 1,
          isEdit: false,
          content: (
            currentStep: number,
            onRequestValidate: (fn: (step: number) => Promise<boolean>) => void,
            onRequestSave: (fn: () => Promise<void>) => void,
            onRequestDelete: (fn: () => Promise<void>) => void,
            onClose: () => void,
            onIsSavingChange: (isSaving: boolean) => void,
            // eslint-disable-next-line react/no-unstable-nested-components
          ) => (
            <EnforcementActionViewEditContent
              currentStep={currentStep}
              investigationGuid={investigationGuid}
              contravention={contravention as Contravention}
              party={party as InvestigationParty | undefined}
              onRequestValidate={onRequestValidate}
              onRequestSave={onRequestSave}
              onRequestDelete={onRequestDelete}
              onClose={onClose}
              onIsSavingChange={onIsSavingChange}
              handleChildDirtyChange={handleChildDirtyChange}
            />
          ),
          handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  const onEditEnforcementAction = (enforcementActionId: string, contraventionId: string, partyGuid: string | null) => {
    const contravention = contraventions?.find((c) => c?.contraventionIdentifier === contraventionId);
    const party = partyGuid ? investigationData?.parties?.find((p) => p?.partyIdentifier === partyGuid) : undefined;
    const contraventionParty = contravention?.investigationParty?.find((p) =>
      partyGuid ? p?.partyIdentifier === partyGuid : !p?.partyIdentifier,
    );
    const enforcementAction = (contraventionParty?.enforcementActions as EnforcementAction[])?.find(
      (ea) => ea?.enforcementActionIdentifier === enforcementActionId,
    );
    if (!contravention || (partyGuid && !party) || !enforcementAction) return;

    dispatch(
      openModal({
        modalSize: "lg",
        modalType: MULTI_STEP_MODAL,
        data: {
          titles: ["Decision details", "Edit decision"],
          totalSteps: 2,
          isEdit: true,
          deleteFromStep: 1,
          skipValidateForSteps: [0],
          nextButtonLabel: "Edit",
          hidePreviousButton: true,
          isReadOnly,
          deleteEntityLabel: "decision",
          content: (
            currentStep: number,
            onRequestValidate: (fn: (step: number) => Promise<boolean>) => void,
            onRequestSave: (fn: () => Promise<void>) => void,
            onRequestDelete: (fn: () => Promise<void>) => void,
            onClose: () => void,
            onIsSavingChange: (isSaving: boolean) => void,
            // eslint-disable-next-line react/no-unstable-nested-components
          ) => (
            <EnforcementActionViewEditContent
              currentStep={currentStep}
              investigationGuid={investigationGuid}
              contravention={contravention as Contravention}
              party={party as InvestigationParty | undefined}
              enforcementAction={enforcementAction}
              isReadOnly={isReadOnly}
              onRequestValidate={onRequestValidate}
              onRequestSave={onRequestSave}
              onRequestDelete={onRequestDelete}
              onClose={onClose}
              onIsSavingChange={onIsSavingChange}
              handleChildDirtyChange={handleChildDirtyChange}
            />
          ),
          handleChildDirtyChange,
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
    const knownGroups = parties
      .filter((party) => party.partyAssociationRole === "PTYOFINTRST")
      .sort((a, b) => getPartyName(a).localeCompare(getPartyName(b)))
      .map((party) => {
        const existing = groupedByPartyGuid.get(party.partyIdentifier ?? null);
        const aliases = (party.aliases ?? [])
          .filter(Boolean)
          .map((a) => a!.name)
          .join(", ");
        return {
          partyName: party.business && aliases ? `${getPartyName(party)} (${aliases})` : getPartyName(party),
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
    <>
      <div className="row align-items-center mb-4">
        <div className="col">
          <h2 className="mb-0">Contraventions</h2>
        </div>
        <div className="col-auto">
          <Button
            id="details-screen-edit-button"
            variant="primary"
            size="sm"
            onClick={() => openContraventionModal()}
            disabled={isReadOnly}
          >
            <i className="bi bi-plus-circle me-1" /> Add contravention
          </Button>
        </div>
      </div>

      {knownGroups.map(({ partyName, contraventions: groupedContraventions, partyGuid }) => {
        const partyObj = parties.find((p) => p.partyIdentifier === partyGuid);
        const profileComplete = partyObj ? isPartyProfileComplete(partyObj) : false;
        const publishedParty = partyObj ? isPublishedParty(partyObj) : false;
        return (
          <div
            key={partyGuid ?? partyName}
            className="mb-4"
          >
            <div className="mb-2 d-flex align-items-center gap-2 investigation-party-name">
              <Button
                variant="link"
                className="p-0"
                onClick={() =>
                  navigate(`/investigation/${investigationGuid}/party/${partyGuid}`, {
                    state: { from: "contraventions" },
                  })
                }
              >
                <h5>{partyName}</h5>
              </Button>
              {!profileComplete && <PartyBadges isIncomplete={true} />}
              {publishedParty && <PartyBadges isPublished={true} />}
            </div>
            <div className="comp-data-container">
              <ContraventionTable
                contraventions={groupedContraventions}
                investigationGuid={investigationGuid}
                partyGuid={partyGuid}
                isReadOnly={isReadOnly}
                enforcementActionsWithAttachments={enforcementActionsWithAttachments}
                onAddEnforcementAction={(id) => onAddEnforcementAction(id, partyGuid)}
                onEdit={(id, partyGuid) => openContraventionModal(id, partyGuid)}
                onEditEnforcementAction={(eaId, contraventionId, pGuid) =>
                  onEditEnforcementAction(eaId, contraventionId, pGuid)
                }
              />
            </div>
          </div>
        );
      })}

      {unknownGroups.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 investigation-party-name">
            <h5 className="fw-bold text-body">Unknown party</h5>
          </div>
          <div className="comp-data-container">
            <ContraventionTable
              contraventions={unknownGroups.flatMap((g) => g.contraventions)}
              investigationGuid={investigationGuid}
              partyGuid={null}
              isReadOnly={isReadOnly}
              enforcementActionsWithAttachments={enforcementActionsWithAttachments}
              onAddEnforcementAction={(id, pGuid) => onAddEnforcementAction(id, pGuid)}
              onEdit={(id, pGuid) => openContraventionModal(id, pGuid)}
              onEditEnforcementAction={(eaId, contraventionId, pGuid) =>
                onEditEnforcementAction(eaId, contraventionId, pGuid)
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

function groupContraventionsByParty(
  contraventions: Contravention[] | null | undefined,
): { partyGuid: string | null; contraventions: Contravention[] }[] {
  if (!contraventions?.length) return [];

  const map = new Map<string | null, Contravention[]>();

  for (const contravention of contraventions) {
    const parties = contravention.investigationParty as InvestigationParty[] | undefined;

    if (parties?.length) {
      for (const party of parties) {
        const key = party.partyIdentifier || null;
        map.set(key, [...(map.get(key) ?? []), contravention]);
      }
    } else {
      map.set(null, [...(map.get(null) ?? []), contravention]);
    }
  }

  return Array.from(map.entries()).map(([partyGuid, contraventions]) => ({ partyGuid, contraventions }));
}
