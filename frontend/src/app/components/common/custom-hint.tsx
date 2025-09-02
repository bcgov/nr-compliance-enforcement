import { FC, ReactNode } from "react";
import { useHint } from "react-bootstrap-typeahead";

type CustomHintProps = {
  children: ReactNode;
  className?: string;
  hintText: string;
};

export const CustomHint: FC<CustomHintProps> = ({ children, className, hintText }) => {
  const { hintRef } = useHint();

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flex: 1,
        height: "100%",
        position: "relative",
      }}
    >
      {children}
      <input
        aria-hidden
        className="rbt-input-hint"
        ref={hintRef}
        readOnly
        style={{
          backgroundColor: "transparent",
          borderColor: "transparent",
          boxShadow: "none",
          color: "rgba(0, 0, 0, 0.54)",
          left: 0,
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          width: "100%",
        }}
        tabIndex={-1}
        value={hintText}
      />
    </div>
  );
};
