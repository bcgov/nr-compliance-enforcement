import React, {
  Component,
  useState,
  useCallback,
  createContext,
  useContext,
  MutableRefObject,
  useMemo,
  useRef,
  ComponentType,
  ReactNode,
  PropsWithChildren,
  ReactElement,
  ErrorInfo,
} from "react";

type ComponentDidCatch = (error: Error, errorInfo: ErrorInfo) => void;

interface ErrorBoundaryProps {
  error: Error | undefined;
  onError: ComponentDidCatch;
}

class ErrorBoundary extends Component<PropsWithChildren<ErrorBoundaryProps>> {
  displayName = "UseErrorBoundary";

  componentDidCatch(...args: Parameters<NonNullable<Component["componentDidCatch"]>>) {
    // silence React warning:
    // ErrorBoundary: Error boundaries should implement getDerivedStateFromError().
    // In that method, return a state update to display an error message or fallback UI
    this.setState({});
    this.props.onError(...args);
  }

  render() {
    return this.props.children;
  }
}

const noop = () => false;

interface ErrorBoundaryCtx {
  componentDidCatch: MutableRefObject<ComponentDidCatch | undefined>;
  error: Error | undefined;
  errorInfo: ErrorInfo | undefined;
  setError: (error: Error | undefined) => void;
}

const errorBoundaryContext = createContext<ErrorBoundaryCtx>({
  componentDidCatch: { current: undefined },
  error: undefined,
  errorInfo: undefined,
  setError: noop,
});

// eslint-disable-next-line @typescript-eslint/ban-types
export function ErrorBoundaryContext({ children }: { children?: ReactNode }) {
  const [error, setError] = useState<Error>();
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>();

  const componentDidCatch = useRef<ComponentDidCatch>();
  const ctx = useMemo(
    () => ({
      componentDidCatch,
      error,
      errorInfo,
      setError,
    }),
    [error, errorInfo],
  );

  debugger;

  return (
    <errorBoundaryContext.Provider value={ctx}>
      <ErrorBoundary
        error={error}
        onError={(error, errorInfo) => {
          setError(error);
          setErrorInfo(errorInfo);
          componentDidCatch.current?.(error, errorInfo);
        }}
      >
        {children}
      </ErrorBoundary>
    </errorBoundaryContext.Provider>
  );
}
ErrorBoundaryContext.displayName = "ErrorBoundaryContext";

export function withErrorBoundary<Props = Record<string, unknown>>(
  WrappedComponent: ComponentType<Props>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (props: PropsWithChildren<Props>) => ReactElement<any, any> {
  function WithErrorBoundary(props: Props) {
    return (
      <ErrorBoundaryContext>
        <WrappedComponent
          key="WrappedComponent"
          {...props}
        />
      </ErrorBoundaryContext>
    );
  }
  WithErrorBoundary.displayName = `WithErrorBoundary(${
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"
  })`;

  return WithErrorBoundary;
}

export type UseErrorBoundaryReturn = [
  error: Error | undefined,
  errorInfo: ErrorInfo | undefined,
  resetError: () => void,
];

export function useErrorBoundary(componentDidCatch?: ComponentDidCatch): UseErrorBoundaryReturn {
  const ctx = useContext(errorBoundaryContext);
  ctx.componentDidCatch.current = componentDidCatch;
  const resetError = useCallback(() => {
    ctx.setError(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ctx.error, ctx.errorInfo, resetError];
}
