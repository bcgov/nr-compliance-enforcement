import { useCallback, useMemo, useState } from "react";

type UseDuplicateFileWarningParams = {
  /** Display names of the files currently staged for upload. */
  stagedNames: string[];
  /** Display names of the attachments already saved against this record. */
  existingNames: string[];
};

type UseDuplicateFileWarningResult = {
  /** Staged files that collide with an existing attachment and have not been acknowledged. */
  duplicateFileNames: string[];
  /** True while an unacknowledged collision is staged, so saving should be blocked. */
  isBlocked: boolean;
  /** Acknowledges the current collisions, letting them replace the existing attachments. */
  confirm: () => void;
  /** Clears acknowledgements, for when the staged selection is discarded. */
  reset: () => void;
};

/**
 * Derives the pending duplicate-filename warnings from whatever is currently staged, rather than
 * from the most recent selection. Recomputing means the warning self-corrects when a staged file is
 * removed or re-selected, instead of going stale against the staged set.
 */
export const useDuplicateFileWarning = ({
  stagedNames,
  existingNames,
}: UseDuplicateFileWarningParams): UseDuplicateFileWarningResult => {
  const [confirmedDuplicates, setConfirmedDuplicates] = useState<Set<string>>(new Set());

  const stagedKey = stagedNames.join("\u0000");
  const existingKey = existingNames.join("\u0000");

  const duplicateFileNames = useMemo(() => {
    const existing = new Set(existingNames);
    return stagedNames.filter((name) => existing.has(name) && !confirmedDuplicates.has(name));
  }, [stagedKey, existingKey, confirmedDuplicates]);

  const confirm = useCallback(() => {
    setConfirmedDuplicates((prev) => {
      const next = new Set(prev);
      duplicateFileNames.forEach((name) => next.add(name));
      return next;
    });
  }, [duplicateFileNames]);

  const reset = useCallback(() => {
    setConfirmedDuplicates(new Set());
  }, []);

  return {
    duplicateFileNames,
    isBlocked: duplicateFileNames.length > 0,
    confirm,
    reset,
  };
};
