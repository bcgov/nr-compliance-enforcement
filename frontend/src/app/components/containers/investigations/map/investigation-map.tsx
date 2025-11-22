import { FC, useMemo, useCallback } from "react";
import { gql } from "graphql-request";

import LeafletMapWithServerSideClustering from "@components/mapping/leaflet-map-with-server-side-clustering";
import InvestigationSummaryPopup from "@components/mapping/investigation-summary-popup";
import { useInvestigationSearch } from "../hooks/use-investigation-search";
import { useMapSearch } from "@hooks/use-map-search";

type Props = {
  error?: Error | null;
};

const SEARCH_INVESTIGATIONS_MAP = gql`
  query SearchInvestigationsMap($model: InvestigationSearchMapParameters!) {
    searchInvestigationsMap(model: $model) {
      clusters
      mappedCount
      unmappedCount
      zoom
      center
    }
  }
`;

type SearchInvestigationsMapResponse = {
  searchInvestigationsMap?: {
    clusters?: Array<any>;
    mappedCount?: number;
    unmappedCount?: number;
    zoom?: number;
    center?: Array<number>;
  };
};

export const InvestigationMap: FC<Props> = ({ error = null }) => {
  const { getFilters } = useInvestigationSearch();
  const filters = useMemo(() => getFilters(), [getFilters]);

  const selectMapResult = useCallback(
    (response: SearchInvestigationsMapResponse | undefined) => response?.searchInvestigationsMap,
    [],
  );

  const { clusters, unmappedCount, defaultClusterView, loadingMapData, mapError, handleMapMoved } =
    useMapSearch<SearchInvestigationsMapResponse>({
      query: SEARCH_INVESTIGATIONS_MAP,
      filters,
      resultAccessor: selectMapResult,
    });

  const renderInvestigationPopup = (investigationGuid: string) => (
    <InvestigationSummaryPopup investigationGuid={investigationGuid} />
  );

  if (loadingMapData && clusters.length === 0 && !mapError) {
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
            <p className="text-muted">Error loading investigations: {displayError?.message}</p>
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
      renderMarkerPopup={renderInvestigationPopup}
    />
  );
};
