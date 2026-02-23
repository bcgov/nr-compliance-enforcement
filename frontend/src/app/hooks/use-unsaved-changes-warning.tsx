import { useCallback, useEffect, useRef } from "react";

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

export default useUnsavedChangesWarning;
