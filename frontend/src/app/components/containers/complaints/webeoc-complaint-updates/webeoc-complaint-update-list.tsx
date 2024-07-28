import { FC, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import {
  getWebEOCUpdates,
  selectWebEOCComplaintUpdates,
  getWebEOCChangeCount,
  selectWebEOCChangeCount,
} from "../../../../store/reducers/complaints";
import { WebEOCComplaintUpdateDTO } from "../../../../types/app/complaints/webeoc-complaint-update";
import { formatDate, formatTime } from "../../../../common/methods";

type Props = {
  complaintIdentifier: string;
};

export const WebEOCComplaintUpdateList: FC<Props> = ({ complaintIdentifier }) => {
  const dispatch = useAppDispatch();
  const complaintUpdates = useAppSelector(selectWebEOCComplaintUpdates);
  const changeCount = useAppSelector(selectWebEOCChangeCount);
  const [expandedUpdates, setExpandedUpdates] = useState<Record<string, boolean>>({});
  const [showLinks, setShowLinks] = useState<Record<string, boolean>>({});
  const descriptionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    dispatch(getWebEOCUpdates(complaintIdentifier));
    dispatch(getWebEOCChangeCount(complaintIdentifier));
  }, [complaintIdentifier, dispatch]);

  const toggleExpand = (id: string) => {
    setExpandedUpdates((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expanded state
    }));
  };

  useEffect(() => {
    Object.keys(descriptionRefs.current).forEach((id) => {
      const element = descriptionRefs.current[id];
      if (element && element.scrollHeight > element.clientHeight) {
        setShowLinks((prev) => ({
          ...prev,
          [id]: true,
        }));
      }
    });
  }, [complaintUpdates]);

  return (
    <>
      {((complaintUpdates && complaintUpdates.length > 0) || (changeCount && changeCount > 0)) && (
        <div className="comp-container comp-complaint-details-block">
          <div>
            <h6>
              Complaint Updates {complaintUpdates && complaintUpdates.length > 0 && "(" + complaintUpdates.length + ")"}
            </h6>
            {changeCount && changeCount > 0 && (
              <div className="comp-complaint-update-count">
                This ticket has been updated, or its content has been edited, {changeCount} times since it was created.
                Please review all the details below to see the latest information.
              </div>
            )}
          </div>
          {complaintUpdates &&
            complaintUpdates.length > 0 &&
            complaintUpdates.map((update: WebEOCComplaintUpdateDTO) => (
              <div
                className="comp-complaint-update-item"
                key={update.complaintUpdateGuid}
              >
                <div className="comp-complaint-update-item-row first-row">
                  <div className="update-number">Update {update.updateSeqNumber}:</div>
                  <div className="received">
                    <span
                      className="date-time-logged-label"
                      id="date-time-logged-label-id"
                    >
                      Received
                    </span>
                    <i className="bi bi-calendar"></i>
                    {formatDate(update.createUtcTimestamp)}
                    <i className="bi bi-clock comp-margin-left-xs"></i>
                    {formatTime(update.createUtcTimestamp)}
                  </div>
                </div>
                {update.updDetailText && (
                  <div className="complaint-description-section">
                    <div className="complaint-description-label">Complaint description</div>
                    <div
                      className={`complaint-description-text ${
                        expandedUpdates[update.complaintUpdateGuid] ? "expanded" : ""
                      } ${showLinks[update.complaintUpdateGuid] ? "needs-gradient" : ""}`}
                      ref={(el) => (descriptionRefs.current[update.complaintUpdateGuid] = el)}
                      style={{
                        maxHeight: expandedUpdates[update.complaintUpdateGuid] ? "none" : "6em",
                        overflow: expandedUpdates[update.complaintUpdateGuid] ? "visible" : "hidden",
                      }}
                    >
                      {update.updDetailText}
                    </div>
                    {showLinks[update.complaintUpdateGuid] && (
                      <div className="show-more-container">
                        <button
                          type="button"
                          className="show-more-link"
                          onClick={() => toggleExpand(update.complaintUpdateGuid)}
                        >
                          {expandedUpdates[update.complaintUpdateGuid] ? "Click to collapse" : "Click to expand"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <div className="complaint-location-section">
                  <div className="complaint-location-row">
                    {update.updLocationSummaryText && (
                      <div className="complaint-location-label-value-pair">
                        <div className="complaint-location-label">Complaint location:</div>
                        <div className="complaint-location-value">{update.updLocationSummaryText}</div>
                      </div>
                    )}
                    {update.updLocationDetailedText && (
                      <div className="complaint-location-label-value-pair">
                        <div className="complaint-location-label">Location description:</div>
                        <div className="complaint-location-value">{update.updLocationDetailedText}</div>
                      </div>
                    )}
                  </div>
                </div>
                {update.updLocationGeometryPoint?.coordinates && (
                  <div className="coordinates-section">
                    <div className="complaint-description-label">Latitude:</div>
                    <div className="complaint-description-text">{update.updLocationGeometryPoint.coordinates[1]}</div>
                    <div className="complaint-description-label">Longitude:</div>
                    <div className="complaint-description-text">{update.updLocationGeometryPoint.coordinates[0]}</div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </>
  );
};
