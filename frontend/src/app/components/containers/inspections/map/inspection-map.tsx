import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { gql } from "graphql-request";

import LeafletMapWithServerSideClustering from "@components/mapping/leaflet-map-with-server-side-clustering";
import InspectionSummaryPopup from "@components/mapping/inspection-summary-popup";
import { useRequest } from "@graphql/client";
import { useInspectionSearch } from "../hooks/use-inspection-search";

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

const DEFAULT_ZOOM = 5;

type BoundingBox = {
  west?: number;
  south?: number;
  east?: number;
  north?: number;
};

type SearchInspectionsMapResponse = {
  searchInspectionsMap?: {
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

export const InspectionMap: FC<Props> = ({ error = null }) => {
  const { getFilters } = useInspectionSearch();
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
        const model: Record<string, any> = { zoom };
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

        const response: SearchInspectionsMapResponse = await useRequest(SEARCH_INSPECTIONS_MAP, {
          model,
        });
        const result = response?.searchInspectionsMap;

        setClusters(result?.clusters ?? []);
        setUnmappedCount(result?.unmappedCount ?? 0);

        if (!bbox && result?.zoom && Array.isArray(result.center) && result.center.length === 2) {
          setDefaultClusterView({
            zoom: result.zoom,
            center: [result.center[0], result.center[1]] as [number, number],
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
