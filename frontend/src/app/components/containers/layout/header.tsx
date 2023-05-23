import { FC } from "react";

import logo from "../../../../assets/images/branding/CE-Temp-Logo.svg";

export const Header: FC = () => {
  return (
    <div className="comp-header">
      <div className="comp-header-logo">
        <div className="comp-logo-src">
          <img src={logo} alt="logo" />
        </div>
      </div>
      <div className="comp-header-content">
        <div className="comp-left-content"></div>
        <div className="comp-right-contnet"></div>
      </div>
    </div>
  );
};
