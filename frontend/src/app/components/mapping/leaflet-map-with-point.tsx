import { FC, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOMServer from "react-dom/server";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import Leaflet from "leaflet";

type Props = {
  coordinates: { lat: number; lng: number };
  draggable: boolean;
};

/**
 * Renders a map with a marker at the supplied location
 *
 */
const LeafletMapWithPoint: FC<Props> = ({ coordinates, draggable }) => {
  const iconHTML = ReactDOMServer.renderToString(
    <FontAwesomeIcon icon={faMapMarkerAlt} />
  );
  const customMarkerIcon = new Leaflet.DivIcon({
    html: iconHTML,
    className: "map-marker",
    iconSize: [40, 0], // Adjust icon size as needed
    iconAnchor: [20, 40], // Adjust icon anchor point
  });

  // recenter the map when the center value is updated
  const Centerer = () => {
    const map = useMap();

    useEffect(() => {
      if (coordinates) {
        map.setView(coordinates);
      }
    }, [map]);

    return null;
  };

  return (
    <MapContainer
      id="map"
      center={coordinates}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
      className="map-container"
    >
      <Centerer />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        data-testid="complaint-location-marker"
        position={coordinates}
        icon={customMarkerIcon}
        draggable={draggable}
      ></Marker>
    </MapContainer>
  );
};

export default LeafletMapWithPoint;
