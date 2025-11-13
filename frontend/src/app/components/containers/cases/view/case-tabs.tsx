import { FC, useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const CASE_TAB_ITEMS = {
  summary: "Summary",
  records: "Case Records",
  history: "Case History",
  map: "Map View",
};

type CaseParams = {
  id: string;
};

export const CaseTabs: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<CaseParams>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("summary");

  // Determine active tab based on current URL
  useEffect(() => {
    const paths = location.pathname.split("/");
    const tabKey = paths.at(-1) ?? "";

    setActiveTab(tabKey === id ? "summary" : tabKey);
  }, [location.pathname, id]);

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);

    if (tabKey === "summary") {
      navigate(`/case/${id}`);
    } else {
      navigate(`/case/${id}/${tabKey}`);
    }
  };

  return (
    <Nav className="nav nav-tabs case-nav-tabs px-4">
      {Object.entries(CASE_TAB_ITEMS).map(([key, label]) => {
        return (
          <Nav.Item
            className={`nav-item case-tab case-tab-${key === activeTab ? "active" : "inactive"}`}
            key={`${key}-tab-item`}
          >
            <Nav.Link
              className={`nav-link ${key === activeTab ? "active" : "inactive"}`}
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
