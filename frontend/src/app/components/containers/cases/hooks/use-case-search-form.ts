import { useSearchParams } from "react-router-dom";
import { useCallback, useRef } from "react";
import Option from "@apptypes/app/option";
import { SORT_TYPES } from "@constants/sort-direction";

export interface CaseSearchFormData {
  searchQuery: string;
  status: Option | null;
  leadAgency: Option | null;
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

const STATUS_OPTIONS: Option[] = [
  { value: "OPEN", label: "Open" },
  { value: "CLOSED", label: "Closed" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "PENDING", label: "Pending" },
];

const LEAD_AGENCY_OPTIONS: Option[] = [
  { value: "COS", label: "Conservation Officer Service" },
  { value: "PARKS", label: "Parks Canada" },
  { value: "RCMP", label: "RCMP" },
  { value: "OTHER", label: "Other" },
];

// Utility functions
const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const serializeDate = (date: Date | null): string | undefined => (date ? date.toISOString().split("T")[0] : undefined);

const deserializeDate = (dateString: string | null): Date | null => (dateString ? new Date(dateString) : null);

const serializeOption = (option: Option | null): string | undefined => option?.value;

const deserializeOption = (value: string | null, options: Option[]): Option | null =>
  value ? options.find((opt) => opt.value === value) || null : null;

// URL parameter mapping functions
const serializeFormValueToUrl = (key: keyof CaseSearchFormData, value: any): string | undefined => {
  switch (key) {
    case "searchQuery":
      return value || undefined;
    case "status":
    case "leadAgency":
      return serializeOption(value);
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

// Global debounced update function to prevent multiple simultaneous URL updates
let globalDebouncedUpdate: ((newParams: URLSearchParams, setter: (params: URLSearchParams) => void) => void) | null =
  null;
let immediateUpdateFields = new Set(["page", "pageSize", "sortBy", "sortOrder"]); // Fields that need immediate updates
let updateInProgress = false;

export const useCaseSearchForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lastUpdateTime = useRef(0);

  // Parse URL params to form values
  const formValues: CaseSearchFormData = {
    searchQuery: searchParams.get("search") || DEFAULT_FORM_VALUES.searchQuery,
    status: deserializeOption(searchParams.get("status"), STATUS_OPTIONS),
    leadAgency: deserializeOption(searchParams.get("leadAgency"), LEAD_AGENCY_OPTIONS),
    startDate: deserializeDate(searchParams.get("startDate")),
    endDate: deserializeDate(searchParams.get("endDate")),
    sortBy: searchParams.get("sortBy") || DEFAULT_FORM_VALUES.sortBy,
    sortOrder: searchParams.get("sortOrder") || DEFAULT_FORM_VALUES.sortOrder,
    page: parseInt(searchParams.get("page") || "1", 10),
    pageSize: parseInt(searchParams.get("pageSize") || "25", 10),
    viewType: (searchParams.get("viewType") as "list" | "map") || DEFAULT_FORM_VALUES.viewType,
  };

  // Create debounced update function once
  if (!globalDebouncedUpdate) {
    globalDebouncedUpdate = debounce((newParams: URLSearchParams, setter: (params: URLSearchParams) => void) => {
      if (!updateInProgress) {
        updateInProgress = true;
        setter(newParams);
        setTimeout(() => {
          updateInProgress = false;
        }, 100);
      }
    }, 300);
  }

  // Update URL with new field value
  const setFieldValue = useCallback(
    (field: keyof CaseSearchFormData, value: any) => {
      // Throttle rapid updates
      const now = Date.now();
      if (now - lastUpdateTime.current < 50) {
        return;
      }
      lastUpdateTime.current = now;

      const newParams = new URLSearchParams(searchParams);

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

      // Use immediate update for pagination/sorting, debounced for everything else
      if (immediateUpdateFields.has(field)) {
        if (!updateInProgress) {
          updateInProgress = true;
          setSearchParams(newParams, { replace: true });
          setTimeout(() => {
            updateInProgress = false;
          }, 100);
        }
      } else {
        globalDebouncedUpdate!(newParams, setSearchParams);
      }
    },
    [searchParams, setSearchParams],
  );

  // Update multiple fields at once (useful for sorting)
  const setMultipleFieldValues = useCallback(
    (updates: Partial<CaseSearchFormData>) => {
      const now = Date.now();
      if (now - lastUpdateTime.current < 50) {
        return;
      }
      lastUpdateTime.current = now;

      const newParams = new URLSearchParams(searchParams);

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

      // Use immediate update since this is typically used for sorting
      if (!updateInProgress) {
        updateInProgress = true;
        setSearchParams(newParams, { replace: true });
        setTimeout(() => {
          updateInProgress = false;
        }, 100);
      }
    },
    [searchParams, setSearchParams],
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
      agencyCode: formValues.leadAgency?.value || undefined,
      caseStatus: formValues.status?.value || undefined,
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
    statusOptions: STATUS_OPTIONS,
    leadAgencyOptions: LEAD_AGENCY_OPTIONS,
    clearFilter,
    resetForm,
    getFilters,
  };
};
