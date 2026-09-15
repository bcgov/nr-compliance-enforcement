import { FC } from "react";
import { Slide } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { COMSObject } from "@apptypes/coms/object";
import AttachmentIcon from "./attachment-icon";
import { Button } from "react-bootstrap";
import { formatDateObjectAsString, parseUTCTimestampToLocal } from "@/app/common/date-utils";
import { downloadAttachment, getDisplayFilename } from "@/app/common/attachment-utils";
import { useAppDispatch } from "@/app/hooks/hooks";
import { truncateFilenameString } from "@/app/common/methods";

type Props = {
  index: number;
  attachment: COMSObject;
  onFileRemove: (attachment: COMSObject) => void;
  showPreview: boolean;
  allowDelete?: boolean;
};

export const AttachmentSlide: FC<Props> = ({ index, attachment, allowDelete, onFileRemove, showPreview }) => {
  const dispatch = useAppDispatch();

  const getSlideClass = () => {
    let className = "";
    if (attachment.errorMesage) {
      className = "comp-attachment-slide-error";
    } else if (attachment.pendingUpload) {
      className = "comp-attachment-slide-pending";
    }
    return className;
  };

  const renderButtons = () => (
    <>
      {!attachment.pendingUpload && (
        <Button
          variant="light"
          className="icon-btn comp-slide-download-btn"
          tabIndex={index}
          onClick={() => downloadAttachment(dispatch, attachment)}
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
    </>
  );

  const content = (
    <div className={showPreview ? `comp-attachment-slide ${getSlideClass()}` : "attachment-header"}>
      {showPreview ? (
        <>
          <div className="comp-attachment-slide-actions">{renderButtons()}</div>
          <div className="comp-attachment-slide-top">
            <AttachmentIcon
              filename={attachment.name}
              imageIconString={attachment.imageIconString}
            />
          </div>
          <div className="comp-attachment-slide-bottom">
            <div
              className="comp-attachment-slide-name"
              title={getDisplayFilename(attachment.name)}
            >
              {truncateFilenameString(getDisplayFilename(attachment.name), 15)}
            </div>
            {attachment?.pendingUpload && attachment?.errorMesage ? (
              <div className="comp-attachment-slide-meta">{attachment?.errorMesage}</div>
            ) : (
              <div className="comp-attachment-slide-meta">
                {attachment?.pendingUpload
                  ? "Save to upload attachment(s)"
                  : formatDateObjectAsString(parseUTCTimestampToLocal(attachment.createdAt), { format: "dateTime" })}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <strong title={getDisplayFilename(attachment.name)}>
            {truncateFilenameString(getDisplayFilename(attachment.name), 15)}
          </strong>
          <div className="comp-carousel-files-buttons-no-preview">{renderButtons()}</div>
        </>
      )}
    </div>
  );

  return (
    <div>
      {showPreview ? (
        <Slide
          index={index}
          key={index}
        >
          {content}
        </Slide>
      ) : (
        <>
          {content}
          <hr className="mt-0 mb-0" />
        </>
      )}
    </div>
  );
};
