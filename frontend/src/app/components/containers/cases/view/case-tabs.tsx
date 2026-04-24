import { FC, useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppSelector } from "@hooks/hooks";
import { isFeatureActive } from "@store/reducers/app";
import { FEATURE_TYPES } from "@constants/feature-flag-types";

const CASE_TAB_ITEMS = {
  summary: "Summary",
  records: "Case Records",
  history: "Case History",
  map: "Map View",
};

const LEGACY_TAB_KEYS = ["records", "map"];

type CaseParams = {
  id: string;
};

export const CaseTabs: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<CaseParams>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("summary");
  const showLegacy = useAppSelector(isFeatureActive(FEATURE_TYPES.LEGACY_CASE_VIEW));

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
      {Object.entries(CASE_TAB_ITEMS)
        .filter(([key]) => showLegacy || !LEGACY_TAB_KEYS.includes(key))
        .map(([key, label]) => {
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
