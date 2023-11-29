import { FC } from "react";
import { Slide } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { useAppDispatch } from "../../hooks/hooks";
import { generateApiParameters, get } from "../../common/api";
import { formatDateTime } from "../../common/methods";
import { BsCloudDownload, BsTrash } from "react-icons/bs";
import { COMSObject } from "../../types/coms/object";
import config from "../../../config";
import AttachmentIcon from "./attachment-icon";

type Props = {
  index: number;
  attachment: COMSObject;
  allowDelete?: boolean;
};

export const AttachmentSlide: FC<Props> = ({
  index,
  attachment,
  allowDelete,
}) => {
  const dispatch = useAppDispatch();

  // download attachment
  const handleAttachmentClick = async (objectid: string, filename: string) => {
    const parameters = generateApiParameters(
      `${config.COMS_URL}/object/${objectid}?download=url`
    );

    const response = await get<string>(dispatch, parameters);

    // Create an anchor element to trigger the download.  Note that the href is a pre-signed URL valid for 7 days (this is a COMS/Objectstore feature)
    const a = document.createElement("a");

    a.href = response;
    a.download = filename; // Set the download filename
    a.target = "_blank";
    a.click();
  };

  return (
    <Slide index={index} key={index}>
      <div className="coms-carousel-slide">
        <div className="coms-carousel-actions">
          {allowDelete && <BsTrash className="delete-icon" tabIndex={index} />}
          <BsCloudDownload
            tabIndex={index}
            className="download-icon"
            onClick={() =>
              handleAttachmentClick(`${attachment.id}`, `${attachment.name}`)
            }
          />
        </div>
        <div className="top-section">
        <AttachmentIcon filename={attachment.name}/>
        </div>
        <div className="bottom-section">
          <div className="slide_text slide_file_name">{attachment.name}</div>
          <div className="slide_text">
            {formatDateTime(attachment.createdAt.toString())}
          </div>
        </div>
      </div>
    </Slide>
  );
};
