import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { COMSObject } from "@apptypes/coms/object";
import { openModal, selectMaxFileSize } from "@store/reducers/app";
import { removeIdentifierFromFilename } from "@common/methods";
import { generateFileThumbnail, getDisplayFilename } from "@/app/common/attachment-utils";
import AttachmentEnum from "@constants/attachment-enum";
import { CANCEL_CONFIRM_FILE_UPDATE } from "@/app/types/modal/modal-types";

type UseAttachmentStagingParams = {
  attachmentType: AttachmentEnum;
  identifier?: string;
  onFilesSelected?: (attachments: File[]) => void;
  onFilesReplaced?: (attachments: File[]) => void;
  onFileDeleted?: (attachment: COMSObject) => void;
  confirmDuplicates?: boolean;
};

type UseAttachmentStagingResult = {
  slides: COMSObject[];
  setSlides: React.Dispatch<React.SetStateAction<COMSObject[]>>;
  onFileSelect: (newFiles: FileList) => Promise<void>;
  onFileRemove: (attachment: COMSObject) => void;
};

/**
 * Owns the staging of locally selected files: duplicate-name confirmation, size validation,
 * thumbnail generation, and the slide list that the carousel renders.
 */
export const useAttachmentStaging = ({
  attachmentType,
  identifier,
  onFilesSelected,
  onFilesReplaced,
  onFileDeleted,
  confirmDuplicates = true,
}: UseAttachmentStagingParams): UseAttachmentStagingResult => {
  const dispatch = useAppDispatch();

  // max file size for uploads
  const maxFileSize = useAppSelector(selectMaxFileSize);

  const [slides, setSlides] = useState<COMSObject[]>([]);

  /**
   * Resolves the name used to decide whether two attachments are the same file.
   * Some attachment types embed an identifier in the stored filename; others do not.
   */
  const toComparableName = (attachment: COMSObject): string => {
    if (
      attachmentType === AttachmentEnum.TASK_ATTACHMENT ||
      attachmentType === AttachmentEnum.ENFORCEMENT_ACTION_ATTACHMENT ||
      attachmentType === AttachmentEnum.PARTY_ATTACHMENT ||
      attachmentType === AttachmentEnum.INVESTIGATION_PARTY_ATTACHMENT
    ) {
      return getDisplayFilename(attachment.name);
    }

    return removeIdentifierFromFilename(decodeURIComponent(attachment.name), identifier ?? "", attachmentType);
  };

  const confirmFileUpdate = async (newFiles: FileList) => {
    const exisingFileNames: string[] = slides.map(toComparableName);
    const exisingFileNamesSet = new Set(exisingFileNames);
    const newFileNamesArray = Array.from(newFiles).map((file) => file.name);
    const conflitingFileNames = newFileNamesArray.filter((item) => exisingFileNamesSet.has(item));
    if (conflitingFileNames.length === 0 || !confirmDuplicates) {
      await stageFiles(newFiles, conflitingFileNames);
    } else {
      document.body.click();
      dispatch(
        openModal({
          modalSize: "md",
          modalType: CANCEL_CONFIRM_FILE_UPDATE,
          data: {
            title: "File already exists",
            fileNames: conflitingFileNames,
            onUpdate: async () => {
              await stageFiles(newFiles, conflitingFileNames);
            },
          },
        }),
      );
    }
  };

  // when a user selects files (via the file browser that pops up when clicking the upload slide) then add them to the carousel
  const onFileSelect = async (newFiles: FileList) => {
    await confirmFileUpdate(newFiles);
  };

  const stageFiles = async (newFiles: FileList, conflictingFileNames: string[]) => {
    const selectedFilesArray = Array.from(newFiles);
    let newSlides: COMSObject[] = [];
    for (let selectedFile of selectedFilesArray) {
      newSlides.push(await createSlideFromFile(selectedFile));
    }
    removeInvalidFiles(selectedFilesArray, conflictingFileNames);

    // a confirmed replacement supersedes the slide it replaces, so drop the superseded slide
    // rather than leaving two slides with the same display name in the carousel
    const incomingNames = new Set(selectedFilesArray.map((file) => file.name));
    const retainedSlides = slides.filter((slide) => !incomingNames.has(getDisplayFilename(slide.name)));

    setSlides([...newSlides, ...retainedSlides]);
  };

  // don't upload files that are invalid
  const removeInvalidFiles = (files: File[], conflictingFileNames: string[]) => {
    const validFiles = files.filter((file) => file.size <= maxFileSize * 1_000_000);
    if (onFilesSelected) {
      // remove any of the selected files that fail validation so that they aren't uploaded
      onFilesSelected(validFiles);
    }
    if (onFilesReplaced && conflictingFileNames.length > 0) {
      const conflictSet = new Set(conflictingFileNames);
      onFilesReplaced(validFiles.filter((file) => conflictSet.has(file.name)));
    }
  };

  // given a file, create a carousel slide
  const createSlideFromFile = async (file: File) => {
    const imageIconString = await generateFileThumbnail(file);
    const newSlide: COMSObject = {
      name: encodeURIComponent(file.name),
      id: uuidv4(), // generate a unique identifier in case the user uploads non-unique file names.  This allows us to know which one the user wants to delete
      path: "",
      public: false,
      active: false,
      bucketId: "",
      createdBy: "",
      updatedBy: "",
      imageIconString: imageIconString,
      pendingUpload: true,
      size: file.size,
    };

    // check for large file sizes
    if (file.size > maxFileSize * 1_000_000) {
      // convert MB to Bytes
      newSlide.errorMesage = `File exceeds ${maxFileSize} MB`;
    }

    return newSlide;
  };

  // fired when user wants to remove a slide from the carousel
  const onFileRemove = (attachment: COMSObject) => {
    setSlides((slides) => slides.filter((slide) => slide.id !== attachment.id));
    if (onFileDeleted) {
      onFileDeleted(attachment);
    }
  };

  return { slides, setSlides, onFileSelect, onFileRemove };
};
