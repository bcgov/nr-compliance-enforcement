import { FC } from "react";
import { Button } from "react-bootstrap";
import { FormField } from "@components/common/form-field";
import { ValidationPhoneInput } from "@/app/common/validation-phone-input";
import { ContactMethod } from "@/generated/graphql";

type PartyPhoneFieldsProps = {
  form: any;
  isDisabled: boolean;
  phoneNumbers: ContactMethod[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onSetPrimary: (index: number) => void;
};

export const PartyPhoneFields: FC<PartyPhoneFieldsProps> = ({
  form,
  isDisabled,
  phoneNumbers,
  onAdd,
  onRemove,
  onSetPrimary,
}) => {
  return (
    <>
      {phoneNumbers?.map((phoneNumber: ContactMethod, index: number) => (
        <FormField
          key={phoneNumber.contactMethodGuid || `phone-${index}`}
          form={form}
          name={`phoneNumbers[${index}].value`}
          label={index === 0 ? "Phone number" : ""}
          render={(field) => (
            <div className="party-contact-method">
              {index === 0 && <div className="party-primary-contact-method-label">Primary</div>}
              {index > 0 && <div className="party-primary-contact-spacer"></div>}

              <input
                type="radio"
                id={`phone-primary-${index}`}
                name="primaryPhoneNumber"
                checked={phoneNumber.isPrimary || false}
                onChange={() => onSetPrimary(index)}
                disabled={isDisabled}
              />

              <div className="party-multiple-value-container">
                <ValidationPhoneInput
                  className="comp-details-input"
                  value={phoneNumber.value ?? ""}
                  onChange={(value: string) => field.handleChange(value || "")}
                  maxLength={14}
                  international={false}
                  id={`phone-number-${index}`}
                  errMsg={field.state.meta.errors?.[0]?.message || ""}
                />
              </div>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onRemove(index)}
                type="button"
              >
                <i className="bi bi-trash" />
                {/**/}
                Remove
              </Button>
            </div>
          )}
        />
      ))}
      <FormField
        form={form}
        name="add-phone-number-placeholder"
        label=""
        render={() => (
          <Button
            id="add-phone-number-button"
            variant="outline-primary"
            size="sm"
            onClick={onAdd}
            type="button"
          >
            <i className="bi bi-plus-circle me-1" />
            {/**/}
            Add phone number
          </Button>
        )}
      />
    </>
  );
};
