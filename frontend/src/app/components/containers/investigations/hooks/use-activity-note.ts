import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Option from "@apptypes/app/option";
import { ActivityNoteInput } from "@/generated/graphql";

interface UseActivityNoteFormProps {
  defaultOfficer: Option;
  initialContent?: string; // For editing existing notes
  showErrors?: boolean;
}

export const useActivityNoteForm = ({
  defaultOfficer,
  initialContent,
  showErrors = false,
}: UseActivityNoteFormProps) => {
  // Form state
  const [selectedOfficer, setSelectedOfficer] = useState<Option | null>(defaultOfficer);
  const [selectedActionedDateTime, setSelectedActionedDateTime] = useState<Date | undefined>();
  const [plainText, setPlainText] = useState<string>("");

  // Validation errors
  const [isValid, setIsValid] = useState(true);
  const [contentError, setContentError] = useState<string>("");
  const [dateTimeError, setDateTimeError] = useState<string>("");
  const [officerError, setOfficerError] = useState<string>("");

  // Editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "New entry...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: initialContent ? JSON.parse(initialContent) : undefined,
    onUpdate: ({ editor }) => {
      setPlainText(editor.getText());
    },
  });

  // Use Effects

  // Validation - runs whenever dependencies change
  useEffect(() => {
    const hasContent = plainText.trim().length > 0;
    const hasDateTime = selectedActionedDateTime !== undefined;
    const hasOfficer = selectedOfficer?.value !== undefined && selectedOfficer?.value !== "";

    const valid = hasContent && hasDateTime && hasOfficer;
    setIsValid(valid);

    // Only set error messages if parent says to show them
    if (showErrors) {
      const newContentError = hasContent ? "" : "Content is required";
      const newDateTimeError = hasDateTime ? "" : "Date/time actioned is required";
      const newOfficerError = hasOfficer ? "" : "Officer is required";

      setContentError(newContentError);
      setDateTimeError(newDateTimeError);
      setOfficerError(newOfficerError);
    } else {
      setContentError("");
      setDateTimeError("");
      setOfficerError("");
    }
  }, [plainText, selectedActionedDateTime, selectedOfficer, showErrors]);

  // Get current input values
  const getInputValues = (): Partial<ActivityNoteInput> => {
    return {
      contentJson: editor ? JSON.stringify(editor.getJSON()) : "",
      contentText: plainText,
      actionedTimestamp: selectedActionedDateTime,
      actionedAppUserGuidRef: selectedOfficer?.value || "",
    };
  };

  const reset = () => {
    editor?.commands.clearContent();
    setPlainText("");
    setSelectedActionedDateTime(undefined);
    setSelectedOfficer(defaultOfficer);
    setContentError("");
    setDateTimeError("");
    setOfficerError("");
    setIsValid(false);
  };

  return {
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
  };
};
