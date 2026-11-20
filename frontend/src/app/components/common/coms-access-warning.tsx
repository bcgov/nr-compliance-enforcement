import { FC } from "react";
import notificationInvalid from "@assets/images/notification-invalid.png";

export const ComsAccessWarning: FC = () => (
  <div
    id="coms-access-warning"
    className="comp-complaint-error"
  >
    <img
      src={notificationInvalid}
      alt="error"
      className="filter-image-spacing"
    />{" "}
    Unable to connect to attachment storage, attachments may be unavailable. If this persists contact an administrator.
  </div>
);

export default ComsAccessWarning;
