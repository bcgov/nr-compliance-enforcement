import { FC } from "react";
import { format } from "date-fns";
import { EnforcementAction, InvestigationParty } from "@/generated/graphql";
import { getDisplayFilename } from "@/app/common/attachment-utils";
import { generateApiParameters, get } from "@/app/common/api";
import { useAppDispatch } from "@/app/hooks/hooks";
import { EnforcementActionAttachment } from "@/app/common/enforcement-action-attachment-utils";
import config from "@/config";
import { getPartyName } from "@/app/common/party-name";
import { NON_EA_DECISION_CODES } from "./enforcement-action-constants";

const CODE_WARNING = "WARN";
const CODE_VIOLATION_TICKET = "FDVT";
const CODE_ADMINISTRATIVE_SANCTION = "ADSN";
const CODE_ORDER = "ORDR";
const CODE_RESTORATIVE_JUSTICE = "RJUS";
const CODE_COURT_PROSECUTION = "CTPR";
const CODE_ADMINISTRATIVE_PENALTY = "ADPN";
const COMMENT_DECISION_CODES = new Set([
  CODE_ADMINISTRATIVE_SANCTION,
  CODE_RESTORATIVE_JUSTICE,
  CODE_ADMINISTRATIVE_PENALTY,
]);

const formatDate = (value?: string | Date | null): string => (value ? format(new Date(value), "yyyy-MM-dd") : "—");
const formatYesNo = (value?: boolean | null): string => (value == null ? "—" : value ? "Yes" : "No");

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
  communityLabel: string;
  servingOfficerLabel: string;
  issuingOfficerLabel: string;
  enforcementActionLabel: string;
  ticketOutcomeLabel?: string;
  decisionDetailLabels: DecisionDetailLabels;
  attachments: EnforcementActionAttachment[];
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
  issuingOfficerLabel,
  enforcementActionLabel,
  ticketOutcomeLabel,
  decisionDetailLabels,
  attachments,
  isLoadingAttachments,
}) => {
  const dispatch = useAppDispatch();
  const ticket = enforcementAction.ticket;
  const code = enforcementAction.enforcementActionCode?.enforcementActionCode ?? "";
  const isNonEADecision = NON_EA_DECISION_CODES.has(code);

  const handleFileClick = async (e: React.MouseEvent<HTMLAnchorElement>, attachmentId: string) => {
    e.preventDefault();
    if (!attachmentId) return;
    const parameters = generateApiParameters(`${config.COMS_URL}/object/${attachmentId}?download=url`);
    const downloadUrl = await get<string>(dispatch, parameters);
    window.open(downloadUrl, "_blank");
  };

  const attachmentContent =
    attachments.length === 0 ? (
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
              <Field label="Decision">{enforcementActionLabel || "—"}</Field>
            </div>
            <div className="col-6"></div>
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
            <div className="col-6">
              <Field label="Community">{communityLabel || "—"}</Field>
            </div>

            {code === CODE_WARNING && (
              <div className="col-6">
                <Field label="Warning number">{enforcementAction.warningNumber || "—"}</Field>
              </div>
            )}

            {code === CODE_VIOLATION_TICKET && ticket && (
              <>
                <div className="col-6">
                  <Field label="Ticket type">{decisionDetailLabels.ticketType || "—"}</Field>
                </div>
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
              </>
            )}

            {code === CODE_ADMINISTRATIVE_SANCTION && (
              <>
                <div className="col-6">
                  <Field label="Sanction type">{decisionDetailLabels.sanctionType || "—"}</Field>
                </div>
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
                  <Field label="Order type">{decisionDetailLabels.orderType || "—"}</Field>
                </div>
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
