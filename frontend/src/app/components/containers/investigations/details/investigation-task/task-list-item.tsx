import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { applyStatusClass, formatDateTime, truncateString } from "@/app/common/methods";
import { Task } from "@/generated/graphql";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskCategory, selectTaskSubCategory, selectTaskStatus } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";

type Props = {
  data: Task;
  investigationGuid: string;
};

export const TaskListItem: FC<Props> = ({ data, investigationGuid }) => {
  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const taskStatuses = useAppSelector(selectTaskStatus);
  const officers = useAppSelector(selectOfficers);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [isExpandedClass, setIsExpandedClass] = useState("");

  const subCategory = taskSubCategories.find((sc) => sc.value === data.taskTypeCode);
  const category = taskCategories.find((c) => c.value === subCategory?.taskCategory);
  const status = taskStatuses.find((s) => s.value === data.taskStatusCode);
  const assignedOfficer = officers?.find((o) => o.app_user_guid === data.assignedUserIdentifier);
  const assignedOfficerName = assignedOfficer
    ? `${assignedOfficer.first_name} ${assignedOfficer.last_name}`
    : "-";

  const toggleExpand = () => {
    if (isExpanded) {
      toggleHoverState(false);
      setIsExpandedClass("");
    } else {
      setIsExpandedClass("comp-cell-parent-expanded");
    }
    setIsExpanded(!isExpanded);
  };

  const toggleHoverState = (state: boolean) => {
    setIsRowHovered(state);
  };

  const truncatedDescription = truncateString(data.description ?? "", 205);

  return (
    <>
      <tr
        key={data.taskIdentifier}
        className={`${isExpandedClass} ${isRowHovered ? "comp-table-row-hover-style" : ""}`}
      >
        <td
          className={`comp-cell-width-90 comp-cell-min-width-90 text-center ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          <Link
            to={`/investigation/${investigationGuid}/task/${data.taskIdentifier}`}
            className="comp-cell-link"
          >
            {data.taskNumber}
          </Link>
        </td>
        <td
          className={`comp-cell-width-160 comp-cell-min-width-160 ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {category?.label ?? "-"}
        </td>
        <td
          className={`comp-cell-width-160 comp-cell-min-width-160 ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {subCategory?.label ?? "-"}
        </td>
        <td
          className={`comp-cell-width-110 ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {status && data.taskStatusCode && (
            <span className={`badge ${applyStatusClass(data.taskStatusCode)}`}>{status.label}</span>
          )}
        </td>
        <td
          className={`comp-cell-width-160 comp-cell-min-width-160 ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {assignedOfficerName}
        </td>
        <td
          className={`comp-cell-width-160 comp-cell-min-width-160 case-table-date-cell ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          {formatDateTime(data.updatedDate ?? data.createdDate)}
        </td>
      </tr>
      {isExpanded && (
        <tr
          onMouseEnter={() => toggleHoverState(true)}
          onMouseLeave={() => toggleHoverState(false)}
        >
          <td className="comp-cell-width-90 comp-cell-child-expanded"></td>
          <td
            onClick={toggleExpand}
            colSpan={5}
            className="comp-cell-child-expanded"
          >
            <dl className="hwc-table-dl">
              <div>
                <dt>Description</dt>
                {truncatedDescription ? <dd>{truncatedDescription}</dd> : <dd>No description provided</dd>}
              </div>
            </dl>
          </td>
        </tr>
      )}
    </>
  );
};
