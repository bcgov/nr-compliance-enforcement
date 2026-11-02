import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

interface ClampedContentProps {
  maxLines: number;
  children: ReactNode;
}

/**
 * Clamps content to a number of rendered lines with a fade-out, and shows a "View more" toggle only
 * when the content actually overflows.
 */
export const ClampedContent: FC<ClampedContentProps> = ({ maxLines, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [viewMore, setViewMore] = useState(false);

  // Measured only while collapsed (expanded content never overflows). Re-measured when the clamped
  // box resizes (a narrower column wraps onto more lines) and when the content itself changes
  // size (e.g. legislation loading after mount), which the clamped box alone may not reflect
  useEffect(() => {
    const element = contentRef.current;
    const inner = innerRef.current;
    if (!element || !inner || viewMore) return;

    const observer = new ResizeObserver(() => setIsOverflowing(element.scrollHeight > element.clientHeight));
    observer.observe(element);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [viewMore]);

  const isFaded = !viewMore && isOverflowing;

  return (
    <>
      <div
        ref={contentRef}
        className={`clamped-content${isFaded ? " clamped-content--faded" : ""}`}
        style={viewMore ? undefined : { maxHeight: `${maxLines}lh` }}
      >
        <div ref={innerRef}>{children}</div>
      </div>
      {isOverflowing && (
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => setViewMore(!viewMore)}
          >
            {viewMore ? (
              <>
                View less <BsChevronUp />
              </>
            ) : (
              <>
                View more <BsChevronDown />
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
};
