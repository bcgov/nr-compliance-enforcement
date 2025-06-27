import { FC } from "react";
import { useAppSelector } from "@hooks/hooks";
import agencyIcons from "@assets/images/icons";
import { selectCodeTable } from "@store/reducers/code-table";
import UserService from "@service/user-service";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { AgencyNames, AgencyType } from "@/app/types/app/agency-types";

type Props = {
  agency?: string;
};

export const AgencyBanner: FC<Props> = ({ agency }) => {
  const defaultAgencyCode = AgencyType.SECTOR;
  const defaultDescription = AgencyNames[AgencyType.SECTOR as keyof typeof AgencyNames].short;

  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));
  const selectedAgency = agency ?? UserService.getUserAgency();

  const selected = agencies.find((item) => item.agency === selectedAgency) ?? {
    agency: defaultAgencyCode,
    shortDescription: defaultDescription,
    longDescription: defaultDescription,
  };

  const { longDescription: name, agency: code } = selected;

  return (
    <span className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none comp-organization-nav-item">
      <img
        id="comp-agency-branding"
        className="comp-organization-nav-logo"
        src={agencyIcons[code]}
        alt={`${agency}-branding`}
      />
      <span
        id="comp-agency-name"
        className="comp-organization-nav-name"
      >
        {name}
      </span>
    </span>
  );
};
