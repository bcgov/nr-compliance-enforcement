import { FC, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOMServer from "react-dom/server";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import Leaflet from "leaflet";
import NonDismissibleAlert from "@components/common/non-dismissible-alert";
import { MapGestureHandler } from "./map-gesture-handler";
import { Card } from "react-bootstrap";

type Props = {
  coordinates?: { lat: number; lng: number };
  draggable: boolean;
  onMarkerMove?: (lat: number, lng: number) => void;
  hideMarker?: boolean;
};

/**
 * Renders a map with a marker at the supplied location
 *
 */
const LeafletMapWithPoint: FC<Props> = ({ coordinates, draggable, onMarkerMove, hideMarker }) => {
  const iconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} />);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  // update the marker poisition when the coordinates are updated (occurs when geocoded).
  // but don't update them if the marker position has already been set manually
  useEffect(() => {
    if (coordinates) {
      setMarkerPosition(coordinates);
    }
  }, [coordinates]);

  const handleMarkerDragEnd = (e: L.LeafletEvent) => {
    const marker = e.target;
    if (marker?.getLatLng) {
      const newPosition = marker.getLatLng();

      if (onMarkerMove) {
        onMarkerMove(newPosition.lat, newPosition.lng);
      }
    }
  };

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
      if (markerPosition) {
        map.setView(markerPosition);
      }
    }, [map]);

    return null;
  };

  return (
    <Card className="comp-map-container">
      {hideMarker && <NonDismissibleAlert />}

      <MapContainer
        id="map"
        center={markerPosition}
        zoom={12}
        style={{ height: "400px", width: "100%" }}
        className="map-container"
      >
        <MapGestureHandler />
        <Centerer />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {!hideMarker && (
          <Marker
            data-testid="complaint-location-marker"
            position={markerPosition}
            icon={customMarkerIcon}
            draggable={draggable}
            eventHandlers={{ dragend: handleMarkerDragEnd }}
          ></Marker>
        )}
      </MapContainer>
    </Card>
  );
};

export default LeafletMapWithPoint;
