import { useCallback, useEffect, useRef } from "react";

export const useMultiStepForm = (
  onRequestValidate: (fn: (step: number) => Promise<boolean>) => void,
  onRequestSave: (fn: () => Promise<void>) => void,
) => {
  const validateFnsRef = useRef<Record<number, () => Promise<boolean>>>({});
  const getValuesFnsRef = useRef<Record<number, () => unknown>>({});

  const registerStepValidate = useCallback((step: number, fn: () => Promise<boolean>) => {
    validateFnsRef.current[step] = fn;
  }, []);

  const registerStepValues = useCallback(<T>(step: number, fn: () => T) => {
    getValuesFnsRef.current[step] = fn as () => unknown;
  }, []);

  const getStepValues = useCallback(<T>(step: number): T | undefined => {
    return getValuesFnsRef.current[step]?.() as T;
  }, []);

  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    return (await validateFnsRef.current[step]?.()) ?? false;
  }, []);

  useEffect(() => {
    onRequestValidate(async (step: number) => {
      return (await validateFnsRef.current[step]?.()) ?? false;
    });
  }, [onRequestValidate]);

  return { registerStepValidate, registerStepValues, getStepValues, validateStep };
};
