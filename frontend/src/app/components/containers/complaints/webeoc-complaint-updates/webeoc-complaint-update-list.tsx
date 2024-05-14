import { FC, useEffect } from "react";
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

  useEffect(() => {
    dispatch(getWebEOCUpdates(complaintIdentifier));
  }, [complaintIdentifier, dispatch]);

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
                  <label id="date-time-logged-label-id">Recieved</label>
                  <i className="bi bi-calendar comp-margin-right-xxs"></i>
                  <span>{formatDate(update.createUtcTimestamp)}</span>
                  <i className="bi bi-clock comp-margin-left-xxs comp-margin-right-xxs"></i>
                  <span>{formatTime(update.createUtcTimestamp)}</span>
                </div>
              </div>
              {update.updDetailText && (
                <div className="complaint-description-section">
                  <div className="complaint-description-label">Complaint Description</div>
                  <div className="complaint-description-text">{update.updDetailText}</div>
                </div>
              )}
              <div className="comp-complaint-update-item-row complaint-location-section">
                {update.updLocationSummaryText && (
                  <div className="complaint-location-label-value-pair">
                    <div className="complaint-location-label">Complaint Location</div>
                    <div className="complaint-location-value">{update.updLocationSummaryText}</div>
                  </div>
                )}
                {update.updLocationDetailedText && (
                  <div className="complaint-location-label-value-pair">
                    <div className="complaint-location-label">Location Description</div>
                    <div className="complaint-location-value">{update.updLocationDetailedText}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  );
};
