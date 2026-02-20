import { useEffect } from "react";

const useUnsavedChangesWarning = (isDirty: boolean) => {
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
      const confirmed = globalThis.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (confirmed) {
        originalPushState(...args);
      }
    };

    const handlePopState = () => {
      const confirmed = globalThis.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmed) {
        globalThis.history.pushState(null, "", globalThis.location.href);
      }
    };

    // Push state first, then attach listener after to avoid immediate trigger
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
};

export default useUnsavedChangesWarning;
