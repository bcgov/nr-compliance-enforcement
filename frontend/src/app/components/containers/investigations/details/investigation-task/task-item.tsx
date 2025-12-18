import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskCategory, selectTaskSubCategory } from "@/app/store/reducers/code-table-selectors";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";
import { RootState } from "@/app/store/store";
import { Investigation, Task } from "@/generated/graphql";
import { Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";

interface TaskItemProps {
  task: Task;
  onEdit: (taskId: string) => void;
  investigationData?: Investigation;
}

export const TaskItem = ({ task, investigationData, onEdit }: TaskItemProps) => {
  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const leadAgency = investigationData?.leadAgency ?? "COS";
  const officersInAgencyList = useSelector((state: RootState) => selectOfficersByAgency(state, leadAgency));

  const subCategory = taskSubCategories.find((subCategory) => subCategory.value === task?.taskTypeCode);
  const category = taskCategories.find((category) => category.value === subCategory?.taskCategory);
  const assignedOfficer = officersInAgencyList.find((officer) => officer.app_user_guid === task.assignedUserIdentifier);

  function handleRemoveTask(taskIdentifier: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <section className="comp-details-section">
      <Card
        className="mb-3"
        border="default"
      >
        <Card.Header className="comp-card-header">
          <div className="comp-card-header-title">
            <h4>Task {task.taskNumber}</h4>
          </div>
          <div className="comp-card-header-actions">
            <Button
              variant="outline-primary"
              size="sm"
              id="task-edit-button"
              onClick={() => onEdit(task.taskIdentifier)} // orchestration is done via the parent component
            >
              <i className="bi bi-pencil"></i>
              <span>Edit</span>
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              id="task-remove-button"
              onClick={() => handleRemoveTask(task?.taskIdentifier)}
            >
              <i className="bi bi-trash"></i>
              <span>Delete</span>
            </Button>
          </div>
        </Card.Header>

        <Card.Body className="task-details">
          <dl>
            <div>
              <dt>Task category</dt>
              <dd>
                <pre id="comp-task-category">{category?.label}</pre>
              </dd>
            </div>
            <div>
              <dt>Task sub-category</dt>
              <dd>
                <pre id="comp-task-sub-category">{subCategory?.label}</pre>
              </dd>
            </div>
            <div>
              <dt>Task description</dt>
              <dd>
                <pre id="comp-task-description">{task?.description}</pre>
              </dd>
            </div>
            <div>
              <dt>Officer assigned</dt>
              <dd>
                <pre id="comp-task-assigned-user">{`${assignedOfficer?.last_name},  ${assignedOfficer?.first_name}`}</pre>
              </dd>
            </div>
            <div style={{ fontSize: "14px", color: "#7a7a7a" }}>{`Created at TBD by TBD (TBD))`}</div>
          </dl>
        </Card.Body>
      </Card>
    </section>
  );
};
