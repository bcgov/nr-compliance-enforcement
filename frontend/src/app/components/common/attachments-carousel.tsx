import { FC, useEffect, useState, useRef } from "react";
import {
  CarouselProvider,
  Slider,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { useAppDispatch } from "../../hooks/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  getAttachments,
  setAttachments,
} from "../../store/reducers/objectstore";
import {
  BsArrowLeftShort,
  BsArrowRightShort,
} from "react-icons/bs";
import { AttachmentSlide } from "./attachment-slide";
import { AttachmentUpload } from "./attachment-upload";
import { COMSObject } from "../../types/coms/object";


type Props = {
  complaintIdentifier: string;
  allowUpload?: boolean;
  allowDelete?: boolean;
};

export const AttachmentsCarousel: FC<Props> = ({
  complaintIdentifier,
  allowUpload,
  allowDelete,
}) => {
  const dispatch = useAppDispatch();
  const carouselData = useSelector(
    (state: RootState) => state.attachments.attachments
  );

  const SLIDE_WIDTH = 289; // width of the carousel slide, in pixels
  const [visibleSlides, setVisibleSlides] = useState<number>(4); // Adjust the initial number of visible slides as needed
  const carouselContainerRef = useRef<HTMLDivElement | null>(null); // ref to the carousel's container, used to determine how many slides can fit in the container


  const [slides, setSlides] = useState<COMSObject[]>([]);

  useEffect(() => {
    if (carouselData) {
      setSlides(carouselData);
    }
  },[carouselData])

  // get the attachments when the complaint loads
  useEffect(() => {
    dispatch(getAttachments(complaintIdentifier));
  }, [complaintIdentifier, dispatch]);

  //-- when the component unmounts clear the complaint from redux
  useEffect(() => {
    return () => {
      dispatch(setAttachments({}));
    };
  }, []);

  const onFileSelect = (newFile: File) => {
    const newSlide: COMSObject = {
      name: newFile.name,
      id: "",
      path: "",
      public: false,
      active: false,
      bucketId: "",
      createdBy: "",
      createdAt: new Date(),
      updatedBy: "",
      updatedAt: new Date()
    };
    setSlides([...slides, newSlide]);
  };


  useEffect(() => {

    const calcualteSlidesToDisplay = (containerWidth: number): number => {
      const SLIDE_WIDTH = 299; // width of a slide if 289, plus 10 for gap
      const slidesToDisplay = Math.floor(containerWidth / SLIDE_WIDTH);
      if (allowUpload) {
        return slidesToDisplay <= 1 ? 1 : slidesToDisplay - 1;
      } else {
        return slidesToDisplay <= 1 ? 1 : slidesToDisplay;
      }
    }

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
            <AttachmentUpload complaintIdentifier={complaintIdentifier} onFileSelect={onFileSelect}/>
          )}
          <Slider className="coms-slider">
            {slides?.map((item, index) => (
              <AttachmentSlide key={item.name} attachment={item} index={index} allowDelete={allowDelete} />
            ))}
          </Slider>
        </CarouselProvider>
      )}
    </div>
  );
};
