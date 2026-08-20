import { FC, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { ValidationPhoneInput } from "@/app/common/validation-phone-input";
import { useStore } from "@tanstack/react-form";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCountries, selectCountrySubdivisions } from "@/app/store/reducers/code-table-selectors";
import { CompSelect } from "@/app/components/common/comp-select";
import {
  CANADA_COUNTRY_CODE,
  DEFAULT_CANADA_PROVINCE,
  isDefaultAddress,
  validateEmailValue,
  validatePhoneNumberValue,
} from "@/app/components/containers/parties/form/party-form-utils";
import { getFieldErrorMessage } from "@/app/components/containers/parties/form/party-form-errors";

interface AddressFieldsProps {
  addressIndex: number;
  form: any;
  isDisabled: boolean;
  isPrimary: boolean;
  onRemoveAddress: (index: number) => void;
  onSetPrimaryAddress: (index: number) => void;
  showOfficeFields?: boolean;
  showDisplayInInvestigation?: boolean;
}

export const AddressFields: FC<AddressFieldsProps> = ({
  addressIndex,
  form,
  isDisabled,
  isPrimary,
  onRemoveAddress,
  onSetPrimaryAddress,
  showOfficeFields = false,
  showDisplayInInvestigation = false,
}) => {
  const selectedCountry = useStore(
    form.store,
    (state: any) => state.values?.addresses?.[addressIndex]?.country ?? "",
  ) as string;

  const selectedProvince = useStore(
    form.store,
    (state: any) => state.values?.addresses?.[addressIndex]?.province ?? "",
  ) as string;

  const isCanada = (selectedCountry || "").trim() === CANADA_COUNTRY_CODE;

  // if the country is Canada and the province is not set set to BC or if another country clear the province
  useEffect(() => {
    if (isCanada && !selectedProvince) {
      form.setFieldValue(`addresses[${addressIndex}].province`, DEFAULT_CANADA_PROVINCE);
    }
    if (!isCanada && selectedProvince) {
      form.setFieldValue(`addresses[${addressIndex}].province`, "");
      form.validateField(`addresses[${addressIndex}].addressName`, "change");
    }
  }, [addressIndex, form, isCanada, selectedProvince]);

  const countryOptions = useAppSelector(selectCountries);
  const provinceOptions = useAppSelector(selectCountrySubdivisions);

  return (
    <>
      {addressIndex > 0 && <hr className="comp-details-section-divider mt-4 mb-4" />}
      <div className="party-contact-header mb-3">
        <label htmlFor={`address-primary-${addressIndex}`}>
          <input
            type="radio"
            id={`address-primary-${addressIndex}`}
            name="primaryAddress"
            checked={isPrimary || false}
            onChange={() => onSetPrimaryAddress(addressIndex)}
            disabled={isDisabled}
            className="me-2"
          />{" "}
          Mark as Primary address
        </label>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => onRemoveAddress(addressIndex)}
          type="button"
        >
          <i className="bi bi-trash" /> Remove Address
        </Button>
      </div>

      <FormField
        form={form}
        name={`addresses[${addressIndex}].addressName` as any}
        label="Address name"
        required
        validators={{
          // re-run when any of these change
          onChangeListenTo: [
            `addresses[${addressIndex}].address`,
            `addresses[${addressIndex}].city`,
            `addresses[${addressIndex}].postalCode`,
            `addresses[${addressIndex}].province`,
            `addresses[${addressIndex}].country`,
          ],
          // an added row must be entered or removed
          onChange: ({ value, fieldApi }: any) => {
            if (value?.trim()) return undefined;
            const address = fieldApi.form.getFieldValue(`addresses[${addressIndex}]`) ?? {};
            return isDefaultAddress({ ...address, addressName: value })
              ? "Enter or remove this address"
              : "Address name is required";
          },
        }}
        render={(field) => (
          <CompInput
            id={`address-name-${addressIndex}`}
            divid={`address-name-${addressIndex}-div`}
            type="input"
            inputClass="comp-form-control comp-details-input"
            value={field.state.value ?? ""}
            error={getFieldErrorMessage(field)}
            maxLength={128}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Home, Office, etc."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name={`addresses[${addressIndex}].address` as any}
        label="Address"
        render={(field) => (
          <CompInput
            id={`address-${addressIndex}`}
            divid={`address-${addressIndex}-div`}
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
            id={`city-${addressIndex}`}
            divid={`city-${addressIndex}-div`}
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
            label="Province/state"
            render={(field) => (
              <CompSelect
                id="address-province"
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
                id={`postal-code-${addressIndex}`}
                divid={`postal-code-${addressIndex}-div`}
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
            id="address-country"
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
      {showOfficeFields && (
        <>
          <FormField
            form={form}
            name={`addresses[${addressIndex}].phoneNumber` as any}
            label="Phone number"
            validators={{
              onChange: ({ value }: { value: string | undefined }) => validatePhoneNumberValue(value),
            }}
            render={(field) => (
              <ValidationPhoneInput
                className="comp-details-input"
                value={field.state.value ?? ""}
                onChange={(value: string) => field.handleChange(value || "")}
                maxLength={14}
                international={false}
                id={`address-phone-${addressIndex}`}
                errMsg={getFieldErrorMessage(field)}
              />
            )}
          />
          <FormField
            form={form}
            name={`addresses[${addressIndex}].emailAddress` as any}
            label="Email address"
            validators={{
              onChange: ({ value }: { value: string | undefined }) => validateEmailValue(value),
            }}
            render={(field) => (
              <CompInput
                id={`address-email-${addressIndex}`}
                divid={`address-email-${addressIndex}-div`}
                type="input"
                inputClass="comp-form-control comp-details-input"
                value={field.state.value ?? ""}
                error={getFieldErrorMessage(field)}
                maxLength={512}
                onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                placeholder="Enter email address"
                disabled={isDisabled}
              />
            )}
          />
          {showDisplayInInvestigation && (
            <FormField
              form={form}
              name={`addresses[${addressIndex}].displayInInvestigation` as any}
              label="Display in investigation"
              render={(field) => (
                <div className="comp-details-edit-input">
                  <input
                    type="checkbox"
                    id={`address-display-${addressIndex}`}
                    checked={field.state.value ?? true}
                    onChange={(evt) => field.handleChange(evt.target.checked)}
                    disabled={isDisabled}
                  />
                </div>
              )}
            />
          )}
        </>
      )}
    </>
  );
};
