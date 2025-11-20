import { useCallback, useEffect, useMemo, useState } from "react";
import { graphqlRequest } from "@graphql/client";
import { BoundingBox, DEFAULT_MAP_ZOOM, sanitizeFilters } from "@/app/utils/map-search";

type MapQueryResult = {
  clusters?: Array<any>;
  mappedCount?: number;
  unmappedCount?: number;
  zoom?: number;
  center?: Array<number>;
};

type UseMapSearchOptions<TResponse> = {
  query: any;
  filters: Record<string, any>;
  resultAccessor: (response: TResponse | undefined) => MapQueryResult | undefined;
};

type DefaultClusterView = {
  zoom: number;
  center: [number, number];
};

export const useMapSearch = <TResponse>({ query, filters, resultAccessor }: UseMapSearchOptions<TResponse>) => {
  const filtersInput = useMemo(() => sanitizeFilters(filters), [filters]);

  const [clusters, setClusters] = useState<Array<any>>([]);
  const [unmappedCount, setUnmappedCount] = useState<number>(0);
  const [defaultClusterView, setDefaultClusterView] = useState<DefaultClusterView>();
  const [loadingMapData, setLoadingMapData] = useState<boolean>(false);
  const [mapError, setMapError] = useState<Error | null>(null);

  const fetchMapData = useCallback(
    async (zoom: number = DEFAULT_MAP_ZOOM, bbox?: BoundingBox) => {
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

        const response = (await graphqlRequest(query, { model })) as TResponse | undefined;
        const result = resultAccessor(response);

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
    [filtersInput, query, resultAccessor],
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

  return {
    clusters,
    unmappedCount,
    defaultClusterView,
    loadingMapData,
    mapError,
    handleMapMoved,
  };
};
