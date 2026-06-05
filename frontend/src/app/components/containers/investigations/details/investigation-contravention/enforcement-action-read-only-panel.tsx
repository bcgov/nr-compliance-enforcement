import { FC } from "react";
import { format } from "date-fns";
import { EnforcementAction, InvestigationParty } from "@/generated/graphql";
import { getDisplayFilename } from "@/app/common/attachment-utils";
import { generateApiParameters, get } from "@/app/common/api";
import { useAppDispatch } from "@/app/hooks/hooks";
import { EnforcementActionAttachment } from "@/app/common/enforcement-action-attachment-utils";
import { getPartyLabel } from "@/app/components/containers/investigations/details/investigation-contravention";
import config from "@/config";

interface EnforcementActionReadOnlyPanelProps {
  enforcementAction: EnforcementAction;
  party: InvestigationParty;
  contraventionLabel: React.ReactNode;
  communityLabel: string;
  servingOfficerLabel: string;
  enforcementActionLabel: string;
  ticketOutcomeLabel?: string;
  attachments: EnforcementActionAttachment[];
  isLoadingAttachments: boolean;
}

const Field: FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-3">
    <div className="text-muted small mb-1">{label}</div>
    <div>{children}</div>
  </div>
);

export const EnforcementActionReadOnlyPanel: FC<EnforcementActionReadOnlyPanelProps> = ({
  enforcementAction,
  party,
  contraventionLabel,
  communityLabel,
  servingOfficerLabel,
  enforcementActionLabel,
  ticketOutcomeLabel,
  attachments,
  isLoadingAttachments,
}) => {
  const dispatch = useAppDispatch();
  const ticket = enforcementAction.ticket;

  const handleFileClick = async (e: React.MouseEvent<HTMLAnchorElement>, attachmentId: string) => {
    e.preventDefault();
    if (!attachmentId) return;
    const parameters = generateApiParameters(`${config.COMS_URL}/object/${attachmentId}?download=url`);
    const downloadUrl = await get<string>(dispatch, parameters);
    window.open(downloadUrl, "_blank");
  };

  return (
    <>
      <div className="border rounded bg-bc-brand-background-light-gray text-dark px-3 py-3 mb-4">
        <div className="text-muted small mb-1">Party</div>
        <div className="mb-2">{getPartyLabel(party)}</div>
        <div className="text-muted small mb-1">Contravention</div>
        <div>{contraventionLabel}</div>
      </div>

      <div className="row">
        <div className="col-6">
          <Field label="Date issued">
            {enforcementAction.dateIssued ? format(new Date(enforcementAction.dateIssued), "yyyy-MM-dd") : "—"}
          </Field>
        </div>
        <div className="col-6">
          <Field label="Community">{communityLabel || "—"}</Field>
        </div>
        <div className="col-6">
          <Field label="Serving officer">{servingOfficerLabel || "—"}</Field>
        </div>
        <div className="col-6">
          <Field label="Enforcement action">{enforcementActionLabel || "—"}</Field>
        </div>
        {ticket && (
          <>
            <div className="col-6">
              <Field label="Ticket amount">{ticket.ticketAmount != null ? `${ticket.ticketAmount}` : "—"}</Field>
            </div>
            <div className="col-6">
              <Field label="Ticket outcome">{ticketOutcomeLabel || "—"}</Field>
            </div>
            <div className="col-6">
              <Field label="Ticket number">{ticket.ticketNumber || "—"}</Field>
            </div>
          </>
        )}
      </div>

      <Field label="Attachments">
        {isLoadingAttachments ? (
          <span className="text-muted">Loading…</span>
        ) : attachments.length === 0 ? (
          <span className="text-muted">No attachments</span>
        ) : (
          <div className="d-flex flex-column gap-1">
            {attachments.map((a) => (
              <div
                key={a.id}
                className="d-flex align-items-center gap-2"
              >
                <i className="bi bi-paperclip" />
                <a
                  href={`${config.COMS_URL}/object/${a.id}`}
                  className="comp-cell-link"
                  onClick={(e) => handleFileClick(e, a.id ?? "")}
                  title={`Download ${getDisplayFilename(a.name)}`}
                >
                  {getDisplayFilename(a.name)}
                </a>
              </div>
            ))}
          </div>
        )}
      </Field>
    </>
  );
};
