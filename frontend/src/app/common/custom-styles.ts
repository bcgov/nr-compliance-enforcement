import { StylesConfig } from "react-select";

export const customStyles: StylesConfig = {
    control: (provided: Record<string, unknown>, state: any) => ({
      ...provided,
      border: state.isFocused ? "1px solid #90b6F8" : "1px solid #a1a1a1",
      boxShadow: state.isFocused ? "0px 0px 0px 4px rgba(0,120,255,0.25)" : "none",
    })
  };