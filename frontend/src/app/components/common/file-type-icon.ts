export const getFileTypeIcon = (fileType: string | null | undefined): string => {
  switch (fileType) {
    case "Audio":
      return "bi-file-earmark-music";
    case "Document":
      return "bi-file-earmark-text";
    case "Photo":
      return "bi-file-earmark-image";
    case "Video":
      return "bi-file-earmark-play";
    default:
      return "bi-file-earmark";
  }
};
