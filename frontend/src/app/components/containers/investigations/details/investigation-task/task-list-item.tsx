import { FC, useEffect, useState } from "react";
import { ActivityNote, DiaryDate, Task } from "@/generated/graphql";
import { useAppDispatch } from "@/app/hooks/hooks";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { GET_ACTIVITY_NOTES_BY_TASK } from "@/app/components/common/activity-note";
import { GET_DIARY_DATES_BY_TASK } from "@/app/components/containers/investigations/details/investigation-diary-dates";
import { getAttachments } from "@/app/store/reducers/attachments";
import AttachmentEnum from "@/app/constants/attachment-enum";
import { formatDate, truncateString } from "@/app/common/methods";

type Props = {
  data: Task;
  investigationGuid: string;
};

export const TaskListExpandedContent: FC<Props> = ({ data, investigationGuid }) => {
  const dispatch = useAppDispatch();
  const [attachmentCount, setAttachmentCount] = useState<number | null>(null);

  const { data: taskActionsData } = useGraphQLQuery<{ getActivityNotesByTask: ActivityNote[] }>(
    GET_ACTIVITY_NOTES_BY_TASK,
    {
      queryKey: ["getActivityNotesByTask", data.taskIdentifier],
      variables: { taskGuid: data.taskIdentifier },
    },
  );

  const { data: diaryDatesData } = useGraphQLQuery<{ diaryDatesByTask: DiaryDate[] }>(GET_DIARY_DATES_BY_TASK, {
    queryKey: ["diaryDatesByTask", data.taskIdentifier],
    variables: { taskGuid: data.taskIdentifier },
  });

  useEffect(() => {
    if (attachmentCount !== null) return;
    dispatch(getAttachments(investigationGuid, data.taskIdentifier, AttachmentEnum.TASK_ATTACHMENT))
      .then((attachments) => setAttachmentCount(attachments?.length ?? 0))
      .catch(() => setAttachmentCount(0));
  }, [attachmentCount, dispatch, investigationGuid, data.taskIdentifier]);

  const taskActionCount = taskActionsData?.getActivityNotesByTask?.length ?? 0;
  const diaryDates = diaryDatesData?.diaryDatesByTask ?? [];
  const truncatedDescription = truncateString(data.description ?? "", 205);

  return (
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
          diaryDates.map((dd) => <dd key={dd.diaryDateGuid}>{`${formatDate(dd.dueDate)} - ${dd.description}`}</dd>)
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
  );
};
