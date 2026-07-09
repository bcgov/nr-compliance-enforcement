import { FC, useCallback, useEffect, useState, useRef } from "react";
import { useAppDispatch } from "@hooks/hooks";
import { getAttachments } from "@store/reducers/attachments";
import { COMSObject } from "@apptypes/coms/object";
import AttachmentEnum from "@constants/attachment-enum";
import { generateApiParameters, get } from "@/app/common/api";
import config from "@/config";

export const PartyCarousel: FC<{ partyId: string }> = ({ partyId }) => {
  const dispatch = useAppDispatch();
  const [attachments, setAttachments] = useState<COMSObject[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isMountedRef = useRef(true);
  const sortItems = (items: COMSObject[]) =>
    items.slice().sort((a, b) => {
      const at = a?.createdAt ? Date.parse(a.createdAt.toString()) : 0;
      const bt = b?.createdAt ? Date.parse(b.createdAt.toString()) : 0;
      return bt - at;
    });

  const loadAttachments = useCallback(async (): Promise<number> => {
    if (!partyId) return 0;
    const items = await dispatch(getAttachments(partyId, undefined, AttachmentEnum.PARTY_ATTACHMENT, true));
    if (!isMountedRef.current) return 0;
    const sorted = sortItems(items);
    setAttachments(sorted);
    setCurrentSlide(0);
    return sorted.length;
  }, [dispatch, partyId]);

  useEffect(() => {
    isMountedRef.current = true;
    loadAttachments();
    const handleAttachmentsUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ identifier: string; attachmentType: AttachmentEnum }>;
      if (customEvent?.detail?.attachmentType !== AttachmentEnum.PARTY_ATTACHMENT) return;
      if (customEvent?.detail?.identifier !== partyId) return;
      loadAttachments();
    };
    globalThis.window.addEventListener("attachments-updated", handleAttachmentsUpdated);
    return () => {
      isMountedRef.current = false;
      globalThis.window.removeEventListener("attachments-updated", handleAttachmentsUpdated);
    };
  }, [loadAttachments, partyId]);

  const total = attachments.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (total <= 1) return;
      e.preventDefault();
      if (e.deltaY > 0) {
        setCurrentSlide((s) => Math.min(s + 1, total - 1));
      } else if (e.deltaY < 0) {
        setCurrentSlide((s) => Math.max(s - 1, 0));
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [total]);

  if (!attachments || attachments.length === 0) {
    return <i className="bi bi-person-vcard party-details-summary-vcard"></i>;
  }

  const att = attachments[currentSlide];

  const handleAttachmentClick = async (att: COMSObject) => {
    const parameters = generateApiParameters(`${config.COMS_URL}/object/${att.id}?download=url`);
    const response = await get<string>(dispatch, parameters);
    const a = document.createElement("a");
    a.href = response;
    a.download = att.name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  return (
    <div
      ref={containerRef}
      className="d-flex align-items-center justify-content-center gap-3"
    >
      <button
        type="button"
        onClick={() => setCurrentSlide((s) => Math.max(s - 1, 0))}
        disabled={currentSlide === 0}
        className={`btn btn-link p-0 ${currentSlide === 0 ? "text-muted" : "text-dark"} fs-3`}
      >
        <i className="bi bi-caret-left-fill" />
      </button>

      <div className="party-carousel-frame d-flex align-items-center justify-content-center flex-grow-1 overflow-hidden rounded border bg-light">
        {att?.imageIconString ? (
          <button
            type="button"
            className="border-0 bg-transparent p-0 w-100 h-100"
            onClick={() => {
              void handleAttachmentClick(att);
            }}
          >
            <img
              src={att.imageIconString}
              alt={att.name}
              className="w-100 h-100 object-fit-cover"
            />
          </button>
        ) : (
          <i className="bi bi-image text-secondary fs-1" />
        )}
      </div>

      <button
        type="button"
        onClick={() => setCurrentSlide((s) => Math.min(s + 1, total - 1))}
        disabled={currentSlide === total - 1}
        className={`btn btn-link p-0 ${currentSlide === total - 1 ? "text-muted" : "text-primary"} fs-3`}
      >
        <i className="bi bi-caret-right-fill" />
      </button>
    </div>
  );
};
