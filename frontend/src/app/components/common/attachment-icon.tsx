import {
  BsImageFill,
  BsFillCameraVideoFill,
  BsFilePdfFill,
  BsFileEarmarkWordFill,
  BsFileEarmarkExcelFill,
  BsFileEarmarkZipFill,
  BsFileFill,
  BsFileMusicFill,
} from "react-icons/bs";

type Props = {
  filename: string;
};

// given a file name, display an icon
const AttachmentIcon: React.FC<Props> = ({ filename }) => {
  const getFileExtension = (filename: string) => {
    return filename
      .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
      .toLowerCase();
  };

  const extension = getFileExtension(filename);

  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "tif":
    case "tiff":
      return <BsImageFill />;
    case "mp4":
    case "asf":
    case "flv":
    case "webm":
    case "avi":
    case "mov":
      return <BsFillCameraVideoFill />;
    case "pdf":
      return <BsFilePdfFill />;
    case "doc":
    case "docx":
      return <BsFileEarmarkWordFill />;
    case "xls":
    case "xlsx":
      return <BsFileEarmarkExcelFill />;
    case "zip":
    case "rar":
    case "7z":
      return <BsFileEarmarkZipFill />;
    case "wav":
    case "mp3":
    case "midi":
    case "mpa":
    case "wam":
      return <BsFileMusicFill />;

    default:
      return <BsFileFill />;
  }
};

export default AttachmentIcon;
