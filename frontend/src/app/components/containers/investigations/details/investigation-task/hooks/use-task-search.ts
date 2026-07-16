import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

export interface TaskSearchParams {
  categoryFilter: string | null;
  subCategoryFilter: string | null;
  statusFilter: string | null;
  officerFilter: string | null;
}

const DEFAULT_SEARCH_VALUES: TaskSearchParams = {
  categoryFilter: null,
  subCategoryFilter: null,
  statusFilter: null,
  officerFilter: null,
};

const serializeSearchValueToUrl = (key: keyof TaskSearchParams, value: any): string | undefined => {
  if (value == null) {
    return undefined;
  }

  if (value === DEFAULT_SEARCH_VALUES[key]) {
    return undefined;
  }

  return typeof value === "string" ? value.trim() || undefined : String(value);
};

export const useTaskSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchValues: TaskSearchParams = useMemo(
    () => ({
      categoryFilter: searchParams.get("categoryFilter"),
      subCategoryFilter: searchParams.get("subCategoryFilter"),
      statusFilter: searchParams.get("statusFilter"),
      officerFilter: searchParams.get("officerFilter"),
    }),
    [searchParams],
  );

  const setValues = useCallback(
    (values: Partial<TaskSearchParams>) => {
      setSearchParams(
        (currentParams) => {
          const newParams = new URLSearchParams(currentParams);

          Object.entries(values).forEach(([key, value]) => {
            const serialized = serializeSearchValueToUrl(key as keyof TaskSearchParams, value);

            if (serialized === undefined) {
              newParams.delete(key);
            } else {
              newParams.set(key, serialized);
            }
          });

          return newParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearValues = useCallback(
    (keys: keyof TaskSearchParams | (keyof TaskSearchParams)[]) => {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      const valuesToClear: Partial<TaskSearchParams> = {};

      keysArray.forEach((key) => {
        (valuesToClear as any)[key] = DEFAULT_SEARCH_VALUES[key];
      });

      setValues(valuesToClear);
    },
    [setValues],
  );

  return {
    searchValues,
    setValues,
    clearValues,
  };
};
