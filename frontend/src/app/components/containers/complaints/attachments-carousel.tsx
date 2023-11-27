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
import { getAttachments } from "../../../store/reducers/objectstore";
import { generateApiParameters, get } from "../../../common/api";
import { formatDateTime } from "../../../common/methods";
import { BsImageFill, BsCloudDownload } from "react-icons/bs";

type Props = {
  complaintIdentifier: string;
};

export const AttachmentsCarousel: FC<Props> = ({ complaintIdentifier }) => {
  const dispatch = useAppDispatch();
  const carouselData = useSelector(
    (state: RootState) => state.attachments.attachments
  );

  useEffect(() => {
    dispatch(getAttachments(complaintIdentifier));
  }, [complaintIdentifier, dispatch]);

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
      <h6>Attachments</h6>
      <br />
      <CarouselProvider
        naturalSlideWidth={289}
        naturalSlideHeight={200}
        isIntrinsicHeight={true}
        totalSlides={carouselData ? carouselData.length : 0}
        visibleSlides={7}
        className="coms-carousel"
      >
        <Slider>
          {carouselData?.map((item, index) => (
            <Slide index={index} key={index}>
              <div className="coms-carousel-slide">
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
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
      </CarouselProvider>
      <br />
    </div>
  );
};
