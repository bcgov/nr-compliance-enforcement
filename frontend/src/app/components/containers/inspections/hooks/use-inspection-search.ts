import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { SORT_TYPES } from "@constants/sort-direction";

export interface InspectionSearchParams {
  search: string;
  inspectionStatus: string | null;
  leadAgency: string | null;
  startDate: Date | null;
  endDate: Date | null;
  sortBy: string;
  sortOrder: string;
  page: number;
  pageSize: number;
  viewType: "list" | "map";
}

const DEFAULT_SEARCH_VALUES: InspectionSearchParams = {
  search: "",
  inspectionStatus: null,
  leadAgency: null,
  startDate: null,
  endDate: null,
  sortBy: "openedTimestamp",
  sortOrder: SORT_TYPES.DESC,
  page: 1,
  pageSize: 25,
  viewType: "list",
};

const serializeDate = (date: Date | null): string | undefined => (date ? date.toISOString().split("T")[0] : undefined);

const deserializeDate = (dateString: string | null): Date | null => (dateString ? new Date(dateString) : null);

const serializeSearchValueToUrl = (key: keyof InspectionSearchParams, value: any): string | undefined => {
  if (value == null) {
    return undefined;
  }

  // If value equals default we don't need to include it in the URL
  if (value === DEFAULT_SEARCH_VALUES[key]) {
    return undefined;
  }

  if (value instanceof Date) {
    return serializeDate(value);
  }

  switch (typeof value) {
    case "string":
      return value.trim() || undefined;
    case "number":
      return value.toString();
    case "boolean":
      return value.toString();
    default:
      return value ? String(value) : undefined;
  }
};

export const useInspectionSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchValues: InspectionSearchParams = useMemo(
    () => ({
      search: searchParams.get("search") || DEFAULT_SEARCH_VALUES.search,
      inspectionStatus: searchParams.get("inspectionStatus"),
      leadAgency: searchParams.get("leadAgency"),
      startDate: deserializeDate(searchParams.get("startDate")),
      endDate: deserializeDate(searchParams.get("endDate")),
      sortBy: searchParams.get("sortBy") || DEFAULT_SEARCH_VALUES.sortBy,
      sortOrder: searchParams.get("sortOrder") || DEFAULT_SEARCH_VALUES.sortOrder,
      page: Number.parseInt(searchParams.get("page") || "1", 10),
      pageSize: Number.parseInt(searchParams.get("pageSize") || "25", 10),
      viewType: (searchParams.get("viewType") as "list" | "map") || DEFAULT_SEARCH_VALUES.viewType,
    }),
    [searchParams],
  );

  const setValues = useCallback(
    (values: Partial<InspectionSearchParams> | { [K in keyof InspectionSearchParams]: InspectionSearchParams[K] }) => {
      setSearchParams(
        (currentParams) => {
          const newParams = new URLSearchParams(currentParams);

          for (const [key, value] of Object.entries(values)) {
            const serialized = serializeSearchValueToUrl(key as keyof InspectionSearchParams, value);

            if (serialized === undefined) {
              newParams.delete(key);
            } else {
              newParams.set(key, serialized);
            }
          }

          // Reset to page 1 when filters change (except for page/pageSize/sort changes)
          const filterFields = Object.keys(values).filter(
            (key) => !["page", "pageSize", "sortBy", "sortOrder"].includes(key),
          );
          if (filterFields.length > 0) {
            newParams.delete("page");
          }

          return newParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearValues = useCallback(
    (keys: keyof InspectionSearchParams | (keyof InspectionSearchParams)[]) => {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      const valuesToClear: Partial<InspectionSearchParams> = {};

      for (const key of keysArray) {
        (valuesToClear as any)[key] = DEFAULT_SEARCH_VALUES[key];
      }

      setValues(valuesToClear);
    },
    [setValues],
  );

  const setSort = useCallback(
    (sortBy: string, sortOrder: string) => {
      setValues({ sortBy, sortOrder });
    },
    [setValues],
  );

  const resetSearch = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const getFilters = useCallback(() => {
    const { viewType, page, pageSize, ...filters } = searchValues;
    return filters;
  }, [searchValues]);

  return {
    searchValues,
    setValues,
    setSort,
    clearValues,
    resetSearch,
    getFilters,
  };
};
