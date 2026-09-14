import { FC } from "react";
import Select, { GroupBase, MenuPlacement, StylesConfig, components } from "react-select";
import Option from "@apptypes/app/option";

type Props = {
  id: string;
  showInactive: boolean;
  className?: string;
  classNames?: {};
  options?: Array<Option> | Array<GroupBase<Option>>;
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

// Custom Option component to render labelElement or disabled items
const CustomOption = (props: any) => {
  const { data } = props;

  // If there's a custom labelElement, use it
  if (data.labelElement) {
    return <components.Option {...props}>{data.labelElement}</components.Option>;
  }

  // If it's disabled, render muted text
  if (data.isDisabled) {
    return (
      <components.Option {...props}>
        <strong className="text-muted">{data.label}</strong>
      </components.Option>
    );
  }

  // If it's a header render bold
  if (data.isHeader) {
    return (
      <components.Option {...props}>
        <strong>{data.label}</strong>
      </components.Option>
    );
  }

  // Default rendering
  return <components.Option {...props}>{data.label}</components.Option>;
};

// Group headings render only for labelled groups
const CustomGroupHeading = (props: any) => (props.data.label ? <components.GroupHeading {...props} /> : null);

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

  const toItems = (opts: readonly Option[]) => {
    // If the options do not have the field isActive, then show all options
    const visible =
      opts.length > 0 && !("isActive" in opts[0]) ? opts : opts.filter((o) => (showInactive ? true : o.isActive));

    // Map options to include label, labelElement, isDisabled and isHeader
    return visible.map((o) => ({
      label: o.label, //for searchability
      value: o.value,
      labelElement: o.labelElement,
      isDisabled: o.isDisabled ?? false,
      isHeader: o.isHeader ?? false,
    }));
  };

  if (options && options.length > 0 && "options" in options[0]) {
    items = (options as Array<GroupBase<Option>>).map((group) => ({
      label: group.label,
      options: toItems(group.options),
    }));
    if (value && !items.some((group) => group.options.some((o: Option) => o.value === value.value))) {
      items[items.length - 1].options.push(value);
    }
  } else if (options) {
    items = toItems(options as Array<Option>);
    if (value && !items.some((o) => o.value === value.value)) {
      items.push(value);
    }
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
        components={{ Option: CustomOption, GroupHeading: CustomGroupHeading }}
        isClearable={isClearable ?? false}
        maxMenuHeight={maxMenuHeight ?? undefined}
      />
      {enableValidation && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};
