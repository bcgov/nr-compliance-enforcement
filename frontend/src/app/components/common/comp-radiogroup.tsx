import { FC } from "react";
import { Form } from "react-bootstrap";
import Option from "@apptypes/app/option";

type Props = {
  id: string;
  options: Array<Option>;
  enableValidation: boolean;
  errorMessage?: string;
  value?: string | null;
  onChange: (selectedOption: Option) => void;
  isDisabled?: boolean;
  radioGroupName: string;
  itemClassName: string;
  groupClassName: string;
};

export const CompRadioGroup: FC<Props> = ({
  id,
  options,
  enableValidation,
  errorMessage,
  value,
  onChange,
  isDisabled,
  radioGroupName,
  itemClassName,
  groupClassName,
}) => {
  return (
    <div>
      <div className={errorMessage ? `${groupClassName} comp-radio-group` : groupClassName}>
        {options.map((item, index) => {
          return (
            <Form.Check
              inline
              className={itemClassName}
              name={radioGroupName}
              type="radio"
              id={`${id}-${index}`}
              label={item.label}
              value={item.value}
              onChange={(e: any) => onChange(e)}
              checked={item.value === value}
              key={item.value?.toLowerCase()}
              disabled={isDisabled}
            />
          );
        })}
      </div>
      {enableValidation && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};
