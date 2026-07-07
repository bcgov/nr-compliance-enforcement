import { FC } from "react";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { BusinessPerson } from "@/generated/graphql";
import { usePartyFormFields } from "@/app/components/containers/parties/hooks/use-party-form-fields";
import { ContactPersonFields } from "@/app/components/containers/parties/edit/contact-person";
import { z } from "zod";
import { Button } from "react-bootstrap";
import { getFieldErrorMessage } from "@/app/components/containers/parties/form/party-form-errors";
import { PartyContactFields } from "@/app/components/containers/parties/form/party-contact-fields";
import { PartyAliasFields } from "@/app/components/containers/parties/form/party-alias-fields";

type BusinessFormFieldsProps = {
  form: any;
  isDisabled: boolean;
  showContactPeople?: boolean;
  businessGuid?: string;
  showInvestigationFields?: boolean;
};

export const BusinessFormFields: FC<BusinessFormFieldsProps> = ({
  form,
  isDisabled,
  showContactPeople = true,
  businessGuid,
  showInvestigationFields = false,
}) => {
  const {
    addresses,
    handleAddAddress,
    handleRemoveAddress,
    handleSetPrimaryAddress,
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
    handleSetPrimaryBusinessContact,
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
      <PartyAliasFields
        form={form}
        isDisabled={isDisabled}
        aliases={aliases}
        onAdd={handleAddAlias}
        onRemove={handleRemoveAlias}
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
            value={field.state.value ?? ""}
            error={getFieldErrorMessage(field)}
            maxLength={16}
            onChange={(evt: any) => {
              field.handleChange(evt?.target?.value || "");
              if (getFieldErrorMessage(field)) {
                field.setMeta({ errorMap: {}, errorSourceMap: {} });
              }
            }}
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
            value={field.state.value ?? ""}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={16}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            disabled={isDisabled}
          />
        )}
      />
      <PartyContactFields
        form={form}
        isDisabled={isDisabled}
        addresses={addresses}
        onAddAddress={handleAddAddress}
        onRemoveAddress={handleRemoveAddress}
        onSetPrimaryAddress={handleSetPrimaryAddress}
        phoneNumbers={phoneNumbers}
        onAddPhoneNumber={handleAddPhoneNumber}
        onRemovePhoneNumber={handleRemovePhoneNumber}
        onSetPrimaryPhoneNumber={handleSetPrimaryPhoneNumber}
        emailAddresses={emailAddresses}
        onAddEmail={handleAddEmail}
        onRemoveEmail={handleRemoveEmail}
        onSetPrimaryEmail={handleSetPrimaryEmail}
        showOfficeFields={showInvestigationFields}
      />
      {showContactPeople && (
        <>
          <div className="comp-details-section-header pt-5">
            <h3>Contact(s)</h3>
          </div>
          {contacts?.map((contact: BusinessPerson, contactIndex: number) => (
            <ContactPersonFields
              key={contact.businessPersonXrefGuid || `contact-${contactIndex}`}
              contact={contact}
              contactIndex={contactIndex}
              form={form}
              isDisabled={isDisabled}
              isPrimary={contact.isPrimary || false}
              onRemoveContact={handleRemoveContact}
              onSetPrimaryBusinessContact={handleSetPrimaryBusinessContact}
              onAddContactMethod={handleAddContactMethod}
              onRemoveContactMethod={handleRemoveContactMethod}
              onSetPrimaryContact={handleSetPrimaryContact}
              showInvestigationFields={showInvestigationFields}
            />
          ))}
          <Button
            variant="primary"
            size="sm"
            className="mt-3"
            type="button"
            onClick={handleAddContact}
          >
            <i className="bi bi-plus-circle me-1" /> Add contact
          </Button>
        </>
      )}
    </>
  );
};
