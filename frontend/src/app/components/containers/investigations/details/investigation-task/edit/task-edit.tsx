import { FC, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToggleInformation } from "@/app/common/toast";
import { TaskEditHeader } from "./task-edit-header";

const TaskEdit: FC = () => {
  const navigate = useNavigate();
  const { investigationGuid = "" } = useParams<{ investigationGuid: string; taskId: string }>();

  const cancelButtonClick = useCallback(() => {
    navigate(`/investigation/${investigationGuid}/tasks`);
  }, [navigate, investigationGuid]);

  const saveButtonClick = useCallback(() => {
    ToggleInformation("Task editing is not yet implemented");
  }, []);

  return (
    <div className="comp-investigation-edit-headerdetails">
      <TaskEditHeader
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        investigationGuid={investigationGuid}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Task details</h2>
        </div>
        <div className="p-4 text-muted">Task editing form coming soon.</div>
      </section>
    </div>
  );
};

export default TaskEdit;
