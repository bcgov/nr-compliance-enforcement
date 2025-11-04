import { FC, useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const INSPECTION_TAB_ITEMS = {
  summary: "Inspection summary",
  parties: "Parties",
  admin: "Administration",
};

type InspectionParams = {
  inspectionGuid: string;
};

export const InspectionTabs: FC = () => {
  const navigate = useNavigate();
  const { inspectionGuid } = useParams<InspectionParams>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("summary");

  // Determine active tab based on current URL
  useEffect(() => {
    const paths = location.pathname.split("/");
    const tabKey = paths.at(-1) ?? "";

    setActiveTab(tabKey === inspectionGuid ? "summary" : tabKey);
  }, [location.pathname, inspectionGuid]);

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);

    if (tabKey === "summary") {
      navigate(`/inspection/${inspectionGuid}`);
    } else {
      navigate(`/inspection/${inspectionGuid}/${tabKey}`);
    }
  };

  return (
    <Nav className="nav nav-pills inspection-nav-pills mb-3">
      {Object.entries(INSPECTION_TAB_ITEMS).map(([key, label]) => {
        return (
          <Nav.Item
            className={`nav-item`}
            key={`${key}-tab-item`}
          >
            <Nav.Link
              className={`nav-link me-4 inspection-nav-link ${key === activeTab ? "active" : "inactive"}`}
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
