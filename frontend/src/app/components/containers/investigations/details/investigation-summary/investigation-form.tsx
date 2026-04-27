import { bcUtmZoneNumbers, parseUTCDateTimeToLocal, formatLocalTime } from "@/app/common/methods";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { CompCoordinateInput } from "@/app/components/common/comp-coordinate-input";
import { CompSelect } from "@/app/components/common/comp-select";
import { FormErrorBanner } from "@/app/components/common/form-error-banner";
import { FormField } from "@/app/components/common/form-field";
import { useAppSelector } from "@/app/hooks/hooks";
import { getUserAgency } from "@/app/service/user-service";
import { selectCommunityCodeDropdown, selectComplaintStatusCodeDropdown } from "@/app/store/reducers/code-table";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { RootState } from "@/app/store/store";
import { AppUser } from "@/app/types/app/app_user/app_user";
import Option from "@apptypes/app/option";
import { useSelector } from "react-redux";
import z from "zod";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { useState } from "react";

interface InvestigationFormProps {
  form: any;
  isDisabled: boolean;
  discoveryDate?: string;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  discoveryTime?: string;
  isEditMode?: boolean;
}

export const InvestigationForm = ({
  form,
  isDisabled,
  discoveryDate,
  onDirtyChange,
  discoveryTime,
  isEditMode = false,
}: InvestigationFormProps) => {
  const communityOptions = useAppSelector(selectCommunityCodeDropdown);
  const [selectedDiscoveryDate, setSelectedDiscoveryDate] = useState<Date | null>(() =>
    parseUTCDateTimeToLocal(discoveryDate, discoveryTime),
  );
  const [selectedDiscoveryTime, setSelectedDiscoveryTime] = useState<string | null>(() => {
    const d = parseUTCDateTimeToLocal(discoveryDate, discoveryTime);
    return d && discoveryTime ? formatLocalTime(d) : null;
  });

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

  const handleDiscoveryDateTimeChange = (date: Date | null, time: string | null) => {
    setSelectedDiscoveryDate(date);
    setSelectedDiscoveryTime(time);
    if (date) {
      const discoveryDate = new Date(date);
      if (time) {
        const [hh, mm] = time.split(":").map(Number);
        discoveryDate.setHours(hh, mm, 0, 0);
      }
      form.setFieldValue("discoveryDate", discoveryDate.toISOString());
      form.setFieldValue("discoveryTime", time ? discoveryDate.toISOString() : null);
    } else {
      form.setFieldValue("discoveryDate", "");
      form.setFieldValue("discoveryTime", null);
    }
    form.setFieldMeta("discoveryDate", (meta: any) => ({ ...meta, isDirty: false, isTouched: false }));
  };

  return (
    <>
      <FormErrorBanner form={form} />
      <form onSubmit={form.handleSubmit}>
        <fieldset>
          {isEditMode && (
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
          )}
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
              if (!field.state.value && selectedDiscoveryDate) {
                field.handleChange(selectedDiscoveryDate.toISOString());
              }
              return (
                <ValidationDatePicker
                  id="investigation-discovery-date"
                  selectedDate={selectedDiscoveryDate}
                  selectedTime={selectedDiscoveryTime}
                  onChange={(date: Date, time: string | null) => {
                    handleDiscoveryDateTimeChange(date, time);
                    if (date) {
                      field.setMeta({ errorMap: {} });
                    }
                  }}
                  className="comp-details-edit-calendar-input"
                  classNamePrefix="comp-select"
                  errMsg={field.state.meta.errors?.[0] || ""}
                  maxDate={new Date()}
                  showTimePicker={true}
                  nullableTime={true}
                  onTimeWithoutDate={() =>
                    field.setMeta({ errorMap: { onChange: "Select a date before entering a time" } })
                  }
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
                  onDirtyChange={onDirtyChange}
                />
              );
            }}
          />
        </fieldset>
        <FormField
          form={form}
          name="community"
          label="Community"
          required
          validators={{ onChange: z.string().min(1, "Community is required") }}
          render={(field) => (
            <CompSelect
              id="community-select"
              classNamePrefix="comp-select"
              className="comp-details-input pt-2"
              options={communityOptions}
              value={communityOptions.find((opt) => opt.value === field.state.value)}
              onChange={(option) => field.handleChange(option?.value || "")}
              placeholder="Select community"
              isClearable={true}
              showInactive={false}
              enableValidation={true}
              errorMessage={field.state.meta.errors?.[0]?.message || ""}
            />
          )}
        />
      </form>
    </>
  );
};
