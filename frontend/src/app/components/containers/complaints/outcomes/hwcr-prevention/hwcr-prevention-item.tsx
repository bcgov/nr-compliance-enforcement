import { FC } from "react";
import { Prevention } from "@/app/types/outcomes/prevention";
import { Badge, Button, Card } from "react-bootstrap";
import { selectComplaintViewMode } from "@store/reducers/complaints";
import { useAppSelector } from "@/app/hooks/hooks";
import UserService from "@/app/service/user-service";
import { selectOfficerByAuthUserGuid } from "@/app/store/reducers/officer";
import { formatDateObjectAsString, parseUTCTimestampToLocal } from "@/app/common/date-utils";
import { CASE_ACTION_CODE } from "@constants/case_actions";

type Props = {
  prevention: Prevention;
  handleEdit: Function;
  handleDelete: Function;
};

export const HWCRPreventionItem: FC<Props> = ({ prevention, handleEdit, handleDelete }) => {
  const isReadOnly = useAppSelector(selectComplaintViewMode);
  const isSameAgency = UserService.getUserAgency() === prevention.outcomeAgencyCode;
  const officer = useAppSelector(selectOfficerByAuthUserGuid(prevention.officer?.value ?? ""));
  const canEdit = isSameAgency && !isReadOnly;
  const isWacnIssued = prevention.prevention_type?.some((item) => item.value === CASE_ACTION_CODE.ISSUEWACN);

  return (
    <Card border="default">
      <Card.Body>
        <div className="comp-details-section-header">
          <div className="comp-details-section">
            <dl>
              <div>
                <dt>Actions</dt>
                <dd>
                  <ul id="prev-educ-checkbox-div">
                    {prevention.prevention_type?.map((item) => (
                      <li
                        className="checkbox-label-padding"
                        key={item.value}
                      >
                        {item.key}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              {isWacnIssued && (
                <div id="prev-educ-wacn-amount-div">
                  <dt>Number of WACN issued</dt>
                  <dd>{prevention.wacnAmount ?? ""}</dd>
                </div>
              )}
              <div id="prev-educ-outcome-officer-div">
                <dt>Officer</dt>
                <dd>
                  <span id="comp-review-required-officer">{prevention.officer?.key ?? ""}</span>{" "}
                  <Badge className="comp-status-badge-closed">{officer?.agency_code?.shortDescription}</Badge>
                </dd>
              </div>
              <div id="prev-educ-outcome-date-div">
                <dt>Date</dt>
                <dd>
                  {formatDateObjectAsString(parseUTCTimestampToLocal(prevention.date), {
                    format: "date",
                  })}
                </dd>
              </div>
            </dl>
          </div>
          <div className="comp-outcome-item-header-actions">
            <Button
              variant="outline-primary"
              size="sm"
              id="prevention-edit-button"
              onClick={() => handleEdit()}
              disabled={!canEdit}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit</span>
            </Button>
            <Button
              size="sm"
              variant="outline-primary"
              id="prevention-delete-button"
              onClick={() => handleDelete()}
              disabled={!canEdit}
            >
              <i className="bi bi-trash3"></i>
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
