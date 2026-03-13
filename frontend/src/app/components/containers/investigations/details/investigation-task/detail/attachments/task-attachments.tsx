import { useDocumentationSearch } from "@/app/components/containers/investigations/details/investigation-documentation/hooks/use-documentation-search";
import {
  Attachment,
  useInvestigationAttachments,
} from "@/app/components/containers/investigations/details/investigation-documentation/hooks/use-investigation-attachments";
import { TaskAttachmentList } from "@/app/components/containers/investigations/details/investigation-task/detail/attachments/attachment-list";
import { useAppDispatch } from "@/app/hooks/hooks";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { openModal } from "@/app/store/reducers/app";
import { ADD_EDIT_TASK_ATTACHMENT } from "@/app/types/modal/modal-types";
import { Task } from "@/generated/graphql";
import { FC } from "react";
import { Button } from "react-bootstrap";

interface TaskAttachmentProps {
  investigationGuid: string;
  task: Task | undefined;
}

export const TaskAttachments: FC<TaskAttachmentProps> = ({ investigationGuid, task }) => {
  const dispatch = useAppDispatch();
  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning();

  const { searchValues } = useDocumentationSearch();

  const { attachments, isLoading } = useInvestigationAttachments({
    investigationIdentifier: investigationGuid,
    tasks: task ? [task] : [],
    search: searchValues.search,
    taskFilter: searchValues.taskFilter,
    fileTypeFilter: searchValues.fileTypeFilter,
    sortBy: searchValues.sortBy,
    sortOrder: searchValues.sortOrder,
    page: searchValues.page,
    pageSize: searchValues.pageSize,
    enabled: !!investigationGuid,
  });

  const handleAddAttachment = () => {
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_EDIT_TASK_ATTACHMENT,
        data: {
          title: "Upload attachment",
          investigationIdentifier: investigationGuid,
          taskIdentifier: task?.taskIdentifier,
          existingAttachments: attachments,
          defaultAssignee: task?.assignedUserIdentifier,
          onDirtyChange: handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  const handleEditAttachment = (attachment: Attachment) => {
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_EDIT_TASK_ATTACHMENT,
        data: {
          title: "Edit attachment",
          investigationIdentifier: investigationGuid,
          taskIdentifier: task?.taskIdentifier,
          existingAttachments: attachments,
          attachment,
        },
        hideCallback,
      }),
    );
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center my-2">
        <h4>Attachments</h4>
        {attachments.length > 0 && (
          <Button
            id="add-task-attachment"
            title="Add attachment"
            variant="primary"
            size="sm"
            onClick={handleAddAttachment}
            className="mb-3"
          >
            <i className="bi bi-upload"></i>
            <span>Add attachment</span>
          </Button>
        )}
      </div>

      {attachments.length === 0 ? (
        <div>
          <Button
            id="add-task-attachment"
            title="Add attachment"
            variant="primary"
            size="sm"
            onClick={handleAddAttachment}
          >
            <i className="bi bi-upload"></i>
            <span>Add attachment</span>
          </Button>
        </div>
      ) : (
        <div className="comp-data-container">
          <TaskAttachmentList
            attachments={attachments}
            isLoading={isLoading}
            onEdit={handleEditAttachment}
          />
        </div>
      )}
    </div>
  );
};
