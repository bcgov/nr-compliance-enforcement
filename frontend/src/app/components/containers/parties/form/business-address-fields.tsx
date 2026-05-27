import { FC, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { z } from "zod";
import { useStore } from "@tanstack/react-form";

import countryCsvRaw from "@/assets/country-list.csv?raw";
import provinceCsvRaw from "@/assets/province-list.csv?raw";

const parseFirstCsvColumn = (csv: string): string[] => {
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Drop header row (e.g. "Name,Code")
  const dataLines = lines.slice(1);

  const names: string[] = [];
  for (const line of dataLines) {
    // We only need the first column ("Name"), but some names contain commas and are quoted.
    if (line.startsWith('"')) {
      const endQuote = line.indexOf('",');
      if (endQuote > 1) {
        names.push(line.slice(1, endQuote).trim());
      }
      continue;
    }
    const firstComma = line.indexOf(",");
    if (firstComma === -1) {
      continue;
    }
    names.push(line.slice(0, firstComma).trim());
  }

  return names;
};

const COUNTRY_OPTIONS = parseFirstCsvColumn(countryCsvRaw);
const CANADA_PROVINCE_OPTIONS = parseFirstCsvColumn(provinceCsvRaw);
const DEFAULT_COUNTRY = "Canada";
const DEFAULT_CANADA_PROVINCE = "British Columbia";

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

  const countryOptions = useMemo(() => COUNTRY_OPTIONS, []);
  const provinceOptions = useMemo(() => CANADA_PROVINCE_OPTIONS, []);

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
            divid={`business-address-${addressIndex}-div`}
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
            divid={`business-city-${addressIndex}-div`}
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
      {isCanada && (
        <FormField
          form={form}
          name={`addresses[${addressIndex}].province` as any}
          label="Province"
          render={(field) => {
            const errorMessage = field.state.meta.errors?.[0]?.message || "";
            const className = ["comp-form-control", "comp-details-input", errorMessage ? "is-invalid error-border" : ""]
              .filter(Boolean)
              .join(" ");

            return (
              <div id={`business-province-${addressIndex}-div`}>
                <select
                  id={`business-province-${addressIndex}`}
                  className={className}
                  value={field.state.value ?? ""}
                  onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                  disabled={isDisabled}
                >
                  <option value="">Select province...</option>
                  {provinceOptions.map((name) => (
                    <option
                      key={name}
                      value={name}
                    >
                      {name}
                    </option>
                  ))}
                </select>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
              </div>
            );
          }}
        />
      )}
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
            placeholder="Enter postal code..."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name={`addresses[${addressIndex}].country` as any}
        label="Country"
        render={(field) => {
          const errorMessage = field.state.meta.errors?.[0]?.message || "";
          const className = ["comp-form-control", "comp-details-input", errorMessage ? "is-invalid error-border" : ""]
            .filter(Boolean)
            .join(" ");

          return (
            <div id={`business-country-${addressIndex}-div`}>
              <select
                id={`business-country-${addressIndex}`}
                className={className}
                value={field.state.value ?? ""}
                onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                disabled={isDisabled}
              >
                {countryOptions.map((name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                ))}
              </select>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
          );
        }}
      />
    </div>
  );
};
