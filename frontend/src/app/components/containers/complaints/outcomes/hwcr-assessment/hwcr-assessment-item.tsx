import { FC } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@hooks/hooks";
import {
  selectComplaintLargeCarnivoreInd,
  selectLinkedComplaints,
  selectComplaintViewMode,
} from "@store/reducers/complaints";
import { formatDate } from "@common/methods";
import "react-toastify/dist/ReactToastify.css";
import { Assessment } from "@apptypes/outcomes/assessment";
import { Badge, Button, Card } from "react-bootstrap";

import "@assets/sass/hwcr-assessment.scss";
import UserService from "@/app/service/user-service";
import { selectOfficerByAuthUserGuid } from "@/app/store/reducers/officer";

type Props = {
  assessment: Assessment;
  handleEdit: Function;
};

export const HWCRAssessmentItem: FC<Props> = ({ assessment, handleEdit }) => {
  const isReadOnly = useAppSelector(selectComplaintViewMode);
  const linkedComplaintData = useAppSelector(selectLinkedComplaints);
  const isLargeCarnivore = useAppSelector(selectComplaintLargeCarnivoreInd);
  const officer = useAppSelector(selectOfficerByAuthUserGuid(assessment.officer?.value ?? ""));

  const showDuplicateOptions = assessment.action_required === "No" && assessment.justification?.value === "DUPLICATE";
  const assessmentDivClass = `comp-details-form-row ${assessment.action_required === "Yes" ? "inherit" : "hidden"}`;
  const justificationLabelClass = assessment.action_required === "Yes" ? "hidden" : "inherit";

  return (
    <Card id="outcome-assessment">
      <Card.Body>
        <div className="comp-details-section-header">
          <div className="comp-details-section">
            <dl>
              <div id="action-required-div">
                <dt>Action required</dt>
                <dd>{assessment.action_required}</dd>
              </div>
              <div
                id="justification-div"
                className={justificationLabelClass}
              >
                <dt>Justification</dt>
                <dd>
                  <span>{assessment.justification?.key}</span>
                </dd>
              </div>
              {showDuplicateOptions && linkedComplaintData?.length > 0 && (
                <div
                  id="linked-complaint-div"
                  className={justificationLabelClass}
                >
                  <dt>Linked complaint</dt>
                  <dd>
                    <Link
                      to={`/complaint/HWCR/${linkedComplaintData[0].id}`}
                      id={linkedComplaintData[0].id}
                    >
                      {linkedComplaintData[0].id ?? ""}
                    </Link>
                  </dd>
                </div>
              )}

              {/* Contacted complainant - view state */}
              {assessment.contacted_complainant !== null && (
                <div
                  id="contacted-complainant-div"
                  className={assessmentDivClass}
                >
                  <dt>Contacted complainant</dt>
                  <dd>
                    <span>{assessment.contacted_complainant ? "Yes" : "No"}</span>
                  </dd>
                </div>
              )}

              {/* Attended - view state */}
              {assessment.attended !== null && (
                <div
                  id="attended-div"
                  className={assessmentDivClass}
                  style={{ marginTop: "0px" }}
                >
                  <dt>Attended</dt>
                  <dd>
                    <span>{assessment.attended ? "Yes" : "No"}</span>
                  </dd>
                </div>
              )}

              {/* Legacy actions - view state */}
              {assessment.assessment_type_legacy && assessment.assessment_type_legacy.length > 0 && (
                <div
                  id="assessment-legacy-checkbox-div"
                  className={assessmentDivClass}
                  style={{ marginTop: "0px" }}
                >
                  <dt>Actions (legacy)</dt>
                  <dd>
                    <ul>
                      {assessment.assessment_type_legacy?.map((type) => (
                        <li
                          className="checkbox-label-padding"
                          key={type.key}
                        >
                          {type.value}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}

              {/* Animal actions - view state */}
              {(assessment.assessment_type?.length > 0 || assessment.assessment_cat1_type?.length > 0) && (
                <div
                  id="assessment-checkbox-div"
                  className={assessmentDivClass}
                  style={{ marginTop: "0px" }}
                >
                  <dt>Animal actions</dt>
                  <dd>
                    <ul>
                      {assessment.assessment_type?.map((type) => (
                        <li
                          className="checkbox-label-padding"
                          key={type.key}
                        >
                          {type.key}
                        </li>
                      ))}
                      {assessment.assessment_cat1_type?.map((type) => (
                        <li
                          className="checkbox-label-padding"
                          key={type.key}
                        >
                          {type.key}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}

              {/* Location type - view state */}
              {isLargeCarnivore && assessment.action_required && assessment.location_type?.key && (
                <div
                  id="location-type-div"
                  className={assessmentDivClass}
                  style={{ marginTop: "0px" }}
                >
                  <dt>Location type</dt>
                  <dd>
                    <span>{assessment.location_type.key}</span>
                  </dd>
                </div>
              )}

              {/* Conflict history - view state */}
              {(isLargeCarnivore ||
                (assessment.assessment_type_legacy && assessment.assessment_type_legacy.length > 0)) &&
                assessment.action_required &&
                assessment.conflict_history?.key && (
                  <div
                    id="conflict history-div"
                    className={assessmentDivClass}
                    style={{ marginTop: "0px" }}
                  >
                    <dt>Conflict history</dt>
                    <dd>
                      <span>{assessment.conflict_history.key}</span>
                    </dd>
                  </div>
                )}

              {/* Category level - view state */}
              {isLargeCarnivore && assessment.action_required && assessment.category_level?.key && (
                <div
                  id="conflict history-div"
                  className={assessmentDivClass}
                  style={{ marginTop: "0px" }}
                >
                  <dt>Category level</dt>
                  <dd>
                    <span>{assessment.category_level.key}</span>
                  </dd>
                </div>
              )}
              <div>
                <dt>Officer</dt>
                <dd>
                  <span id="assessment-officer-div">{assessment.officer?.key ?? ""}</span>{" "}
                  <Badge className="comp-status-badge-closed">{officer?.agency_code?.short_description}</Badge>
                </dd>
              </div>
              <div id="assessment-date-div">
                <dt>Date</dt>
                <dd>{formatDate(`${assessment?.date ? new Date(assessment.date) : new Date()}`)}</dd>
              </div>
            </dl>
          </div>
          <div className="comp-outcome-item-header-actions">
            <Button
              variant="outline-primary"
              size="sm"
              id="assessment-edit-button"
              onClick={() => handleEdit()}
              disabled={isReadOnly === true || assessment.agency !== UserService.getUserAgency()}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit</span>
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
