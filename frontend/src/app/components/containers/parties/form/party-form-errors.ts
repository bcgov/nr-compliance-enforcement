import { ToggleError } from "@/app/common/toast";
import { PartyUniqueFieldConflict } from "@/generated/graphql";
import { PartyTypeCodes } from "@/app/constants/party-types";
import {
  DRIVERS_LICENSE_FIELD_CODE,
  PARTY_DUPLICATE_MESSAGE,
  profileExistsMessage,
} from "@/app/components/containers/parties/form/party-unique-fields";
import { BusinessIdentifiers } from "@/app/constants/business-identifiers";

export const BUSINESS_NUMBER_FIELD = "businessNumber.identifierValue";
export const DRIVERS_LICENSE_FIELD = "driversLicenseNumber";
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

const firstErrorMessage = (errors: unknown[] | undefined): string => {
  for (const error of errors ?? []) {
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

export const getFieldErrorMessage = (field: FieldWithErrors): string => firstErrorMessage(field.state.meta.errors);

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

export const isPartyDuplicatedIdentifier = (error: unknown): boolean =>
  getGraphQLErrorMessage(error) === PARTY_DUPLICATE_MESSAGE;

export const setFieldError = (form: { setFieldMeta: Function }, fieldName: string, message: string) => {
  form.setFieldMeta(fieldName, (meta: Record<string, unknown>) => ({
    ...meta,
    isTouched: true,
    errorMap: {
      ...(meta?.errorMap as Record<string, unknown> | undefined),
      onSubmit: message,
    },
    errorSourceMap: {
      ...(meta?.errorSourceMap as Record<string, unknown> | undefined),
      onSubmit: "field",
    },
  }));
};

// Removes the message this module set, leaving any validator error on the field in place
export const clearFieldError = (form: { setFieldMeta: Function }, fieldName: string) => {
  form.setFieldMeta(fieldName, (meta: Record<string, unknown>) => {
    const errorMap = { ...((meta?.errorMap as Record<string, unknown>) ?? {}) };
    const errorSourceMap = { ...((meta?.errorSourceMap as Record<string, unknown>) ?? {}) };
    delete errorMap.onSubmit;
    delete errorSourceMap.onSubmit;
    return { ...meta, errorMap, errorSourceMap };
  });
};

export const setBusinessNumberFieldError = (form: { setFieldMeta: Function }, message: string) =>
  setFieldError(form, BUSINESS_NUMBER_FIELD, message);

const normalizeUniqueValue = (value?: string | null): string => (value ?? "").replace(/[^a-z0-9]/gi, "").toLowerCase();

const uniqueFieldName = (conflict: PartyUniqueFieldConflict, values: any): string | undefined => {
  if (conflict.fieldCode === DRIVERS_LICENSE_FIELD_CODE) return DRIVERS_LICENSE_FIELD;
  if (conflict.fieldCode === BusinessIdentifiers.BUSINESS_NUMBER) return BUSINESS_NUMBER_FIELD;
  const rows: any[] = values?.externalIds ?? [];
  const index = rows.findIndex(
    (row) =>
      row?.externalIdCode === conflict.fieldCode &&
      normalizeUniqueValue(row?.externalIdValue) === normalizeUniqueValue(conflict.value),
  );
  const fallback = rows.findIndex((row) => row?.externalIdCode === conflict.fieldCode);
  const found = index >= 0 ? index : fallback;
  return found >= 0 ? `externalIds[${found}].externalIdValue` : undefined;
};

export const getUniqueFieldConflicts = (
  form: { setFieldMeta: Function },
  values: any,
  conflicts: PartyUniqueFieldConflict[],
) => {
  if (values?.partyType === PartyTypeCodes.PERSON) clearFieldError(form, DRIVERS_LICENSE_FIELD);
  if (values?.partyType === PartyTypeCodes.ORGANIZATION) clearFieldError(form, BUSINESS_NUMBER_FIELD);
  (values?.externalIds ?? []).forEach((_: unknown, index: number) =>
    clearFieldError(form, `externalIds[${index}].externalIdValue`),
  );
  for (const conflict of conflicts) {
    const fieldName = uniqueFieldName(conflict, values);
    if (fieldName) setFieldError(form, fieldName, profileExistsMessage(conflict.shortDescription));
  }
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
