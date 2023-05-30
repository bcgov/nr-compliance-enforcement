import React, { FC } from "react";

type OrganizationNavbarItemProps = {
  name: string;
  logo: any;
  url?: string;
};

export const OrganizationNavbarItem: FC<OrganizationNavbarItemProps> = ({
  name,
  logo,
  url,
}) => {
  return (
    <>
      <span className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none comp-organization-nav-item">
        <img
          className="comp-organization-nav-logo"
          src={logo}
          alt="logo"
          style={{ paddingRight: "12px" }}
        />
        <span
          style={{
            fontSize: "17px",
            lineHeight: "20px",
            letterSpacing: "-0.0064em",
            fontWeight: "700",
          }}
          className="comp-organization-nav-name"
        >
          {name}
        </span>
      </span>
    </>
  );
};
