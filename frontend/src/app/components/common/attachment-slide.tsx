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
  onFileRemove: (attachment: COMSObject) => void;
  allowDelete?: boolean;
};

export const AttachmentSlide: FC<Props> = ({ index, attachment, allowDelete, onFileRemove }) => {
  const dispatch = useAppDispatch();

  // download attachment
  const handleAttachmentClick = async (objectid: string, filename: string) => {
    const parameters = generateApiParameters(`${config.COMS_URL}/object/${objectid}?download=url`);

    const response = await get<string>(dispatch, parameters);

    // Create an anchor element to trigger the download.  Note that the href is a pre-signed URL valid for 7 days (this is a COMS/Objectstore feature)
    const a = document.createElement("a");

    a.href = response;
    a.download = filename; // Set the download filename
    a.target = "_blank";
    a.click();
  };

  const getSlideClass = () => {
    let className = "";

    if (attachment.errorMesage) {
      className = "error-slide";
    } else if (attachment.pendingUpload) {
      className = "pending-slide";
    }

    return className;
  };

  return (
    <Slide
      index={index}
      key={index}
    >
      <div className={`coms-carousel-slide ${getSlideClass()}`}>
        <div className="coms-carousel-actions">
          {!attachment.pendingUpload && (
            <BsCloudDownload
              tabIndex={index}
              className="download-icon"
              onClick={() => handleAttachmentClick(`${attachment.id}`, `${attachment.name}`)}
            />
          )}
          {allowDelete && (
            <BsTrash
              className="delete-icon"
              tabIndex={index}
              onClick={() => onFileRemove(attachment)}
            />
          )}
        </div>
        <div className="top-section">
          <AttachmentIcon
            filename={attachment.name}
            imageIconString={attachment.imageIconString}
          />
        </div>
        <div className="bottom-section">
          <div className="slide_text slide_file_name">{decodeURIComponent(attachment.name)}</div>
          {attachment?.pendingUpload && attachment?.errorMesage ? (
            <div>{attachment?.errorMesage}</div>
          ) : (
            <div className="slide_text">
              {attachment?.pendingUpload ? "Pending upload..." : formatDateTime(attachment.createdAt?.toString())}
            </div>
          )}
        </div>
      </div>
    </Slide>
  );
};
