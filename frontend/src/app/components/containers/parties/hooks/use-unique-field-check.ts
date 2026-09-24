import { useCallback, useEffect, useState } from "react";
import { useStore } from "@tanstack/react-form";
import { ToggleError } from "@/app/common/toast";
import {
  isPartyDuplicatedIdentifier,
  getUniqueFieldConflicts,
} from "@/app/components/containers/parties/form/party-form-errors";
import {
  buildUniqueFieldCheckInput,
  checkPartyUniqueFields,
  PARTY_DUPLICATE_MESSAGE,
  scrollToFormErrorBanner,
} from "@/app/components/containers/parties/form/party-unique-fields";

// Check that none of a party's unique fields already exist on a published profile
export const useUniqueFieldCheck = (form: any, excludePartyIdentifier?: string) => {
  // Set when a save was refused because a unique field already belongs to a published profile
  const [uniqueFieldConflict, setUniqueFieldConflict] = useState(false);

  const serializedUniqueFieldInput = useStore(form.store, (state: any) =>
    JSON.stringify(buildUniqueFieldCheckInput(state.values)),
  );

  useEffect(() => {
    setUniqueFieldConflict(false);
  }, [serializedUniqueFieldInput]);

  const checkUniqueFieldConflicts = useCallback(async (): Promise<boolean> => {
    const values = form.state.values;

    try {
      const conflicts = await checkPartyUniqueFields(buildUniqueFieldCheckInput(values), excludePartyIdentifier);
      getUniqueFieldConflicts(form, values, conflicts);
      setUniqueFieldConflict(conflicts.length > 0);

      if (conflicts.length) {
        ToggleError(PARTY_DUPLICATE_MESSAGE);
        scrollToFormErrorBanner();
        return true;
      }
    } catch (error) {
      console.error("Error checking party identifiers:", error);
      setUniqueFieldConflict(false);
    }

    return false;
  }, [form, excludePartyIdentifier]);

  const handleDuplicateIdentifierError = useCallback((error: unknown): boolean => {
    if (!isPartyDuplicatedIdentifier(error)) {
      return false;
    }
    setUniqueFieldConflict(true);
    ToggleError(PARTY_DUPLICATE_MESSAGE);
    scrollToFormErrorBanner();
    return true;
  }, []);

  return { uniqueFieldConflict, checkUniqueFieldConflicts, handleDuplicateIdentifierError };
};
