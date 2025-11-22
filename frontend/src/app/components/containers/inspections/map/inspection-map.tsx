import { FC, useMemo, useCallback } from "react";
import { gql } from "graphql-request";

import LeafletMapWithServerSideClustering from "@components/mapping/leaflet-map-with-server-side-clustering";
import InspectionSummaryPopup from "@components/mapping/inspection-summary-popup";
import { useInspectionSearch } from "../hooks/use-inspection-search";
import { useMapSearch } from "@hooks/use-map-search";

type Props = {
  error?: Error | null;
};

const SEARCH_INSPECTIONS_MAP = gql`
  query SearchInspectionsMap($model: InspectionSearchMapParameters!) {
    searchInspectionsMap(model: $model) {
      clusters
      mappedCount
      unmappedCount
      zoom
      center
    }
  }
`;

type SearchInspectionsMapResponse = {
  searchInspectionsMap?: {
    clusters?: Array<any>;
    mappedCount?: number;
    unmappedCount?: number;
    zoom?: number;
    center?: Array<number>;
  };
};

export const InspectionMap: FC<Props> = ({ error = null }) => {
  const { getFilters } = useInspectionSearch();
  const filters = useMemo(() => getFilters(), [getFilters]);

  const selectMapResult = useCallback(
    (response: SearchInspectionsMapResponse | undefined) => response?.searchInspectionsMap,
    [],
  );

  const { clusters, unmappedCount, defaultClusterView, loadingMapData, mapError, handleMapMoved } =
    useMapSearch<SearchInspectionsMapResponse>({
      query: SEARCH_INSPECTIONS_MAP,
      filters,
      resultAccessor: selectMapResult,
    });

  const renderInspectionPopup = (inspectionGuid: string) => <InspectionSummaryPopup inspectionGuid={inspectionGuid} />;

  if (loadingMapData && clusters.length === 0 && !mapError) {
    return (
      <div className="comp-map-container">
        <div className="d-flex align-items-center justify-content-center h-100">
          <div className="text-center">
            <div className="spinner-border mb-3">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="text-muted">Loading Map</h4>
            <p className="text-muted">Loading inspections for mapping...</p>
          </div>
        </div>
      </div>
    );
  }

  if (mapError || error) {
    const displayError = mapError || error;
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
            <p className="text-muted">Error loading inspections: {displayError?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LeafletMapWithServerSideClustering
      handleMapMoved={handleMapMoved}
      loadingMapData={loadingMapData}
      clusters={clusters}
      defaultClusterView={defaultClusterView}
      unmappedCount={unmappedCount}
      renderMarkerPopup={renderInspectionPopup}
    />
  );
};
