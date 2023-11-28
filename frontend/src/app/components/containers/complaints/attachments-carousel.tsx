import { FC, useEffect, useState, useRef } from "react";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { useAppDispatch } from "../../../hooks/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  getAttachments,
  setAttachments,
} from "../../../store/reducers/objectstore";
import { generateApiParameters, get } from "../../../common/api";
import { formatDateTime } from "../../../common/methods";
import {
  BsImageFill,
  BsCloudDownload,
  BsTrash,
  BsArrowLeftShort,
  BsArrowRightShort,
  BsPlus,
} from "react-icons/bs";

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

  useEffect(() => {
    dispatch(getAttachments(complaintIdentifier));
  }, [complaintIdentifier, dispatch]);

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setAttachments({}));
    };
  }, []);

  const [visibleSlides, setVisibleSlides] = useState<number>(4); // Adjust the initial number of visible slides as needed
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);

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

  const handleImageClick = async (objectid: string, filename: string) => {
    const parameters = generateApiParameters(
      `${process.env.REACT_APP_COMS_URL}/object/${objectid}?download=url`
    );
    console.log(`${process.env.REACT_APP_COMS_URL}/object`);
    const response = await get<string>(dispatch, parameters);

    // Create an anchor element to trigger the download.  Note that the href is a pre-signed URL valid for 7 days (this is a COMS/Objectstore feature)
    const a = document.createElement("a");

    a.href = response;
    a.download = filename; // Set the download filename
    a.target = "_blank";
    a.click();
  };

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
              <Slide index={index} key={index}>
                <div className="coms-carousel-slide">
                  <div className="coms-carousel-actions">
                    {allowDelete && (
                      <BsTrash className="delete-icon" tabIndex={index} />
                    )}
                    <BsCloudDownload
                      tabIndex={index}
                      className="download-icon"
                      onClick={() =>
                        handleImageClick(`${item.id}`, `${item.name}`)
                      }
                    />
                  </div>
                  <div className="top-section">
                    <BsImageFill />
                  </div>
                  <div className="bottom-section">
                    <div className="line bold">{item.name}</div>
                    <div className="line">
                      {formatDateTime(item.createdAt.toString())}
                    </div>
                  </div>
                </div>
              </Slide>
            ))}
          </Slider>
        </CarouselProvider>
      )}
    </div>
  );
};
