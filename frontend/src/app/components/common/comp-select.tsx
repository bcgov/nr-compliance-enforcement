import { FC } from "react";
import Select, { StylesConfig } from "react-select";
import Option from "../../types/app/option";

type Props = {
  id: string;
  className: string;
  options: Array<Option>;
  enableValidation: boolean;
  errorMessage?: string;
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
}) => {
  let styles: StylesConfig = {};

  let items = [...options];

  if (defaultOption) {
    items = [defaultOption, ...options];

    styles = {
      ...styles,
      menuList: (provided, state) => {
        return {
          ...provided,
          "& :first-child": {
            color: "#e4e4e4",
            backgroundColor: "white",
          },
        };
      },
    };
  }

  //-- pass through the onChange event
  const handleChange = (s: any) => {
    onChange(s)
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
      />
      {enableValidation && <div></div>}
    </>
  );
};
