import { FC } from "react";
import Option from "@apptypes/app/option";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

interface ValidationCheckboxGroupProps {
  options: Option[];
  errMsg: string;
  onCheckboxChange: (checkedItems: Option[]) => void;
  checkedValues?: Option[];
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

export const ValidationCheckboxGroup: FC<ValidationCheckboxGroupProps> = ({
  options,
  errMsg,
  onCheckboxChange,
  onDirtyChange,
  checkedValues = [],
}) => {
  const { markDirty } = useFormDirtyState(onDirtyChange, 0);
  const inputClassName = "form-check-input";
  const labelClassName = "form-check-label checkbox-label";

  const handleCheckboxChange = (value: Option) => {
    markDirty();
    const updatedCheckedItems = checkedValues
      .map((item) => {
        return item.value;
      })
      .includes(value.value)
      ? checkedValues.filter((item) => item.value !== value.value)
      : [...checkedValues, value];

    onCheckboxChange(updatedCheckedItems);
  };

  return (
    <div id="checkbox-div">
      {options.map((option, index) => (
        <div
          className="comp-checkbox"
          key={option.value}
        >
          <input
            type="checkbox"
            id={option.value}
            className={inputClassName}
            checked={checkedValues
              .map((item) => {
                return item.value;
              })
              .includes(option.value)}
            onChange={() => handleCheckboxChange(option)}
          />
          <label
            className={labelClassName}
            htmlFor={option.value}
          >
            {option.label}
          </label>
        </div>
      ))}
      <div className="error-message">{errMsg}</div>
    </div>
  );
};
