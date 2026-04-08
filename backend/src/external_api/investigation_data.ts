import { get } from "src/external_api/shared_data";

// Used for Report generation
export const getTask = async (token: string, taskId: string) => {
  const query = `{
    task(taskId: "${taskId}") {
      investigationIdentifier
      taskTypeCode
      assignedUserIdentifier
      taskNumber
      description
      taskCategoryTypeCode
      remarks
      dueDate
    }
    diaryDatesByTask(taskGuid: "${taskId}") {
        dueDate
        description
    }
    getExhibitsByTask(taskId: "${taskId}") {
      exhibitNumber
      description
      dateCollected
      collectedAppUserGuidRef
    }
    getActivityNotesByTask(taskGuid: "${taskId}") {
      contentText
      actionedDate
      actionedTime
      actionedAppUserGuidRef
    }
    appUsers {
       appUserGuid
       lastName
       firstName
    }
    taskCategoryTypeCodes { 
      taskCategoryTypeCode 
      longDescription
    }
    taskTypeCodes { 
      taskTypeCode 
      longDescription
    }
  }`;

  const { data, errors } = await get(token, { query });

  if (errors) {
    throw new Error(`GraphQL errors occurred while fetching task: ${JSON.stringify(errors)}`);
  }

  const {
    task,
    diaryDatesByTask,
    getExhibitsByTask,
    getActivityNotesByTask,
    appUsers,
    taskCategoryTypeCodes,
    taskTypeCodes,
  } = data;

  // Convert data into report readable format

  // Users
  const userMap = new Map(appUsers.map((u) => [u.appUserGuid, { firstName: u.firstName, lastName: u.lastName }]));
  const _resolveUser = (guid: string) => userMap.get(guid) ?? { firstName: "Unknown", lastName: "User" };

  // Task Categories
  const categoryMap = new Map(
    taskCategoryTypeCodes.map((tc) => [tc.taskCategoryTypeCode, { longDescription: tc.longDescription }]),
  );
  const _resolveTaskCategory = (categoryCode: string) =>
    categoryMap.get(categoryCode) ?? { longDescription: "Unknown category" };

  // Task types
  const typeMap = new Map(taskTypeCodes.map((tt) => [tt.taskTypeCode, { longDescription: tt.longDescription }]));
  const _resolveTaskType = (typeCode: string) => typeMap.get(typeCode) ?? { longDescription: "Unknown type" };

  return {
    ...task,
    assignedUser: _resolveUser(task.assignedUserIdentifier),
    taskType: {
      category: _resolveTaskCategory(task.taskCategoryTypeCode),
      type: _resolveTaskType(task.taskTypeCode),
    },
    exhibits: getExhibitsByTask.map((exhibit) => ({
      ...exhibit,
      collectedBy: _resolveUser(exhibit.collectedAppUserGuidRef),
    })),
    activityNotes: getActivityNotesByTask.map((note) => ({
      ...note,
      actionedBy: _resolveUser(note.actionedAppUserGuidRef),
    })),
    diaryDates: diaryDatesByTask,
    generatedOn: new Date(),
  };
};
