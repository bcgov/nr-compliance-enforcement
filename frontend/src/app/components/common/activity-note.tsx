import { MenuBarEditor } from "@/app/components/containers/investigations/details/investigation-continuation/menu-bar-editor";
import { EditorContent, Editor } from "@tiptap/react";
import { FC } from "react";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { CompSelect } from "@/app/components/common/comp-select";
import Option from "@apptypes/app/option";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { AppUser } from "@apptypes/app/app_user/app_user";

interface ActivityNoteProps {
  leadAgency: string;
  editor: Editor;
  selectedActionedDateTime: Date | undefined;
  setSelectedActionedDateTime: (date: Date | undefined) => void;
  selectedOfficer: Option | null;
  setSelectedOfficer: (officer: Option | null) => void;
}

export const ActivityNoteEditor: FC<ActivityNoteProps> = ({
  leadAgency,
  editor,
  selectedActionedDateTime,
  setSelectedActionedDateTime,
  selectedOfficer,
  setSelectedOfficer,
}) => {
  // Redux State
  const officersInAgencyList = useSelector((state: RootState) => selectOfficersByAgency(state, leadAgency));

  const assignableOfficers: Option[] =
    officersInAgencyList && officersInAgencyList.length > 0
      ? officersInAgencyList.map((officer: AppUser) => ({
          value: officer.app_user_guid,
          label: `${officer.last_name}, ${officer.first_name}`,
        }))
      : [];

  const handleActionedDateTimeChange = (date: Date) => {
    setSelectedActionedDateTime(date);
  };

  const handleAssignedOfficerChange = (selected: Option | null) => {
    setSelectedOfficer(selected);
  };

  return (
    <div className="lg:col-span-2 space-y-4 border rounded p-3">
      <MenuBarEditor editor={editor} />
      <div className="">
        <EditorContent
          editor={editor}
          className="tiptap-editor"
        />
      </div>

      {/* Date actioned */}
      <div className="mt-3 comp-details-form-row">
        <div className="col-2">
          Date/time actioned<span className="required-ind">*</span>
        </div>
        <div className="comp-details-edit-input">
          <ValidationDatePicker
            id="investigation-continuation-report-date-picker"
            selectedDate={selectedActionedDateTime}
            onChange={handleActionedDateTimeChange}
            className="comp-details-edit-calendar-input"
            classNamePrefix="comp-select"
            errMsg={
              selectedActionedDateTime && selectedActionedDateTime > new Date()
                ? "Date and time cannot be in the future"
                : ""
            }
            maxDate={new Date()}
            showTimePicker={true}
          />
        </div>
      </div>

      {/* Officer assigned */}
      <div
        className="comp-details-form-row"
        id="officer-assigned-pair-id"
      >
        <div
          className="col-2"
          id="officer-assigned-select-label-id"
        >
          Officer<span className="required-ind">*</span>
        </div>
        <CompSelect
          id="officer-assigned-select-id"
          showInactive={false}
          classNamePrefix="comp-select"
          onChange={(e) => handleAssignedOfficerChange(e)}
          className="comp-details-input w-100 max-w-370"
          options={assignableOfficers}
          placeholder="Select"
          enableValidation={false}
          value={selectedOfficer ?? null}
          isClearable={true}
        />
      </div>
    </div>
  );
};
