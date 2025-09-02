import { FC, ReactNode } from "react";
import { useHint } from "react-bootstrap-typeahead";
import "./custom-hint.scss";

type CustomHintProps = {
  children: ReactNode;
  className?: string;
  hintText: string;
};

export const CustomHint: FC<CustomHintProps> = ({ children, className, hintText }) => {
  const { hintRef } = useHint();

  return (
    <div className={`custom-hint-container ${className || ""}`}>
      {children}
      <input
        aria-hidden
        className="rbt-input-hint custom-hint-input"
        ref={hintRef}
        readOnly
        tabIndex={-1}
        value={hintText}
      />
    </div>
  );
};
