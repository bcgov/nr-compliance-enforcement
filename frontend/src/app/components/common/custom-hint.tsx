import { FC, ReactNode } from "react";
import { useHint } from "react-bootstrap-typeahead";
import "./custom-hint.scss";
import { Form } from "react-bootstrap";

type CustomHintProps = {
  children: ReactNode;
  className?: string;
  hintText: string;
};

interface HintInputWrapperProps {
  hintText: string;
  inputProps: any;
  inputRef: (node: any) => void;
  referenceElementRef: (node: any) => void;
}

export const HintInputWrapper: React.FC<HintInputWrapperProps> = ({
  hintText,
  inputProps,
  inputRef,
  referenceElementRef,
}) => {
  return (
    <CustomHint hintText={hintText}>
      <Form.Control
        {...inputProps}
        ref={(node: any) => {
          inputRef(node);
          referenceElementRef(node);
        }}
        type="text"
        className="rbt-input-text"
      />
    </CustomHint>
  );
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
