import { FC } from "react";
import { Slide } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { useAppDispatch } from "@hooks/hooks";
import { generateApiParameters, get } from "@common/api";
import { formatDateTime } from "@common/methods";
import { COMSObject } from "@apptypes/coms/object";
import config from "@/config";
import AttachmentIcon from "./attachment-icon";
import { Button } from "react-bootstrap";

type Props = {
  index: number;
  attachment: COMSObject;
  onFileRemove: (attachment: COMSObject) => void;
  showPreview: boolean;
  allowDelete?: boolean;
};

export const AttachmentSlide: FC<Props> = ({ index, attachment, allowDelete, onFileRemove, showPreview }) => {
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
      className = "comp-attachment-slide-error";
    } else if (attachment.pendingUpload) {
      className = "comp-attachment-slide-pending";
    }

    return className;
  };

  return (
    <div>
      {showPreview ? (
        <Slide
          index={index}
          key={index}
        >
          <div className={`comp-attachment-slide ${getSlideClass()}`}>
            <div className="comp-attachment-slide-actions">
              {!attachment.pendingUpload && (
                <Button
                  variant="light"
                  className="icon-btn comp-slide-download-btn"
                  tabIndex={index}
                  onClick={() => handleAttachmentClick(`${attachment.id}`, `${attachment.name}`)}
                >
                  <i className="bi bi-cloud-arrow-down"></i>
                </Button>
              )}
              {allowDelete && (
                <Button
                  variant="light"
                  className="icon-btn"
                  tabIndex={index}
                  onClick={() => onFileRemove(attachment)}
                >
                  <i className="bi bi-trash3"></i>
                </Button>
              )}
            </div>
            <div className="comp-attachment-slide-top">
              <AttachmentIcon
                filename={attachment.name}
                imageIconString={attachment.imageIconString}
              />
            </div>
            <div className="comp-attachment-slide-bottom">
              <div className="comp-attachment-slide-name">{decodeURIComponent(attachment.name)}</div>
              {attachment?.pendingUpload && attachment?.errorMesage ? (
                <div className="comp-attachment-slide-meta">{attachment?.errorMesage}</div>
              ) : (
                <div className="comp-attachment-slide-meta">
                  {attachment?.pendingUpload
                    ? "Save to upload attachment(s)"
                    : formatDateTime(attachment.createdAt?.toString())}
                </div>
              )}
            </div>
          </div>
        </Slide>
      ) : (
        <div>
          <div className="comp-carousel-files-no-preview">
            <strong>{decodeURIComponent(attachment.name)}</strong>
            <div className="comp-carousel-files-buttons-no-preview">
              {!attachment.pendingUpload && (
                <Button
                  variant="light"
                  className="icon-btn comp-slide-download-btn"
                  tabIndex={index}
                  onClick={() => handleAttachmentClick(`${attachment.id}`, `${attachment.name}`)}
                >
                  <i className="bi bi-cloud-arrow-down"></i>
                </Button>
              )}
              {allowDelete && (
                <Button
                  variant="light"
                  className="icon-btn"
                  tabIndex={index}
                  onClick={() => onFileRemove(attachment)}
                >
                  <i className="bi bi-trash3"></i>
                </Button>
              )}
            </div>
          </div>
          <hr className="mt-0 mb-0" />
        </div>
      )}
    </div>
  );
};
