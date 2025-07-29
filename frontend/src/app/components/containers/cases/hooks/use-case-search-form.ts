import { useForm } from "@tanstack/react-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
import Option from "@apptypes/app/option";
import { SORT_TYPES } from "@constants/sort-direction";

// Debounce utility function
const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

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

// Utility functions for URL serialization
const serializeDate = (date: Date | null): string | undefined => {
  return date ? date.toISOString().split("T")[0] : undefined;
};

const deserializeDate = (dateString: string | null): Date | null => {
  return dateString ? new Date(dateString) : null;
};

const serializeOption = (option: Option | null): string | undefined => {
  return option ? option.value : undefined;
};

const deserializeOption = (value: string | null, options: Option[]): Option | null => {
  return value ? options.find((opt) => opt.value === value) || null : null;
};

export const useCaseSearchForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isInitializing = useRef(true);
  const isUpdatingFromURL = useRef(false);
  const lastUrlValues = useRef<CaseSearchFormData | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Options for selects - these would normally come from API/redux
  const statusOptions: Option[] = [
    { value: "OPEN", label: "Open" },
    { value: "CLOSED", label: "Closed" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "PENDING", label: "Pending" },
  ];

  const leadAgencyOptions: Option[] = [
    { value: "COS", label: "Conservation Officer Service" },
    { value: "PARKS", label: "Parks Canada" },
    { value: "RCMP", label: "RCMP" },
    { value: "OTHER", label: "Other" },
  ];

  // Parse URL params to form values
  const getInitialValues = useCallback((): CaseSearchFormData => {
    return {
      searchQuery: searchParams.get("search") || DEFAULT_FORM_VALUES.searchQuery,
      status: deserializeOption(searchParams.get("status"), statusOptions),
      leadAgency: deserializeOption(searchParams.get("leadAgency"), leadAgencyOptions),
      startDate: deserializeDate(searchParams.get("startDate")),
      endDate: deserializeDate(searchParams.get("endDate")),
      sortBy: searchParams.get("sortBy") || DEFAULT_FORM_VALUES.sortBy,
      sortOrder: searchParams.get("sortOrder") || DEFAULT_FORM_VALUES.sortOrder,
      page: parseInt(searchParams.get("page") || "1", 10),
      pageSize: parseInt(searchParams.get("pageSize") || "25", 10),
      viewType: (searchParams.get("viewType") as "list" | "map") || DEFAULT_FORM_VALUES.viewType,
    };
  }, [searchParams, statusOptions, leadAgencyOptions]);

  const form = useForm({
    defaultValues: getInitialValues(),
    onSubmit: async ({ value }) => {
      // This will be called when form is submitted
      updateURL(value);
    },
  });

  // Update URL when form values change
  const updateURL = useCallback(
    (values: CaseSearchFormData) => {
      const params = new URLSearchParams();

      if (values.searchQuery) params.set("search", values.searchQuery);
      if (values.status?.value) params.set("status", values.status.value);
      if (values.leadAgency?.value) params.set("leadAgency", values.leadAgency.value);
      const startDateStr = serializeDate(values.startDate);
      if (startDateStr) params.set("startDate", startDateStr);
      const endDateStr = serializeDate(values.endDate);
      if (endDateStr) params.set("endDate", endDateStr);
      if (values.sortBy !== DEFAULT_FORM_VALUES.sortBy) params.set("sortBy", values.sortBy);
      if (values.sortOrder !== DEFAULT_FORM_VALUES.sortOrder) params.set("sortOrder", values.sortOrder);
      if (values.page !== DEFAULT_FORM_VALUES.page) params.set("page", values.page.toString());
      if (values.pageSize !== DEFAULT_FORM_VALUES.pageSize) params.set("pageSize", values.pageSize.toString());
      if (values.viewType !== DEFAULT_FORM_VALUES.viewType) params.set("viewType", values.viewType);

      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  // Debounced URL update function
  const debouncedUpdateURL = useCallback(
    debounce((values: CaseSearchFormData) => {
      if (!isInitializing.current && !isUpdatingFromURL.current) {
        // Check if values are different from last URL update to prevent cycles
        if (lastUrlValues.current && JSON.stringify(values) === JSON.stringify(lastUrlValues.current)) {
          return;
        }

        lastUrlValues.current = { ...values };
        updateURL(values);
      }
    }, 300),
    [updateURL],
  );

  // Auto-update URL when form values change (debounced)
  useEffect(() => {
    const subscription = form.store.subscribe(() => {
      const values = form.store.state.values;
      debouncedUpdateURL(values);
    });

    return () => {
      subscription();
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [form.store, debouncedUpdateURL]);

  // Update form when URL changes (browser back/forward)
  useEffect(() => {
    const newValues = getInitialValues();
    const currentValues = form.store.state.values;

    // Check if values actually changed to prevent unnecessary updates
    const hasChanged = Object.entries(newValues).some(([key, value]) => {
      const currentValue = currentValues[key as keyof CaseSearchFormData];
      return JSON.stringify(value) !== JSON.stringify(currentValue);
    });

    if (!hasChanged) {
      return;
    }

    isUpdatingFromURL.current = true;
    isInitializing.current = true;

    Object.entries(newValues).forEach(([key, value]) => {
      form.setFieldValue(key as keyof CaseSearchFormData, value);
    });

    // Store the values we just set to prevent cycles
    lastUrlValues.current = { ...newValues };

    // Mark initialization as complete after a short delay
    setTimeout(() => {
      isInitializing.current = false;
      isUpdatingFromURL.current = false;
    }, 100);
  }, [searchParams, form, getInitialValues]);

  // Mark initialization as complete on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      isInitializing.current = false;
      isUpdatingFromURL.current = false;
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Helper functions
  const updateURLImmediate = useCallback(
    (values: CaseSearchFormData) => {
      if (!isInitializing.current && !isUpdatingFromURL.current) {
        // Check if values are different from last URL update to prevent cycles
        if (lastUrlValues.current && JSON.stringify(values) === JSON.stringify(lastUrlValues.current)) {
          return;
        }

        lastUrlValues.current = { ...values };
        updateURL(values);
      }
    },
    [updateURL],
  );

  const clearFilter = useCallback(
    (filterName: keyof CaseSearchFormData) => {
      form.setFieldValue(filterName, DEFAULT_FORM_VALUES[filterName] as any);
      // Immediately update URL for filter clearing
      setTimeout(() => {
        if (!isInitializing.current) {
          updateURLImmediate(form.store.state.values);
        }
      }, 50);
    },
    [form, updateURLImmediate],
  );

  const resetForm = useCallback(() => {
    form.reset();
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [form, setSearchParams]);

  // Get current form values
  const formValues = form.store.state.values;

  // Transform form values to API format
  const getAPIFilters = useCallback(() => {
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
    form,
    formValues,
    statusOptions,
    leadAgencyOptions,
    clearFilter,
    resetForm,
    getAPIFilters,
    updateURL,
    updateURLImmediate,
  };
};
