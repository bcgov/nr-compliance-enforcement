import { useForm } from "@tanstack/react-form";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
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

export const useCaseSearchForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitializing = useRef(true);
  const isUrlUpdate = useRef(false);

  // Parse URL params to form values
  const parseUrlToFormValues = useCallback(
    (): CaseSearchFormData => ({
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
    }),
    [searchParams],
  );

  const form = useForm({
    defaultValues: parseUrlToFormValues(),
    onSubmit: async ({ value }) => {
      updateUrl(value);
    },
  });

  // Convert form values to URL params
  const buildUrlParams = useCallback((values: CaseSearchFormData): URLSearchParams => {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      const formKey = key as keyof CaseSearchFormData;
      const serialized = serializeFormValueToUrl(formKey, value);
      if (serialized !== undefined) {
        const paramName = URL_PARAM_NAMES[formKey];
        params.set(paramName, serialized);
      }
    });

    return params;
  }, []);

  // Update URL with form values
  const updateUrl = useCallback(
    (values: CaseSearchFormData) => {
      if (isUrlUpdate.current) return;

      const params = buildUrlParams(values);
      setSearchParams(params, { replace: true });
    },
    [buildUrlParams, setSearchParams],
  );

  // Debounced URL update for search/filter changes
  const debouncedUpdateUrl = useCallback(
    debounce((values: CaseSearchFormData) => {
      if (!isInitializing.current) {
        updateUrl(values);
      }
    }, 300),
    [updateUrl],
  );

  // Immediate URL update for sorting/pagination
  const updateUrlImmediate = useCallback(
    (values: CaseSearchFormData) => {
      if (!isInitializing.current) {
        updateUrl(values);
      }
    },
    [updateUrl],
  );

  // Auto-update URL when form values change
  useEffect(() => {
    const subscription = form.store.subscribe(() => {
      const values = form.store.state.values;
      debouncedUpdateUrl(values);
    });

    return () => subscription();
  }, [form.store, debouncedUpdateUrl]);

  // Update form when URL changes (browser navigation)
  useEffect(() => {
    const newValues = parseUrlToFormValues();
    const currentValues = form.store.state.values;

    // Check if values actually changed
    const hasChanged = Object.keys(newValues).some((key) => {
      const newVal = newValues[key as keyof CaseSearchFormData];
      const currentVal = currentValues[key as keyof CaseSearchFormData];
      return JSON.stringify(newVal) !== JSON.stringify(currentVal);
    });

    if (hasChanged) {
      isUrlUpdate.current = true;

      Object.entries(newValues).forEach(([key, value]) => {
        form.setFieldValue(key as keyof CaseSearchFormData, value);
      });

      setTimeout(() => {
        isUrlUpdate.current = false;
      }, 100);
    }
  }, [searchParams, form, parseUrlToFormValues]);

  // Initialize hook
  useEffect(() => {
    const timer = setTimeout(() => {
      isInitializing.current = false;
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Exposed setFieldValue function
  const setFieldValue = useCallback(
    (field: keyof CaseSearchFormData, value: any) => {
      form.setFieldValue(field, value);
    },
    [form],
  );

  // Helper functions
  const clearFilter = useCallback(
    (filterName: keyof CaseSearchFormData) => {
      form.setFieldValue(filterName, DEFAULT_FORM_VALUES[filterName] as any);
      // Hook's form subscription will automatically handle URL update
    },
    [form],
  );

  const resetForm = useCallback(() => {
    form.reset();
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [form, setSearchParams]);

  // Get API filters from form values
  const getAPIFilters = useCallback(() => {
    const values = form.store.state.values;
    return {
      search: values.searchQuery || undefined,
      agencyCode: values.leadAgency?.value || undefined,
      caseStatus: values.status?.value || undefined,
      sortBy: values.sortBy || undefined,
      sortOrder: values.sortOrder || undefined,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
    };
  }, [form.store.state.values]);

  return {
    formValues: form.store.state.values,
    setFieldValue,
    statusOptions: STATUS_OPTIONS,
    leadAgencyOptions: LEAD_AGENCY_OPTIONS,
    clearFilter,
    resetForm,
    getAPIFilters,
  };
};
