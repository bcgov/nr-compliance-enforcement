import { FC, useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const INVESTIGATION_TAB_ITEMS = {
  summary: "Investigation summary",
  parties: "Parties",
  contraventions: "Contraventions",
  documents: "Evidence and documents",
  continuation: "Continuation report",
  admin: "Administration",
};

type InvestigationParams = {
  investigationGuid: string;
};

export const InvestigationTabs: FC = () => {
  const navigate = useNavigate();
  const { investigationGuid } = useParams<InvestigationParams>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("summary");

  // Determine active tab based on current URL
  useEffect(() => {
    const paths = location.pathname.split("/");
    const tabKey = paths.at(-1) ?? "";

    setActiveTab(tabKey === investigationGuid ? "summary" : tabKey);
  }, [location.pathname, investigationGuid]);

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);

    if (tabKey === "summary") {
      navigate(`/investigation/${investigationGuid}`);
    } else {
      navigate(`/investigation/${investigationGuid}/${tabKey}`);
    }
  };

  return (
    <Nav className="nav nav-pills investigation-nav-pills mb-3">
      {Object.entries(INVESTIGATION_TAB_ITEMS).map(([key, label]) => {
        return (
          <Nav.Item
            className={`nav-item`}
            key={`${key}-tab-item`}
          >
            <Nav.Link
              className={`nav-link me-4 investigation-nav-link ${key === activeTab ? "active" : "inactive"}`}
              id={key}
              onClick={() => handleTabClick(key)}
            >
              {label}
            </Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
};
