import { FC, useEffect, useState } from "react";
import "pure-react-carousel/dist/react-carousel.es.css";
import { useAppDispatch } from "@hooks/hooks";
import { getAttachments, getSnapshotAttachments } from "@store/reducers/attachments";
import { COMSObject } from "@apptypes/coms/object";
import AttachmentEnum from "@constants/attachment-enum";
import { getDisplayFilename } from "@/app/common/attachment-utils";
import { InvestigationAttachmentReference } from "@/generated/graphql";
import AttachmentCarousel from "@/app/components/common/attachment-carousel";
import { useAttachmentStaging } from "@/app/hooks/use-attachment-staging";

type Props = {
  attachmentType: AttachmentEnum;
  showPreview: boolean;
  identifier?: string;
  subIdentifier?: string;
  allowUpload?: boolean;
  allowDelete?: boolean;
  cancelPendingUpload?: boolean;
  onFilesSelected?: (attachments: File[]) => void;
  onFileDeleted?: (attachments: COMSObject) => void;
  onFilesReplaced?: (attachments: File[]) => void;
  onSlideCountChange?: (count: number) => void;
  setCancelPendingUpload?: (isCancelUpload: boolean) => void | null;
  disabled?: boolean | null;
  refreshKey?: number;
  attachmentReferences?: InvestigationAttachmentReference[];
};

export const Attachments: FC<Props> = ({
  attachmentType,
  showPreview,
  identifier,
  subIdentifier,
  allowUpload,
  allowDelete,
  cancelPendingUpload,
  onFilesSelected,
  onFilesReplaced,
  onFileDeleted,
  onSlideCountChange,
  setCancelPendingUpload,
  disabled,
  refreshKey,
  attachmentReferences,
}) => {
  const dispatch = useAppDispatch();

  const { slides, setSlides, onFileSelect, onFileRemove } = useAttachmentStaging({
    attachmentType,
    identifier,
    onFilesSelected,
    onFilesReplaced,
    onFileDeleted,
  });

  const [carouselData, setCarouselData] = useState<COMSObject[]>([]);

  // when the carousel data updates (from the selector, on load), populate the carousel slides
  useEffect(() => {
    if (carouselData) {
      setSlides(sortAttachmentsByName(carouselData));
    } else {
      setSlides([]);
    }
  }, [carouselData]);

  // reload when an update from the shared party replaces the references
  const attachmentReferencesKey = (attachmentReferences ?? []).map((r) => `${r.objectId}:${r.version}`).join();

  // get the attachments when the Carousel loads
  useEffect(() => {
    if (!identifier) {
      return;
    }

    let isMounted = true;

    const loadAttachments = async () => {
      const attachments: COMSObject[] = [];

      // Fetch attachment information from COMS based on identifiers
      if (identifier) {
        const liveAttachments = await dispatch(getAttachments(identifier, subIdentifier, attachmentType));
        attachments.push(...liveAttachments);
      }

      // Also include any pinned versions that were passed into the component. A pinned version is
      // skipped when a live attachment of the same name exists, since the live one supersedes it.
      if (attachmentReferences) {
        const snapshotAttachments = await dispatch(getSnapshotAttachments(attachmentReferences));
        const liveNames = new Set(attachments.map((a) => getDisplayFilename(a.name)));
        attachments.push(...snapshotAttachments.filter((a: COMSObject) => !liveNames.has(getDisplayFilename(a.name))));
      }

      if (isMounted) {
        setCarouselData(attachments);
      }
    };

    loadAttachments();

    return () => {
      isMounted = false;
    };
  }, [dispatch, identifier, subIdentifier, attachmentType, refreshKey, attachmentReferencesKey]);

  // Update the slide count when the slides state changes
  useEffect(() => {
    // Call the onSlideCountChange prop with the updated count
    if (typeof onSlideCountChange === "function") {
      onSlideCountChange(slides.length);
    }
  }, [onSlideCountChange, slides.length]);

  // Clear all pending upload attachments
  useEffect(() => {
    if (cancelPendingUpload) {
      setSlides([]);
      if (setCancelPendingUpload) setCancelPendingUpload(false); //reset cancelPendingUpload
    }
  }, [cancelPendingUpload, setCancelPendingUpload]);

  function sortAttachmentsByName(comsObjects: COMSObject[]): COMSObject[] {
    // Create a copy of the array using slice() or spread syntax
    const copy = [...comsObjects];

    // Sort the copy based on the name property
    copy.sort((a, b) => a.name.localeCompare(b.name));

    return copy;
  }

  return (
    <AttachmentCarousel
      slides={slides}
      showPreview={showPreview}
      onFileSelect={onFileSelect}
      onFileRemove={onFileRemove}
      allowUpload={allowUpload}
      allowDelete={allowDelete}
      disabled={disabled}
    />
  );
};
