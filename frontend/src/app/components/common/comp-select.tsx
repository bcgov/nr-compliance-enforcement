import { FC } from "react";
import Select, { StylesConfig, components } from "react-select";
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

// Custom Option component to render labelElement
const CustomOption = (props: any) => {
  const { data } = props;
  return <components.Option {...props}>{data.labelElement ?? data.label}</components.Option>;
};

// Custom filterOption to ensure searchability
const customFilterOption = (option: Option, rawInput: string) => {
  const searchText = rawInput.toLowerCase();
  const label = option.label?.toLowerCase() ?? "";
  return label.includes(searchText);
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

    // Map options to include label and labelElement
    items = items.map((o) => ({
      label: o.label, //for searchability
      value: o.value,
      labelElement: o.labelElement,
    }));
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
        value={value}
        onChange={handleChange}
        classNamePrefix={classNamePrefix}
        defaultValue={defaultOption}
        isDisabled={isDisabled}
        menuPlacement="auto"
        filterOption={customFilterOption}
        components={{ Option: CustomOption }}
        isClearable={isClearable ?? false}
      />
      {enableValidation && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};
