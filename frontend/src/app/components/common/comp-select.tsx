import { FC } from "react";
import Select, { StylesConfig } from "react-select";
import Option from "../../types/app/option";

type Props = {
  id: string;
  className?: string;
  classNames?: {};
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
  classNames,
  options,
  defaultOption,
  placeholder,
  enableValidation,
  value,
  onChange,
  classNamePrefix,
  errorMessage,
}) => {
  let styles: StylesConfig = {};

  let items = [...options];

  // If "none" is an option, lighten the colour a bit so that it doesn't appear the same as the other selectable options
    styles = {
      ...styles,
      option: (provided, state) => ({
        ...provided,
        color:
          state.label === "None" || state.label === "Unassigned"
            ? "#a1a1a1"
            : "black",
      }),
    };

  //-- pass through the onChange event
  const handleChange = (s: any) => {
    onChange(s);
  };

  return (
    <>
      <Select
        id={id}
        className={
          errorMessage ? `${className} error-select-border ` : className
        }
        classNames={classNames}
        styles={styles}
        placeholder={placeholder}
        options={items}
        value={value}
        onChange={handleChange}
        classNamePrefix={classNamePrefix}
      />
      {enableValidation && <div className="error-message">{errorMessage}</div>}
    </>
  );
};
