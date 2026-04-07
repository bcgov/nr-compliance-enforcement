import { get, getAppUsers } from "src/external_api/shared_data";

export const getTask = async (token: string, taskId: string) => {
  const query = `{task(taskId: "${taskId}") {
    investigationIdentifier
    taskTypeCode
    assignedUserIdentifier
    taskNumber
    description
    taskCategoryTypeCode
    remarks
    dueDate
  }}`;

  const { data, errors } = await get(token, { query });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching task: ${JSON.stringify(errors)}`);
  }

  // Data conversions
  // TODO: Felt cute, might delete later
  const task = data?.task;
  if (task) {
    const users = await getAppUsers(token);
    const findUserName = (guid: string) => {
      const user = users.find((u) => u.appUserGuid === guid);
      return user ? `${user.lastName}, ${user.firstName}` : "Unknown officer";
    };

    task.assignedUserIdentifier = findUserName(task.assignedUserIdentifier);
  }

  return task;
};
