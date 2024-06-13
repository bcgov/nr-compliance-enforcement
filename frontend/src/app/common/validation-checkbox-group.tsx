import { FC, useState, useEffect } from "react";
import Option from "../types/app/option";

interface ValidationCheckboxGroupProps {
  options: Option[];
  errMsg: string;
  onCheckboxChange: (checkedItems: Option[]) => void;
  checkedValues?: Option[];
}

export const ValidationCheckboxGroup: FC<ValidationCheckboxGroupProps> = ({
  options,
  errMsg,
  onCheckboxChange,
  checkedValues = [],
}) => {
  const [checkedItems, setCheckedItems] = useState<Option[]>(checkedValues);

  const inputClassName = "form-check-input";
  const labelClassName = "form-check-label checkbox-label";

  const handleCheckboxChange = (value: Option) => {
    const updatedCheckedItems = checkedItems
      .map((item) => {
        return item.value;
      })
      .includes(value.value)
      ? checkedItems.filter((item) => item.value !== value.value)
      : [...checkedItems, value];

    setCheckedItems(updatedCheckedItems);
    onCheckboxChange(updatedCheckedItems);
  };

  useEffect(() => {
    setCheckedItems(checkedValues);
  }, [checkedValues.length]);

  return (
    <div
      id="checkbox-div"
      className="comp-checkbox-group"
    >
      {options.map((option, index) => (
        <div
          className="comp-checkbox"
          key={option.value}
        >
          <input
            type="checkbox"
            id={option.value!}
            className={inputClassName}
            checked={checkedItems
              .map((item) => {
                return item.value;
              })
              .includes(option.value!)}
            onChange={() => handleCheckboxChange(option)}
          />
          <label
            className={labelClassName}
            htmlFor={option.value!}
          >
            {option.label}
          </label>
        </div>
      ))}
      {errMsg && (
        <div className="comp-form-error-msg error-message">
          <i className="bi bi-exclamation-circle-fill"></i>
          {errMsg}
        </div>
      )}
    </div>
  );
};
