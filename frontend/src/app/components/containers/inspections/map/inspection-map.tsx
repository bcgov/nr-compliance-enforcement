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

  const { clusters, unmappedCount, defaultClusterView, loadingMapData, mapError, handleMapMoved, noResults } =
    useMapSearch<SearchInspectionsMapResponse>({
      query: SEARCH_INSPECTIONS_MAP,
      filters,
      resultAccessor: selectMapResult,
    });

  const renderInspectionPopup = (inspectionGuid: string) => <InspectionSummaryPopup inspectionGuid={inspectionGuid} />;

  return (
    <LeafletMapWithServerSideClustering
      handleMapMoved={handleMapMoved}
      loadingMapData={loadingMapData}
      clusters={clusters}
      defaultClusterView={defaultClusterView}
      unmappedCount={unmappedCount}
      renderMarkerPopup={renderInspectionPopup}
      noResults={noResults}
    />
  );
};
