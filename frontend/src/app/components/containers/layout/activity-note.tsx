import { ActivityNoteEditor } from "@/app/components/common/activity-note";
import { useActivityNoteForm } from "@/app/components/containers/investigations/hooks/use-activity-note";
import { useAppSelector } from "@/app/hooks/hooks";
import { appUserGuid, profileDisplayName, selectOfficerAgency } from "@/app/store/reducers/app";
import { ActivityNote, ActivityNoteInput } from "@/generated/graphql";
import { FC, useEffect } from "react";
import Option from "@apptypes/app/option";

interface ActivityNoteWrapperProps {
  index?: number;
  onValidationChange: (isValid: boolean, index?: number) => void;
  onValuesChange: (values: Partial<ActivityNoteInput>, index?: number) => void;
  initialData?: ActivityNote;
  shouldReset?: boolean;
  showErrors: boolean;
}

export const ActivityNoteWrapper: FC<ActivityNoteWrapperProps> = ({
  index,
  onValidationChange,
  onValuesChange,
  initialData,
  showErrors,
  shouldReset,
}) => {
  const reportedUserGuid = useAppSelector(appUserGuid);
  const reportedUserName = useAppSelector(profileDisplayName);
  const agency = useAppSelector(selectOfficerAgency);

  const defaultOfficer: Option = {
    value: reportedUserGuid,
    label: reportedUserName,
  };

  const {
    editor,
    selectedOfficer,
    setSelectedOfficer,
    selectedActionedDateTime,
    setSelectedActionedDateTime,
    isValid,
    getInputValues,
    contentError,
    dateTimeError,
    officerError,
    reset,
  } = useActivityNoteForm({
    defaultOfficer,
    initialContent: initialData?.contentJson ?? "",
    showErrors,
  });

  // Reset form when requested
  useEffect(() => {
    if (shouldReset) {
      reset();
    }
  }, [shouldReset, reset]);

  // Notify parent when validation state changes
  useEffect(() => {
    onValidationChange(isValid, index);
  }, [isValid, index]);

  // Notify parent when values change
  useEffect(() => {
    const values = getInputValues();
    onValuesChange(values, index);
  }, [selectedActionedDateTime, selectedOfficer, index]);

  return (
    <ActivityNoteEditor
      index={index || 0}
      leadAgency={agency}
      editor={editor}
      selectedActionedDateTime={selectedActionedDateTime}
      setSelectedActionedDateTime={setSelectedActionedDateTime}
      selectedOfficer={selectedOfficer}
      setSelectedOfficer={setSelectedOfficer}
      contentError={contentError}
      dateTimeError={dateTimeError}
      officerError={officerError}
    />
  );
};
