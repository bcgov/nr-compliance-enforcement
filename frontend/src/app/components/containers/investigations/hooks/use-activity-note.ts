import { useState } from "react";
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
}

export const useActivityNoteForm = ({
  investigationGuid,
  defaultOfficer,
  reportedUserGuid,
  onSaveSuccess,
}: UseActivityNoteFormProps) => {
  // Form state
  const [selectedOfficer, setSelectedOfficer] = useState<Option | null>(defaultOfficer);
  const [selectedActionedDateTime, setSelectedActionedDateTime] = useState<Date | undefined>();
  const [plainText, setPlainText] = useState<string>("");

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
      setPlainText(editor.getText());
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

  // Actions
  const reset = () => {
    editor?.commands.clearContent();
    setSelectedActionedDateTime(undefined);
    setSelectedOfficer(defaultOfficer);
  };

  const handleSave = async () => {
    if (!editor) return;

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

  // Validation
  const isValid = !!(plainText && selectedActionedDateTime && selectedOfficer);

  return {
    // State
    editor,
    selectedOfficer,
    setSelectedOfficer,
    selectedActionedDateTime,
    setSelectedActionedDateTime,
    plainText,

    // Actions
    handleSave,
    reset,

    // Status
    isValid,
    isSaving: saveReportMutation.isPending,
  };
};
