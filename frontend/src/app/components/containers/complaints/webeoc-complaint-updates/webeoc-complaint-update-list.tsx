import { FC, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { getWebEOCChangeCount, selectRelatedData, getRelatedData } from "@store/reducers/complaints";
import { WebEOCComplaintUpdateDTO } from "@apptypes/app/complaints/webeoc-complaint-update";
import { formatDate, formatTime } from "@common/methods";
import { ActionTaken } from "@apptypes/app/complaints/action-taken";
import { ComplaintReferral } from "@/app/types/app/complaints/complaint-referral";
import { UUID } from "node:crypto";
import { formatPhoneNumber } from "react-phone-number-input/input";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { selectOfficers } from "@store/reducers/officer";

type Props = {
  complaintIdentifier: string;
};

type UpdateItem = {
  type: string;
  id: UUID;
  header: {
    title: string;
    date: string;
    officer: string;
  };
  content: WebEOCComplaintUpdateDTO | ActionTaken | ComplaintReferral;
};

export const WebEOCComplaintUpdateList: FC<Props> = ({ complaintIdentifier }) => {
  const dispatch = useAppDispatch();
  const { updates, actions, referrals } = useAppSelector(selectRelatedData) || {
    updates: [],
    actions: [],
    referrals: [],
  };
  const officers = useAppSelector(selectOfficers);
  const [expandedUpdates, setExpandedUpdates] = useState<Record<string, boolean>>({});
  const [expandedActions, setExpandedActions] = useState<Record<string, boolean>>({});
  const [showLinks, setShowLinks] = useState<Record<string, boolean>>({});
  const descriptionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [allUpdates, setAllUpdates] = useState<UpdateItem[]>([]);

  useEffect(() => {
    dispatch(getRelatedData(complaintIdentifier));
    dispatch(getWebEOCChangeCount(complaintIdentifier));
  }, [complaintIdentifier, dispatch]);

  const toggleExpand = (id: string) => {
    setExpandedUpdates((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expanded state
    }));
    setExpandedActions((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expanded state
    }));
  };

  useEffect(() => {
    if (allUpdates.length > 0) {
      Object.keys(descriptionRefs.current).forEach((id) => {
        const element = descriptionRefs.current[id];
        if (element && element.scrollHeight > element.clientHeight) {
          setShowLinks((prev) => ({
            ...prev,
            [id]: true,
          }));
        }
      });
    } else {
      descriptionRefs.current = {};
    }
  }, [allUpdates]);

  useEffect(() => {
    //merge complaint updates and action updates then sort allUpdates by timestamp
    if ((updates && updates.length > 0) || (actions && actions.length > 0) || (referrals && referrals.length > 0)) {
      const mappedUpdates = updates.map((item) => {
        return {
          type: "update",
          id: item.complaintUpdateGuid,
          header: {
            title: "Complaint details update",
            date: item.createUtcTimestamp,
            officer: item.createUserId,
          },
          content: item,
        };
      });

      const mappedActions = actions.map((item) => {
        return {
          type: "action",
          id: item.actionTakenGuid,
          header: {
            title: "Call center action",
            date: item.actionUtcTimestamp,
            officer: item.loggedByTxt,
          },
          content: item,
        };
      });

      const mappedReferrals = referrals.map((item) => {
        let officerName = "Unknown Officer";

        if (item.app_user_guid_ref && officers) {
          const officer = officers.find((o) => o.app_user_guid === item.app_user_guid_ref);
          if (officer) {
            officerName = `${officer.first_name} ${officer.last_name}`;
          }
        }

        return {
          type: "referral",
          id: item.complaint_referral_guid,
          header: {
            title: "Complaint referred",
            date: item.referral_date,
            officer: officerName,
          },
          content: item,
        };
      });

      const allUpdatesArr = [...mappedUpdates, ...mappedActions, ...mappedReferrals].sort((a, b) => {
        return new Date(b.header.date).valueOf() - new Date(a.header.date).valueOf();
      });
      setAllUpdates(allUpdatesArr);
    } else setAllUpdates([]);
  }, [updates, actions, referrals, officers]);

  return (
    <>
      {allUpdates && allUpdates.length > 0 && (
        <div className="comp-complaint-details-block">
          <div>
            <h6>Complaint updates {"(" + allUpdates.length + ")"}</h6>
            <div className="comp-complaint-update-count">
              This ticket has been updated {allUpdates.length} {allUpdates.length === 1 ? "time" : "times"} since it was
              created. Please review all the details below to see the latest information.
            </div>
          </div>

          {allUpdates.map((update: UpdateItem, index: number) => {
            const emailListTooltip = (props: any) => (
              <Tooltip
                id="email-list-tooltip"
                className="comp-complaint-update-email-list-tooltip"
                {...props}
              >
                <div>
                  <strong>Notifications sent to:</strong>
                  {(update.content as ComplaintReferral).referral_email_logs?.map((emailLog) => (
                    <div key={emailLog.email_address}>
                      <span>{emailLog.email_address}</span>
                    </div>
                  ))}
                </div>
              </Tooltip>
            );
            return (
              <div
                className={`comp-complaint-update-item ${update.type === "referral" ? "referral-update" : "webeoc-update"}`}
                key={update.id}
              >
                <div className="comp-complaint-update-item-row first-row">
                  <div className="update-number">Update {allUpdates.length - index}:</div>
                  <div className="received">
                    <span style={{ fontWeight: 700 }}>{update.header.title}</span> |{" "}
                    <span>
                      <i className="bi bi-calendar"></i>
                      {formatDate(update.header.date)}
                      <i className="bi bi-clock comp-margin-left-xs"></i>
                      {formatTime(update.header.date)}
                    </span>{" "}
                    | <span>{update.header.officer}</span>
                  </div>
                  {showLinks[update.id] && (
                    <div className="expand-collapse-button">
                      <button
                        className="comp-icon-button-container"
                        onClick={() => toggleExpand(update.id)}
                      >
                        {expandedUpdates[update.id] ? (
                          <i className="bi bi-chevron-up h2"></i>
                        ) : (
                          <i className="bi bi-chevron-down h2"></i>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {(update.content as ComplaintReferral).referred_by_agency && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Previous agency:</div>
                    <div className="complaint-description-text">
                      {(update.content as ComplaintReferral).referred_by_agency.longDescription}
                    </div>
                  </div>
                )}

                {(update.content as ComplaintReferral).referred_to_agency && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">New lead agency:</div>
                    <div className="complaint-description-text">
                      <strong>{(update.content as ComplaintReferral).referred_to_agency.longDescription}</strong>{" "}
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={emailListTooltip}
                      >
                        <i className="bi bi-envelope-fill"></i>
                      </OverlayTrigger>
                    </div>
                  </div>
                )}

                {(update.content as ComplaintReferral).referral_reason && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Reason for referral:</div>
                    <div className="complaint-description-text">
                      {(update.content as ComplaintReferral).referral_reason}
                    </div>
                  </div>
                )}

                {(update.content as ActionTaken).actionDetailsTxt && (
                  <div className="comp-complaint-update-item-row first-row">
                    <div className="comp-complaint-update-label">Details:</div>
                    <div
                      className={`complaint-description-text ${
                        expandedActions[(update.content as ActionTaken).actionTakenGuid] ? "expanded" : ""
                      } ${showLinks[(update.content as ActionTaken).actionTakenGuid] ? "needs-gradient" : ""}`}
                      ref={(el) => (descriptionRefs.current[(update.content as ActionTaken).actionTakenGuid] = el)}
                      style={{
                        maxHeight: expandedActions[(update.content as ActionTaken).actionTakenGuid] ? "none" : "6em",
                        overflow: expandedUpdates[(update.content as ActionTaken).actionTakenGuid]
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      {(update.content as ActionTaken).actionDetailsTxt}
                    </div>
                  </div>
                )}

                {(update.content as WebEOCComplaintUpdateDTO).updDetailText && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Complaint description:</div>
                    <div
                      className={`complaint-description-text ${
                        expandedUpdates[(update.content as WebEOCComplaintUpdateDTO).complaintUpdateGuid]
                          ? "expanded"
                          : ""
                      } ${showLinks[(update.content as WebEOCComplaintUpdateDTO).complaintUpdateGuid] ? "needs-gradient" : ""}`}
                      ref={(el) =>
                        (descriptionRefs.current[(update.content as WebEOCComplaintUpdateDTO).complaintUpdateGuid] = el)
                      }
                      style={{
                        maxHeight: expandedUpdates[(update.content as WebEOCComplaintUpdateDTO).complaintUpdateGuid]
                          ? "none"
                          : "6em",
                        overflow: expandedUpdates[(update.content as WebEOCComplaintUpdateDTO).complaintUpdateGuid]
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      {(update.content as WebEOCComplaintUpdateDTO).updDetailText}
                    </div>
                  </div>
                )}
                {(update.content as WebEOCComplaintUpdateDTO).updLocationSummaryText && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Complaint location:</div>
                    <div className="complaint-description-text">
                      {(update.content as WebEOCComplaintUpdateDTO).updLocationSummaryText}
                    </div>
                  </div>
                )}
                {(update.content as WebEOCComplaintUpdateDTO).updLocationDetailedText && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Location description:</div>
                    <div className="complaint-description-text">
                      {(update.content as WebEOCComplaintUpdateDTO).updLocationDetailedText}
                    </div>
                  </div>
                )}
                {(update.content as WebEOCComplaintUpdateDTO).updLocationGeometryPoint && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Latitude/Longitude:</div>
                    <div className="complaint-description-text">
                      {(update.content as WebEOCComplaintUpdateDTO).updLocationGeometryPoint?.coordinates[1]} ,{" "}
                      {(update.content as WebEOCComplaintUpdateDTO).updLocationGeometryPoint?.coordinates[0]}
                    </div>
                  </div>
                )}
                {(update.content as WebEOCComplaintUpdateDTO).updCallerName && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Name:</div>
                    <div className="complaint-description-text">
                      {(update.content as WebEOCComplaintUpdateDTO).updCallerName}
                    </div>
                  </div>
                )}
                {(update.content as WebEOCComplaintUpdateDTO).updCallerPhone1 && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Primary Phone:</div>
                    <div className="complaint-description-text">
                      {formatPhoneNumber((update.content as WebEOCComplaintUpdateDTO).updCallerPhone1 ?? "")}
                    </div>
                  </div>
                )}
                {(update.content as WebEOCComplaintUpdateDTO).updCallerPhone2 && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Alternative phone 1:</div>
                    <div className="complaint-description-text">
                      {formatPhoneNumber((update.content as WebEOCComplaintUpdateDTO).updCallerPhone2 ?? "")}
                    </div>
                  </div>
                )}
                {(update.content as WebEOCComplaintUpdateDTO).updCallerPhone3 && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Alternative phone 2:</div>
                    <div className="complaint-description-text">
                      {formatPhoneNumber((update.content as WebEOCComplaintUpdateDTO).updCallerPhone3 ?? "")}
                    </div>
                  </div>
                )}
                {(update.content as WebEOCComplaintUpdateDTO).updCallerAddress && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Address:</div>
                    <div className="complaint-description-text">
                      {(update.content as WebEOCComplaintUpdateDTO).updCallerAddress}
                    </div>
                  </div>
                )}
                {(update.content as WebEOCComplaintUpdateDTO).updCallerEmail && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Email:</div>
                    <div className="complaint-description-text">
                      {(update.content as WebEOCComplaintUpdateDTO).updCallerEmail}
                    </div>
                  </div>
                )}
                {(update.content as WebEOCComplaintUpdateDTO).reported_by_code && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Organization reporting the complaint:</div>
                    <div className="complaint-description-text">
                      {(update.content as WebEOCComplaintUpdateDTO).reported_by_code?.short_description}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
