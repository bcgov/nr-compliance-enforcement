import { FC } from "react";
import { Button } from "react-bootstrap";
import { FormField } from "@components/common/form-field";
import { ValidationPhoneInput } from "@/app/common/validation-phone-input";
import { ContactMethod } from "@/generated/graphql";
import { CompInput } from "@/app/components/common/comp-input";
import { AddressFields } from "@/app/components/containers/parties/form/party-address-fields";
import { AddressFormValue } from "@/app/components/containers/parties/form/party-form-utils";

type PartyContactFieldsProps = {
  form: any;
  isDisabled: boolean;
  addresses: AddressFormValue[];
  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  onSetPrimaryAddress: (index: number) => void;
  phoneNumbers: ContactMethod[];
  onAddPhoneNumber: () => void;
  onRemovePhoneNumber: (index: number) => void;
  onSetPrimaryPhoneNumber: (index: number) => void;
  emailAddresses: ContactMethod[];
  onAddEmail: () => void;
  onRemoveEmail: (index: number) => void;
  onSetPrimaryEmail: (index: number) => void;
};

export const PartyContactFields: FC<PartyContactFieldsProps> = ({
  form,
  isDisabled,
  addresses,
  onAddAddress,
  onRemoveAddress,
  onSetPrimaryAddress,
  phoneNumbers,
  onAddPhoneNumber,
  onRemovePhoneNumber,
  onSetPrimaryPhoneNumber,
  emailAddresses,
  onAddEmail,
  onRemoveEmail,
  onSetPrimaryEmail,
}) => {
  return (
    <>
      {addresses?.map((address: AddressFormValue, index: number) => (
        <FormField
          key={address.addressGuid || `address-${index}`}
          form={form}
          name={`address-block-${index}` as any}
          label={index === 0 ? "Address" : ""}
          render={() => (
            <AddressFields
              addressIndex={index}
              form={form}
              isDisabled={isDisabled}
              isPrimary={address.isPrimary || false}
              onRemoveAddress={onRemoveAddress}
              onSetPrimaryAddress={onSetPrimaryAddress}
            />
          )}
        />
      ))}
      <FormField
        form={form}
        name="add-address-placeholder"
        label=""
        render={() => (
          <Button
            id="add-address-button"
            variant="outline-primary"
            size="sm"
            onClick={onAddAddress}
            type="button"
          >
            <i className="bi bi-plus-circle me-1" />
            {/**/}
            Add address
          </Button>
        )}
      />
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
                onChange={() => onSetPrimaryPhoneNumber(index)}
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
                onClick={() => onRemovePhoneNumber(index)}
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
            onClick={onAddPhoneNumber}
            type="button"
          >
            <i className="bi bi-plus-circle me-1" />
            {/**/}
            Add phone number
          </Button>
        )}
      />
      {emailAddresses?.map((email: ContactMethod, index: number) => (
        <FormField
          key={email.contactMethodGuid || `email-${index}`}
          form={form}
          name={`emailAddresses[${index}].value` as any}
          label={index === 0 ? "Email" : ""}
          render={(field) => (
            <div className="party-contact-method">
              {index === 0 && <div className="party-primary-contact-method-label">Primary</div>}
              {index > 0 && <div className="party-primary-contact-spacer"></div>}

              <input
                type="radio"
                id={`email-primary-${index}`}
                name="primaryEmail"
                checked={email.isPrimary || false}
                onChange={() => onSetPrimaryEmail(index)}
                disabled={isDisabled}
              />

              <div className="party-multiple-value-container">
                <CompInput
                  id={`email-${index}`}
                  divid=""
                  type="input"
                  inputClass="comp-form-control comp-details-input"
                  value={field.state.value}
                  error={field.state.meta.errors?.[0]?.message || ""}
                  maxLength={512}
                  onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                  disabled={isDisabled}
                />
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onRemoveEmail(index)}
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
        name="add-email-placeholder"
        label=""
        render={() => (
          <Button
            id="add-email-button"
            variant="outline-primary"
            size="sm"
            onClick={onAddEmail}
            type="button"
          >
            <i className="bi bi-plus-circle me-1" />
            {/**/}
            Add email
          </Button>
        )}
      />
    </>
  );
};
