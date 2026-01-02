import { bcUtmZoneNumbers } from "@/app/common/methods";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { CompCoordinateInput } from "@/app/components/common/comp-coordinate-input";
import { CompInput } from "@/app/components/common/comp-input";
import { CompSelect } from "@/app/components/common/comp-select";
import { FormErrorBanner } from "@/app/components/common/form-error-banner";
import { FormField } from "@/app/components/common/form-field";
import { useAppSelector } from "@/app/hooks/hooks";
import { getUserAgency } from "@/app/service/user-service";
import { selectAgencyDropdown, selectComplaintStatusCodeDropdown } from "@/app/store/reducers/code-table";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { RootState } from "@/app/store/store";
import { AppUser } from "@/app/types/app/app_user/app_user";
import Option from "@apptypes/app/option";
import { gql } from "graphql-request";
import { useSelector } from "react-redux";
import z from "zod";
import { graphqlRequest as GraphQLRequest } from "@/app/graphql/client";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";

interface InvestigationFormProps {
  form: any;
  isDisabled: boolean;
  id?: string;
  discoveryDate?: string;
}

const CHECK_INVESTIGATION_NAME_EXISTS = gql`
  query CheckInvestigationNameExists($name: String!, $leadAgency: String!, $excludeInvestigationGuid: String) {
    checkInvestigationNameExists(
      name: $name
      leadAgency: $leadAgency
      excludeInvestigationGuid: $excludeInvestigationGuid
    )
  }
`;

