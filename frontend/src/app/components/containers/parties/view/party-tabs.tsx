import { FC, useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const PARTY_TAB_ITEMS = {
  details: "Party details",
  history: "Party history",
};

type PartyTabParams = {
  id: string;
};

export const PartyTabs: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<PartyTabParams>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("details");

  useEffect(() => {
    const paths = location.pathname.split("/");
    const tabKey = paths.at(-1) ?? "";
    setActiveTab(tabKey === id ? "details" : tabKey);
  }, [location.pathname, id]);

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);
    if (tabKey === "details") {
      navigate(`/party/${id}`);
    } else {
      navigate(`/party/${id}/${tabKey}`);
    }
  };

  return (
    <Nav className="nav nav-tabs case-nav-tabs px-4">
      {Object.entries(PARTY_TAB_ITEMS).map(([key, label]) => (
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
      ))}
    </Nav>
  );
};
