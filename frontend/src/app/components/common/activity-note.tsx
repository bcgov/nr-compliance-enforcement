import { MenuBarEditor } from "@/app/components/containers/investigations/details/investigation-continuation/menu-bar-editor";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { FC, useEffect, useState } from "react";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { CompSelect } from "@/app/components/common/comp-select";
import Option from "@apptypes/app/option";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid, profileDisplayName, selectOfficerAgency } from "@/app/store/reducers/app";
import { selectOfficersByAgency, selectOfficers } from "@/app/store/reducers/officer";
import { ActivityNote, ActivityNoteInput } from "@/generated/graphql";
import { AppUser } from "@apptypes/app/app_user/app_user";
import { parseUTCDateTimeToLocal, formatLocalTime, formatLocalDateTimeToUTC } from "@common/methods";
import { gql } from "graphql-request";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

interface ActivityNoteProps {
  index?: number;
  onValidationChange: (isValid: boolean, index?: number) => void;
  onValuesChange: (values: Partial<ActivityNoteInput>, index?: number) => void;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
  initialData?: ActivityNote;
  shouldReset?: boolean;
  showErrors: boolean;
}

export const GET_ACTIVITY_NOTES_BY_TASK = gql`
  query GetActivityNotesByTask($taskGuid: String!) {
    getActivityNotesByTask(taskGuid: $taskGuid) {
      activityNoteGuid
      activityNoteCode
      investigationGuid
      contentJson
      contentText
      actionedDate
      actionedTime
      reportedTimestamp
      actionedAppUserGuidRef
      reportedAppUserGuidRef
    }
  }
`;

export const DELETE_ACTIVITY_NOTE = gql`
  mutation DeleteActivityNote($activityNoteGuid: String!) {
    deleteActivityNote(activityNoteGuid: $activityNoteGuid)
  }
`;

export const SAVE_ACTIVITY_NOTE = gql`
  mutation SaveActivityNote($input: ActivityNoteInput!) {
    saveActivityNote(input: $input) {
      activityNoteGuid
      activityNoteCode
      investigationGuid
      contentJson
      actionedDate
      actionedTime
      reportedTimestamp
      actionedAppUserGuidRef
      reportedAppUserGuidRef
    }
  }
`;

