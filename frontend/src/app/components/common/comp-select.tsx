import { FC } from "react";
import Select, { StylesConfig } from "react-select";
import Option from "../../types/app/option";

type Props = {
  id: string;
  className: string;
  options: Array<Option>;
  enableValidation: boolean;
  errorMessage?: string;
  classNamePrefix?: string;
  placeholder: string;
  defaultOption?: Option;
  value?: Option | null;
  onChange: (selectedOption: Option | null) => void;
};

export const CompSelect: FC<Props> = ({
  id,
  className,
  options,
  defaultOption,
  placeholder,
  enableValidation,
  value,
  onChange,
  classNamePrefix,
}) => {
  let styles: StylesConfig = {};

  let items = [...options];

  // If "none" is an option, lighten the colour a bit so that it doesn't appear the same as the other selectable options
  if (defaultOption) {
    items = [defaultOption, ...options];

    styles = {
      ...styles,
      option: (provided, state) => ({
        ...provided,
        color: state.label === "None" || state.label ===  "Unassigned" ? "#a1a1a1" : "black",
      }),
    };
  }

  //-- pass through the onChange event
  const handleChange = (s: any) => {
    onChange(s);
  };

  return (
    <>
      <Select
        id={id}
        className={className}
        styles={styles}
        placeholder={placeholder}
        options={items}
        defaultValue={value}
        onChange={handleChange}
        classNamePrefix={classNamePrefix}
      />
      {enableValidation && <div></div>}
    </>
  );
};
