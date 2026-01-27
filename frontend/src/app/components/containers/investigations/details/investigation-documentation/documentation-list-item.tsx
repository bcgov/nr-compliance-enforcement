import { FC } from "react";
import { Link } from "react-router-dom";
import { formatDateTime } from "@common/methods";
import { generateApiParameters, get } from "@common/api";
import { useAppDispatch } from "@hooks/hooks";
import { Task } from "@/generated/graphql";
import { getDisplayFilename } from "@common/coms-api";
import config from "@/config";
import { Attachment } from "./hooks/use-investigation-attachments";

type Props = {
  attachment: Attachment;
  investigationGuid: string;
  task?: Task;
};

export const DocumentationListItem: FC<Props> = ({ attachment, investigationGuid, task }) => {
  const dispatch = useAppDispatch();

  const handleFileClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!attachment.id) return;

    const parameters = generateApiParameters(`${config.COMS_URL}/object/${attachment.id}?download=url`);
    const downloadUrl = await get<string>(dispatch, parameters);

    window.open(downloadUrl, "_blank");
  };

  const displayName = getDisplayFilename(attachment.name);
  const taskLabel = task ? `Task ${task.taskNumber}` : "-";

  return (
    <tr>
      <td className="comp-cell-min-width-200">
        <a
          href={`${config.COMS_URL}/object/${attachment.id}`}
          className="comp-cell-link"
          onClick={handleFileClick}
          title={`Download ${displayName}`}
        >
          {displayName}
        </a>
      </td>
      <td className="comp-cell-width-150 comp-cell-min-width-150">
        {task ? (
          <Link
            to={`/investigation/${investigationGuid}/tasks?section=task-item-${task.taskNumber}`}
            className="comp-cell-link"
          >
            {taskLabel}
          </Link>
        ) : (
          <span>{taskLabel}</span>
        )}
      </td>
      <td className="comp-cell-width-150 comp-cell-min-width-150">
        {attachment.createdAt ? formatDateTime(attachment.createdAt.toString()) : "-"}
      </td>
    </tr>
  );
};
