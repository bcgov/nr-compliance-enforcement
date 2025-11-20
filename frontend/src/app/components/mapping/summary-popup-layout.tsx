import { FC } from "react";
import { Popup } from "react-leaflet";
import { Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type SummaryPopupLayoutProps = {
  title: string;
  identifier: string;
  status: string;
  statusClassName: string;
  loggedValue: string;
  officerValue: string;
  officerAgency: string;
  officerUnassigned?: boolean;
  locationValue: string;
  detailsPath: string;
  detailsLabel: string;
  loading: boolean;
  loadingMessage: string;
  error?: Error | null;
  errorMessage: string;
};

export const SummaryPopupLayout: FC<SummaryPopupLayoutProps> = ({
  title,
  identifier,
  status,
  statusClassName,
  loggedValue,
  officerValue,
  officerAgency,
  officerUnassigned = false,
  locationValue,
  detailsPath,
  detailsLabel,
  loading,
  loadingMessage,
  error,
  errorMessage,
}) => {
  const navigate = useNavigate();

  return (
    <Popup
      keepInView
      className="comp-map-popup"
    >
      <div
        id={identifier}
        className="ms-2 me-2"
      >
        <div className="comp-map-popup-header mb-2 pt-2">
          <div className="comp-map-popup-header-title">
            <h2 className="mb-0 text-start">{title}</h2>
          </div>
          <div className="comp-map-popup-header-meta">
            <Badge className={`badge ${statusClassName}`}>{status}</Badge>
          </div>
        </div>
        <div className="comp-map-popup-details">
          {loading && <div className="text-muted small">{loadingMessage}</div>}
          {error && <div className="text-danger small">{errorMessage}</div>}
          {!loading && !error && (
            <>
              <dl>
                <div>
                  <dt className="comp-summary-popup-details">
                    <i className="bi bi-calendar-fill" /> Logged
                  </dt>
                  <dd>{loggedValue}</dd>
                </div>
                <div>
                  <dt className="comp-summary-popup-details">
                    <i className="bi bi-person-fill" /> Officer
                  </dt>
                  <dd>
                    {officerUnassigned && <i className="bi bi-exclamation-triangle-fill text-warning"></i>}{" "}
                    <strong>
                      {officerValue} <span className="comp-tooltip-hint">({officerAgency})</span>
                    </strong>
                  </dd>
                </div>
                <div>
                  <dt className="comp-summary-popup-details">
                    <i className="bi bi-geo-alt-fill" /> Location
                  </dt>
                  <dd>{locationValue}</dd>
                </div>
              </dl>
              <Button
                as="a"
                variant="outline-primary"
                size="sm"
                className="comp-map-popup-details-btn w-100"
                onClick={() => navigate(detailsPath)}
              >
                {detailsLabel}
              </Button>
            </>
          )}
        </div>
      </div>
    </Popup>
  );
};
