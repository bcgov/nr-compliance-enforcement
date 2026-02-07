import { ValidationPhoneInput } from "@/app/common/validation-phone-input";
import { FormField } from "@/app/components/common/form-field";
import { ContactMethod } from "@/generated/graphql";
import { FC } from "react";
import { Button } from "react-bootstrap";

interface PhoneNumberFieldProps {
  phoneNumber: ContactMethod;
  displayIndex: number;
  form: any;
  isDisabled: boolean;
  onSetPrimary: () => void;
  onRemove: () => void;
  fieldName: string;
  radioName: string;
  radioId: string;
  inputId: string;
}

export const PhoneNumberField: FC<PhoneNumberFieldProps> = ({
  phoneNumber,
  displayIndex,
  form,
  isDisabled,
  onSetPrimary,
  onRemove,
  fieldName,
  radioName,
  radioId,
  inputId,
}) => {
  return (
    <FormField
      form={form}
      name={fieldName}
      label={displayIndex === 0 ? "Phone number" : ""}
      render={(field) => (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {displayIndex === 0 && <div style={{ width: "60px", fontWeight: "500", fontSize: "14px" }}>Primary</div>}
          {displayIndex > 0 && <div style={{ width: "60px" }}></div>}

          <input
            type="radio"
            id={radioId}
            name={radioName}
            checked={phoneNumber.isPrimary || false}
            onChange={onSetPrimary}
            disabled={isDisabled}
          />

          <div style={{ flex: 1 }}>
            <ValidationPhoneInput
              className="comp-details-input"
              value={phoneNumber.value ?? ""}
              onChange={(value: string) => field.handleChange(value || "")}
              maxLength={14}
              international={false}
              id={inputId}
              errMsg={field.state.meta.errors?.[0]?.message || ""}
            />
          </div>

          <div style={{ width: "100px" }}>
            <Button
              variant="outline-dark"
              size="sm"
              onClick={onRemove}
              type="button"
            >
              <i className="bi bi-trash" />
              {/**/}
              Remove
            </Button>
          </div>
        </div>
      )}
    />
  );
};
