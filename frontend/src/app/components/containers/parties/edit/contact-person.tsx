import { FC } from "react";
import { Button } from "react-bootstrap";
import { useStore } from "@tanstack/react-form";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { BusinessPerson, ContactMethod } from "@/generated/graphql";
import { ValidationPhoneInput } from "@/app/common/validation-phone-input";
import { ValidationMultiSelect } from "@/app/common/validation-multiselect";
import { ContactMethods } from "@/app/constants/contact-methods";
import {
  AddressFormValue,
  validateEmailValue,
  validatePhoneNumberValue,
} from "@/app/components/containers/parties/form/party-form-utils";
import { getFieldErrorMessage } from "@/app/components/containers/parties/form/party-form-errors";

interface ContactPersonFieldsProps {
  contact: BusinessPerson;
  contactIndex: number;
  form: any;
  isDisabled: boolean;
  isPrimary: boolean;
  onRemoveContact: (index: number) => void;
  onSetPrimaryBusinessContact: (index: number) => void;
  onAddContactMethod: (contactIndex: number, typeCode: string) => void;
  onRemoveContactMethod: (contactIndex: number, methodIndex: number) => void;
  onSetPrimaryContact: (contactIndex: number, methodIndex: number, typeCode: string) => void;
  showInvestigationFields?: boolean;
}

