import { FC, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { getWebEOCChangeCount, selectRelatedData, getRelatedData } from "@store/reducers/complaints";
import { WebEOCComplaintUpdateDTO } from "@apptypes/app/complaints/webeoc-complaint-update";
import { formatDate, formatTime } from "@common/methods";
import { ActionTaken } from "@apptypes/app/complaints/action-taken";

type Props = {
  complaintIdentifier: string;
};

export const WebEOCComplaintUpdateList: FC<Props> = ({ complaintIdentifier }) => {
  const dispatch = useAppDispatch();
  const { updates, actions } = useAppSelector(selectRelatedData) || { updates: [], actions: [] };
  const [expandedUpdates, setExpandedUpdates] = useState<Record<string, boolean>>({});
  const [expandedActions, setExpandedActions] = useState<Record<string, boolean>>({});
  const [showLinks, setShowLinks] = useState<Record<string, boolean>>({});
  const descriptionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [allUpdates, setAllUpdates] = useState<(WebEOCComplaintUpdateDTO | ActionTaken)[]>([]);

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
    if ((updates && updates.length > 0) || (actions && actions.length > 0)) {
      const allUpdatesArr = [...updates, ...actions].sort((a, b) => {
        const aTime = (a as ActionTaken).actionUtcTimestamp
          ? (a as ActionTaken).actionUtcTimestamp
          : (a as WebEOCComplaintUpdateDTO).createUtcTimestamp;
        const bTime = (b as ActionTaken).actionUtcTimestamp
          ? (b as ActionTaken).actionUtcTimestamp
          : (b as WebEOCComplaintUpdateDTO).createUtcTimestamp;
        return new Date(bTime).valueOf() - new Date(aTime).valueOf();
      });
      setAllUpdates(allUpdatesArr);
    } else setAllUpdates([]);
  }, [updates.length, actions.length]);

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
          {allUpdates.map((update: ActionTaken | WebEOCComplaintUpdateDTO, index) => {
            const isActionTakenUpdate = !!(update as ActionTaken).actionTakenGuid;
            const guid = isActionTakenUpdate
              ? (update as ActionTaken).actionTakenGuid
              : (update as WebEOCComplaintUpdateDTO).complaintUpdateGuid;
            return (
              <div
                className="comp-complaint-update-item"
                key={(update as ActionTaken).actionTakenGuid || update.complaintUpdateGuid}
              >
                <div className="comp-complaint-update-item-row first-row">
                  <div className="update-number">Update {allUpdates.length - index}:</div>
                  <div className="received">
                    <span style={{ fontWeight: 700 }}>
                      {isActionTakenUpdate ? "Call center action" : "Complaint details update"}
                    </span>{" "}
                    |{" "}
                    <span>
                      <i className="bi bi-calendar"></i>
                      {isActionTakenUpdate
                        ? formatDate((update as ActionTaken).actionUtcTimestamp)
                        : formatDate((update as WebEOCComplaintUpdateDTO).createUtcTimestamp)}
                      <i className="bi bi-clock comp-margin-left-xs"></i>
                      {isActionTakenUpdate
                        ? formatTime((update as ActionTaken).actionUtcTimestamp)
                        : formatTime((update as WebEOCComplaintUpdateDTO).createUtcTimestamp)}
                    </span>{" "}
                    |{" "}
                    <span>
                      {isActionTakenUpdate
                        ? (update as ActionTaken).loggedByTxt
                        : (update as WebEOCComplaintUpdateDTO).createUserId}
                    </span>
                  </div>
                  {showLinks[guid] && (
                    <div className="expand-collapse-button">
                      <button
                        className="comp-icon-button-container"
                        onClick={() => toggleExpand(guid)}
                      >
                        {expandedUpdates[guid] ? (
                          <i className="bi bi-chevron-up h2"></i>
                        ) : (
                          <i className="bi bi-chevron-down h2"></i>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {(update as ActionTaken).actionDetailsTxt && (
                  <div className="comp-complaint-update-item-row first-row">
                    <div className=".comp-complaint-update-label">Details:</div>
                    <div
                      className={`complaint-description-text ${
                        expandedActions[(update as ActionTaken).actionTakenGuid] ? "expanded" : ""
                      } ${showLinks[(update as ActionTaken).actionTakenGuid] ? "needs-gradient" : ""}`}
                      ref={(el) => (descriptionRefs.current[(update as ActionTaken).actionTakenGuid] = el)}
                      style={{
                        maxHeight: expandedActions[(update as ActionTaken).actionTakenGuid] ? "none" : "6em",
                        overflow: expandedUpdates[(update as ActionTaken).actionTakenGuid] ? "visible" : "hidden",
                      }}
                    >
                      {(update as ActionTaken).actionDetailsTxt}
                    </div>
                  </div>
                )}

                {(update as WebEOCComplaintUpdateDTO).updDetailText && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Complaint description:</div>
                    <div
                      className={`complaint-description-text ${
                        expandedUpdates[(update as WebEOCComplaintUpdateDTO).complaintUpdateGuid] ? "expanded" : ""
                      } ${showLinks[(update as WebEOCComplaintUpdateDTO).complaintUpdateGuid] ? "needs-gradient" : ""}`}
                      ref={(el) =>
                        (descriptionRefs.current[(update as WebEOCComplaintUpdateDTO).complaintUpdateGuid] = el)
                      }
                      style={{
                        maxHeight: expandedUpdates[(update as WebEOCComplaintUpdateDTO).complaintUpdateGuid]
                          ? "none"
                          : "6em",
                        overflow: expandedUpdates[(update as WebEOCComplaintUpdateDTO).complaintUpdateGuid]
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      {(update as WebEOCComplaintUpdateDTO).updDetailText}
                    </div>
                  </div>
                )}
                {(update as WebEOCComplaintUpdateDTO).updLocationSummaryText && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Complaint location:</div>
                    <div className="complaint-description-text">
                      {(update as WebEOCComplaintUpdateDTO).updLocationSummaryText}
                    </div>
                  </div>
                )}
                {(update as WebEOCComplaintUpdateDTO).updLocationDetailedText && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Location description:</div>
                    <div className="complaint-description-text">
                      {(update as WebEOCComplaintUpdateDTO).updLocationDetailedText}
                    </div>
                  </div>
                )}
                {(update as WebEOCComplaintUpdateDTO).updLocationGeometryPoint && (
                  <div className="complaint-description-section">
                    <div className="comp-complaint-update-label">Latitude/Longitude:</div>
                    <div className="complaint-description-text">
                      {(update as WebEOCComplaintUpdateDTO).updLocationGeometryPoint?.coordinates[1]} ,{" "}
                      {(update as WebEOCComplaintUpdateDTO).updLocationGeometryPoint?.coordinates[0]}
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
