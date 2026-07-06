import { FC } from "react";
import { Button } from "react-bootstrap";
import { FormField } from "@components/common/form-field";
import { ValidationPhoneInput } from "@/app/common/validation-phone-input";
import { ContactMethod } from "@/generated/graphql";
import { CompInput } from "@/app/components/common/comp-input";
import { AddressFields } from "@/app/components/containers/parties/form/party-address-fields";
import {
  AddressFormValue,
  validateEmailValue,
  validatePhoneNumberValue,
} from "@/app/components/containers/parties/form/party-form-utils";
import { getFieldErrorMessage } from "@/app/components/containers/parties/form/party-form-errors";

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
  showOfficeFields?: boolean;
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
  showOfficeFields = false,
}) => {
  return (
    <>
      <div className="comp-details-section-header pt-5">
        <h3>Contact information</h3>
      </div>
      {phoneNumbers?.map((phoneNumber: ContactMethod, index: number) => (
        <FormField
          key={phoneNumber.contactMethodGuid || `phone-${index}`}
          form={form}
          name={`phoneNumbers[${index}].value`}
          label={index === 0 ? "Phone number" : ""}
          validators={{
            // only validate if there are multiple, a single empty item is allowed
            onChange: ({ value, fieldApi }: any) => {
              const rows = fieldApi.form.getFieldValue("phoneNumbers") ?? [];
              if (rows.length > 1 && !value?.trim()) return "Phone number is required";
              return validatePhoneNumberValue(value);
            },
          }}
          render={(field) => (
            <>
              <div className="comp-details-form-row">
                <label htmlFor={`phone-primary-${index}`}>
                  <input
                    type="radio"
                    id={`phone-primary-${index}`}
                    name="primaryPhoneNumber"
                    checked={phoneNumber.isPrimary || false}
                    onChange={() => onSetPrimaryPhoneNumber(index)}
                    disabled={isDisabled}
                    className="me-2"
                  />{" "}
                  Mark as Primary phone number
                </label>
              </div>
              <div className="party-contact-method">
                <div className="party-multiple-value-container">
                  <ValidationPhoneInput
                    className="comp-details-input"
                    value={phoneNumber.value ?? ""}
                    onChange={(value: string) => field.handleChange(value || "")}
                    maxLength={14}
                    international={false}
                    id={`phone-number-${index}`}
                    errMsg={getFieldErrorMessage(field)}
                  />
                </div>

                {phoneNumbers.length > 1 && (
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
                )}
              </div>
            </>
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
            <i className="bi bi-plus-circle me-1" /> Add phone number
          </Button>
        )}
      />
      {emailAddresses?.map((email: ContactMethod, index: number) => (
        <FormField
          key={email.contactMethodGuid || `email-${index}`}
          form={form}
          name={`emailAddresses[${index}].value` as any}
          label={index === 0 ? "Email" : ""}
          validators={{
            // only validate if there are multiple, a single empty item is allowed
            onChange: ({ value, fieldApi }: any) => {
              const rows = fieldApi.form.getFieldValue("emailAddresses") ?? [];
              if (rows.length > 1 && !value?.trim()) return "Email is required";
              return validateEmailValue(value);
            },
          }}
          render={(field) => (
            <>
              <div className="comp-details-form-row">
                <label htmlFor={`email-primary-${index}`}>
                  <input
                    type="radio"
                    id={`email-primary-${index}`}
                    name="primaryEmail"
                    checked={email.isPrimary || false}
                    onChange={() => onSetPrimaryEmail(index)}
                    disabled={isDisabled}
                    className="me-2"
                  />{" "}
                  Mark as Primary email
                </label>
              </div>
              <div className="party-contact-method">
                <div className="party-multiple-value-container">
                  <CompInput
                    id={`email-${index}`}
                    divid=""
                    type="input"
                    inputClass="comp-form-control comp-details-input"
                    value={field.state.value}
                    error={getFieldErrorMessage(field)}
                    maxLength={512}
                    onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                    disabled={isDisabled}
                  />
                </div>
                {emailAddresses.length > 1 && (
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
                )}
              </div>
            </>
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
            <i className="bi bi-plus-circle me-1" /> Add email
          </Button>
        )}
      />
      <div className="comp-details-section-header pt-5">
        <h3>Address(es)</h3>
      </div>
      {addresses?.map((address: AddressFormValue, index: number) => (
        <AddressFields
          key={address.addressGuid || `address-${index}`}
          addressIndex={index}
          form={form}
          isDisabled={isDisabled}
          isPrimary={address.isPrimary || false}
          canRemove={addresses.length > 1}
          onRemoveAddress={onRemoveAddress}
          onSetPrimaryAddress={onSetPrimaryAddress}
          showOfficeFields={showOfficeFields}
        />
      ))}
      <Button
        id="add-address-button"
        variant="primary"
        size="sm"
        onClick={onAddAddress}
        type="button"
        className="mt-3"
      >
        <i className="bi bi-plus-circle me-1" /> Add address
      </Button>
    </>
  );
};
