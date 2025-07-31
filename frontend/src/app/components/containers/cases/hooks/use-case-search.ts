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

const DEFAULT_FORM_VALUES: CaseSearchParams = {
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

const serializeFormValueToUrl = (key: keyof CaseSearchParams, value: any): string | undefined => {
  if (value == null) {
    return undefined;
  }

  // If value equals default we don't need to include it in the URL
  if (value === DEFAULT_FORM_VALUES[key]) {
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

  const formValues: CaseSearchParams = useMemo(
    () => ({
      search: searchParams.get("search") || DEFAULT_FORM_VALUES.search,
      caseStatus: searchParams.get("caseStatus"),
      agencyCode: searchParams.get("agencyCode"),
      startDate: deserializeDate(searchParams.get("startDate")),
      endDate: deserializeDate(searchParams.get("endDate")),
      sortBy: searchParams.get("sortBy") || DEFAULT_FORM_VALUES.sortBy,
      sortOrder: searchParams.get("sortOrder") || DEFAULT_FORM_VALUES.sortOrder,
      page: parseInt(searchParams.get("page") || "1", 10),
      pageSize: parseInt(searchParams.get("pageSize") || "25", 10),
      viewType: (searchParams.get("viewType") as "list" | "map") || DEFAULT_FORM_VALUES.viewType,
    }),
    [searchParams],
  );

  const setFieldValue = useCallback(
    (field: keyof CaseSearchParams, value: any) => {
      setSearchParams(
        (currentParams) => {
          const newParams = new URLSearchParams(currentParams);

          const serialized = serializeFormValueToUrl(field, value);

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

  // Update multiple fields at once (useful for sorting)
  const setMultipleFieldValues = useCallback(
    (updates: Partial<CaseSearchParams>) => {
      setSearchParams(
        (currentParams) => {
          const newParams = new URLSearchParams(currentParams);

          // Apply all updates to the new params
          Object.entries(updates).forEach(([field, value]) => {
            const fieldKey = field as keyof CaseSearchParams;
            const serialized = serializeFormValueToUrl(fieldKey, value);

            if (serialized !== undefined) {
              newParams.set(fieldKey, serialized);
            } else {
              newParams.delete(fieldKey);
            }
          });

          // Reset to page 1 when filters change (except for page/pageSize/sorting changes)
          const updatedFields = Object.keys(updates);
          const hasNonSortingUpdates = updatedFields.some(
            (field) => field !== "page" && field !== "pageSize" && field !== "sortBy" && field !== "sortOrder",
          );
          if (hasNonSortingUpdates) {
            newParams.delete("page");
          }

          return newParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearFilter = useCallback(
    (filterName: keyof CaseSearchParams) => {
      setFieldValue(filterName, DEFAULT_FORM_VALUES[filterName]);
    },
    [setFieldValue],
  );

  const resetForm = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const getFilters = useCallback(() => {
    return formValues;
  }, [formValues]);

  return {
    formValues,
    setFieldValue,
    setMultipleFieldValues,
    clearFilter,
    resetForm,
    getFilters,
  };
};
