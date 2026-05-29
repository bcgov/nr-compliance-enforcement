import { FC, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { z } from "zod";
import { useStore } from "@tanstack/react-form";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCountries, selectCountrySubdivisions } from "@/app/store/reducers/code-table-selectors";
import { CompSelect } from "@/app/components/common/comp-select";

const DEFAULT_COUNTRY = "CA";
const DEFAULT_CANADA_PROVINCE = "CA-BC";

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
  const selectedCountry = useStore(
    form.store,
    (state: any) => state.values?.addresses?.[addressIndex]?.country ?? "",
  ) as string;

  const selectedProvince = useStore(
    form.store,
    (state: any) => state.values?.addresses?.[addressIndex]?.province ?? "",
  ) as string;

  const isCanada = (selectedCountry || "").trim() === DEFAULT_COUNTRY;

  useEffect(() => {
    if (!selectedCountry) {
      form.setFieldValue(`addresses[${addressIndex}].country`, DEFAULT_COUNTRY);
    }
  }, [addressIndex, form, selectedCountry]);

  // If the country is not Canada, clear the province
  useEffect(() => {
    if (!isCanada) {
      form.setFieldValue(`addresses[${addressIndex}].province`, "");
    }
  }, [addressIndex, form, isCanada]);

  // If the country is Canada and the province is not set, set to the default province (BC)
  useEffect(() => {
    if (isCanada && !selectedProvince) {
      form.setFieldValue(`addresses[${addressIndex}].province`, DEFAULT_CANADA_PROVINCE);
    }
  }, [addressIndex, form, isCanada, selectedProvince]);

  const countryOptions = useAppSelector(selectCountries);
  const provinceOptions = useAppSelector(selectCountrySubdivisions);

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
            divid={`business-address-name-${addressIndex}-div`}
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value ?? ""}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={128}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter address name"
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
            divid={`business-address-${addressIndex}-div`}
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value ?? ""}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={120}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter address"
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
            divid={`business-city-${addressIndex}-div`}
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value ?? ""}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={128}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter city"
            disabled={isDisabled}
          />
        )}
      />
      {isCanada && (
        <>
          <FormField
            form={form}
            name={`addresses[${addressIndex}].province` as any}
            label="Province"
            render={(field) => (
              <CompSelect
                id="business-address-province"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={provinceOptions}
                value={provinceOptions.find((opt) => opt.value === field.state.value)}
                onChange={(option) => field.handleChange(option?.value ?? "")}
                placeholder="Select province"
                isClearable={false}
                showInactive={false}
                enableValidation
                errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
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
                divid={`business-postal-code-${addressIndex}-div`}
                type="input"
                inputClass="comp-form-control comp-details-input"
                value={field.state.value ?? ""}
                error={field.state.meta.errors?.[0]?.message || ""}
                maxLength={16}
                onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                placeholder="Enter postal code"
                disabled={isDisabled}
              />
            )}
          />
        </>
      )}
      <FormField
        form={form}
        name={`addresses[${addressIndex}].country` as any}
        label="Country"
        render={(field) => (
          <CompSelect
            id="business-address-country"
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={countryOptions}
            value={countryOptions.find((opt) => opt.value === field.state.value)}
            onChange={(option) => field.handleChange(option?.value ?? "")}
            placeholder="Select country"
            isClearable={false}
            showInactive={false}
            enableValidation
            errorMessage={field.state.meta.errors?.[0]?.message ?? ""}
          />
        )}
      />
    </div>
  );
};
