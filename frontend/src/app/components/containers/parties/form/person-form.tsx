import { FC } from "react";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import { ValidationPhoneInput } from "@/app/common/validation-phone-input";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { ContactMethod } from "@/generated/graphql";
import { useAppSelector } from "@hooks/hooks";
import { selectSexDropdown } from "@/app/store/reducers/code-table";
import { z } from "zod";
import { Button } from "react-bootstrap";
import { usePartyFormFields } from "@/app/components/containers/parties/hooks/use-party-form-fields";
import { PartyPhoneFields } from "@/app/components/containers/parties/form/party-phone-fields";

type PersonFormProps = {
  form: any;
  isDisabled: boolean;
};

export const PersonForm: FC<PersonFormProps> = ({ form, isDisabled }) => {
  const sexCodeOptions = useAppSelector(selectSexDropdown)
    ?.filter((opt: { isActive?: boolean }) => opt.isActive !== false)
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
          <ValidationDatePicker
            id="DateOfBirth"
            classNamePrefix="comp-details-input"
            className="comp-form-control comp-details-input"
            selectedDate={field.state.value}
            onChange={(date: Date | undefined) => field.handleChange(date ?? undefined)}
            errMsg={field.state.meta.errors?.[0]?.message || ""}
            isDisabled={isDisabled}
            showYearDropdown={true}
            yearDropdownItemNumber={100}
          />
        )}
      />
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
        name="sexCode"
        label="Sex"
        render={(field) => (
          <CompSelect
            id="sex-select"
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={sexCodeOptions}
            value={sexCodeOptions?.find((opt: any) => opt.value === field.state.value)}
            onChange={(option) => field.handleChange(option?.value ?? "")}
            placeholder="Select sex"
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
