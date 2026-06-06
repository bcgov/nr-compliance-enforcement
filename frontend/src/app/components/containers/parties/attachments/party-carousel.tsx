import { FC, useEffect, useState, useRef } from "react";
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

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      void (async () => {
        if (!partyId) return;
        const items = await dispatch(getAttachments(partyId, undefined, AttachmentEnum.PARTY_ATTACHMENT, true));
        if (!isMounted) return;
        const sorted = items.slice().sort((a, b) => {
          const at = a?.createdAt ? Date.parse(a.createdAt.toString()) : 0;
          const bt = b?.createdAt ? Date.parse(b.createdAt.toString()) : 0;
          return bt - at;
        });
        setAttachments(sorted);
        setCurrentSlide(0);
      })();
    }, 500);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [dispatch, partyId]);

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

      <div
        className="d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden rounded border bg-light"
        style={{ height: "220px" }}
      >
        {att?.imageIconString ? (
          <img
            src={att.imageIconString}
            alt={att.name}
            className="img-fluid w-100 h-100"
            style={{ cursor: "pointer" }}
            onClick={async () => {
              const parameters = generateApiParameters(`${config.COMS_URL}/object/${att.id}?download=url`);
              const response = await get<string>(dispatch, parameters);
              const a = document.createElement("a");
              a.href = response;
              a.download = att.name;
              a.target = "_blank";
              a.click();
            }}
          />
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
