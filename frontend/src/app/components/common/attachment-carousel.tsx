import { FC, useEffect, useRef, useState } from "react";
import { CarouselProvider, Slider } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { COMSObject } from "@apptypes/coms/object";
import { AttachmentSlide } from "./attachment-slide";
import { AttachmentUpload } from "./attachment-upload";

type Props = {
  slides: COMSObject[];
  showPreview: boolean;
  onFileSelect?: (selectedFiles: FileList) => void;
  onFileRemove?: (attachment: COMSObject) => void;
  allowUpload?: boolean;
  allowDelete?: boolean;
  disabled?: boolean | null;
  /** Renders the upload drop zone in its reduced-height layout. */
  variant?: string;
  /**
   * Caps how many attachments render as thumbnails. Any beyond the cap are listed by filename instead.
   * When omitted, every attachment renders as a thumbnail.
   */
  maxPreviews?: number;
};

export const AttachmentCarousel: FC<Props> = ({
  slides,
  showPreview,
  onFileSelect,
  onFileRemove,
  allowUpload,
  allowDelete,
  disabled,
  variant,
  maxPreviews,
}) => {
  const SLIDE_WIDTH = 289; // width of the carousel slide, in pixels
  const SLIDE_HEIGHT = 200;
  const [visibleSlides, setVisibleSlides] = useState<number>(4); // Adjust the initial number of visible slides as needed
  const carouselContainerRef = useRef<HTMLDivElement | null>(null); // ref to the carousel's container, used to determine how many slides can fit in the container

  // when a preview cap is set, only the first maxPreviews render as thumbnails; the rest fall back to a filename list
  const previewSlides = maxPreviews === undefined ? slides : slides.slice(0, maxPreviews);
  const overflowSlides = maxPreviews === undefined ? [] : slides.slice(maxPreviews);

  // the drop zone summarises what the user has staged, not attachments already saved
  const stagedSlides = slides.filter((s) => s.pendingUpload);

  // calculates how many slides will fit on the page
  useEffect(() => {
    const calculateSlidesToDisplay = (containerWidth: number): number => {
      const SLIDE_WIDTH = 299; // width of a slide if 289, plus 10 for gap
      const slidesToDisplay = Math.floor(containerWidth / SLIDE_WIDTH);
      if (allowUpload) {
        // account for the upload slide (which adds another slide to the carousel)
        return Math.max(slidesToDisplay - 1, 1);
      } else {
        return Math.max(slidesToDisplay, 1);
      }
    };
    // Function to update the number of visible slides based on the parent container width
    const updateVisibleSlides = () => {
      if (carouselContainerRef.current) {
        const containerWidth = carouselContainerRef.current.offsetWidth;
        const slidesToDisplay = calculateSlidesToDisplay(containerWidth);
        setVisibleSlides(slidesToDisplay);
      }
    };

    // Call the function once to set the initial number of visible slides
    updateVisibleSlides();

    // Add a window resize listener to update the number of visible slides when the window size changes
    window.addEventListener("resize", updateVisibleSlides);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateVisibleSlides);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowUpload]);

  return (
    <div
      ref={carouselContainerRef}
      className={variant}
    >
      {(allowUpload || (slides && slides?.length > 0)) && (
        <>
          {showPreview ? (
            <>
              <CarouselProvider
                naturalSlideWidth={SLIDE_WIDTH}
                naturalSlideHeight={SLIDE_HEIGHT}
                totalSlides={previewSlides ? previewSlides.length : 0}
                visibleSlides={visibleSlides}
                className="comp-carousel"
              >
                <Slider className="coms-slider">
                  {allowUpload && (
                    <AttachmentUpload
                      onFileSelect={onFileSelect ?? (() => {})}
                      disabled={disabled}
                      previousValues={stagedSlides}
                    />
                  )}
                  {previewSlides?.map((item, index) => (
                    <AttachmentSlide
                      key={item.id}
                      attachment={item}
                      index={index}
                      allowDelete={allowDelete}
                      onFileRemove={() => onFileRemove?.(item)}
                      showPreview={true}
                    />
                  ))}
                </Slider>
              </CarouselProvider>
              {overflowSlides.length > 0 && (
                <div className="comp-carousel-slide-no-preview mt-2">
                  {overflowSlides.map((item, index) => (
                    <AttachmentSlide
                      key={item.id}
                      attachment={item}
                      index={previewSlides.length + index}
                      allowDelete={allowDelete}
                      onFileRemove={() => onFileRemove?.(item)}
                      showPreview={false}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="comp-carousel-no-preview">
              {allowUpload && (
                <div className="comp-carousel-upload-no-preview">
                  <AttachmentUpload
                    onFileSelect={onFileSelect ?? (() => {})}
                    disabled={disabled}
                    previousValues={stagedSlides}
                  />
                </div>
              )}
              <div className="comp-carousel-slide-no-preview">
                {slides?.map((item, index) => (
                  <AttachmentSlide
                    key={item.id}
                    attachment={item}
                    index={index}
                    allowDelete={allowDelete}
                    onFileRemove={() => onFileRemove?.(item)}
                    showPreview={showPreview}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttachmentCarousel;