export const ActivityNoteEditor: FC<ActivityNoteProps> = ({
  index,
  onValidationChange,
  onValuesChange,
  onDirtyChange,
  initialData,
  showErrors,
  shouldReset,
}) => {
  // Redux State
  const currentUserGuid = useAppSelector(appUserGuid);
  const currentUserName = useAppSelector(profileDisplayName);
  const agency = useAppSelector(selectOfficerAgency);
  const allOfficers = useAppSelector(selectOfficers);
  const officersInAgencyList = useAppSelector((state) => selectOfficersByAgency(state, agency));

  // Determine initial officer
  const existingOfficer = allOfficers?.find(
    (item: { app_user_guid: string }) => item.app_user_guid === initialData?.actionedAppUserGuidRef,
  );
  const existingOfficerName = existingOfficer
    ? `${existingOfficer.last_name}, ${existingOfficer.first_name}`
    : undefined;

  const initialOfficer: Option = {
    value: existingOfficer?.app_user_guid ?? currentUserGuid,
    label: existingOfficerName ?? currentUserName,
  };

  // Form state
  const [selectedOfficer, setSelectedOfficer] = useState<Option | null>(initialOfficer);
  const [selectedActionedDateTime, setSelectedActionedDateTime] = useState<Date | undefined>(
    () => parseUTCDateTimeToLocal(initialData?.actionedDate, initialData?.actionedTime) ?? undefined,
  );
  const [selectedActionedTime, setSelectedActionedTime] = useState<string | null>(() => {
    const d = parseUTCDateTimeToLocal(initialData?.actionedDate, initialData?.actionedTime);
    return d && initialData?.actionedTime ? formatLocalTime(d) : null;
  });
  const [plainText, setPlainText] = useState<string>(initialData?.contentText ?? "");

  // Validation errors
  const [contentError, setContentError] = useState<string>("");
  const [dateTimeError, setDateTimeError] = useState<string>("");
  const [officerError, setOfficerError] = useState<string>("");

  // Dirty tracking
  const { markDirty, markClean } = useFormDirtyState(onDirtyChange);

  // Editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "New entry...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: initialData?.contentJson ? JSON.parse(initialData.contentJson) : undefined,
    onUpdate: ({ editor }) => {
      setPlainText(editor.getText());
      markDirty();
    },
  });

  // Component Data - assignable officers (include existing officer so value populates even if inactive/different agency)
  const assignableOfficersBase: Option[] =
    officersInAgencyList && officersInAgencyList.length > 0
      ? officersInAgencyList.map((officer: AppUser) => ({
          value: officer.app_user_guid,
          label: `${officer.last_name}, ${officer.first_name}`,
        }))
      : [];

  const assignableOfficers: Option[] =
    existingOfficer && !assignableOfficersBase.some((opt) => opt.value === existingOfficer.app_user_guid)
      ? [
          ...assignableOfficersBase,
          {
            value: existingOfficer.app_user_guid,
            label: `${existingOfficer.last_name}, ${existingOfficer.first_name}`,
          },
        ]
      : assignableOfficersBase;

  const assignableOfficersSorted = [...assignableOfficers].sort((a, b) => {
    const labelA = String(a.label ?? "");
    const labelB = String(b.label ?? "");
    return labelA.localeCompare(labelB, undefined, { sensitivity: "base" });
  });

  // Helper function to get current input values
  const getInputValues = (): Partial<ActivityNoteInput> => {
    let actionedTime: Date | undefined = undefined;
    let actionedDate: Date | undefined = selectedActionedDateTime;
    if (selectedActionedDateTime && selectedActionedTime) {
      const { utcDate } = formatLocalDateTimeToUTC(selectedActionedDateTime, selectedActionedTime);
      const combined = new Date(selectedActionedDateTime);
      const [hh, mm] = selectedActionedTime.split(":").map(Number);
      combined.setHours(hh, mm, 0, 0);
      actionedTime = combined;
      actionedDate = utcDate;
    }
    return {
      activityNoteGuid: initialData?.activityNoteGuid,
      contentJson: editor ? JSON.stringify(editor.getJSON()) : "",
      contentText: editor ? editor.getText() : "",
      actionedDate,
      actionedTime,
      actionedAppUserGuidRef: selectedOfficer?.value || "",
    };
  };

  // Helper function to reset form
  const reset = () => {
    editor?.commands.clearContent();
    setPlainText("");
    setSelectedActionedDateTime(undefined);
    setSelectedActionedTime(null);
    setSelectedOfficer(initialOfficer);
    setContentError("");
    setDateTimeError("");
    setOfficerError("");
    markClean();
  };

  // Validation - runs whenever dependencies change
  useEffect(() => {
    const hasContent = plainText.trim().length > 0;
    const hasDateTime = selectedActionedDateTime !== undefined;
    const hasOfficer = selectedOfficer?.value !== undefined && selectedOfficer?.value !== "";

    const isValid = hasContent && hasDateTime && hasOfficer;

    // Only set error messages if parent says to show them
    if (showErrors) {
      setContentError(hasContent ? "" : "Content is required");
      setDateTimeError(hasDateTime ? "" : "Date/time actioned is required");
      setOfficerError(hasOfficer ? "" : "Officer is required");
    } else {
      setContentError("");
      setDateTimeError("");
      setOfficerError("");
    }

    // Notify parent of validation state
    onValidationChange(isValid, index);
  }, [plainText, selectedActionedDateTime, selectedOfficer, showErrors, index, onValidationChange]);

  // Notify parent when values change
  useEffect(() => {
    const values = getInputValues();
    onValuesChange(values, index);
  }, [plainText, selectedActionedDateTime, selectedActionedTime, selectedOfficer, index]);

  // Reset form when requested
  useEffect(() => {
    if (shouldReset) {
      reset();
    }
  }, [shouldReset]);

  const handleEditorClick = () => {
    editor?.commands.focus();
  };

  return (
    <div className="lg:col-span-2 space-y-4 border rounded p-3 mb-3">
      <MenuBarEditor editor={editor} />
      <div className="">
        <EditorContent
          editor={editor}
          className="tiptap-editor"
          onClick={handleEditorClick}
        />
        {contentError && <div className="error-message">{contentError}</div>}
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
            selectedTime={selectedActionedTime}
            onChange={(date: Date, time: string | null) => {
              markDirty();
              setSelectedActionedDateTime(date);
              setSelectedActionedTime(time);
            }}
            className="comp-details-edit-calendar-input"
            classNamePrefix="comp-select"
            errMsg={dateTimeError}
            maxDate={new Date()}
            showTimePicker={true}
            nullableTime={true}
            onTimeWithoutDate={() => setDateTimeError("Select a date before entering a time")}
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
          onChange={(value: Option | null) => {
            setSelectedOfficer(value);
            markDirty();
          }}
          className="comp-details-input w-100 max-w-370"
          options={assignableOfficersSorted}
          placeholder="Select"
          enableValidation={true}
          errorMessage={officerError}
          value={selectedOfficer ?? null}
          isClearable={true}
        />
      </div>
    </div>
  );
};
