import { FC, useEffect, useState, useRef } from "react";
import {
  CarouselProvider,
  Slider,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  getAttachments,
  setAttachments,
} from "../../store/reducers/attachments";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { AttachmentSlide } from "./attachment-slide";
import { AttachmentUpload } from "./attachment-upload";
import { COMSObject } from "../../types/coms/object";
import { selectMaxFileSize } from "../../store/reducers/app";
import { v4 as uuidv4 } from 'uuid';

type Props = {
  complaintIdentifier: string;
  allowUpload?: boolean;
  allowDelete?: boolean;
  onFilesSelected?: (attachments: File[]) => void;
  onFileDeleted?: (attachments: COMSObject) => void;
};

export const AttachmentsCarousel: FC<Props> = ({
  complaintIdentifier,
  allowUpload,
  allowDelete,
  onFilesSelected,
  onFileDeleted,
}) => {
  const dispatch = useAppDispatch();

  // max file size for uploads
  const maxFileSize = useAppSelector(selectMaxFileSize)

  const carouselData = useSelector(
    (state: RootState) => state.attachments.attachments
  );

  const SLIDE_WIDTH = 289; // width of the carousel slide, in pixels
  const [visibleSlides, setVisibleSlides] = useState<number>(4); // Adjust the initial number of visible slides as needed
  const carouselContainerRef = useRef<HTMLDivElement | null>(null); // ref to the carousel's container, used to determine how many slides can fit in the container

  const [slides, setSlides] = useState<COMSObject[]>([]);

  // when the carousel data updates (from the selector, on load), populate the carousel slides
  useEffect(() => {
    if (carouselData) {
      setSlides(carouselData);
    } else {
      setSlides([])
    }
  }, [carouselData]);

  // get the attachments when the complaint loads
  useEffect(() => {
    dispatch(getAttachments(complaintIdentifier));
  }, [complaintIdentifier, dispatch]);

  //-- when the component unmounts clear the attachments from redux
  useEffect(() => {
    return () => {
      dispatch(setAttachments([]));
    };
  }, [dispatch]);

  // when a user selects files (via the file browser that pops up when clicking the upload slide) then add them to the carousel
  const onFileSelect = (newFiles: FileList) => {
    const selectedFilesArray = Array.from(newFiles);
    let newSlides: COMSObject[] = [];
    selectedFilesArray.forEach((file) => {
      newSlides.push(createSlideFromFile(file));
    });
    
    removeInvalidFiles(selectedFilesArray);

    setSlides([...newSlides, ...slides]);
  };

  // don't upload files that are invalid
  const removeInvalidFiles = (files: File[]) => {
    if (onFilesSelected) {
      // remove any of the selected files that fail validation so that they aren't uploaded
      const validFiles = files.filter(file => file.size <= maxFileSize * 1_000_000);
      onFilesSelected(validFiles);
    }
  }

  // given a file, create a carousel slide
  const createSlideFromFile = (file: File) => {
    const newSlide: COMSObject = {
      name: file.name,
      id: uuidv4(), // generate a unique identifier in case the user uploads non-unique file names.  This allows us to know which one the user wants to delete
      path: "",
      public: false,
      active: false,
      bucketId: "",
      createdBy: "",
      updatedBy: "",
      pendingUpload: true
    };

    // check for large file sizes      
    if (file.size > (maxFileSize  * 1_000_000)) { // convert MB to Bytes
      newSlide.errorMesage = `File exceeds ${maxFileSize} MB`;
    }

    return newSlide;
  }

  // fired when user wants to remove a slide from the carousel 
  const onFileRemove = (attachment: COMSObject) => {
    setSlides(slides => slides.filter(slide => slide.id !== attachment.id));
    if (onFileDeleted) {
      onFileDeleted(attachment);
    }
  }

  // calculates how many slides will fit on the page
  useEffect(() => {
    const calcualteSlidesToDisplay = (containerWidth: number): number => {
      const SLIDE_WIDTH = 299; // width of a slide if 289, plus 10 for gap
      const slidesToDisplay = Math.floor(containerWidth / SLIDE_WIDTH);
      if (allowUpload) { // account for the upload slide (which adds another slide to the carousel)
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
  }, []);

  return (
    <div className="comp-complaint-details-block" ref={carouselContainerRef}>
      <h6>Attachments ({slides?.length ? slides.length : 0})</h6>

      {(allowUpload || (slides && slides?.length > 0)) && (
        <CarouselProvider
          naturalSlideWidth={SLIDE_WIDTH}
          naturalSlideHeight={200}
          totalSlides={slides ? slides.length : 0}
          visibleSlides={visibleSlides}
          className="coms-carousel"
        >
          <ButtonBack className="back-icon">
            <BsArrowLeftShort />
          </ButtonBack>
          <ButtonNext className="next-icon">
            <BsArrowRightShort />
          </ButtonNext>
          {allowUpload && (
            <AttachmentUpload
              onFileSelect={onFileSelect}
            />
          )}
          <Slider className="coms-slider">
            {slides?.map((item, index) => (
              <AttachmentSlide
                key={item.name}
                attachment={item}
                index={index}
                allowDelete={allowDelete}
                onFileRemove={() => onFileRemove(item)}
              />
            ))}
          </Slider>
        </CarouselProvider>
      )}
    </div>
  );
};
