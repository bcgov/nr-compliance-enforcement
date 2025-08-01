import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { SORT_TYPES } from "@constants/sort-direction";

export interface CaseSearchParams {
  search: string;
  caseStatus: string | null;
  agencyCode: string | null;
  startDate: Date | null;
  endDate: Date | null;
  sortBy: string;
  sortOrder: string;
  page: number;
  pageSize: number;
  viewType: "list" | "map";
}

const DEFAULT_SEARCH_VALUES: CaseSearchParams = {
  search: "",
  caseStatus: null,
  agencyCode: null,
  startDate: null,
  endDate: null,
  sortBy: "caseOpenedTimestamp",
  sortOrder: SORT_TYPES.DESC,
  page: 1,
  pageSize: 25,
  viewType: "list",
};

const serializeDate = (date: Date | null): string | undefined => (date ? date.toISOString().split("T")[0] : undefined);

const deserializeDate = (dateString: string | null): Date | null => (dateString ? new Date(dateString) : null);

const serializeSearchValueToUrl = (key: keyof CaseSearchParams, value: any): string | undefined => {
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

export const useCaseSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchValues: CaseSearchParams = useMemo(
    () => ({
      search: searchParams.get("search") || DEFAULT_SEARCH_VALUES.search,
      caseStatus: searchParams.get("caseStatus"),
      agencyCode: searchParams.get("agencyCode"),
      startDate: deserializeDate(searchParams.get("startDate")),
      endDate: deserializeDate(searchParams.get("endDate")),
      sortBy: searchParams.get("sortBy") || DEFAULT_SEARCH_VALUES.sortBy,
      sortOrder: searchParams.get("sortOrder") || DEFAULT_SEARCH_VALUES.sortOrder,
      page: parseInt(searchParams.get("page") || "1", 10),
      pageSize: parseInt(searchParams.get("pageSize") || "25", 10),
      viewType: (searchParams.get("viewType") as "list" | "map") || DEFAULT_SEARCH_VALUES.viewType,
    }),
    [searchParams],
  );

  const setValue = useCallback(
    (field: keyof CaseSearchParams, value: any) => {
      setSearchParams(
        (currentParams) => {
          const newParams = new URLSearchParams(currentParams);

          const serialized = serializeSearchValueToUrl(field, value);

          if (serialized !== undefined) {
            newParams.set(field, serialized);
          } else {
            newParams.delete(field);
          }

          // Reset to page 1 when filters change (except for page/pageSize changes)
          if (field !== "page" && field !== "pageSize" && field !== "sortBy" && field !== "sortOrder") {
            newParams.delete("page");
          }

          return newParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSort = useCallback(
    (sortBy: string, sortOrder: string) => {
      setSearchParams(
        (currentParams) => {
          const newParams = new URLSearchParams(currentParams);
          newParams.set("sortBy", sortBy);
          newParams.set("sortOrder", sortOrder);
          return newParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearFilter = useCallback(
    (filterName: keyof CaseSearchParams) => {
      setValue(filterName, DEFAULT_SEARCH_VALUES[filterName]);
    },
    [setValue],
  );

  const resetSearch = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const getFilters = useCallback(() => {
    return searchValues;
  }, [searchValues]);

  return {
    searchValues,
    setValue,
    setSort,
    clearFilter,
    resetSearch,
    getFilters,
  };
};
