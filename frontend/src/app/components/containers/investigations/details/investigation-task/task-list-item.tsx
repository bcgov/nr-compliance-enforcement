import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applyStatusClass, formatDate, formatDateTime, truncateString } from "@/app/common/methods";
import { ActivityNote, DiaryDate, Task } from "@/generated/graphql";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { selectTaskCategory, selectTaskSubCategory, selectTaskStatus } from "@/app/store/reducers/code-table-selectors";
import { selectOfficers } from "@/app/store/reducers/officer";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { GET_ACTIVITY_NOTES_BY_TASK } from "@/app/components/common/activity-note";
import { GET_DIARY_DATES_BY_TASK } from "@/app/components/containers/investigations/details/investigation-diary-dates";
import { getAttachments } from "@/app/store/reducers/attachments";
import AttachmentEnum from "@/app/constants/attachment-enum";

type Props = {
  data: Task;
  investigationGuid: string;
};

export const TaskListItem: FC<Props> = ({ data, investigationGuid }) => {
  const dispatch = useAppDispatch();
  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const taskStatuses = useAppSelector(selectTaskStatus);
  const officers = useAppSelector(selectOfficers);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [isExpandedClass, setIsExpandedClass] = useState("");
  const [attachmentCount, setAttachmentCount] = useState<number | null>(null);

  const subCategory = taskSubCategories.find((sc) => sc.value === data.taskTypeCode);
  const category = taskCategories.find((c) => c.value === subCategory?.taskCategory);
  const status = taskStatuses.find((s) => s.value === data.taskStatusCode);
  const assignedOfficer = officers?.find((o) => o.app_user_guid === data.assignedUserIdentifier);
  const assignedOfficerName = assignedOfficer ? `${assignedOfficer.first_name} ${assignedOfficer.last_name}` : "-";

  const { data: taskActionsData } = useGraphQLQuery<{ getActivityNotesByTask: ActivityNote[] }>(
    GET_ACTIVITY_NOTES_BY_TASK,
    {
      queryKey: ["getActivityNotesByTask", data.taskIdentifier],
      variables: { taskGuid: data.taskIdentifier },
      enabled: isExpanded,
    },
  );

  const { data: diaryDatesData } = useGraphQLQuery<{ diaryDatesByTask: DiaryDate[] }>(GET_DIARY_DATES_BY_TASK, {
    queryKey: ["diaryDatesByTask", data.taskIdentifier],
    variables: { taskGuid: data.taskIdentifier },
    enabled: isExpanded,
  });

  useEffect(() => {
    if (isExpanded && attachmentCount === null) {
      dispatch(getAttachments(investigationGuid, data.taskIdentifier, AttachmentEnum.TASK_ATTACHMENT)).then(
        (attachments) => {
          setAttachmentCount(attachments?.length ?? 0);
        },
      );
    }
  }, [isExpanded, attachmentCount, dispatch, investigationGuid, data.taskIdentifier]);

  const taskActionCount = taskActionsData?.getActivityNotesByTask?.length ?? 0;
  const diaryDates = diaryDatesData?.diaryDatesByTask ?? [];

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
          className={`comp-cell-width-30 comp-cell-min-width-30 text-center ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          <i className={`bi bi-chevron-${isExpanded ? "down" : "right"}`} />
        </td>
        <td
          className={`comp-cell-width-90 comp-cell-min-width-90 text-center ${isExpandedClass}`}
          onClick={toggleExpand}
        >
          <Link
            to={`/investigation/${investigationGuid}/task/${data.taskIdentifier}`}
            className="comp-cell-link"
          >
            {`Task ${data.taskNumber}`}
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
          <td className="comp-cell-width-30 comp-cell-child-expanded"></td>
          <td className="comp-cell-width-90 comp-cell-child-expanded"></td>
          <td
            onClick={toggleExpand}
            colSpan={5}
            className="comp-cell-child-expanded"
          >
            <dl className="hwc-table-dl">
              <div className="pb-3">
                <dt>Task details</dt>
                {truncatedDescription ? <dd>{truncatedDescription}</dd> : <dd>No description provided</dd>}
              </div>
              <div className="pb-3">
                <dt>Diary dates</dt>
                {diaryDates.length === 0 ? (
                  <dd>-</dd>
                ) : (
                  diaryDates.map((dd) => <dd key={dd.dueDate}>{`${formatDate(dd.dueDate)} - ${dd.description}`}</dd>)
                )}
              </div>
              <div className="pb-3 flex-row">
                <dt
                  style={{ width: "auto" }}
                  className="me-2"
                >
                  Task actions:
                </dt>
                <dd>{taskActionCount}</dd>
              </div>
              <div className="pb-3 flex-row">
                <dt
                  style={{ width: "auto" }}
                  className="me-2"
                >
                  Attachments:
                </dt>
                <dd>{attachmentCount ?? "-"}</dd>
              </div>
            </dl>
          </td>
        </tr>
      )}
    </>
  );
};
