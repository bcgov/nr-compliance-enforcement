import { FC, ReactElement, ReactNode } from "react";
import Select, { StylesConfig } from "react-select";
import Option from "../../types/app/option";
import { from } from "linq-to-typescript";

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

  //-- when there is a default option a custom style object needs to be generated 
  //-- to handle the correct styling for when there's a hover state and selected 
  //-- state, otherwise the first option (defaultOption) will be render like any other item
  if (defaultOption) {
    items = [defaultOption, ...options];

    styles = {
      ...styles,
      menuList: (provided, state) => {
        const isFirstSelected = (state: any): boolean => {
          const { children } = state;

          if (from(children).any()) {
            const first = from(children).firstOrDefault() as ReactElement;
            if(!first){
               return false
            }

            const {
               props: { isSelected },
             } = first;
 
             return isSelected;
          }

          return false;
        };
        return {
          ...provided,
          "& :first-child": {
            color: isFirstSelected(state) ? "white" : "#a1a1a1",
            backgroundColor: "white",
            background: isFirstSelected(state) ? "#4c82fb" : "white",
          },
          "& :first-child:hover": {
            backgroundColor: "#e1ebfe",
          },
        };
      },
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
      />
      {enableValidation && <div></div>}
    </>
  );
};
