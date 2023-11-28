import { FC, useEffect } from "react";
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

  const handleImageClick = async (objectid: string, filename: string) => {
    const parameters = generateApiParameters(
      `${process.env.REACT_APP_COMS_URL}/object/${objectid}?download=url`
    );
    console.log(`${process.env.REACT_APP_COMS_URL}/object`);
    const response = await get<string>(dispatch, parameters);

    // Create an anchor element to trigger the download
    const a = document.createElement("a");

    a.href = response;
    a.download = filename; // Set the download filename
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="comp-complaint-details-block">
      <h6>Attachments ({carouselData?.length ? carouselData.length : 0})</h6>
      {carouselData && carouselData?.length > 0 && (
      <CarouselProvider
        naturalSlideWidth={SLIDE_WIDTH}
        naturalSlideHeight={200}
        totalSlides={carouselData ? carouselData.length : 0}
        visibleSlides={4}
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
                {allowDelete && <BsTrash className="delete-icon" />}
                <BsCloudDownload
                  className="download-icon"
                  onClick={() => handleImageClick(`${item.id}`, `${item.name}`)}
                />
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
