import { FC } from "react";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { useAppSelector } from "@hooks/hooks";
import { selectApproximateAgeDropdown, selectGenderDropdown } from "@/app/store/reducers/code-table";
import { z } from "zod";
import { usePartyFormFields } from "@/app/components/containers/parties/hooks/use-party-form-fields";
import { PartyPhoneFields } from "@/app/components/containers/parties/form/party-phone-fields";
import { useStore } from "@tanstack/react-form";
import { calculateAgeYears, isYoungPerson } from "@/app/common/methods";
import { Badge } from "react-bootstrap";

type PersonFormProps = {
  form: any;
  isDisabled: boolean;
};

export const PersonForm: FC<PersonFormProps> = ({ form, isDisabled }) => {
  const genderCodeOptions = useAppSelector(selectGenderDropdown)
    ?.filter((opt: { activeInd?: boolean }) => opt.activeInd !== false)
    .map((opt: { value: string; label: string }) => ({ value: opt.value, label: opt.label }));

  const approximateAgeOptions = useAppSelector(selectApproximateAgeDropdown)
    ?.filter((opt: { activeInd?: boolean }) => opt.activeInd !== false)
    .map((opt: { value: string; label: string }) => ({ value: opt.value, label: opt.label }));

  const { phoneNumbers, handleAddPhoneNumber, handleRemovePhoneNumber, handleSetPrimaryPhoneNumber } =
    usePartyFormFields(form);

  return (
    <>
      <FormField
        form={form}
        name="firstName"
        label="First name"
        required
        validators={{ onChange: z.string().min(1, "First name is required") }}
        render={(field) => (
          <CompInput
            id="FirstName"
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            defaultValue={field.state.value}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={50}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter first name..."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name="lastName"
        label="Last name"
        required
        validators={{ onChange: z.string().min(1, "Last name is required") }}
        render={(field) => (
          <CompInput
            id="LastName"
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            defaultValue={field.state.value}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={50}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter last name..."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name="middleName"
        label="Middle name"
        render={(field) => (
          <CompInput
            id="MiddleName"
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            defaultValue={field.state.value}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={50}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter middle name..."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name="middleName2"
        label="Middle name 2"
        render={(field) => (
          <CompInput
            id="MiddleName2"
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            defaultValue={field.state.value}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={50}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter middle name 2..."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name="dateOfBirth"
        label="Date of birth"
        render={(field) => (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ValidationDatePicker
              id="DateOfBirth"
              classNamePrefix="comp-details-input"
              className="comp-form-control comp-details-input"
              selectedDate={field.state.value}
              onChange={(date: Date | undefined) => {
                field.handleChange(date ?? null);
                if (date) {
                  form.setFieldValue("approximateAgeCode", undefined);
                }
              }}
              errMsg={field.state.meta.errors?.[0]?.message || ""}
              isDisabled={isDisabled}
              showYearDropdown={true}
              yearDropdownItemNumber={100}
            />
            {field.state.value instanceof Date && (
              <span className="text-muted">{calculateAgeYears(field.state.value)} years old</span>
            )}
            <form.Subscribe selector={(state: any) => state.values.approximateAgeCode}>
              {(approximateAgeCode: string | undefined) =>
                isYoungPerson(field.state.value, approximateAgeCode) ? (
                  <Badge bg="species-badge comp-species-badge">Young person</Badge>
                ) : null
              }
            </form.Subscribe>
          </div>
        )}
      />
      <form.Subscribe selector={(state: any) => state.values.dateOfBirth}>
        {(dateOfBirth: Date | undefined) =>
          dateOfBirth ? null : (
            <FormField
              form={form}
              name="approximateAgeCode"
              label="Approximate age"
              render={(field) => (
                <CompSelect
                  id="approximate-age-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={approximateAgeOptions}
                  value={approximateAgeOptions?.find((opt: any) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value ?? "")}
                  placeholder="Select approximate age"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  isDisabled={isDisabled}
                />
              )}
            />
          )
        }
      </form.Subscribe>
      <FormField
        form={form}
        name="driversLicenseNumber"
        label="Driver's licence number"
        render={(field) => (
          <CompInput
            id="DriversLicenseNumber"
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            defaultValue={field.state.value}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={50}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter driver's licence number..."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name="driversLicenseJurisdiction"
        label="Driver's licence jurisdiction"
        render={(field) => (
          <CompInput
            id="DriversLicenseJurisdiction"
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            defaultValue={field.state.value}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={50}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter driver's licence jurisdiction..."
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name="genderCode"
        label="Gender"
        render={(field) => (
          <CompSelect
            id="gender-select"
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={genderCodeOptions}
            value={genderCodeOptions?.find((opt: any) => opt.value === field.state.value)}
            onChange={(option) => field.handleChange(option?.value ?? "")}
            placeholder="Select gender"
            isClearable={true}
            showInactive={false}
            enableValidation={true}
            errorMessage={field.state.meta.errors?.[0]?.message || ""}
            isDisabled={isDisabled}
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
    </>
  );
};
