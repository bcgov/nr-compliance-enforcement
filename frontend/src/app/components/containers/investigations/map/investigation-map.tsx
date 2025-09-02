import { FC } from "react";

type Props = {
  investigations?: any[];
  isLoading?: boolean;
  error?: Error | null;
};

export const InvestigationMap: FC<Props> = ({ investigations, isLoading = false, error = null }) => {
  if (isLoading) {
    return (
      <div className="comp-map-container">
        <div className="d-flex align-items-center justify-content-center h-100">
          <div className="text-center">
            <div className="spinner-border mb-3">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="text-muted">Loading Map</h4>
            <p className="text-muted">Loading investigations for mapping...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comp-map-container">
        <div className="d-flex align-items-center justify-content-center h-100">
          <div className="text-center">
            <div className="mb-3">
              <i
                className="bi bi-exclamation-triangle-fill text-danger"
                style={{ fontSize: "3rem" }}
              ></i>
            </div>
            <h4 className="text-danger">Error Loading Map</h4>
            <p className="text-muted">Error loading investigation: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="comp-map-container">
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="text-center">
          <div className="mb-3">
            <i
              className="bi bi-geo-alt-fill"
              style={{ fontSize: "3rem", color: "#6c757d" }}
            ></i>
          </div>
          <h4 className="text-muted">Map View</h4>
          <p className="text-muted mb-2">Placeholder map view for investigations</p>
          {investigations && investigations.length > 0 && (
            <p className="text-muted small">
              {investigations.length} investigation{investigations.length !== 1 ? "s" : ""} for mapping
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
