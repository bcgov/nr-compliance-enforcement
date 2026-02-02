import { CompInput } from "@/app/components/common/comp-input";
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
      name={fieldName as any}
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
            <CompInput
              id={inputId}
              divid=""
              type="input"
              inputClass="comp-form-control comp-details-input"
              value={phoneNumber.value ?? ""}
              error={field.state.meta.errors?.[0]?.message || ""}
              maxLength={512}
              onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
              disabled={isDisabled}
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
