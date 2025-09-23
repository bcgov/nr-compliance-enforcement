import { FC } from "react";
import { Nav } from "react-bootstrap";

type props = {
  caseTab: string;
  caseTabItems: Array<string>;
  onTabChange: Function;
};

export const CaseTabs: FC<props> = ({ caseTab, caseTabItems, onTabChange }) => {
  return (
    <Nav className="nav nav-tabs case-nav-tabs">
      {caseTabItems.map((item) => {
        return (
          <Nav.Item
            className={`nav-item case-tab case-tab-${item === caseTab ? "active" : "inactive"}`}
            key={`${item}-tab-item`}
          >
            <Nav.Link
              className={`nav-link ${item === caseTab ? "active" : "inactive"}`}
              id={item}
              onClick={() => onTabChange(item)}
            >
              {item}
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
};
