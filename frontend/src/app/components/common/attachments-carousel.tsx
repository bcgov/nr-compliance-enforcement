import { FC, useEffect, useState, useRef } from "react";
import { CarouselProvider, Slider } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { getAttachments } from "@store/reducers/attachments";
import { AttachmentSlide } from "./attachment-slide";
import { AttachmentUpload } from "./attachment-upload";
import { COMSObject } from "@apptypes/coms/object";
import { selectMaxFileSize } from "@store/reducers/app";
import { v4 as uuidv4 } from "uuid";
import { getThumbnailDataURL, isImage } from "@common/methods";
import AttachmentEnum from "@constants/attachment-enum";

type Props = {
  attachmentType: AttachmentEnum;
  showPreview: boolean;
  identifier?: string;
  allowUpload?: boolean;
  allowDelete?: boolean;
  cancelPendingUpload?: boolean;
  onFilesSelected?: (attachments: File[]) => void;
  onFileDeleted?: (attachments: COMSObject) => void;
  onSlideCountChange?: (count: number) => void;
  setCancelPendingUpload?: (isCancelUpload: boolean) => void | null;
  disabled?: boolean | null;
  refreshKey?: number;
};

export const Attachments: FC<Props> = ({
  attachmentType,
  showPreview,
  identifier,
  allowUpload,
  allowDelete,
  cancelPendingUpload,
  onFilesSelected,
  onFileDeleted,
  onSlideCountChange,
  setCancelPendingUpload,
  disabled,
  refreshKey,
}) => {
  const dispatch = useAppDispatch();

  // max file size for uploads
  const maxFileSize = useAppSelector(selectMaxFileSize);

  const [carouselData, setCarouselData] = useState<COMSObject[]>([]);

  const SLIDE_WIDTH = 289; // width of the carousel slide, in pixels
  const SLIDE_HEIGHT = 200;
  const [visibleSlides, setVisibleSlides] = useState<number>(4); // Adjust the initial number of visible slides as needed
  const carouselContainerRef = useRef<HTMLDivElement | null>(null); // ref to the carousel's container, used to determine how many slides can fit in the container

  const [slides, setSlides] = useState<COMSObject[]>([]);

  const [, setSlideCount] = useState<number>(0);

  // when the carousel data updates (from the selector, on load), populate the carousel slides
  useEffect(() => {
    if (carouselData) {
      setSlides(sortAttachmentsByName(carouselData));
    } else {
      setSlides([]);
    }
  }, [carouselData]);

  // get the attachments when the Carousel loads
  useEffect(() => {
    if (!identifier) {
      return;
    }

    let isMounted = true;

    const loadAttachments = async () => {
      const attachments = await dispatch(getAttachments(identifier, attachmentType));

      if (isMounted) {
        setCarouselData(attachments);
      }
    };

    loadAttachments();

    return () => {
      isMounted = false;
    };
  }, [dispatch, identifier, attachmentType, refreshKey]);

  // Update the slide count when the slides state changes
  useEffect(() => {
    setSlideCount(slides.length);

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

  // when a user selects files (via the file browser that pops up when clicking the upload slide) then add them to the carousel
  const onFileSelect = async (newFiles: FileList) => {
    const selectedFilesArray = Array.from(newFiles);
    let newSlides: COMSObject[] = [];
    for (let selectedFile of selectedFilesArray) {
      newSlides.push(await createSlideFromFile(selectedFile));
    }
    removeInvalidFiles(selectedFilesArray);

    setSlides([...newSlides, ...slides]);
  };

  // don't upload files that are invalid
  const removeInvalidFiles = (files: File[]) => {
    if (onFilesSelected) {
      // remove any of the selected files that fail validation so that they aren't uploaded
      const validFiles = files.filter((file) => file.size <= maxFileSize * 1_000_000);
      onFilesSelected(validFiles);
    }
  };

  // given a file, create a carousel slide
  const createSlideFromFile = async (file: File) => {
    let imageIconString;
    if (isImage(file.name)) {
      const thumbnail = await getThumbnailDataURL(file);
      if (thumbnail) {
        imageIconString = thumbnail;
      }
    }
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

  // calculates how many slides will fit on the page
  useEffect(() => {
    const calcualteSlidesToDisplay = (containerWidth: number): number => {
      const SLIDE_WIDTH = 299; // width of a slide if 289, plus 10 for gap
      const slidesToDisplay = Math.floor(containerWidth / SLIDE_WIDTH);
      if (allowUpload) {
        // account for the upload slide (which adds another slide to the carousel)
        return slidesToDisplay <= 1 ? 1 : slidesToDisplay - 1;
      } else {
        return slidesToDisplay <= 1 ? 1 : slidesToDisplay;
      }
    };
    // Function to update the number of visible slides based on the parent container width
    const updateVisibleSlides = () => {
      if (carouselContainerRef.current) {
        const containerWidth = carouselContainerRef.current.offsetWidth;
        const slidesToDisplay = calcualteSlidesToDisplay(containerWidth);
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
    <div ref={carouselContainerRef}>
      {(allowUpload || (slides && slides?.length > 0)) && (
        <>
          {showPreview ? (
            <CarouselProvider
              naturalSlideWidth={SLIDE_WIDTH}
              naturalSlideHeight={SLIDE_HEIGHT}
              totalSlides={slides ? slides.length : 0}
              visibleSlides={visibleSlides}
              className="comp-carousel"
            >
              <Slider className="coms-slider">
                {allowUpload && (
                  <AttachmentUpload
                    onFileSelect={onFileSelect}
                    disabled={disabled}
                  />
                )}
                {slides?.map((item, index) => (
                  <AttachmentSlide
                    key={item.id}
                    attachment={item}
                    index={index}
                    allowDelete={allowDelete}
                    onFileRemove={() => onFileRemove(item)}
                    showPreview={true}
                  />
                ))}
              </Slider>
            </CarouselProvider>
          ) : (
            <div className="comp-carousel-no-preview">
              {allowUpload && (
                <div className="comp-carousel-upload-no-preview">
                  <AttachmentUpload
                    onFileSelect={onFileSelect}
                    disabled={disabled}
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
                    onFileRemove={() => onFileRemove(item)}
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
