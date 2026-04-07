import { get } from "src/external_api/shared_data";

export const getTask = async (token: string, taskId: string) => {
  const query = `{task(taskId: "${taskId}") {
    taskIdentifier
    investigationIdentifier
    taskTypeCode
    taskStatusCode
    assignedUserIdentifier
    createdByUserIdentifier
    createdDate
    updatedDate
    taskNumber
    description
    activeIndicator
    taskCategoryTypeCode
    remarks
    dueDate
  }}`;

  const { data, errors } = await get(token, { query });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching task: ${JSON.stringify(errors)}`);
  }

  return data?.task;
};
