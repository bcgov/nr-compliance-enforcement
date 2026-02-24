import { useCallback, useEffect, useRef, useState } from "react";

const useUnsavedChangesWarning = (isDirty: boolean) => {
  // Used to override hook behavior in cases where we want to be able to navigate (e.g. cancelling or saving changes then going to a new page)
  const allowNavigationRef = useRef(false);

  const allowNavigation = useCallback(() => {
    allowNavigationRef.current = true;
  }, []);

  // Browser-level navigation (refresh, tab close, URL bar)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // In-app navigation (back/forward buttons + React Router Links)
  useEffect(() => {
    if (!isDirty) return;

    const originalPushState = globalThis.history.pushState.bind(globalThis.history);

    globalThis.history.pushState = (...args) => {
      if (allowNavigationRef.current) {
        allowNavigationRef.current = false;
        originalPushState(...args);
        return;
      }
      const confirmed = globalThis.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (confirmed) originalPushState(...args);
    };

    const handlePopState = () => {
      if (allowNavigationRef.current) {
        allowNavigationRef.current = false;
        return;
      }
      const confirmed = globalThis.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmed) globalThis.history.pushState(null, "", globalThis.location.href);
    };

    originalPushState(null, "", globalThis.location.href);
    const timer = setTimeout(() => {
      globalThis.addEventListener("popstate", handlePopState);
    }, 100);

    return () => {
      clearTimeout(timer);
      globalThis.history.pushState = originalPushState;
      globalThis.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty]);

  return { allowNavigation };
};

// Helper hook for managing form state
export const useFormDirtyState = (onDirtyChange?: (index: number, isDirty: boolean) => void) => {
  const [isDirty, setIsDirty] = useState(false);
  const [dirtyChildren, setDirtyChildren] = useState<Record<number, boolean>>({});

  const markDirty = () => setIsDirty(true);
  const markClean = () => setIsDirty(false);

  // Hook for tracking dirty state in forms, supporting both local state and child component aggregation
  // onDirtyChange - is a callback to bubble dirty state to parent. The index parameter is controlled
  //        by the parent via a wrapper e.g. (_, isDirty) => handleChildDirtyChange(2, isDirty)
  //        See create complaint or complaint outcome report for a working example.
  // Usage:
  //   - Leaf components: use markDirty/markClean to track local state
  //   - Parent components: use handleChildDirtyChange to aggregate child dirty states and pass isAnyDirty to useUnsavedChangesWarning
  const handleChildDirtyChange = (childIndex: number, childIsDirty: boolean) => {
    setDirtyChildren((prev) => ({ ...prev, [childIndex]: childIsDirty }));
  };

  const isAnyDirty = isDirty || Object.values(dirtyChildren).some(Boolean);

  // Bubble up dirty status to the parent
  useEffect(() => {
    // The index passed here is ignored by the parent since it controls
    // the index via a wrapper e.g. (_, isDirty) => handleChildDirtyChange(2, isDirty)
    onDirtyChange?.(0, isAnyDirty);
  }, [isAnyDirty]);

  return { isAnyDirty, markDirty, markClean, handleChildDirtyChange };
};

export default useUnsavedChangesWarning;
