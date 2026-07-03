import { ContraventionForm } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-form";
import { ContraventionViewEditModalContent } from "./contravention-read-only-panel";
import { ContraventionTable } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-table";
import { useAppDispatch } from "@/app/hooks/hooks";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { openModal } from "@/app/store/reducers/app";
import { MULTI_STEP_MODAL } from "@/app/types/modal/modal-types";
import { Contravention, EnforcementAction, Investigation, InvestigationParty } from "@/generated/graphql";
import { FC, useMemo } from "react";
import { formatPhoneNumber } from "@/app/common/methods";
import { Button } from "react-bootstrap";
import { useInvestigationReadOnly } from "../../hooks/use-investigation-read-only";
import { EnforcementActionViewEditContent } from "./enforcement-action-view-edit-content";
import { useEnforcementActionAttachmentIds } from "./hooks/use-enforcement-action-attachment-ids";

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
  const isReadOnly = useInvestigationReadOnly(investigationGuid);
  const enforcementActionsWithAttachments = useEnforcementActionAttachmentIds(investigationGuid);
  const contraventions = investigationData?.contraventions;
  const parties = investigationData?.parties as InvestigationParty[];

  const isPartyProfileComplete = (party: InvestigationParty): boolean => {
    const primaryAddress = party.addresses?.find((addr) => addr?.isPrimary);
    if (party.person) {
      const rawDob = party.person?.dateOfBirth;
      const rawPhone = party.contactMethods?.find((m) => m?.typeCode === "PHONE")?.value;
      return !!primaryAddress && !!rawPhone && !!rawDob;
    } else {
      return !!primaryAddress;
    }
  };

  const isPublishedParty = (party: InvestigationParty): boolean => {
    const invParty = party as InvestigationParty;
    if (invParty.person) {
      return !!invParty.person.personReference;
    }
    return !!invParty.partyReference;
  };

  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning(onDirtyChange);

  const openViewContraventionModal = (contraventionId: string, partyGuid?: string | null) => {
    const contravention = contraventions?.find((c) => c?.contraventionIdentifier === contraventionId);
    if (!contravention) return;

    dispatch(
      openModal({
        modalSize: "lg",
        modalType: MULTI_STEP_MODAL,
        data: {
          titles: ["Contravention details", "Edit contravention"],
          totalSteps: 2,
          isEdit: true,
          deleteFromStep: 1,
          skipValidateForSteps: [0],
          nextButtonLabel: "Edit",
          hidePreviousButton: true,
          isReadOnly: isReadOnly,
          content: (
            currentStep: number,
            onRequestValidate: (fn: (step: number) => Promise<boolean>) => void,
            onRequestSave: (fn: () => Promise<void>) => void,
            onRequestDelete: (fn: () => Promise<void>) => void,
            onClose: () => void,
            onIsSavingChange: (isSaving: boolean) => void,
            // eslint-disable-next-line react/no-unstable-nested-components
          ) => (
            <ContraventionViewEditModalContent
              currentStep={currentStep}
              investigationGuid={investigationGuid}
              investigationParties={investigationData?.parties as InvestigationParty[]}
              contravention={contravention}
              partyGuid={partyGuid}
              isReadOnly={isReadOnly}
              handleChildDirtyChange={handleChildDirtyChange}
              onRequestValidate={onRequestValidate}
              onRequestSave={onRequestSave}
              onRequestDelete={onRequestDelete}
              onClose={onClose}
              onIsSavingChange={onIsSavingChange}
            />
          ),
          handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

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

  const onAddEnforcementAction = (contraventionId: string, partyGuid: string) => {
    const contravention = contraventions?.find((c) => c?.contraventionIdentifier === contraventionId);
    const party = investigationData?.parties?.find((p) => p?.partyIdentifier === partyGuid);
    if (!contravention || !party) return;

    dispatch(
      openModal({
        modalSize: "lg",
        modalType: MULTI_STEP_MODAL,
        data: {
          titles: ["Add enforcement action"],
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
              party={party as InvestigationParty}
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

  const onEditEnforcementAction = (enforcementActionId: string, contraventionId: string, partyGuid: string) => {
    const contravention = contraventions?.find((c) => c?.contraventionIdentifier === contraventionId);
    const party = investigationData?.parties?.find((p) => p?.partyIdentifier === partyGuid);
    const contraventionParty = contravention?.investigationParty?.find((p) => p?.partyIdentifier === partyGuid);
    const enforcementAction = (contraventionParty?.enforcementActions as EnforcementAction[])?.find(
      (ea) => ea?.enforcementActionIdentifier === enforcementActionId,
    );
    if (!contravention || !party || !enforcementAction) return;

    dispatch(
      openModal({
        modalSize: "lg",
        modalType: MULTI_STEP_MODAL,
        data: {
          titles: ["Enforcement action details", "Edit enforcement action"],
          totalSteps: 2,
          isEdit: true,
          deleteFromStep: 1,
          skipValidateForSteps: [0],
          nextButtonLabel: "Edit",
          hidePreviousButton: true,
          isReadOnly,
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
              party={party as InvestigationParty}
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
      .map((party) => {
        const existing = groupedByPartyGuid.get(party.partyIdentifier ?? null);
        const primaryAddress = party.addresses?.find((addr) => addr?.isPrimary);
        const rawPhone = party.contactMethods?.find((m) => m?.typeCode === "PHONE")?.value ?? "";
        const phone = formatPhoneNumber(rawPhone);
        const rawDob = party.person?.dateOfBirth ?? "";
        const dob = rawDob ? new Date(rawDob).toISOString().split("T")[0] : "";
        return {
          partyName: getPartyLabel(party),
          partyGuid: party.partyIdentifier ?? null,
          contraventions: existing?.contraventions ?? [],
          phone,
          dob,
          primaryAddress: primaryAddress
            ? {
                address: primaryAddress?.address,
                city: primaryAddress?.city,
                province: primaryAddress?.province,
                postalCode: primaryAddress?.postalCode,
              }
            : undefined,
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
            disabled={isReadOnly}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add contravention</span>
          </Button>
        </div>
      </div>

      {knownGroups.length > 0 && (
        <div className="row mb-4">
          <h3>Known / Partially-known parties of interest</h3>
        </div>
      )}
      {knownGroups.map(
        ({ partyName, contraventions: groupedContraventions, partyGuid, phone, dob, primaryAddress }) => {
          const partyObj = parties.find((p) => p.partyIdentifier === partyGuid);
          const profileComplete = partyObj ? isPartyProfileComplete(partyObj) : false;
          const publishedParty = partyObj ? isPublishedParty(partyObj) : false;
          return (
            <div
              key={partyName}
              className="mb-4"
            >
              <h5 className="mb-0 fw-bold">
                <i className={profileComplete ? "bi bi-check-circle pe-2" : "bi bi-plus-circle pe-2"}></i>
                {partyName} {groupedContraventions.length > 0 ? `(${groupedContraventions.length})` : ""}
                {!profileComplete && (
                  <span className="brown-font small ps-2">
                    <i className="bi bi-slash-circle-fill pe-1"></i>Incomplete
                  </span>
                )}
                {publishedParty && (
                  <span className="text-success small ps-2">
                    <i className="bi bi-check-circle-fill pe-1"></i>Published
                  </span>
                )}
              </h5>
              <span className="text-muted smaller-font">
                {[
                  dob,
                  primaryAddress
                    ? `${primaryAddress?.address} ${primaryAddress?.city} ${primaryAddress?.province} ${primaryAddress?.postalCode}`
                    : null,
                  phone,
                ]
                  .filter(Boolean)
                  .join(" | ")}
              </span>
              <div className="comp-data-container mt-1">
                <ContraventionTable
                  contraventions={groupedContraventions}
                  investigationGuid={investigationGuid}
                  partyGuid={partyGuid}
                  isReadOnly={isReadOnly}
                  enforcementActionsWithAttachments={enforcementActionsWithAttachments}
                  onView={(id, pGuid) => openViewContraventionModal(id, pGuid)}
                  onAddEnforcementAction={(id) => onAddEnforcementAction(id, partyGuid)}
                  onEdit={(id, partyGuid) => openContraventionModal(id, partyGuid)}
                  onEditEnforcementAction={(eaId, contraventionId, pGuid) =>
                    onEditEnforcementAction(eaId, contraventionId, pGuid)
                  }
                  isProfileComplete={profileComplete}
                />
              </div>
            </div>
          );
        },
      )}

      {(parties.length > 0 || unknownGroups.length > 0) && (
        <div className="mb-4">
          <h3 className="mb-3">Unknown parties of interest</h3>
          {unknownGroups.length > 0 && (
            <div className="comp-data-container">
              <ContraventionTable
                contraventions={unknownGroups.flatMap((g) => g.contraventions)}
                investigationGuid={investigationGuid}
                partyGuid={null}
                isReadOnly={isReadOnly}
                enforcementActionsWithAttachments={enforcementActionsWithAttachments}
                onView={(id, pGuid) => openViewContraventionModal(id, pGuid)}
                onAddEnforcementAction={(id, pGuid) => onAddEnforcementAction(id, pGuid)}
                onEdit={(id, pGuid) => openContraventionModal(id, pGuid)}
                onEditEnforcementAction={(eaId, contraventionId, pGuid) =>
                  onEditEnforcementAction(eaId, contraventionId, pGuid)
                }
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
