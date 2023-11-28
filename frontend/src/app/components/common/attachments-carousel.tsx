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
  BsPlus,
} from "react-icons/bs";
import { AttachmentSlide } from "./attachment-slide";

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


  useEffect(() => {
    // Function to update the number of visible slides based on the parent container width
    const updateVisibleSlides = () => {
      if (carouselContainerRef.current) {
        const containerWidth = carouselContainerRef.current.offsetWidth;
        // change the number of slides that appear in the carousel, depending on the container's width.
        // Also factor in that the edit screen contains a upload icon, so handle that case differently (e.g. display 1 less slide)
        if (allowUpload) {
          if (containerWidth < 950) {
            setVisibleSlides(1);
          } else if (containerWidth < 1250) {
            setVisibleSlides(2);
          } else {
            setVisibleSlides(3);
          }
        } else {
          if (containerWidth < 650) {
            setVisibleSlides(1);
          } else if (containerWidth < 1000) {
            setVisibleSlides(2);
          } else if (containerWidth < 1300) {
            setVisibleSlides(3);
          } else {
            setVisibleSlides(4);
          }
        }
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
      <h6>Attachments ({carouselData?.length ? carouselData.length : 0})</h6>
      {carouselData && carouselData?.length > 0 && (
        <CarouselProvider
          naturalSlideWidth={SLIDE_WIDTH}
          naturalSlideHeight={200}
          totalSlides={carouselData ? carouselData.length : 0}
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
            <div className="coms-carousel-upload-container">
              <div className="upload-icon">
                <BsPlus />
              </div>
              <div className="upload-text">Upload</div>
            </div>
          )}
          <Slider className="coms-slider">
            {carouselData?.map((item, index) => (
              <AttachmentSlide key={item.id} attachment={item} index={index} allowDelete={allowDelete}/>
            ))}
          </Slider>
        </CarouselProvider>
      )}
    </div>
  );
};
