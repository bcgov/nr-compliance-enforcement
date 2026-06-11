import { FC } from "react";
import { FormField } from "@components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { useAppSelector } from "@hooks/hooks";
import {
  selectApproximateAgeDropdown,
  selectBuildDropdown,
  selectComplexionDropdown,
  selectEyeColourDropdown,
  selectFacialHairStyleDropdown,
  selectGenderDropdown,
  selectHairColourDropdown,
  selectHairLengthDropdown,
} from "@/app/store/reducers/code-table";
import { z } from "zod";
import { usePartyFormFields } from "@/app/components/containers/parties/hooks/use-party-form-fields";
import { PartyPhoneFields } from "@/app/components/containers/parties/form/party-phone-fields";
import { calculateAgeYears, isYoungPerson } from "@/app/common/methods";
import { Badge, Button, Form } from "react-bootstrap";
import { selectCountries, selectCountrySubdivisions } from "@/app/store/reducers/code-table-selectors";
import { Alias, ContactMethod, PersonFacialHairStyleCode } from "@/generated/graphql";
import { AddressFormValue } from "@/app/components/containers/parties/form/party-form-utils";
import { AddressFields } from "@/app/components/containers/parties/form/party-address-fields";
import { HeightField, WeightField } from "@/app/components/containers/parties/form/height-weight-fields";
import { ValidationMultiSelect } from "@/app/common/validation-multiselect";
import Option from "@apptypes/app/option";
import { ValidationTextArea } from "@/app/common/validation-textarea";

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

  const complexionCodeOptions = useAppSelector(selectComplexionDropdown).map(
    (opt: { value: string; label: string }) => ({
      value: opt.value,
      label: opt.label,
    }),
  );

  const buildCodeOptions = useAppSelector(selectBuildDropdown).map((opt: { value: string; label: string }) => ({
    value: opt.value,
    label: opt.label,
  }));

  const hairColourOptions = useAppSelector(selectHairColourDropdown).map((opt: { value: string; label: string }) => ({
    value: opt.value,
    label: opt.label,
  }));

  const hairLengthOptions = useAppSelector(selectHairLengthDropdown).map((opt: { value: string; label: string }) => ({
    value: opt.value,
    label: opt.label,
  }));

  const eyeColourOptions = useAppSelector(selectEyeColourDropdown).map((opt: { value: string; label: string }) => ({
    value: opt.value,
    label: opt.label,
  }));

  const facialHairStyleOptions = useAppSelector(selectFacialHairStyleDropdown).map(
    (opt: { value: string; label: string }) => ({
      value: opt.value,
      label: opt.label,
    }),
  );

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
  } = usePartyFormFields(form);

  // Helper functions to prevent Sonar from whining that it's all nested too deep.
  const renderDriversLicenseSubdivisionField = () => (
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
  );

  const renderFacialHairStyleField = () => {
    const mapFacialHairStyleToOption = (fhs: PersonFacialHairStyleCode) =>
      facialHairStyleOptions.find((o) => o.value === fhs.facialHairStyleCode) ?? {
        value: fhs.facialHairStyleCode,
        label: fhs.facialHairStyleCode,
      };

    const findExistingFacialHairStyle = (current: PersonFacialHairStyleCode[], optionValue: string) =>
      current.find((fhs: PersonFacialHairStyleCode) => fhs.facialHairStyleCode === optionValue);

    const mapOptionsToFacialHairStyleCodes = (options: Option[], current: PersonFacialHairStyleCode[]) =>
      (options ?? []).map((o) => {
        const existing = findExistingFacialHairStyle(current, o.value ?? "");
        return {
          personFacialStyleHairCodeGuid: existing?.personFacialStyleHairCodeGuid,
          personGuid: existing?.personGuid,
          facialHairStyleCode: o.value,
        };
      });

    return (
      <FormField
        form={form}
        name="facialHairStyleCodes"
        label="Facial hair style"
        render={(field) => (
          <ValidationMultiSelect
            id="facial-hair-style-select"
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={facialHairStyleOptions}
            values={(field.state.value ?? []).map(mapFacialHairStyleToOption)}
            onChange={(options: Option[]) => {
              const current = field.state.value ?? [];
              field.handleChange(mapOptionsToFacialHairStyleCodes(options, current));
            }}
            placeholder="Select facial hair styles"
            isClearable={true}
            errMsg={field.state.meta.errors?.[0]?.message || ""}
          />
        )}
      />
    );
  };

  return (
    <>
      <FormField
        form={form}
        name="boloIndicator"
        label="Caution / BOLO"
        render={(field) => (
          <Form.Check
            type="checkbox"
            id="bolo-ind"
            label="Caution / BOLO"
            checked={field.state.value === true}
            onChange={(evt: any) => {
              const checked = evt.target.checked;
              field.handleChange(checked);
            }}
            disabled={isDisabled}
          />
        )}
      />
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
            placeholder="Enter first name"
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
            placeholder="Enter last name"
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
            placeholder="Enter middle names"
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
                  placeholder="Enter alias"
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
            onChange={(evt: any) => {
              field.handleChange(evt?.target?.value || "");
              if (!evt?.target?.value) {
                form.setFieldValue("driversLicenseClass", null);
                form.setFieldValue("driversLicenseCountryCode", null);
                form.setFieldValue("driversLicenseCountrySubdivisionCode", null);
              }
            }}
            placeholder="Enter driver's licence number"
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
                    placeholder="Enter driver's licence class"
                    disabled={isDisabled}
                  />
                )}
              />
              <FormField
                form={form}
                name="driversLicenseCountryCode"
                label="Driver's licence country"
                required
                validators={{
                  onChange: ({ value }: { value: string | null | undefined }) => {
                    const requiresCountry = !!form.getFieldValue("driversLicenseNumber");
                    const isEmpty = value === null || value === undefined || value === "";
                    return requiresCountry && isEmpty ? { message: "Country is required" } : undefined;
                  },
                }}
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
                        form.setFieldValue("driversLicenseCountrySubdivisionCode", null);
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
                  countryCode === "CA" ? renderDriversLicenseSubdivisionField() : null
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
      <HeightField
        form={form}
        isDisabled={isDisabled}
      />
      <WeightField
        form={form}
        isDisabled={isDisabled}
      />
      <FormField
        form={form}
        name="complexionCode"
        label="Complexion"
        render={(field) => (
          <CompSelect
            id="complexion-select"
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={complexionCodeOptions}
            value={complexionCodeOptions?.find((opt: any) => opt.value === field.state.value)}
            onChange={(option) => field.handleChange(option?.value ?? "")}
            placeholder="Select complexion"
            isClearable={true}
            showInactive={false}
            enableValidation={true}
            errorMessage={field.state.meta.errors?.[0]?.message || ""}
            isDisabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name="buildCode"
        label="Build"
        render={(field) => (
          <CompSelect
            id="build-select"
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={buildCodeOptions}
            value={buildCodeOptions?.find((opt: any) => opt.value === field.state.value)}
            onChange={(option) => field.handleChange(option?.value ?? "")}
            placeholder="Select build"
            isClearable={true}
            showInactive={false}
            enableValidation={true}
            errorMessage={field.state.meta.errors?.[0]?.message || ""}
            isDisabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name="eyeColourCode"
        label="Eye colour"
        render={(field) => (
          <CompSelect
            id="eye-colour-select"
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={eyeColourOptions}
            value={eyeColourOptions?.find((opt: any) => opt.value === field.state.value)}
            onChange={(option) => {
              const newValue = option?.value ?? "";
              field.handleChange(newValue);
              if (newValue !== "OTH") {
                form.setFieldValue("eyeColourOther", null);
              }
            }}
            placeholder="Select eye colour"
            isClearable={true}
            showInactive={false}
            enableValidation={true}
            errorMessage={field.state.meta.errors?.[0]?.message || ""}
            isDisabled={isDisabled}
          />
        )}
      />
      <form.Subscribe selector={(state: any) => state.values.eyeColourCode}>
        {(eyeColourCode: string | undefined) =>
          eyeColourCode === "OTH" ? (
            <FormField
              form={form}
              name="eyeColourOther"
              label="Other eye colour"
              render={(field) => (
                <CompInput
                  id="eyeColourOther"
                  divid=""
                  type="input"
                  inputClass="comp-form-control comp-details-input"
                  defaultValue={field.state.value}
                  error={field.state.meta.errors?.[0]?.message || ""}
                  maxLength={128}
                  onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                  placeholder="Enter other eye colour"
                  disabled={isDisabled}
                />
              )}
            />
          ) : null
        }
      </form.Subscribe>
      <FormField
        form={form}
        name="hairColourCode"
        label="Hair colour"
        render={(field) => (
          <CompSelect
            id="hair-colour-select"
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={hairColourOptions}
            value={hairColourOptions?.find((opt: any) => opt.value === field.state.value)}
            onChange={(option) => {
              const newValue = option?.value ?? "";
              field.handleChange(newValue);
              if (newValue !== "OTH") {
                form.setFieldValue("hairColourOther", null);
              }
            }}
            placeholder="Select hair colour"
            isClearable={true}
            showInactive={false}
            enableValidation={true}
            errorMessage={field.state.meta.errors?.[0]?.message || ""}
            isDisabled={isDisabled}
          />
        )}
      />
      <form.Subscribe selector={(state: any) => state.values.hairColourCode}>
        {(hairColourCode: string | undefined) =>
          hairColourCode === "OTH" ? (
            <FormField
              form={form}
              name="hairColourOther"
              label="Other hair colour"
              render={(field) => (
                <CompInput
                  id="hairColourOther"
                  divid=""
                  type="input"
                  inputClass="comp-form-control comp-details-input"
                  defaultValue={field.state.value}
                  error={field.state.meta.errors?.[0]?.message || ""}
                  maxLength={128}
                  onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                  placeholder="Enter other hair colour"
                  disabled={isDisabled}
                />
              )}
            />
          ) : null
        }
      </form.Subscribe>
      <FormField
        form={form}
        name="hairLengthCode"
        label="Hair length"
        render={(field) => (
          <CompSelect
            id="hair-length-select"
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={hairLengthOptions}
            value={hairLengthOptions?.find((opt: any) => opt.value === field.state.value)}
            onChange={(option) => field.handleChange(option?.value ?? "")}
            placeholder="Select hair length"
            isClearable={true}
            showInactive={false}
            enableValidation={true}
            errorMessage={field.state.meta.errors?.[0]?.message || ""}
            isDisabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name="facialHairIndicator"
        label="Facial hair"
        render={(field) => (
          <Form.Check
            type="checkbox"
            id="facial-hair-ind"
            label="Has facial hair"
            checked={field.state.value === true}
            onChange={(evt: any) => {
              const checked = evt.target.checked;
              field.handleChange(checked);
              if (!checked) {
                // Clear any existing facial hair styles
                form.setFieldValue("facialHairStyleCodes", []);
              }
            }}
            disabled={isDisabled}
          />
        )}
      />
      <form.Subscribe selector={(state: any) => state.values.facialHairIndicator}>
        {(facialHairIndicator: boolean | undefined) => (facialHairIndicator ? renderFacialHairStyleField() : null)}
      </form.Subscribe>
      <FormField
        form={form}
        name="additionalHairDescriptors"
        label="Additional hair descriptors"
        render={(field) => (
          <CompInput
            id="additional-hair-descriptors"
            divid=""
            type="input"
            inputClass="comp-form-control comp-details-input"
            defaultValue={field.state.value}
            error={field.state.meta.errors?.[0]?.message || ""}
            maxLength={512}
            onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
            placeholder="Enter additional hair descriptors"
            disabled={isDisabled}
          />
        )}
      />
      <FormField
        form={form}
        name="tattooIndicator"
        label="Has tattoos?"
        render={(field) => (
          <Form.Check
            type="checkbox"
            id="tattoo-ind"
            label="Has tattoos?"
            checked={field.state.value === true}
            onChange={(evt: any) => {
              const checked = evt.target.checked;
              field.handleChange(checked);
              if (!checked) {
                // Clear any existing tattoo description
                form.setFieldValue("tattooDescription", "");
              }
            }}
            disabled={isDisabled}
          />
        )}
      />
      <form.Subscribe selector={(state: any) => state.values.tattooIndicator}>
        {(tattooIndicator: boolean | undefined) =>
          tattooIndicator ? (
            <FormField
              form={form}
              name="tattooDescription"
              label="Tattoo description"
              render={(field) => (
                <CompInput
                  id="tattoo-description"
                  divid=""
                  type="input"
                  inputClass="comp-form-control comp-details-input"
                  defaultValue={field.state.value}
                  error={field.state.meta.errors?.[0]?.message || ""}
                  maxLength={512}
                  onChange={(evt: any) => field.handleChange(evt?.target?.value || "")}
                  placeholder="Enter tattoo description"
                  disabled={isDisabled}
                />
              )}
            />
          ) : null
        }
      </form.Subscribe>
      <FormField
        form={form}
        name="additionalDescriptors"
        label="Additional descriptors"
        render={(field) => (
          <ValidationTextArea
            id="description"
            className="comp-form-control comp-details-input"
            rows={4}
            defaultValue={field.state.value}
            onChange={(value: string) => field.handleChange(value)}
            placeholderText="Enter additional descriptors"
            maxLength={4000}
            errMsg={field.state.meta.errors?.[0]?.message || ""}
          />
        )}
      />
      {addresses?.map((address: AddressFormValue, index: number) => (
        <FormField
          key={address.addressGuid || `address-${index}`}
          form={form}
          name={`address-block-${index}` as any}
          label={index === 0 ? "Address" : ""}
          render={() => (
            <AddressFields
              addressIndex={index}
              form={form}
              isDisabled={isDisabled}
              isPrimary={address.isPrimary || false}
              onRemoveAddress={handleRemoveAddress}
              onSetPrimaryAddress={handleSetPrimaryAddress}
            />
          )}
        />
      ))}
      <FormField
        form={form}
        name="add-address-placeholder"
        label=""
        render={() => (
          <Button
            id="add-address-button"
            variant="outline-primary"
            size="sm"
            onClick={handleAddAddress}
            type="button"
          >
            <i className="bi bi-plus-circle me-1" />
            {/**/}
            Add address
          </Button>
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
      <FormField
        form={form}
        name="comments"
        label="Comments"
        render={(field) => (
          <ValidationTextArea
            id="comments"
            className="comp-form-control comp-details-input"
            rows={4}
            defaultValue={field.state.value}
            onChange={(value: string) => field.handleChange(value)}
            placeholderText="Enter additional comments"
            maxLength={4000}
            errMsg={field.state.meta.errors?.[0]?.message || ""}
          />
        )}
      />
    </>
  );
};
