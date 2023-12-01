import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faVideo,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileZipper,
  faFileAudio,
  faFile,
  faMap,
} from "@fortawesome/free-solid-svg-icons";

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
      return <FontAwesomeIcon icon={faImage} />;
    case "mp4":
    case "asf":
    case "flv":
    case "webm":
    case "avi":
    case "mov":
      return <FontAwesomeIcon icon={faVideo} />;
    case "pdf":
      return <FontAwesomeIcon icon={faFilePdf} />;
    case "doc":
    case "docx":
      return <FontAwesomeIcon icon={faFileWord} />;
    case "xls":
    case "xlsx":
      return <FontAwesomeIcon icon={faFileExcel} />;
    case "zip":
    case "rar":
    case "7z":
      return <FontAwesomeIcon icon={faFileZipper} />;
    case "wav":
    case "mp3":
    case "midi":
    case "mpa":
    case "wam":
      return <FontAwesomeIcon icon={faFileAudio} />;
    case "shp":
    case "dbf":
    case "shx":
    case "geojson":
    case "gml":
    case "kml":
    case "kmz":
    case "gpx":
    case "osm":
    case "dlg":
      return <FontAwesomeIcon icon={faMap} />;

    default:
      return <FontAwesomeIcon icon={faFile} />;
  }
};

export default AttachmentIcon;
