import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

interface ClampedContentProps {
  maxLines: number;
  // Selector for countable items; when set, the toggle reads "View X more" with the number not fully visible
  itemSelector?: string;
  children: ReactNode;
}

// Items whose bottom edge falls below the clamped box are not fully visible
const countHiddenItems = (container: HTMLElement, itemSelector: string): number => {
  const visibleBottom = container.getBoundingClientRect().bottom;
  return Array.from(container.querySelectorAll(itemSelector)).filter(
    (item) => item.getBoundingClientRect().bottom > visibleBottom,
  ).length;
};

/**
 * Clamps content to a number of rendered lines with a fade-out, and shows a "View more" toggle only
 * when the content actually overflows.
 */
export const ClampedContent: FC<ClampedContentProps> = ({ maxLines, itemSelector, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [hiddenCount, setHiddenCount] = useState(0);

  // Measured only while collapsed (expanded content never overflows). Re-measured when the clamped
  // box resizes (a narrower column wraps onto more lines) and when the content itself changes
  // size (e.g. legislation loading after mount), which the clamped box alone may not reflect
  useEffect(() => {
    const element = contentRef.current;
    const inner = innerRef.current;
    if (!element || !inner || viewMore) return;

    const observer = new ResizeObserver(() => {
      setIsOverflowing(element.scrollHeight > element.clientHeight);
      if (itemSelector) {
        setHiddenCount(countHiddenItems(element, itemSelector));
      }
    });
    observer.observe(element);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [viewMore, itemSelector]);

  const viewMoreLabel = itemSelector ? `View ${hiddenCount} more` : "View more";

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
        <div className="d-flex justify-content-end">
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
                {viewMoreLabel} <BsChevronDown />
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
};
