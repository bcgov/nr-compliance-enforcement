import { FC } from 'react'
import agencyIcons from '@/assets/icons'
//import { selectCodeTable } from "@store/reducers/code-table";
//import UserService from "@service/user-service";
//import { CODE_TABLE_TYPES } from "@constants/code-table-types";

type Props = {
  agency?: string
}

export const AgencyBanner: FC<Props> = ({ agency }) => {
  const defaultAgencyCode = 'COS'
  const defaultDescription = 'Conservation Officer Service'

  //const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));
  //const selectedAgency = agency || UserService.getUserAgency();

  //const selected = agencies.find((item) => item.agency === selectedAgency) || {
  const selected = {
    agency: defaultAgencyCode,
    shortDescription: defaultDescription,
    longDescription: defaultDescription,
  }

  const { longDescription: name, agency: code } = selected

  const agencyNameStyle =
    name.length > 28 ? 'organization-nav-long-name' : 'organization-nav-name'
  return (
    <span className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none organization-nav-item">
      <img
        id="agency-branding"
        className="organization-nav-logo"
        src={agencyIcons[code]}
        alt={`${agency}-branding`}
      />
      <span id="agency-name" className={agencyNameStyle}>
        {name}
      </span>
    </span>
  )
}
