import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { gql } from "graphql-request";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { ActivityNoteInput } from "@/generated/graphql";
import Option from "@apptypes/app/option";

const SAVE_ACTIVITY_NOTE_MUTATION = gql`
  mutation SaveActivityNote($input: ActivityNoteInput!) {
    saveActivityNote(input: $input) {
      activityNoteGuid
      activityNoteCode
      investigationGuid
      contentJson
      actionedTimestamp
      reportedTimestamp
      actionedAppUserGuidRef
      reportedAppUserGuidRef
    }
  }
`;

interface UseActivityNoteFormProps {
  investigationGuid: string;
  defaultOfficer: Option;
  reportedUserGuid: string;
  onSaveSuccess?: () => void;
  triggerValidation?: boolean;
}

export const useActivityNoteForm = ({
  investigationGuid,
  defaultOfficer,
  reportedUserGuid,
  onSaveSuccess,
  triggerValidation = false,
}: UseActivityNoteFormProps) => {
  // Form state
  const [selectedOfficer, setSelectedOfficer] = useState<Option | null>(defaultOfficer);
  const [selectedActionedDateTime, setSelectedActionedDateTime] = useState<Date | undefined>();
  const [plainText, setPlainText] = useState<string>("");

  // Validation errors
  const [contentError, setContentError] = useState<string>("");
  const [dateTimeError, setDateTimeError] = useState<string>("");
  const [officerError, setOfficerError] = useState<string>("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "New entry...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setPlainText(text);

      // Clear content error if text is entered
      if (hasAttemptedSubmit && text.trim()) {
        setContentError("");
      }
    },
  });

  // Mutation
  const saveReportMutation = useGraphQLMutation(SAVE_ACTIVITY_NOTE_MUTATION, {
    onSuccess: () => {
      ToggleSuccess("Report saved successfully");
      reset();
      onSaveSuccess?.();
    },
    onError: (error: any) => {
      console.error("Error saving report:", error);
      ToggleError("Failed to save report");
    },
  });

  // Validation function
  const validate = (): boolean => {
    let isValid = true;

    // Validate content
    if (plainText.trim()) {
      setContentError("");
    } else {
      setContentError("Content is required");
      isValid = false;
    }

    // Validate date/time
    if (!selectedActionedDateTime) {
      setDateTimeError("Date/time actioned is required");
      isValid = false;
    } else if (selectedActionedDateTime > new Date()) {
      setDateTimeError("Date and time cannot be in the future");
      isValid = false;
    } else {
      setDateTimeError("");
    }

    // Validate officer
    if (selectedOfficer?.value) {
      setOfficerError("");
    } else {
      setOfficerError("Officer is required");
      isValid = false;
    }
    return isValid;
  };

  // Actions
  const reset = () => {
    editor?.commands.clearContent();
    setSelectedActionedDateTime(undefined);
    setSelectedOfficer(defaultOfficer);
    setContentError("");
    setDateTimeError("");
    setOfficerError("");
    setHasAttemptedSubmit(false);
  };

  const handleSave = async () => {
    if (!editor) return;

    setHasAttemptedSubmit(true);

    if (!validate()) {
      return;
    }

    const json = JSON.stringify(editor.getJSON());
    const plainTextContent = editor.getText();

    const input: ActivityNoteInput = {
      investigationGuid,
      activityNoteGuid: null,
      activityNoteCode: "CONTREP",
      contentJson: json,
      contentText: plainTextContent,
      actionedTimestamp: selectedActionedDateTime || new Date(),
      reportedTimestamp: new Date(),
      actionedAppUserGuidRef: selectedOfficer ? selectedOfficer.value : "",
      reportedAppUserGuidRef: reportedUserGuid,
    };

    await saveReportMutation.mutateAsync({ input });
  };

  const handleDateTimeChange = (date: Date | undefined) => {
    setSelectedActionedDateTime(date);

    if (hasAttemptedSubmit) {
      if (!date) {
        setDateTimeError("Date and time is required");
      } else if (date > new Date()) {
        setDateTimeError("Date and time cannot be in the future");
      } else {
        setDateTimeError("");
      }
    }
  };

  const handleOfficerChange = (officer: Option | null) => {
    setSelectedOfficer(officer);

    if (hasAttemptedSubmit) {
      if (officer?.value) {
        setOfficerError("");
      } else {
        setOfficerError("Officer is required");
      }
    }
  };

  // Use Effects
  useEffect(() => {
    if (triggerValidation) {
      setHasAttemptedSubmit(true);
      validate();
    }
  }, [triggerValidation]);

  return {
    // State
    editor,
    selectedOfficer,
    setSelectedOfficer: handleOfficerChange,
    selectedActionedDateTime,
    setSelectedActionedDateTime: handleDateTimeChange,
    plainText,

    // Validation errors
    contentError,
    dateTimeError,
    officerError,

    // Actions
    handleSave,
    reset,

    // Status
    isSaving: saveReportMutation.isPending,
  };
};
