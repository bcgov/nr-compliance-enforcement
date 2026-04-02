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

  const subCategory = taskSubCategories.find((sc) => sc.value === data.taskTypeCode);
  const categoryLabel = taskCategories.find((c) => c.value === data.taskCategoryTypeCode)?.label ?? "-";
  const subCategoryLabel = subCategory?.label && subCategory.label !== "None" ? subCategory.label : "-";
  const statusLabel = taskStatuses.find((s) => s.value === data.taskStatusCode)?.label ?? "";
  const assignedOfficer = officers?.find((o) => o.app_user_guid === data.assignedUserIdentifier);
  const assignedOfficerName = assignedOfficer ? `${assignedOfficer.last_name}, ${assignedOfficer.first_name}` : "-";
  const dueDateObj = new Date(data?.dueDate);
  const dueDate = dueDateObj.toISOString().split("T")[0] ?? "-";

  const [isExpanded, setIsExpanded] = useState(false);
  const [attachmentCount, setAttachmentCount] = useState<number | null>(null);

  const expandedClass = isExpanded ? "comp-cell-parent-expanded align-middle" : "align-middle";

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
    if (!isExpanded || attachmentCount !== null) return;
    dispatch(getAttachments(investigationGuid, data.taskIdentifier, AttachmentEnum.TASK_ATTACHMENT))
      .then((attachments) => setAttachmentCount(attachments?.length ?? 0))
      .catch(() => setAttachmentCount(0));
  }, [isExpanded, attachmentCount, dispatch, investigationGuid, data.taskIdentifier]);

  const taskActionCount = taskActionsData?.getActivityNotesByTask?.length ?? 0;
  const diaryDates = diaryDatesData?.diaryDatesByTask ?? [];

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) return;
    toggleExpand();
  };

  const truncatedDescription = truncateString(data.description ?? "", 205);

  return (
    <>
      <tr
        className={expandedClass}
        onClick={handleRowClick}
      >
        <td className={`comp-cell-width-30 comp-cell-min-width-30 text-center ${expandedClass}`}>
          <button
            onClick={toggleExpand}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? "Collapse" : "Expand"} task ${data.taskNumber} details`}
            className="btn p-0 border-0 text-muted"
          >
            <i className={`m-0 ps-1 bi bi-chevron-${isExpanded ? "down" : "right"}`} />
          </button>
        </td>
        <td className={`comp-cell-width-90 comp-cell-min-width-90 ${expandedClass}`}>
          <Link
            to={`/investigation/${investigationGuid}/task/${data.taskIdentifier}`}
            className="comp-cell-link"
          >
            {`Task ${data.taskNumber}`}
          </Link>
        </td>
        <td className={`comp-cell-width-160 comp-cell-min-width-160 ${expandedClass}`}>{categoryLabel}</td>
        <td className={`comp-cell-width-160 comp-cell-min-width-160 ${expandedClass}`}>{subCategoryLabel}</td>
        <td className={`comp-cell-width-160 comp-cell-min-width-160 ${expandedClass}`}>{data.remarks}</td>
        <td className={`comp-cell-width-110 ${expandedClass}`}>
          {statusLabel && data.taskStatusCode && (
            <span className={`badge ${applyStatusClass(data.taskStatusCode)}`}>{statusLabel}</span>
          )}
        </td>
        <td className={`comp-cell-width-160 comp-cell-min-width-160 ${expandedClass}`}>{assignedOfficerName}</td>
        <td className={`comp-cell-width-160 comp-cell-min-width-160 ${expandedClass}`}>{dueDate}</td>
        <td className={`comp-cell-width-160 comp-cell-min-width-160 case-table-date-cell ${expandedClass}`}>
          {formatDateTime(data.updatedDate ?? data.createdDate)}
        </td>
      </tr>
      {isExpanded && (
        <tr onClick={handleRowClick}>
          <td className="comp-cell-width-30 comp-cell-child-expanded"></td>
          <td className="comp-cell-width-90 comp-cell-child-expanded"></td>
          <td
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
                  diaryDates.map((dd) => (
                    <dd key={dd.diaryDateGuid}>{`${formatDate(dd.dueDate)} - ${dd.description}`}</dd>
                  ))
                )}
              </div>
              <div className="pb-3 flex-row">
                <dt className="w-auto me-2">Task actions:</dt>
                <dd>{taskActionCount}</dd>
              </div>
              <div className="pb-3 flex-row">
                <dt className="w-auto me-2">Attachments:</dt>
                <dd>{attachmentCount ?? "-"}</dd>
              </div>
            </dl>
          </td>
        </tr>
      )}
    </>
  );
};
