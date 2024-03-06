import { FC, useState, useEffect } from 'react';
import Option from '../types/app/option';

interface ValidationCheckboxGroupProps {
  options: Option[];
  errMsg: string;
  onCheckboxChange: (checkedItems: string[]) => void;
}

export const ValidationCheckboxGroup: FC<ValidationCheckboxGroupProps> = ({
  options,
  errMsg,
  onCheckboxChange,
}) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const inputClassName = "form-check-input";
  const labelClassName = "form-check-label checkbox-label";

  const handleCheckboxChange = (value: string) => {
    const updatedCheckedItems = checkedItems.includes(value)
      ? checkedItems.filter((item) => item !== value)
      : [...checkedItems, value];

    setCheckedItems(updatedCheckedItems);
    onCheckboxChange(updatedCheckedItems);
  };

  useEffect(() => {
    // You can use the checkedItems state as needed in the component or for any other logic
    console.log("Checked items:", checkedItems);
  }, [checkedItems]);

  return (
    <div id="checkbox-div" className="checkbox-left-padding">
      {options.map((option, index) => (
        <div className="form-check check-spacing" key={option.value}>
          <input
            type="checkbox"
            id={option.value}
            className={inputClassName}
            checked={checkedItems.includes(option.value!)}
            onChange={() => handleCheckboxChange(option.value!)}
          />
          <label className={labelClassName} htmlFor={option.value}>
            {option.label}
          </label>
        </div>
      ))}
      <div className="error-message">{errMsg}</div>
    </div>
  );
};
