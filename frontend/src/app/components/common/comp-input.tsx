import { FC } from "react";

type Props = {
  id: string;
  divId: string;
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
  step?: number | string;
};

const noop = () => {};

export const CompInput: FC<Props> = ({
  id,
  divId,
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
  onBlur = noop,
  onChange = noop,
  onKeyDown = noop,
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
    divId: divId,
    value: value,
    //  defaultValue: defaultValue,
    className: inputClasses.join(" "),
    onChange: (event: any) => onChange(event),
    onBlur: (event: any) => onBlur(event),
    onKeyDown: (event: any) => onKeyDown(event),
    disabled: disabled,
    placeholder: placeholder,
    maxLength: maxLength,
  };

  if (type === "text") {
    Component = <textarea {...props} cols={cols} rows={rows} />;
  } else {
    Component = <input {...props} type={type} inputMode="numeric" />;
  }

  return (
    <div className={formClass} id={divId}>
      {label && (
        <label className="text-box" htmlFor={id}>
          {label}
        </label>
      )}
      <div className={containerClass}>
        <div>{Component}</div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};
