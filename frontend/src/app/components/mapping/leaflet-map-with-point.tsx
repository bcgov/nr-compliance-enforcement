import { FC, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOMServer from "react-dom/server";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import Leaflet from "leaflet";

type Props = {
  coordinates?: { lat: number; lng: number };
  draggable: boolean;
};

/**
 * Renders a map with a marker at the supplied location
 *
 */
const LeafletMapWithPoint: FC<Props> = ({ coordinates, draggable }) => {
  // the derived lat long pair.
  // If a coordinate is supplied, then the latLng is set to the supplied coordinates.
  // If coordinates aren't supplied, then use the BC Geocoder to determine the latLng based on an address (if supplied), or
  // the community.  Every complaint will have a community, so theoretically, there will always be a latLng that can be derived.
  let latLng: { lat: number; lng: number };

  if (coordinates) {
    latLng = coordinates;
  } else {
    // handle other methods of determining coordinates
    // for now just return 0,0
    latLng = { lat: 0, lng: 0 };
  }

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
      if (latLng) {
        map.setView(latLng);
      }
    }, [map]);

    return null;
  };

  return (
    <MapContainer
      id="map"
      center={latLng}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
      className="map-container"
    >
      <Centerer />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        data-testid="complaint-location-marker"
        position={latLng}
        icon={customMarkerIcon}
        draggable={draggable}
      >
      </Marker>
    </MapContainer>
  );
};

export default LeafletMapWithPoint;
