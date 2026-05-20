import { FC } from "react";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { ValidationPhoneInput } from "@/app/common/validation-phone-input";
import { ContactMethod, Alias, BusinessPerson } from "@/generated/graphql";
import { usePartyFormFields } from "@/app/components/containers/parties/hooks/use-party-form-fields";
import { ContactPersonFields } from "@/app/components/containers/parties/edit/contact-person";
import { z } from "zod";
import { Button } from "react-bootstrap";
import { PartyPhoneFields } from "@/app/components/containers/parties/form/party-phone-fields";

type BusinessFormFieldsProps = {
  form: any;
  isDisabled: boolean;
  showContactPeople?: boolean;
  businessGuid?: string;
};

export const BusinessForm: FC<BusinessFormFieldsProps> = ({
  form,
  isDisabled,
  showContactPeople = true,
  businessGuid,
}) => {
  const {
    phoneNumbers,
    handleAddPhoneNumber,
    handleRemovePhoneNumber,
    handleSetPrimaryPhoneNumber,
    emailAddresses,
    handleAddEmail,
    handleRemoveEmail,
    handleSetPrimaryEmail,
    aliases,
    handleAddAlias,
    handleRemoveAlias,
    contacts,
    handleAddContact,
    handleRemoveContact,
    handleAddContactMethod,
    handleRemoveContactMethod,
    handleSetPrimaryContact,
  } = usePartyFormFields(form, businessGuid);

  return (
    <>
      <FormField
        form={form}
        name="businessName"
        label="Name"
        required
        validators={{
          onChange: z.string().min(1, "Name is required"),
        }}
        render={(field) => (
          <CompInput
            id="businessName"
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={50}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter name..."
            disabled={isDisabled}
          />
        )}
      />
      {aliases?.map((alias: Alias, index: number) => (
        <FormField
          key={alias.aliasGuid || `alias-${index}`}
          form={form}
          name={`aliases[${index}].name` as any}
          label={index === 0 ? "Alias" : ""}
          render={(field) => (
            <div className="party-alias-container">
              <div className="party-multiple-value-container">
                <CompInput
                  id={`alias-${index}`}
                  divid=""
                  type="input"
                  inputClass="comp-form-control comp-details-input"
                  value={field.state.value}
                  error={field.state.meta.errors?.[0]?.message || ""}
                  maxLength={512}
                  onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                  placeholder="Enter alias..."
                  disabled={isDisabled}
                />
              </div>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => handleRemoveAlias(index)}
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
        name="add-alias-placeholder"
        label=""
        render={() => (
          <Button
            id="add-alias-button"
            variant="outline-primary"
            size="sm"
            onClick={handleAddAlias}
            type="button"
          >
            <i className="bi bi-plus-circle me-1" />
            {/**/}
            Add alias
          </Button>
        )}
      />
      <FormField
        form={form}
        name="businessNumber.identifierValue"
        label="Business number"
        render={(field) => (
          <CompInput
            id="businessNumber"
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={16}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name="worksafeBCNumber.identifierValue"
        label="WorkSafeBC number"
        render={(field) => (
          <CompInput
            id="worksafeBCNumber"
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={16}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            disabled={isDisabled}
          />
        )}
      />
      <PartyPhoneFields
        form={form}
        isDisabled={isDisabled}
        phoneNumbers={phoneNumbers}
        onAdd={handleAddPhoneNumber}
        onRemove={handleRemovePhoneNumber}
        onSetPrimary={handleSetPrimaryPhoneNumber}
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
                onChange={() => handleSetPrimaryEmail(index)}
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
                onClick={() => handleRemoveEmail(index)}
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
            onClick={handleAddEmail}
            type="button"
          >
            <i className="bi bi-plus-circle me-1" />
            {/**/}
            Add email
          </Button>
        )}
      />
      {showContactPeople && (
        <>
          {contacts?.map((contact: BusinessPerson, contactIndex: number) => (
            <FormField
              key={contact.businessPersonXrefGuid || `contact-${contactIndex}`}
              form={form}
              name={`contact-${contactIndex}.person`}
              label={contactIndex === 0 ? "Contact" : ""}
              render={() => (
                <ContactPersonFields
                  contact={contact}
                  contactIndex={contactIndex}
                  form={form}
                  isDisabled={isDisabled}
                  onRemoveContact={handleRemoveContact}
                  onAddContactMethod={handleAddContactMethod}
                  onRemoveContactMethod={handleRemoveContactMethod}
                  onSetPrimaryContact={handleSetPrimaryContact}
                />
              )}
            />
          ))}
          <FormField
            form={form}
            name="add-contact-placeholder"
            label=""
            render={() => (
              <Button
                variant="outline-primary"
                onClick={handleAddContact}
                size="sm"
                type="button"
              >
                <i className="bi bi-plus-circle me-1" /> Add contact
              </Button>
            )}
          />
        </>
      )}
    </>
  );
};
