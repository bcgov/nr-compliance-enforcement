import { ChefsAttachment, ChefsFile } from "src/types/chefs/chefs-submission-type";
import { ChefsTransform } from "src/types/chefs/chefs-transform-type";

const findAttachments = (value: unknown): ChefsAttachment[] => {
  if (!value || typeof value !== "object") {
    return [];
  }

  const file = value as Partial<ChefsFile>;
  if (file.storage === "chefs" && file.data?.id) {
    return [{ id: file.data.id, name: file.originalName, size: file.size }];
  }

  // Recursively search through everything on a form to find attachments.
  return Object.values(value).reduce<ChefsAttachment[]>(
    (attachments, child) => attachments.concat(findAttachments(child)),
    [],
  );
};

export const attachmentsTransform: ChefsTransform = (data) => {
  const attachments = findAttachments(data);
  if (attachments.length === 0) {
    return data;
  }

  return {
    ...data,
    attachments,
  };
};