export const InvestigationForm = ({ form, id, isDisabled, discoveryDate }: InvestigationFormProps) => {
  const agencyOptions = useAppSelector(selectAgencyDropdown);
  const selectedDiscoveryDateTime = discoveryDate ? new Date(discoveryDate) : undefined;
  const leadAgency = getUserAgency();
  const officersInAgencyList = useSelector((state: RootState) => selectOfficersByAgency(state, leadAgency));
  const statusOptions = useAppSelector(selectComplaintStatusCodeDropdown);

  const assignableOfficers: Option[] =
    officersInAgencyList && officersInAgencyList.length > 0
      ? officersInAgencyList.map((officer: AppUser) => ({
          value: officer.app_user_guid,
          label: `${officer.last_name}, ${officer.first_name}`,
        }))
      : [];

  const handleDiscoveryDateTimeChange = (date: Date | null) => {
    if (date) {
      form.setFieldValue("discoveryDate", new Date(date).toISOString());
    } else {
      form.setFieldValue("discoveryDate", "");
    }
  };

  return (
    <>
      <FormErrorBanner form={form} />
      <form onSubmit={form.handleSubmit}>
        <fieldset>
          <FormField
            form={form}
            name="name"
            label="Investigation ID"
            required
            validators={{
              onChange: z
                .string()
                .min(1, "Investigation ID is required")
                .max(100, "Investigation ID must be 100 characters or less"),
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }: { value: string }) => {
                if (!value || value.length < 1) return "Investigation ID is required";
                const leadAgency = form.getFieldValue("leadAgency");
                if (!leadAgency) return undefined;
                const result: { checkInvestigationNameExists: boolean } = await GraphQLRequest(
                  CHECK_INVESTIGATION_NAME_EXISTS,
                  {
                    name: value,
                    leadAgency: leadAgency,
                    excludeInvestigationGuid: id,
                  },
                );
                if (result.checkInvestigationNameExists) {
                  return "This Investigation ID is already in use for this agency. Please choose a different Investigation ID.";
                }
                return undefined;
              },
            }}
            render={(field) => (
              <div>
                <CompInput
                  id="display-name"
                  divid="display-name-value"
                  type="input"
                  inputClass="comp-form-control"
                  error={field.state.meta.errors.map((error: any) => error.message || error).join(", ")}
                  maxLength={120}
                  onChange={(evt: any) => field.handleChange(evt.target.value)}
                  value={field.state.value}
                  placeholder="Enter Investigation ID"
                />
              </div>
            )}
          />
          <FormField
            form={form}
            name="investigationStatus"
            label="Investigation status"
            required
            validators={{ onChange: z.string().min(1, "Investigation status is required") }}
            render={(field) => (
              <CompSelect
                id="investigation-status-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={statusOptions}
                value={statusOptions.find((opt) => opt.value === field.state.value)}
                onChange={(option) => field.handleChange(option?.value || "")}
                placeholder="Select investigation status"
                isClearable={true}
                showInactive={false}
                enableValidation={true}
                errorMessage={field.state.meta.errors?.[0]?.message || ""}
              />
            )}
          />
          <FormField
            form={form}
            name="leadAgency"
            label="Lead agency"
            required
            validators={{ onChange: z.string().min(1, "Lead agency is required") }}
            render={(field) => (
              <CompSelect
                id="lead-agency-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={agencyOptions}
                value={agencyOptions.find((opt) => opt.value === field.state.value)}
                onChange={(option) => field.handleChange(option?.value || "")}
                placeholder="Select lead agency"
                isClearable={true}
                showInactive={false}
                enableValidation={true}
                errorMessage={field.state.meta.errors?.[0]?.message || ""}
                isDisabled={true}
              />
            )}
          />
          <FormField
            form={form}
            name="primaryInvestigator"
            label="Primary investigator"
            required
            validators={{ onSubmit: z.string().min(1, "Primary investigator is required") }}
            render={(field) => (
              <CompSelect
                id="primary-investigator-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={assignableOfficers}
                value={assignableOfficers.find((opt) => opt.value === field.state.value)}
                onChange={(option) => field.handleChange(option?.value || "")}
                placeholder="Select investigator"
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
            name="supervisor"
            label="Supervisor"
            required
            validators={{ onChange: z.string().min(1, "Supervisor is required") }}
            render={(field) => (
              <CompSelect
                id="supervisor-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={assignableOfficers}
                value={assignableOfficers.find((opt) => opt.value === field.state.value)}
                onChange={(option) => field.handleChange(option?.value || "")}
                placeholder="Select supervisor"
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
            name="fileCoordinator"
            label="File coordinator"
            render={(field) => (
              <CompSelect
                id="file-coordinator-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                options={assignableOfficers}
                value={assignableOfficers.find((opt) => opt.value === field.state.value)}
                onChange={(option) => field.handleChange(option?.value || "")}
                placeholder="Select coordinator"
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
            name="discoveryDate"
            label="Discovery date"
            required
            validators={{
              onSubmit: ({ value }: { value: string }) => {
                const dateValue = value || discoveryDate || "";
                if (!dateValue || dateValue.length < 1) {
                  return "Discovery date is required";
                } else if (new Date(dateValue) > new Date()) {
                  return "Date and time cannot be in the future";
                } else {
                  return undefined;
                }
              },
            }}
            render={(field) => {
              // Flush state to rendered comp if it's available so no-edit saves work
              if (!field.state.value && selectedDiscoveryDateTime) {
                field.handleChange(selectedDiscoveryDateTime.toISOString());
              }
              return (
                <ValidationDatePicker
                  id="investigation-discovery-date"
                  selectedDate={selectedDiscoveryDateTime}
                  onChange={(date: Date) => {
                    handleDiscoveryDateTimeChange(date);
                    field.handleChange(date ? date.toISOString() : "");
                  }}
                  className="comp-details-edit-calendar-input"
                  classNamePrefix="comp-select"
                  errMsg={field.state.meta.errors?.[0] || ""}
                  maxDate={new Date()}
                  showTimePicker={true}
                />
              );
            }}
          />
          <FormField
            form={form}
            name="description"
            label="Investigation description"
            required
            validators={{ onChange: z.string().min(1, "Description is required") }}
            render={(field) => (
              <ValidationTextArea
                id="description"
                className="comp-form-control comp-details-input"
                rows={4}
                defaultValue={field.state.value}
                onChange={(value: string) => field.handleChange(value)}
                placeholderText="Enter investigation description..."
                maxLength={4000}
                errMsg={field.state.meta.errors?.[0]?.message || ""}
              />
            )}
          />
          <FormField
            form={form}
            name="locationAddress"
            label="Location address"
            // required
            // validators={{ onChange: z.string().min(1, "Location address is required") }}
            render={(field) => (
              <ValidationTextArea
                id="locationAddress"
                className="comp-form-control comp-details-input"
                rows={1}
                defaultValue={field.state.value}
                onChange={(value: string) => field.handleChange(value)}
                placeholderText="Enter the address of the investigation..."
                maxLength={120}
                errMsg={field.state.meta.errors?.[0]?.message || ""}
              />
            )}
          />
          <FormField
            form={form}
            name="locationDescription"
            label="Location description"
            // required
            // validators={{ onChange: z.string().min(1, "Location description is required") }}
            render={(field) => (
              <ValidationTextArea
                id="locationDescription"
                className="comp-form-control comp-details-input"
                rows={4}
                defaultValue={field.state.value}
                onChange={(value: string) => field.handleChange(value)}
                placeholderText="Enter a description of the location of this investigation..."
                maxLength={4000}
                errMsg={field.state.meta.errors?.[0]?.message || ""}
              />
            )}
          />
          <FormField
            form={form}
            name="locationGeometry"
            label="Location"
            render={(field) => {
              const coordinates = field.state.value?.coordinates;
              const longitude = coordinates?.[0]?.toString() || "";
              const latitude = coordinates?.[1]?.toString() || "";

              return (
                <CompCoordinateInput
                  id="investigation-coordinates"
                  mode="investigation"
                  utmZones={bcUtmZoneNumbers.map((zone: string) => ({ value: zone, label: zone }) as Option)}
                  initXCoordinate={longitude}
                  initYCoordinate={latitude}
                  syncCoordinates={(yCoordinate, xCoordinate) => {
                    if (yCoordinate && xCoordinate && yCoordinate !== "" && xCoordinate !== "") {
                      field.handleChange({
                        type: "Point",
                        coordinates: [Number.parseFloat(xCoordinate), Number.parseFloat(yCoordinate)],
                      });
                    } else {
                      field.handleChange(null);
                    }
                  }}
                  throwError={(hasError: boolean) =>
                    hasError
                      ? field.setMeta({ errorMap: { onChange: "Location Coordinates are invalid" } })
                      : field.setMeta({ errorMap: {} })
                  }
                  enableCopyCoordinates={false}
                  validationRequired={false}
                  sourceXCoordinate={longitude}
                  sourceYCoordinate={latitude}
                />
              );
            }}
          />
        </fieldset>
      </form>
    </>
  );
};
