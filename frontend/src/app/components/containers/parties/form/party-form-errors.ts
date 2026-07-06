import { ToggleError } from "@/app/common/toast";

export const BUSINESS_NUMBER_FIELD = "businessNumber.identifierValue";
export const BUSINESS_NUMBER_IN_USE_MESSAGE = "This business number is already in use.";

type GraphQLErrorShape = {
  response?: {
    errors?: Array<{
      message?: string;
      extensions?: { originalError?: string };
    }>;
  };
};

type FieldWithErrors = {
  state: {
    meta: {
      errors?: unknown[];
    };
  };
};

export const getFieldErrorMessage = (field: FieldWithErrors): string => {
  for (const error of field.state.meta.errors ?? []) {
    if (!error) {
      continue;
    }
    if (typeof error === "string") {
      return error;
    }
    if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return "";
};

export const getGraphQLErrorMessage = (error: unknown): string | undefined => {
  const gqlError = (error as GraphQLErrorShape)?.response?.errors?.[0];
  return gqlError?.extensions?.originalError ?? gqlError?.message;
};

export const isBusinessNumberInUseMessage = (message?: string): boolean => {
  if (!message) {
    return false;
  }

  if (message === BUSINESS_NUMBER_IN_USE_MESSAGE) {
    return true;
  }
  return false;
};

export const setBusinessNumberFieldError = (form: { setFieldMeta: Function }, message: string) => {
  form.setFieldMeta(BUSINESS_NUMBER_FIELD, (meta: Record<string, unknown>) => ({
    ...meta,
    isTouched: true,
    errorMap: {
      ...(meta.errorMap as Record<string, unknown> | undefined),
      onSubmit: message,
    },
    errorSourceMap: {
      ...(meta.errorSourceMap as Record<string, unknown> | undefined),
      onSubmit: "field",
    },
  }));
};

export const handleBusinessPartyMutationError = (
  form: { setFieldMeta: Function },
  error: unknown,
  fallbackMessage: string,
): boolean => {
  const message = getGraphQLErrorMessage(error) ?? fallbackMessage;

  if (isBusinessNumberInUseMessage(message)) {
    setBusinessNumberFieldError(form, BUSINESS_NUMBER_IN_USE_MESSAGE);
    return true;
  }

  ToggleError(message);
  return false;
};

// scrolls the first visible error message and sets focus to that control
export const scrollToFirstFieldError = () => {
  setTimeout(() => {
    const errorEl = Array.from(document.querySelectorAll<HTMLElement>(".error-message")).find(
      (el) => el.offsetParent !== null && !!el.textContent?.trim(),
    );
    if (!errorEl) return;
    errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    errorEl
      .closest(".comp-details-form-row")
      ?.querySelector<HTMLElement>("input, select, textarea")
      ?.focus({ preventScroll: true });
  }, 0);
};
