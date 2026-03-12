import { FC, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToggleInformation } from "@/app/common/toast";
import { TaskCreateHeader } from "./task-create-header";

const TaskCreate: FC = () => {
  const navigate = useNavigate();
  const { investigationGuid = "", taskId } = useParams<{
    investigationGuid: string;
    taskId: string;
  }>();

  const isEditMode = !!taskId;

  const cancelButtonClick = useCallback(() => {
    navigate(`/investigation/${investigationGuid}/tasks`);
  }, [navigate, investigationGuid]);

  const saveButtonClick = useCallback(() => {
    ToggleInformation("Save");
  }, [isEditMode]);

  return (
    <div className="comp-investigation-edit-headerdetails">
      <TaskCreateHeader
        isEditMode={isEditMode}
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        investigationGuid={investigationGuid}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Task details</h2>
        </div>
        <div className="p-4 text-muted">{isEditMode ? "Task edit" : "Task create"}</div>
      </section>
    </div>
  );
};

export default TaskCreate;
