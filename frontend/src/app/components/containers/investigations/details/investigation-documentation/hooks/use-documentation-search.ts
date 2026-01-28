import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { SORT_TYPES } from "@constants/sort-direction";

export interface DocumentationSearchParams {
  search: string;
  taskFilter: string | null;
  sortBy: string;
  sortOrder: string;
  page: number;
  pageSize: number;
}

const DEFAULT_SEARCH_VALUES: DocumentationSearchParams = {
  search: "",
  taskFilter: null,
  sortBy: "createdAt",
  sortOrder: SORT_TYPES.DESC,
  page: 1,
  pageSize: 25,
};

const serializeSearchValueToUrl = (key: keyof DocumentationSearchParams, value: any): string | undefined => {
  if (value == null) {
    return undefined;
  }

  // If value equals default we don't need to include it in the URL
  if (value === DEFAULT_SEARCH_VALUES[key]) {
    return undefined;
  }

  switch (typeof value) {
    case "string":
      return value.trim() || undefined;
    case "number":
      return value.toString();
    default:
      return value ? String(value) : undefined;
  }
};

export const useDocumentationSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchValues: DocumentationSearchParams = useMemo(
    () => ({
      search: searchParams.get("search") || DEFAULT_SEARCH_VALUES.search,
      taskFilter: searchParams.get("taskFilter"),
      sortBy: searchParams.get("sortBy") || DEFAULT_SEARCH_VALUES.sortBy,
      sortOrder: searchParams.get("sortOrder") || DEFAULT_SEARCH_VALUES.sortOrder,
      page: Number.parseInt(searchParams.get("page") || "1", 10),
      pageSize: Number.parseInt(searchParams.get("pageSize") || "25", 10),
    }),
    [searchParams],
  );

  const setValues = useCallback(
    (values: Partial<DocumentationSearchParams>) => {
      setSearchParams(
        (currentParams) => {
          const newParams = new URLSearchParams(currentParams);

          Object.entries(values).forEach(([key, value]) => {
            const serialized = serializeSearchValueToUrl(key as keyof DocumentationSearchParams, value);

            if (serialized === undefined) {
              newParams.delete(key);
            } else {
              newParams.set(key, serialized);
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
    (keys: keyof DocumentationSearchParams | (keyof DocumentationSearchParams)[]) => {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      const valuesToClear: Partial<DocumentationSearchParams> = {};

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

  return {
    searchValues,
    setValues,
    setSort,
    clearValues,
    resetSearch,
  };
};
