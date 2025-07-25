import { FC } from "react";
import Select, { MenuPlacement, StylesConfig, components } from "react-select";
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
  maxMenuHeight?: number;
  menuPlacement?: MenuPlacement;
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
  maxMenuHeight,
  menuPlacement,
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
        menuPlacement={menuPlacement ?? "auto"}
        filterOption={customFilterOption}
        components={{ Option: CustomOption }}
        isClearable={isClearable ?? false}
        maxMenuHeight={maxMenuHeight ?? undefined}
      />
      {enableValidation && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};
