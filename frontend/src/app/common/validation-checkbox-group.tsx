import React, { FC, useState } from 'react';
import Option from '../types/app/option';

interface ValidationCheckboxGroupProps {
  options: Option[];
  errMsg: string;
}

export const ValidationCheckboxGroup: FC<ValidationCheckboxGroupProps> = ({
  options,
  errMsg,
}) => {
  const [checkedState, setCheckedState] = useState(new Array(options.length).fill(false));
  const [isError, setIsError] = useState(false);
  const inputClassName="form-check-input";
  const labelClassName="form-check-label checkbox-label"
  const handleOnChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

    // Check if at least one checkbox is selected
    setIsError(!updatedCheckedState.some(state => state));
  };

  const calculatedClass =
    isError ? inputClassName + " error-border" : inputClassName;

  return (
    <div id="checkbox-div" className="checkbox-left-padding">
      {options.map((option, index) => (
        <div className="form-check check-spacing" key={option.value}>
          <input
            type="checkbox"
            id={option.value}
            className={calculatedClass}
            checked={checkedState[index]}
            onChange={() => handleOnChange(index)}
          />
          <label className={labelClassName} htmlFor={option.value}>{option.label}</label>
        </div>
      ))}
      {isError && <div className="error-message">{errMsg}</div>}
    </div>
  );
};
