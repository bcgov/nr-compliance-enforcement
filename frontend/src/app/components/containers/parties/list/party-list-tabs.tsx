import { PartyTypeCodes } from "@/app/constants/party-types";
import { FC } from "react";
import { Nav } from "react-bootstrap";

type Props = {
  partyTypeCode: string;
  onTabChange: (partyTypeCode: string) => void;
};

type NavigationTab = {
  id: string;
  code: string;
  name: string;
};

const TABS: Array<NavigationTab> = [
  { code: PartyTypeCodes.PERSON, name: "People", id: "people-tab" },
  { code: PartyTypeCodes.BUSINESS, name: "Businesses", id: "businesses-tab" },
];

export const PartyListTabs: FC<Props> = ({ partyTypeCode, onTabChange }) => {
  return (
    <Nav className="nav nav-tabs">
      {TABS.map(({ id, code, name }) => (
        <Nav.Item
          className={`nav-item comp-tab comp-tab-${partyTypeCode === code ? "active" : "inactive"}`}
          key={`${code}-tab-item`}
        >
          <Nav.Link
            className={`nav-link ${partyTypeCode === code ? "active" : "inactive"}`}
            id={id}
            onClick={() => onTabChange(code)}
          >
            {name}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};
