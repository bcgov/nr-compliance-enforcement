import { FC, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { getWebEOCUpdates, selectWebEOCComplaintUpdates } from "../../../../store/reducers/complaints";
import { WebEOCComplaintUpdateDTO } from "../../../../types/app/complaints/webeoc-complaint-update";
import { formatDate, formatTime } from "../../../../common/methods";

type Props = {
  complaintIdentifier: string;
};

export const WebEOCComplaintUpdateList: FC<Props> = ({ complaintIdentifier }) => {
  const dispatch = useAppDispatch();
  const complaintUpdates = useAppSelector(selectWebEOCComplaintUpdates);
  const [expandedUpdates, setExpandedUpdates] = useState<Record<string, boolean>>({});
  const [showLinks, setShowLinks] = useState<Record<string, boolean>>({});
  const descriptionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    dispatch(getWebEOCUpdates(complaintIdentifier));
  }, [complaintIdentifier, dispatch]);

  const toggleExpand = (id: string) => {
    setExpandedUpdates((prev) => ({
      ...prev,
      [id]: true,
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
      {complaintUpdates && complaintUpdates.length > 0 ? (
        <div className="comp-complaint-details-block">
          <div>
            <h6>Complaint Updates ({complaintUpdates.length})</h6>
          </div>
          {complaintUpdates.map((update: WebEOCComplaintUpdateDTO) => (
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
                  <i className="bi bi-calendar comp-margin-right-xxs"></i>
                  <span>{formatDate(update.createUtcTimestamp)}</span>
                  <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
                  <span>{formatTime(update.createUtcTimestamp)}</span>
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
                  {showLinks[update.complaintUpdateGuid] && !expandedUpdates[update.complaintUpdateGuid] && (
                    <div className="show-more-container">
                      <span
                        role="button"
                        tabIndex={0}
                        className="show-more-link"
                        onClick={() => toggleExpand(update.complaintUpdateGuid)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            toggleExpand(update.complaintUpdateGuid);
                          }
                        }}
                      >
                        Click to expand
                      </span>
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
                  <div className="complaint-description-label">Coordinates:</div>
                  <div className="complaint-description-text">
                    {update.updLocationGeometryPoint.coordinates[1]} {update.updLocationGeometryPoint.coordinates[0]}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  );
};
