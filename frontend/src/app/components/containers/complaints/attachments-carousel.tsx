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

type Props = {
  complaintIdentifier: string;
};

export const AttachmentsCarousel: FC<Props> = ({ complaintIdentifier }) => {
  const dispatch = useAppDispatch();
  const carouselData = useSelector(
    (state: RootState) => state.attachments.attachments
  );

  useEffect(() => {
    dispatch(getAttachments());
  }, [dispatch]);

  const handleImageClick = async (objectid: string, filename: string) => {
    
    const parameters = generateApiParameters(
        `${process.env.REACT_APP_COMS_URL}/object/${objectid}?download=url`
      );
      console.log(`${process.env.REACT_APP_COMS_URL}/object`);
      const response = await get<string>(dispatch, parameters);
      
    // Create an anchor element to trigger the download
    const a = document.createElement('a');
    
    a.href = response;
    a.download = filename; // Set the download filename
    a.target = '_blank';
    a.click();
  };

  return (
    <div className="comp-complaint-details-block">
      <h6>Attachments</h6>
      <CarouselProvider
        naturalSlideWidth={4}
        naturalSlideHeight={3}
        totalSlides={carouselData ? carouselData.length : 0}
        visibleSlides={4}
      >
        <Slider>
        {carouselData?.map((item, index) => (
          <Slide index={index} key={index}>
            <div className="carousel-item2">
                <p onClick={() => handleImageClick(`${item.id}`,`${item.name}`)}>{`${item.name}`}</p>
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
