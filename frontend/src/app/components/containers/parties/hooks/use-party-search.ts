import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { SORT_TYPES } from "@constants/sort-direction";

export interface PartySearchParams {
  search: string;
  partyTypeCode: string | null;
  sortBy: string;
  sortOrder: string;
  page: number;
  pageSize: number;
  viewType: "list" | "map";
}

const DEFAULT_SEARCH_VALUES: PartySearchParams = {
  search: "",
  partyTypeCode: null,
  sortBy: "partyIdentifier",
  sortOrder: SORT_TYPES.DESC,
  page: 1,
  pageSize: 25,
  viewType: "list",
};

const serializeDate = (date: Date | null): string | undefined => (date ? date.toISOString().split("T")[0] : undefined);

const serializeSearchValueToUrl = (key: keyof PartySearchParams, value: any): string | undefined => {
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

export const usePartySearch = () => {
  
  const [searchParams, setSearchParams] = useSearchParams();

  const searchValues: PartySearchParams = useMemo(
    () => ({
      search: searchParams.get("search") || DEFAULT_SEARCH_VALUES.search,
      partyTypeCode: searchParams.get("partyTypeCode"),
      sortBy: searchParams.get("sortBy") || DEFAULT_SEARCH_VALUES.sortBy,
      sortOrder: searchParams.get("sortOrder") || DEFAULT_SEARCH_VALUES.sortOrder,
      page: parseInt(searchParams.get("page") || "1", 10),
      pageSize: parseInt(searchParams.get("pageSize") || "25", 10),
      viewType: (searchParams.get("viewType") as "list" | "map") || DEFAULT_SEARCH_VALUES.viewType,
    }),
    [searchParams],
  );

  const setValues = useCallback(
    (values: Partial<PartySearchParams> | { [K in keyof PartySearchParams]: PartySearchParams[K] }) => {
      setSearchParams(
        (currentParams) => {
          const newParams = new URLSearchParams(currentParams);

          Object.entries(values).forEach(([key, value]) => {
            const serialized = serializeSearchValueToUrl(key as keyof PartySearchParams, value);

            if (serialized !== undefined) {
              newParams.set(key, serialized);
            } else {
              newParams.delete(key);
            }
          });

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
    (keys: keyof PartySearchParams | (keyof PartySearchParams)[]) => {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      const valuesToClear: Partial<PartySearchParams> = {};

      keysArray.forEach((key) => {
        (valuesToClear as any)[key] = DEFAULT_SEARCH_VALUES[key];
      });

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
