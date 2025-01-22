import React from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faMap } from "@fortawesome/free-solid-svg-icons";

interface Props {
  activeView: "list" | "map";
  onToggle: (view: "list" | "map") => void;
  className?: string;
}

const MapListToggle: React.FC<Props> = ({ activeView, onToggle, className }) => {
  const setElementActive = (classPrefix: string, viewType: string): string => {
    const result = `${classPrefix} ` + (activeView === viewType ? "active" : "");
    return result;
  };

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
        title="Complaint list view"
        value="list"
        id="list_toggle_id"
        className={setElementActive("toggle-button", "list")}
      >
        <FontAwesomeIcon
          icon={faList}
          className={setElementActive("toggle-button-icon", "list")}
        />
        <span className={setElementActive("toggle-button-text", "list")}>List</span>
      </ToggleButton>
      <ToggleButton
        title="Complaint map view"
        value="map"
        id="map_toggle_id"
        className={setElementActive("toggle-button", "map")}
      >
        <FontAwesomeIcon
          icon={faMap}
          className={setElementActive("toggle-button-icon", "map")}
        />
        <span className={setElementActive("toggle-button-text", "map")}>Map</span>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default MapListToggle;
