import { FC } from "react";
import { format } from "date-fns";
import { EnforcementAction, InvestigationParty } from "@/generated/graphql";
import { Attachment, MAX_ATTACHMENT_PREVIEWS } from "@/app/common/attachment-utils";
import { getPartyName } from "@/app/common/party-name";
import { NON_EA_DECISION_CODES } from "./enforcement-action-constants";
import AttachmentCarousel from "@/app/components/common/attachment-carousel";

interface EnforcementActionViewEditContentReadOnlyProps {
  enforcementAction: EnforcementAction;
  party?: InvestigationParty;
  contraventionLabel: React.ReactNode;
  communityLabel: string;
  servingOfficerLabel: string;
  enforcementActionLabel: string;
  ticketOutcomeLabel?: string;
  attachments: Attachment[];
  isLoadingAttachments: boolean;
}

const Field: FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-3">
    <div className="text-muted small mb-1">{label}</div>
    <div>{children}</div>
  </div>
);

export const EnforcementActionViewEditContentReadOnly: FC<EnforcementActionViewEditContentReadOnlyProps> = ({
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
  const ticket = enforcementAction.ticket;
  const isNonEADecision = NON_EA_DECISION_CODES.has(
    enforcementAction.enforcementActionCode?.enforcementActionCode ?? "",
  );

  const attachmentContent =
    attachments.length === 0 ? (
      <span className="text-muted">No attachments</span>
    ) : (
      <AttachmentCarousel
        slides={attachments}
        showPreview={true}
        maxPreviews={MAX_ATTACHMENT_PREVIEWS}
        variant="comp-carousel-modal"
      />
    );
  return (
    <>
      <div className="border rounded bg-bc-brand-background-light-gray text-dark px-3 py-3 mb-4">
        <div className="text-muted small mb-1">Party</div>
        <div className="mb-2">{getPartyName(party)}</div>
        <div className="text-muted small mb-1">Contravention</div>
        <div>{contraventionLabel}</div>
      </div>

      {isNonEADecision ? (
        <div className="row">
          <div className="col-6">
            <Field label="Decision">{enforcementActionLabel || "—"}</Field>
          </div>
          {enforcementAction.comment && (
            <div className="col-12">
              <Field label="Comment">{enforcementAction.comment}</Field>
            </div>
          )}
        </div>
      ) : (
        <>
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
              <Field label="Decision">{enforcementActionLabel || "—"}</Field>
            </div>
            {ticket && (
              <>
                <div className="col-6">
                  <Field label="Ticket amount">{ticket.ticketAmount ? `${ticket.ticketAmount}` : "—"}</Field>
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
            {isLoadingAttachments ? <span className="text-muted">Loading…</span> : attachmentContent}
          </Field>
        </>
      )}
    </>
  );
};
