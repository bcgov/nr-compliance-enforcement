import { FC } from "react";
import { Button } from "react-bootstrap";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { z } from "zod";

interface BusinessAddressFieldsProps {
  addressIndex: number;
  form: any;
  isDisabled: boolean;
  isPrimary: boolean;
  onRemoveAddress: (index: number) => void;
  onSetPrimaryAddress: (index: number) => void;
}

export const BusinessAddressFields: FC<BusinessAddressFieldsProps> = ({
  addressIndex,
  form,
  isDisabled,
  isPrimary,
  onRemoveAddress,
  onSetPrimaryAddress,
}) => {
  return (
    <div className="party-details-item">
      <div className="party-contact-header mb-3">
        <h4>Address {addressIndex + 1}</h4>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => onRemoveAddress(addressIndex)}
          type="button"
        >
          <i className="bi bi-trash" /> Remove Address
        </Button>
      </div>

      <div className="comp-details-form-row">
        <label htmlFor={`address-primary-${addressIndex}`}>Primary address</label>
        <div className="comp-details-edit-input">
          <input
            type="radio"
            id={`address-primary-${addressIndex}`}
            name="primaryBusinessAddress"
            checked={isPrimary || false}
            onChange={() => onSetPrimaryAddress(addressIndex)}
            disabled={isDisabled}
          />
        </div>
      </div>

      <FormField
        form={form}
        name={`addresses[${addressIndex}].addressName` as any}
        label="Address name"
        required
        validators={{
          onChange: z.string().min(1, "Address name is required"),
        }}
        render={(field) => (
          <CompInput
            id={`business-address-name-${addressIndex}`}
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value ?? ""}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={128}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter address name..."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name={`addresses[${addressIndex}].address` as any}
        label="Street address"
        render={(field) => (
          <CompInput
            id={`business-address-${addressIndex}`}
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value ?? ""}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={120}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter address..."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name={`addresses[${addressIndex}].city` as any}
        label="City"
        render={(field) => (
          <CompInput
            id={`business-city-${addressIndex}`}
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value ?? ""}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={128}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter city..."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name={`addresses[${addressIndex}].province` as any}
        label="Province"
        render={(field) => (
          <CompInput
            id={`business-province-${addressIndex}`}
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value ?? ""}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={64}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter province..."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name={`addresses[${addressIndex}].postalCode` as any}
        label="Postal code"
        render={(field) => (
          <CompInput
            id={`business-postal-code-${addressIndex}`}
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value ?? ""}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={16}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter postal code..."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name={`addresses[${addressIndex}].country` as any}
        label="Country"
        render={(field) => (
          <CompInput
            id={`business-country-${addressIndex}`}
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value ?? ""}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={64}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter country..."
            disabled={isDisabled}
          />
        )}
      />
    </div>
  );
};
