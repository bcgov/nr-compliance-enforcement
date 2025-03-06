import { FC } from "react";
import Select, { StylesConfig } from "react-select";
import Option from "@apptypes/app/option";

type Props = {
  id: string;
  showInactive: boolean;
  className?: string;
  classNames?: {};
  options?: Array<Option>;
  enableValidation: boolean;
  errorMessage?: string;
  classNamePrefix?: string;
  placeholder?: string;
  defaultOption?: Option;
  value?: Option | null;
  onChange?: (selectedOption: Option | null) => void;
  isDisabled?: boolean;
  isClearable?: boolean;
};

export const CompSelect: FC<Props> = ({
  id,
  showInactive,
  className,
  classNames,
  options,
  defaultOption,
  placeholder,
  enableValidation,
  value,
  onChange,
  classNamePrefix,
  errorMessage,
  isDisabled,
  isClearable,
}) => {
  let styles: StylesConfig = {};

  let items: any[] = [];

  if (options) {
    // If the options do not have the field isActive, then show all options
    if (options.length > 0 && !("isActive" in options[0])) {
      items = [...options];
    } else {
      items = [...options.filter((o) => (showInactive ? true : o.isActive))];
    }
    if (value && !items.find((o) => o.value === value.value)) {
      items.push(value);
    }
    items = items.map((o) => ({ label: o.labelElement || o.label, value: o.value }));
  }

  // If "none" is an option, lighten the colour a bit so that it doesn't appear the same as the other selectable options
  styles = {
    ...styles,
    option: (provided, state) => ({
      ...provided,
      color: state.label === "None" || state.label === "Unassigned" ? "#a1a1a1" : "black",
    }),
  };

  //-- pass through the onChange event
  const handleChange = (s: any) => {
    if (onChange) {
      onChange(s);
    }
  };

  return (
    <div className={className}>
      <Select
        id={id}
        className={errorMessage ? `${className} error-select-border ` : className}
        classNames={classNames}
        styles={styles}
        placeholder={placeholder}
        options={items}
        // if labelElement is present, use it instead of the string label (used for displaying a custom element)
        value={value?.labelElement ? { label: value?.labelElement || value?.label, value: value?.value } : value}
        onChange={handleChange}
        classNamePrefix={classNamePrefix}
        defaultValue={defaultOption}
        isDisabled={isDisabled}
        menuPlacement="auto"
        isClearable={isClearable ?? false}
      />
      {enableValidation && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};
