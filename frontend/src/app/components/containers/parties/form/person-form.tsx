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
import { calculateAgeYears, isYoungPerson } from "@/app/common/methods";
import { Badge, Button } from "react-bootstrap";
import { selectCountries, selectCountrySubdivisions } from "@/app/store/reducers/code-table-selectors";
import { Alias } from "@/generated/graphql";

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

  const countryOptions = useAppSelector(selectCountries).map((opt: { value: string; label: string }) => ({
    value: opt.value,
    label: opt.label,
  }));

  const subdivisionOptions = useAppSelector(selectCountrySubdivisions).map((opt: { value: string; label: string }) => ({
    value: opt.value,
    label: opt.label,
  }));

  const {
    phoneNumbers,
    handleAddPhoneNumber,
    handleRemovePhoneNumber,
    handleSetPrimaryPhoneNumber,
    aliases,
    handleAddAlias,
    handleRemoveAlias,
  } = usePartyFormFields(form);

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
        name="middleNames"
        label="Middle names"
        render={(field) => (
          <CompInput
            id="MiddleNames"
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            defaultValue={field.state.value}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={256}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter middle names..."
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
      <form.Subscribe selector={(state: any) => state.values.driversLicenseNumber}>
        {(driversLicenseNumber: string | undefined) =>
          driversLicenseNumber ? (
            <>
              <FormField
                form={form}
                name="driversLicenseClass"
                label="Driver's licence class"
                render={(field) => (
                  <CompInput
                    id="DriversLicenseClass"
                    divid=""
                    type="input"
                    inputClass="comp-form-control comp-details-input"
                    defaultValue={field.state.value}
                    error={field.state.meta.errors?.[0]?.message || ""}
                    maxLength={128}
                    onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                    placeholder="Enter driver's licence class..."
                    disabled={isDisabled}
                  />
                )}
              />
              <FormField
                form={form}
                name="driversLicenseCountryCode"
                label="Driver's licence country"
                required
                validators={{ onChange: z.string().min(1, "Country is required") }}
                render={(field) => (
                  <CompSelect
                    id="driversLicenseCountry-select"
                    classNamePrefix="comp-select"
                    className="comp-details-input"
                    options={countryOptions}
                    value={countryOptions?.find((opt: any) => opt.value === field.state.value)}
                    onChange={(option) => {
                      const newValue = option?.value ?? "";
                      field.handleChange(newValue);
                      if (newValue !== "CA") {
                        form.setFieldValue("driversLicenseCountrySubdivisionCode", undefined);
                      }
                    }}
                    placeholder="Select country"
                    isClearable={true}
                    showInactive={false}
                    enableValidation={true}
                    errorMessage={field.state.meta.errors?.[0]?.message || ""}
                    isDisabled={isDisabled}
                  />
                )}
              />
              <form.Subscribe selector={(state: any) => state.values.driversLicenseCountryCode}>
                {(countryCode: string | undefined) =>
                  countryCode === "CA" ? (
                    <FormField
                      form={form}
                      name="driversLicenseCountrySubdivisionCode"
                      label="Driver's licence province"
                      render={(field) => (
                        <CompSelect
                          id="driversLicenseSubdivision-select"
                          classNamePrefix="comp-select"
                          className="comp-details-input"
                          options={subdivisionOptions}
                          value={subdivisionOptions?.find((opt: any) => opt.value === field.state.value)}
                          onChange={(option) => field.handleChange(option?.value ?? "")}
                          placeholder="Select province"
                          isClearable={true}
                          showInactive={false}
                          enableValidation={true}
                          errorMessage={field.state.meta.errors?.[0]?.message || ""}
                          isDisabled={isDisabled}
                        />
                      )}
                    />
                  ) : null
                }
              </form.Subscribe>
            </>
          ) : null
        }
      </form.Subscribe>
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
