import { formatDate, formatTime } from "src/common/methods";
import { get } from "src/external_api/shared_data";

// Used for Report generation
export const getTask = async (token: string, taskId: string, tz: string) => {
  const query = `{
    task(taskId: "${taskId}") {
      investigationLabel
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
  const _resolveTaskCategory = (categoryCode: string) => categoryMap.get(categoryCode) ?? { longDescription: "" };

  // Task types
  const typeMap = new Map(taskTypeCodes.map((tt) => [tt.taskTypeCode, { longDescription: tt.longDescription }]));
  const _resolveTaskType = (typeCode: string) => typeMap.get(typeCode) ?? { longDescription: "" };

  // Need to combine dates and times for proper formatting
  const combineDateAndTime = (date: string, time: string): string => {
    const dateStr = date.split("T")[0];
    const timeStr = time.split("T")[1];
    return `${dateStr}T${timeStr}`;
  };

  return {
    ...task,
    assignedUser: _resolveUser(task.assignedUserIdentifier),
    dueDate: formatDate(task.dueDate),
    taskType: {
      category: _resolveTaskCategory(task.taskCategoryTypeCode),
      type: _resolveTaskType(task.taskTypeCode),
    },
    exhibits: getExhibitsByTask.map((exhibit) => ({
      ...exhibit,
      dateCollected: formatDate(exhibit.dateCollected),
      collectedBy: _resolveUser(exhibit.collectedAppUserGuidRef),
    })),
    activityNotes: getActivityNotesByTask.map((note) => ({
      ...note,
      actionedDate: formatDate(note.actionedDate),
      actionedTime: note.actionedTime ? formatTime(combineDateAndTime(note.actionedDate, note.actionedTime), tz) : "",
      actionedBy: _resolveUser(note.actionedAppUserGuidRef),
    })),
    diaryDates: diaryDatesByTask.map((date) => ({
      ...date,
      dueDate: formatDate(date.dueDate),
    })),
    generatedOn: formatDate(new Date().toISOString()),
    hasDiaryDates: (diaryDatesByTask?.length ?? 0) > 0,
    hasActivityNotes: (getActivityNotesByTask?.length ?? 0) > 0,
  };
};
