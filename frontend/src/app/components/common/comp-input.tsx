import { FC } from "react";

type Props = {
  id: string;
  divid: string;
  type: "input" | "number" | "text";
  label?: string;
  inputClass?: string;
  formClass?: string;
  containerClass?: string;
  onChange?: Function;
  onBlur?: Function;
  error?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  onKeyDown?: Function;
  rows?: number;
  cols?: number;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number | string;
  prefix?: { value: string; prefixClassName?: string; inputClassName?: string };
};

const noop = () => { };

export const CompInput: FC<Props> = ({
  id,
  divid,
  type,
  inputClass,
  formClass,
  containerClass,
  label,
  placeholder,
  value,
  defaultValue,
  error,
  disabled,
  rows,
  cols,
  step,
  maxLength,
  min,
  max,
  onBlur = noop,
  onChange = noop,
  onKeyDown = noop,
  prefix,
}) => {
  let Component: any;

  const inputClasses = [];

  if (inputClass) {
    inputClasses.push(inputClass);
  }

  if (error) {
    inputClasses.push("is-invalid");
    inputClasses.push("error-border");
  }

  if (formClass === "") {
    formClass = "form-group";
  }

  const props = {
    id: id,
    divid,
    value: value,
    //  defaultValue: defaultValue,
    className: inputClasses.join(" "),
    onChange: (event: any) => onChange(event),
    onBlur: (event: any) => onBlur(event),
    onKeyDown: (event: any) => onKeyDown(event),
    disabled: disabled,
    placeholder: placeholder,
    maxLength: maxLength,
    min: min,
    max: max,
  };

  if (type === "text") {
    Component = (
      <textarea
        {...props}
        cols={cols}
        rows={rows}
      />
    );
  } else {
    Component = (
      <input
        {...props}
        type={type}
        inputMode="numeric"
      />
    );
  }

  return (
    <div
      className={formClass}
      id={divid}
    >
      {label && (
        <label
          className="text-box"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className={containerClass}>
        <div className={prefix && "input-group"}>
          {prefix && (
            <span
              className={`input-group-text ${prefix.prefixClassName} ${error ? "error-border" : ""}`}
              id={id}
            >
              {prefix.value}
            </span>
          )}
          {Component}
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};
