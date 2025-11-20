import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { gql } from "graphql-request";

import LeafletMapWithServerSideClustering from "@components/mapping/leaflet-map-with-server-side-clustering";
import InvestigationSummaryPopup from "@components/mapping/investigation-summary-popup";
import { useRequest } from "@graphql/client";
import { useInvestigationSearch } from "../hooks/use-investigation-search";

type Props = {
  error?: Error | null;
};

const SEARCH_INVESTIGATIONS_MAP = gql`
  query SearchInvestigationsMap($model: SearchMapParameters!) {
    searchInvestigationsMap(model: $model) {
      clusters
      mappedCount
      unmappedCount
      zoom
      center
    }
  }
`;

const DEFAULT_ZOOM = 5;

type BoundingBox = {
  west?: number;
  south?: number;
  east?: number;
  north?: number;
};

type SearchInvestigationsMapResponse = {
  searchInvestigationsMap?: {
    clusters?: Array<any>;
    mappedCount?: number;
    unmappedCount?: number;
    zoom?: number;
    center?: Array<number>;
  };
};

const sanitizeFilters = (filters: Record<string, any>) => {
  const sanitized: Record<string, any> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }
    sanitized[key] = value instanceof Date ? value.toISOString() : value;
  });
  return Object.keys(sanitized).length ? sanitized : undefined;
};

export const InvestigationMap: FC<Props> = ({ error = null }) => {
  const { getFilters } = useInvestigationSearch();

  const filters = useMemo(() => getFilters(), [getFilters]);
  const filtersInput = useMemo(() => sanitizeFilters(filters), [filters]);

  const [clusters, setClusters] = useState<Array<any>>([]);
  const [unmappedCount, setUnmappedCount] = useState<number>(0);
  const [defaultClusterView, setDefaultClusterView] = useState<{ zoom: number; center: [number, number] }>();
  const [loadingMapData, setLoadingMapData] = useState<boolean>(false);
  const [mapError, setMapError] = useState<Error | null>(null);

  const fetchMapData = useCallback(
    async (zoom: number = DEFAULT_ZOOM, bbox?: BoundingBox) => {
      setLoadingMapData(true);
      setMapError(null);
      try {
        const model: Record<string, any> = {
          zoom,
        };
        if (
          bbox &&
          bbox.west !== undefined &&
          bbox.south !== undefined &&
          bbox.east !== undefined &&
          bbox.north !== undefined
        ) {
          model.bbox = `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`;
        }
        if (filtersInput) {
          model.filters = filtersInput;
        }

        const response: SearchInvestigationsMapResponse = await useRequest(SEARCH_INVESTIGATIONS_MAP, {
          model,
        });
        const result = response?.searchInvestigationsMap;

        setClusters(result?.clusters ?? []);
        setUnmappedCount(result?.unmappedCount ?? 0);

        if (!bbox && result?.zoom && Array.isArray(result.center) && result.center.length === 2) {
          setDefaultClusterView({
            zoom: result.zoom,
            center: [result.center[0], result.center[1]],
          });
        }
      } catch (fetchError) {
        setMapError(fetchError as Error);
      } finally {
        setLoadingMapData(false);
      }
    },
    [filtersInput],
  );

  useEffect(() => {
    fetchMapData();
  }, [fetchMapData]);

  const handleMapMoved = useCallback(
    (zoom: number, west: number, south: number, east: number, north: number) => {
      setDefaultClusterView(undefined);
      fetchMapData(zoom, { west, south, east, north });
    },
    [fetchMapData],
  );

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
