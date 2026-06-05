import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { Contravention, EnforcementAction, InvestigationParty } from "@/generated/graphql";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { selectOfficers } from "@/app/store/reducers/officer";
import { fetchEnforcementActionAttachments } from "@/app/common/enforcement-action-attachment-utils";
import { EnforcementActionReadOnlyPanel } from "./enforcement-action-read-only-panel";
import { EnforcementActionForm } from "./enforcement-action-form";
import { LegislationText } from "@/app/components/common/legislation-text";
import { useLegislation } from "@/app/graphql/hooks/useLegislationSearchQuery";

interface EnforcementActionViewEditContentProps {
  currentStep: number;
  investigationGuid: string;
  contravention: Contravention;
  party: InvestigationParty;
  enforcementAction?: EnforcementAction;
  isReadOnly?: boolean;
  handleChildDirtyChange: (index: number, isDirty: boolean) => void;
  onRequestValidate: (fn: (step: number) => Promise<boolean>) => void;
  onRequestSave: (fn: () => Promise<void>) => void;
  onRequestDelete: (fn: () => Promise<void>) => void;
  onClose: () => void;
  onIsSavingChange: (isSaving: boolean) => void;
}

const ContraventionLabel: FC<{ legislationIdentifierRef: string }> = ({ legislationIdentifierRef }) => {
  const legislation = useLegislation(legislationIdentifierRef, false);
  const legislationData = legislation?.data?.legislation;
  if (!legislationData) return <span>Loading...</span>;
  const displayText = legislationData.alternateText ?? legislationData.legislationText;
  return (
    <>
      {legislationData.fullCitation} : <LegislationText>{displayText}</LegislationText>
    </>
  );
};

export const EnforcementActionViewEditContent: FC<EnforcementActionViewEditContentProps> = ({
  currentStep,
  investigationGuid,
  contravention,
  party,
  enforcementAction,
  isReadOnly,
  handleChildDirtyChange,
  onRequestValidate,
  onRequestSave,
  onRequestDelete,
  onClose,
  onIsSavingChange,
}) => {
  const eaId = enforcementAction?.enforcementActionIdentifier;

  const attachmentsQuery = useQuery({
    queryKey: ["enforcement-action-attachments", investigationGuid, eaId],
    queryFn: () => fetchEnforcementActionAttachments(investigationGuid, eaId),
    enabled: !!eaId,
  });
  const existingAttachments = attachmentsQuery.data ?? [];

  const areaCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AREA_CODES));
  const enforcementActionCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.ENFORCEMENT_ACTION_TYPE));
  const ticketOutcomeCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.TICKET_OUTCOME_TYPE));
  const officers = useAppSelector(selectOfficers);

  const communityLabel =
    areaCodes.find((c) => c.area === enforcementAction?.geoOrganizationUnitCode)?.areaName ?? "";

  const enforcementActionLabel =
    enforcementActionCodes.find(
      (c) => c.enforcementActionCode === enforcementAction?.enforcementActionCode?.enforcementActionCode,
    )?.shortDescription ?? "";

  const ticketOutcomeLabel =
    ticketOutcomeCodes.find((c) => c.ticketOutcomeCode === enforcementAction?.ticket?.ticketOutcomeCode)
      ?.shortDescription ?? "";

  const servingOfficer = officers?.find((o) => o.app_user_guid === enforcementAction?.appUserIdentifier);
  const servingOfficerLabel = servingOfficer ? `${servingOfficer.last_name}, ${servingOfficer.first_name}` : "";

  return (
    <>
      <div className={currentStep === 0 && enforcementAction ? "" : "d-none"}>
        {enforcementAction && (
          <EnforcementActionReadOnlyPanel
            enforcementAction={enforcementAction}
            party={party}
            contraventionLabel={
              <ContraventionLabel legislationIdentifierRef={contravention.legislationIdentifierRef} />
            }
            communityLabel={communityLabel}
            servingOfficerLabel={servingOfficerLabel}
            enforcementActionLabel={enforcementActionLabel}
            ticketOutcomeLabel={ticketOutcomeLabel}
            attachments={existingAttachments}
            isLoadingAttachments={attachmentsQuery.isLoading}
          />
        )}
      </div>
      {!isReadOnly && (
        <div className={currentStep === 1 || !enforcementAction ? "" : "d-none"}>
          <EnforcementActionForm
            investigationGuid={investigationGuid}
            party={party}
            contravention={contravention}
            enforcementAction={enforcementAction}
            existingAttachments={existingAttachments}
            onDirtyChange={handleChildDirtyChange}
            onRequestValidate={onRequestValidate}
            onRequestSave={onRequestSave}
            onRequestDelete={onRequestDelete}
            onIsSavingChange={onIsSavingChange}
            onClose={onClose}
          />
        </div>
      )}
    </>
  );
};
