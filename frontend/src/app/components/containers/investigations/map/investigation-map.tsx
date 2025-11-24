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

  const { clusters, unmappedCount, defaultClusterView, loadingMapData, handleMapMoved, noResults } =
    useMapSearch<SearchInvestigationsMapResponse>({
      query: SEARCH_INVESTIGATIONS_MAP,
      filters,
      resultAccessor: selectMapResult,
    });

  const renderInvestigationPopup = (investigationGuid: string) => (
    <InvestigationSummaryPopup investigationGuid={investigationGuid} />
  );

  return (
    <LeafletMapWithServerSideClustering
      handleMapMoved={handleMapMoved}
      loadingMapData={loadingMapData}
      clusters={clusters}
      defaultClusterView={defaultClusterView}
      unmappedCount={unmappedCount}
      renderMarkerPopup={renderInvestigationPopup}
      noResults={noResults}
    />
  );
};
