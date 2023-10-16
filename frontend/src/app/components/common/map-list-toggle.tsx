import React from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faMap } from "@fortawesome/free-solid-svg-icons";

interface Props {
  activeView: "list" | "map";
  onToggle: (view: "list" | "map") => void;
  className?: string;
}

const MapListToggle: React.FC<Props> = ({
  activeView,
  onToggle,
  className,
}) => {
  return (
    <ToggleButtonGroup
      className={className}
      type="radio"
      name="viewToggle"
      id="map_list_toggle_id"
      value={activeView}
      defaultValue={"list"}
      onChange={(view) => onToggle(view as "list" | "map")}
    >
      <ToggleButton
        title="Complaint List View"
        value="list"
        id="list_toggle_id"
        className={`toggle-button ${activeView === "list" ? "active" : ""}`}
      >
        <FontAwesomeIcon icon={faList} />
      </ToggleButton>
      <ToggleButton
        title="Complaint Map View"
        value="map"
        id="map_toggle_id"
        className={`toggle-button ${activeView === "map" ? "active" : ""}`}
      >
        <FontAwesomeIcon icon={faMap} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default MapListToggle;
