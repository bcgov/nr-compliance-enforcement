import { FC } from "react";
import { format } from "date-fns";
import { Contravention, EnforcementAction, InvestigationParty } from "@/generated/graphql";
import { Attachment, MAX_ATTACHMENT_PREVIEWS } from "@/app/common/attachment-utils";
import {
  NON_EA_DECISION_CODES,
  CODE_WARNING,
  CODE_VIOLATION_TICKET,
  CODE_ADMINISTRATIVE_SANCTION,
  CODE_ORDER,
  CODE_RESTORATIVE_JUSTICE,
  CODE_COURT_PROSECUTION,
  CODE_ADMINISTRATIVE_PENALTY,
  COMMENT_DECISION_CODES,
} from "./enforcement-action-constants";
import AttachmentCarousel from "@/app/components/common/attachment-carousel";
import { ContraventionSummary } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-summary";

const formatDate = (value?: string | Date | null): string => (value ? format(new Date(value), "yyyy-MM-dd") : "—");
const formatYesNo = (value?: boolean | null): string => {
  if (value == null) return "—";
  return value ? "Yes" : "No";
};

interface DecisionDetailLabels {
  ticketType: string;
  sanctionType: string;
  sanctionStatus: string;
  orderType: string;
  orderStatus: string;
  courtProsecutionStatus: string;
  administrativePenaltyStatus: string;
}

interface EnforcementActionViewEditContentReadOnlyProps {
  enforcementAction: EnforcementAction;
  party?: InvestigationParty;
  contraventionLabel: React.ReactNode;
  servingOfficerLabel: string;
  issuingOfficerLabel: string;
  enforcementActionLabel: string;
  ticketOutcomeLabel?: string;
  decisionDetailLabels: DecisionDetailLabels;
  attachments: Attachment[];
  isLoadingAttachments: boolean;
  contravention: Contravention;
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
  servingOfficerLabel,
  issuingOfficerLabel,
  enforcementActionLabel,
  ticketOutcomeLabel,
  decisionDetailLabels,
  attachments,
  isLoadingAttachments,
  contravention,
}) => {
  const ticket = enforcementAction.ticket;
  const code = enforcementAction.enforcementActionCode?.enforcementActionCode ?? "";
  const isNonEADecision = NON_EA_DECISION_CODES.has(code);

  let decisionDetail: { label: string; value?: string } | null = null;

  switch (code) {
    case CODE_ADMINISTRATIVE_SANCTION:
      decisionDetail = {
        label: "Sanction type",
        value: decisionDetailLabels.sanctionType,
      };
      break;
    case CODE_ORDER:
      decisionDetail = {
        label: "Order type",
        value: decisionDetailLabels.orderType,
      };
      break;
    case CODE_VIOLATION_TICKET:
      decisionDetail = {
        label: "Ticket type",
        value: decisionDetailLabels.ticketType,
      };
      break;
  }

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
      <ContraventionSummary
        contravention={contravention}
        party={party}
        contraventionLabel={contraventionLabel}
      />

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
              <Field label="Decision">{enforcementActionLabel || "—"}</Field>
            </div>
            <div className="col-6">
              {decisionDetail ? <Field label={decisionDetail.label}>{decisionDetail.value || "—"}</Field> : null}
            </div>
            <div className="col-6">
              <Field label="Date issued">{formatDate(enforcementAction.dateIssued)}</Field>
            </div>
            <div className="col-6">
              <Field label="Issuing officer">{issuingOfficerLabel || "—"}</Field>
            </div>
            <div className="col-6">
              <Field label="Date served">{formatDate(enforcementAction.dateServed)}</Field>
            </div>
            <div className="col-6">
              <Field label="Serving officer">{servingOfficerLabel || "—"}</Field>
            </div>

            {code === CODE_WARNING && (
              <div className="col-6">
                <Field label="Warning number">{enforcementAction.warningNumber || "—"}</Field>
              </div>
            )}

            {code === CODE_VIOLATION_TICKET && ticket && (
              <>
                <div className="col-6">
                  <Field label="Ticket number">{ticket.ticketNumber || "—"}</Field>
                </div>
                <div className="col-6">
                  <Field label="Amount">{ticket.ticketAmount != null ? `${ticket.ticketAmount}` : "—"}</Field>
                </div>
                <div className="col-6">
                  <Field label="Status">{ticketOutcomeLabel || "—"}</Field>
                </div>
                <div className="col-6">
                  <Field label="Appeal hearing date">{formatDate(ticket.appealHearingDate)}</Field>
                </div>
                <div className="col-6">
                  <Field label="Notice of cancellation number">
                    {ticket.noticeOfCancellationNumber ? `${ticket.noticeOfCancellationNumber}` : "—"}
                  </Field>
                </div>
              </>
            )}

            {code === CODE_ADMINISTRATIVE_SANCTION && (
              <>
                <div className="col-6">
                  <Field label="Effective date">{formatDate(enforcementAction.effectiveDate)}</Field>
                </div>
                <div className="col-6">
                  <Field label="End date">{formatDate(enforcementAction.endDate)}</Field>
                </div>
                <div className="col-6">
                  <Field label="Status">{decisionDetailLabels.sanctionStatus || "—"}</Field>
                </div>
              </>
            )}

            {code === CODE_ORDER && (
              <>
                <div className="col-6">
                  <Field label="Remediation required">{formatYesNo(enforcementAction.remediationRequired)}</Field>
                </div>
                <div className="col-6">
                  <Field label="Appeal hearing date">{formatDate(enforcementAction.appealHearingDate)}</Field>
                </div>
                <div className="col-6">
                  <Field label="Status">{decisionDetailLabels.orderStatus || "—"}</Field>
                </div>
              </>
            )}

            {code === CODE_RESTORATIVE_JUSTICE && (
              <>
                <div className="col-6">
                  <Field label="Hearing date">{formatDate(enforcementAction.hearingDate)}</Field>
                </div>
                <div className="col-6">
                  <Field label="Decision date">{formatDate(enforcementAction.decisionDate)}</Field>
                </div>
                <div className="col-6">
                  <Field label="Remediation required">{formatYesNo(enforcementAction.remediationRequired)}</Field>
                </div>
              </>
            )}

            {code === CODE_COURT_PROSECUTION && (
              <>
                <div className="col-6">
                  <Field label="Approval">{formatYesNo(enforcementAction.approvalInd)}</Field>
                </div>
                <div className="col-6">
                  <Field label="Remediation required">{formatYesNo(enforcementAction.remediationRequired)}</Field>
                </div>
                <div className="col-6">
                  <Field label="Status">{decisionDetailLabels.courtProsecutionStatus || "—"}</Field>
                </div>
              </>
            )}

            {code === CODE_ADMINISTRATIVE_PENALTY && (
              <>
                <div className="col-6">
                  <Field label="Approval">{formatYesNo(enforcementAction.approvalInd)}</Field>
                </div>
                <div className="col-6">
                  <Field label="Remediation required">{formatYesNo(enforcementAction.remediationRequired)}</Field>
                </div>
                <div className="col-6">
                  <Field label="Status">{decisionDetailLabels.administrativePenaltyStatus || "—"}</Field>
                </div>
              </>
            )}

            {COMMENT_DECISION_CODES.has(code) && enforcementAction.comment && (
              <div className="col-12">
                <Field label="Comment">{enforcementAction.comment}</Field>
              </div>
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
