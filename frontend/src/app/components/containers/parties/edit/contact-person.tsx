import { FC } from "react";
import { Button } from "react-bootstrap";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { PhoneNumberField } from "@/app/components/containers/parties/edit/phone-number";
import { BusinessPerson, ContactMethod } from "@/generated/graphql";

interface ContactPersonFieldsProps {
  contact: BusinessPerson;
  contactIndex: number;
  form: any;
  isDisabled: boolean;
  onRemoveContact: (index: number) => void;
  onAddContactMethod: (contactIndex: number, typeCode: string) => void;
  onRemoveContactMethod: (contactIndex: number, methodIndex: number) => void;
  onSetPrimaryContact: (contactIndex: number, methodIndex: number, typeCode: string) => void;
}

export const ContactPersonFields: FC<ContactPersonFieldsProps> = ({
  contact,
  contactIndex,
  form,
  isDisabled,
  onRemoveContact,
  onAddContactMethod,
  onRemoveContactMethod,
  onSetPrimaryContact,
}) => {
  const phoneNumbers =
    contact.person?.contactMethods
      ?.map((cm, cmIndex) => ({ method: cm, originalIndex: cmIndex }))
      .filter(
        (item): item is { method: ContactMethod; originalIndex: number } =>
          item.method !== null && item.method.typeCode === "PHONE",
      ) || [];

  const emails =
    contact.person?.contactMethods
      ?.map((cm, cmIndex) => ({ method: cm, originalIndex: cmIndex }))
      .filter(({ method }) => method?.typeCode === "EMAILADDR") || [];

  return (
    <div
      key={contact.person?.personGuid}
      className="party-details-item"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h4>Contact {contactIndex + 1}</h4>
        <Button
          variant="outline-dark"
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
        render={(field) => (
          <CompInput
            id={`contact-firstName-${contactIndex}`}
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value}
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
        render={(field) => (
          <CompInput
            id={`contact-lastName-${contactIndex}`}
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter last name..."
            disabled={isDisabled}
          />
        )}
      />

      {/* Phone numbers */}
      {phoneNumbers.map(({ method, originalIndex }, displayIndex) => (
        <PhoneNumberField
          key={originalIndex}
          phoneNumber={method}
          displayIndex={displayIndex}
          form={form}
          isDisabled={isDisabled}
          onSetPrimary={() => onSetPrimaryContact(contactIndex, originalIndex, "PHONE")}
          onRemove={() => onRemoveContactMethod(contactIndex, originalIndex)}
          fieldName={`contacts[${contactIndex}].person.contactMethods[${originalIndex}].value`}
          radioName={`primaryContactPhone-${contactIndex}`}
          radioId={`contact-phone-primary-${contactIndex}-${originalIndex}`}
          inputId={`contact-phone-${contactIndex}-${originalIndex}`}
        />
      ))}

      <FormField
        form={form}
        name={`add-contact-phone-${contactIndex}`}
        label=""
        render={() => (
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => onAddContactMethod(contactIndex, "PHONE")}
            type="button"
          >
            <i className="bi bi-plus-circle me-1" /> Add phone number
          </Button>
        )}
      />

      {/* Emails */}
      {emails.map(({ method, originalIndex }, displayIndex) => (
        <FormField
          key={originalIndex}
          form={form}
          name={`contacts[${contactIndex}].person.contactMethods[${originalIndex}].value` as any}
          label={displayIndex === 0 ? "Email" : ""}
          render={(field) => (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {displayIndex === 0 && <div style={{ width: "60px", fontWeight: "500", fontSize: "14px" }}>Primary</div>}
              {displayIndex > 0 && <div style={{ width: "60px" }}></div>}

              <input
                type="radio"
                id={`email-primary-${displayIndex}`}
                name={`primaryContactEmail-${contactIndex}`}
                checked={method?.isPrimary || false}
                onChange={() => onSetPrimaryContact(contactIndex, originalIndex, "EMAILADDR")}
                disabled={isDisabled}
              />

              <div style={{ flex: 1 }}>
                <CompInput
                  id={`contact-email-${contactIndex}-${originalIndex}`}
                  divid=""
                  type="input"
                  inputClass="comp-form-control comp-details-input"
                  value={field.state.value}
                  onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                  disabled={isDisabled}
                />
              </div>
              <Button
                variant="outline-dark"
                size="sm"
                onClick={() => onRemoveContactMethod(contactIndex, originalIndex)}
                type="button"
              >
                <i className="bi bi-trash" /> Remove
              </Button>
            </div>
          )}
        />
      ))}

      <FormField
        form={form}
        name={`add-contact-email-${contactIndex}`}
        label=""
        render={() => (
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => onAddContactMethod(contactIndex, "EMAILADDR")}
            type="button"
          >
            <i className="bi bi-plus-circle me-1" /> Add email
          </Button>
        )}
      />
    </div>
  );
};