export const ContactPersonFields: FC<ContactPersonFieldsProps> = ({
  contact,
  contactIndex,
  form,
  isDisabled,
  isPrimary,
  onRemoveContact,
  onSetPrimaryBusinessContact,
  onAddContactMethod,
  onRemoveContactMethod,
  onSetPrimaryContact,
  showInvestigationFields = false,
}) => {
  const addresses = useStore(form.store, (state: any) => state.values?.addresses ?? []) as AddressFormValue[];
  const officeOptions = addresses
    .map((a: AddressFormValue, index: number) => ({
      value: a.addressGuid ?? "",
      label: a.addressName?.trim() || `Address ${index + 1}`,
    }))
    .filter((opt) => !!opt.value);
  const phoneNumbers =
    contact.contactMethods
      ?.map((cm, cmIndex) => ({ method: cm, originalIndex: cmIndex }))
      .filter(
        (item): item is { method: ContactMethod; originalIndex: number } =>
          item.method !== null && item.method.typeCode === ContactMethods.PHONE,
      ) || [];

  const emails =
    contact.contactMethods
      ?.map((cm, cmIndex) => ({ method: cm, originalIndex: cmIndex }))
      .filter(({ method }) => method?.typeCode === ContactMethods.EMAIL) || [];


  return (
    <>
      {contactIndex > 0 && <hr className="comp-details-section-divider mt-4 mb-4" />}
      <div className="party-contact-header mb-3">
        {showInvestigationFields ? (
          <label htmlFor={`contact-primary-${contactIndex}`}>
            <input
              type="radio"
              id={`contact-primary-${contactIndex}`}
              name="primaryBusinessContact"
              checked={isPrimary || false}
              onChange={() => onSetPrimaryBusinessContact(contactIndex)}
              disabled={isDisabled}
              className="me-2"
            />{" "}
            Mark as Primary contact
          </label>
        ) : (
          <h4>Contact {contactIndex + 1}</h4>
        )}
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => onRemoveContact(contactIndex)}
          type="button"
        >
          <i className="bi bi-trash" /> Remove Contact
        </Button>
      </div>

      <FormField
        form={form}
        name={`contacts[${contactIndex}].person.firstName` as any}
        label="First name"
        required
        validators={{
          onChange: ({ value }: { value: string | undefined }) =>
            value?.trim() ? undefined : "First name is required",
        }}
        render={(field) => (
          <CompInput
            id={`contact-firstName-${contactIndex}`}
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value}
            error={getFieldErrorMessage(field)}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter first name..."
            disabled={isDisabled}
          />
        )}
      />

      <FormField
        form={form}
        name={`contacts[${contactIndex}].person.lastName` as any}
        label="Last name"
        required
        validators={{
          onChange: ({ value }: { value: string | undefined }) =>
            value?.trim() ? undefined : "Last name is required",
        }}
        render={(field) => (
          <CompInput
            id={`contact-lastName-${contactIndex}`}
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value}
            error={getFieldErrorMessage(field)}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter last name..."
            disabled={isDisabled}
          />
        )}
      />

      {showInvestigationFields && (
        <>
          <FormField
            form={form}
            name={`contacts[${contactIndex}].title` as any}
            label="Title / role"
            render={(field) => (
              <CompInput
                id={`contact-title-${contactIndex}`}
                divid=""
                type="input"
                inputClass="comp-form-control comp-details-input"
                value={field.state.value ?? ""}
                maxLength={256}
                onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                placeholder="Enter title or role..."
                disabled={isDisabled}
              />
            )}
          />

          <FormField
            form={form}
            name={`contacts[${contactIndex}].officeAddressGuids` as any}
            label="Offices associated with"
            render={(field) => (
              <ValidationMultiSelect
                id={`contact-offices-${contactIndex}`}
                className="comp-details-input"
                classNamePrefix="comp-select"
                options={officeOptions}
                values={officeOptions.filter((opt) => (field.state.value ?? []).includes(opt.value))}
                placeholder="Select offices"
                onChange={(selected: any) => field.handleChange((selected ?? []).map((opt: any) => opt.value))}
                errMsg={field.state.meta.errors?.[0]?.message || ""}
                isDisabled={isDisabled}
              />
            )}
          />

          <FormField
            form={form}
            name={`contacts[${contactIndex}].displayInInvestigation` as any}
            label="Display in investigation"
            render={(field) => (
              <div className="comp-details-edit-input">
                <input
                  type="checkbox"
                  id={`contact-display-${contactIndex}`}
                  checked={field.state.value ?? true}
                  onChange={(evt) => field.handleChange(evt.target.checked)}
                  disabled={isDisabled}
                />
              </div>
            )}
          />
        </>
      )}

      {/* Phone numbers */}
      {phoneNumbers.map(({ method, originalIndex }, displayIndex) => (
        <FormField
          key={method.contactMethodGuid || `contact-phone-${displayIndex}`}
          form={form}
          name={`contacts[${contactIndex}].contactMethods[${originalIndex}].value`}
          label={displayIndex === 0 ? "Phone number" : ""}
          validators={{
            // only validate if there are multiple, a single empty phone number is allowed
            onChange: ({ value, fieldApi }: any) => {
              const methods = fieldApi.form.getFieldValue(`contacts[${contactIndex}].contactMethods`) ?? [];
              const rows = methods.filter((cm: any) => cm?.typeCode === ContactMethods.PHONE);
              if (rows.length > 1 && !value?.trim()) return "Phone number is required";
              return validatePhoneNumberValue(value);
            },
          }}
          render={(field) => (
            <>
              <div className="comp-details-form-row">
                <label htmlFor={`contact-phone-primary-${contactIndex}-${originalIndex}`}>
                  <input
                    type="radio"
                    id={`contact-phone-primary-${contactIndex}-${originalIndex}`}
                    name={`primaryContactPhone-${contactIndex}`}
                    checked={method.isPrimary || false}
                    onChange={() => onSetPrimaryContact(contactIndex, originalIndex, ContactMethods.PHONE)}
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
                    value={method.value ?? ""}
                    onChange={(value: string) => field.handleChange(value || "")}
                    maxLength={14}
                    international={false}
                    id={`contact-phone-${contactIndex}-${originalIndex}`}
                    errMsg={getFieldErrorMessage(field)}
                  />
                </div>

                {phoneNumbers.length > 1 && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onRemoveContactMethod(contactIndex, originalIndex)}
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
        name={`add-contact-phone-${contactIndex}`}
        label=""
        render={() => (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onAddContactMethod(contactIndex, ContactMethods.PHONE)}
            type="button"
          >
            <i className="bi bi-plus-circle me-1" /> Add phone number
          </Button>
        )}
      />

      {/* Emails */}
      {emails.map(({ method, originalIndex }, displayIndex) => (
        <FormField
          key={method?.contactMethodGuid || `contact-email-${displayIndex}`}
          form={form}
          name={`contacts[${contactIndex}].contactMethods[${originalIndex}].value` as any}
          label={displayIndex === 0 ? "Email" : ""}
          validators={{
            // only validate if there are multiple, a single empty item is allowed
            onChange: ({ value, fieldApi }: any) => {
              const methods = fieldApi.form.getFieldValue(`contacts[${contactIndex}].contactMethods`) ?? [];
              const rows = methods.filter((cm: any) => cm?.typeCode === ContactMethods.EMAIL);
              if (rows.length > 1 && !value?.trim()) return "Email is required";
              return validateEmailValue(value);
            },
          }}
          render={(field) => (
            <>
              <div className="comp-details-form-row">
                <label htmlFor={`contact-email-primary-${contactIndex}-${originalIndex}`}>
                  <input
                    type="radio"
                    id={`contact-email-primary-${contactIndex}-${originalIndex}`}
                    name={`primaryContactEmail-${contactIndex}`}
                    checked={method?.isPrimary || false}
                    onChange={() => onSetPrimaryContact(contactIndex, originalIndex, ContactMethods.EMAIL)}
                    disabled={isDisabled}
                    className="me-2"
                  />{" "}
                  Mark as Primary email
                </label>
              </div>
              <div className="party-contact-method">
                <div className="party-multiple-value-container">
                  <CompInput
                    id={`contact-email-${contactIndex}-${originalIndex}`}
                    divid=""
                    type="input"
                    inputClass="comp-form-control comp-details-input"
                    value={field.state.value}
                    error={getFieldErrorMessage(field)}
                    onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                    disabled={isDisabled}
                  />
                </div>
                {emails.length > 1 && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => onRemoveContactMethod(contactIndex, originalIndex)}
                    type="button"
                  >
                    <i className="bi bi-trash" /> Remove
                  </Button>
                )}
              </div>
            </>
          )}
        />
      ))}

      <FormField
        form={form}
        name={`add-contact-email-${contactIndex}`}
        label=""
        render={() => (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onAddContactMethod(contactIndex, ContactMethods.EMAIL)}
            type="button"
          >
            <i className="bi bi-plus-circle me-1" /> Add email
          </Button>
        )}
      />
    </>
  );
};
