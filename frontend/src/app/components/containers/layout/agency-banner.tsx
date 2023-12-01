import { FC } from "react";
import { useAppSelector } from "../../../hooks/hooks";
import { selectOfficerAgency } from "../../../store/reducers/app";
import agencyIcons from "../../../../assets/images/icons";
import { selectCodeTable } from "../../../store/reducers/code-table";

export const AgencyBanner: FC = () => {
  const defaultAgencyCode = "COS";
  const defaultDescription = "Conservation Officer Service";

  const agencies = useAppSelector(selectCodeTable("agency"));
  const agency = useAppSelector(selectOfficerAgency);

  const selected = agencies.find((item) => item.agency === agency) || {
    agency: defaultAgencyCode,
    shortDescription: defaultDescription,
    longDescription: defaultDescription,
  };
  const { longDescription: name, agency: code } = selected;

  const agencyNameStyle =
    name.length > 28
      ? "comp-organization-nav-long-name"
      : "comp-organization-nav-name";
  return (
    <span className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none comp-organization-nav-item">
      <img
        className="comp-organization-nav-logo"
        src={agencyIcons[code]}
        alt="logo"
      />
      <span className={agencyNameStyle}>{name}</span>
    </span>
  );
};
