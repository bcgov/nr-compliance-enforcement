import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import Option from "@apptypes/app/option";
import { SORT_TYPES } from "@constants/sort-direction";

export interface CaseSearchFormData {
  searchQuery: string;
  status: string;
  leadAgency: string;
  startDate: Date | null;
  endDate: Date | null;
  sortBy: string;
  sortOrder: string;
  page: number;
  pageSize: number;
  viewType: "list" | "map";
}

// Constants
const DEFAULT_FORM_VALUES: CaseSearchFormData = {
  searchQuery: "",
  status: null,
  leadAgency: null,
  startDate: null,
  endDate: null,
  sortBy: "caseOpenedTimestamp",
  sortOrder: SORT_TYPES.DESC,
  page: 1,
  pageSize: 25,
  viewType: "list",
};

// Utility functions
const serializeDate = (date: Date | null): string | undefined => (date ? date.toISOString().split("T")[0] : undefined);

const deserializeDate = (dateString: string | null): Date | null => (dateString ? new Date(dateString) : null);

// URL parameter mapping functions
const serializeFormValueToUrl = (key: keyof CaseSearchFormData, value: any): string | undefined => {
  switch (key) {
    case "searchQuery":
      return value || undefined;
    case "status":
    case "leadAgency":
      return value || undefined;
    case "startDate":
    case "endDate":
      return serializeDate(value);
    case "sortBy":
      return value !== DEFAULT_FORM_VALUES.sortBy ? value : undefined;
    case "sortOrder":
      return value !== DEFAULT_FORM_VALUES.sortOrder ? value : undefined;
    case "page":
      return value !== DEFAULT_FORM_VALUES.page ? value.toString() : undefined;
    case "pageSize":
      return value !== DEFAULT_FORM_VALUES.pageSize ? value.toString() : undefined;
    case "viewType":
      return value !== DEFAULT_FORM_VALUES.viewType ? value : undefined;
    default:
      return undefined;
  }
};

const URL_PARAM_NAMES = {
  searchQuery: "search",
  status: "status",
  leadAgency: "leadAgency",
  startDate: "startDate",
  endDate: "endDate",
  sortBy: "sortBy",
  sortOrder: "sortOrder",
  page: "page",
  pageSize: "pageSize",
  viewType: "viewType",
} as const;

export const useCaseSearchForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse URL params to form values (memoized to prevent infinite re-renders)
  const formValues: CaseSearchFormData = useMemo(
    () => ({
      searchQuery: searchParams.get("search") || DEFAULT_FORM_VALUES.searchQuery,
      status: searchParams.get("status"),
      leadAgency: searchParams.get("leadAgency"),
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

  // Update URL with new field value
  const setFieldValue = useCallback(
    (field: keyof CaseSearchFormData, value: any) => {
      setSearchParams(
        (currentParams) => {
          const newParams = new URLSearchParams(currentParams);

          const serialized = serializeFormValueToUrl(field, value);
          const paramName = URL_PARAM_NAMES[field];

          if (serialized !== undefined) {
            newParams.set(paramName, serialized);
          } else {
            newParams.delete(paramName);
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
    (updates: Partial<CaseSearchFormData>) => {
      setSearchParams(
        (currentParams) => {
          const newParams = new URLSearchParams(currentParams);

          // Apply all updates to the new params
          Object.entries(updates).forEach(([field, value]) => {
            const fieldKey = field as keyof CaseSearchFormData;
            const serialized = serializeFormValueToUrl(fieldKey, value);
            const paramName = URL_PARAM_NAMES[fieldKey];

            if (serialized !== undefined) {
              newParams.set(paramName, serialized);
            } else {
              newParams.delete(paramName);
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

  // Clear a specific filter
  const clearFilter = useCallback(
    (filterName: keyof CaseSearchFormData) => {
      setFieldValue(filterName, DEFAULT_FORM_VALUES[filterName]);
    },
    [setFieldValue],
  );

  // Reset all filters
  const resetForm = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  // Get API filters from current URL params
  const getFilters = useCallback(() => {
    return {
      search: formValues.searchQuery || undefined,
      agencyCode: formValues.leadAgency || undefined,
      caseStatus: formValues.status || undefined,
      sortBy: formValues.sortBy || undefined,
      sortOrder: formValues.sortOrder || undefined,
      startDate: formValues.startDate || undefined,
      endDate: formValues.endDate || undefined,
    };
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
