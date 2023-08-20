import { FC, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOMServer from "react-dom/server";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import Leaflet from "leaflet";
import { isWithinBC } from "../../common/methods";
import { getGeocodedFeatures } from "../../hooks/geocoder";

type Props = {
  coordinates?: { lat: number; lng: number };
  address?: string;
  community?: string;
  draggable: boolean;
};

/**
 * Renders a map with a marker at the supplied location
 *
 */
const LeafletMapWithPoint: FC<Props> = ({ coordinates, address, community, draggable }) => {
  // the derived lat long pair.
  // If a coordinate is supplied, then the latLng is set to the supplied coordinates.
  // If coordinates aren't supplied, then use the BC Geocoder to determine the latLng based on an address (if supplied), or
  // the community.  Every complaint will have a community, so theoretically, there will always be a latLng that can be derived.
  const [latLng, setLatLng] = useState({lat: 0, lng: 0});

  useEffect(() => {
    const fetchData = async () => {
      // determine the latitude and longitude based on coordinates, address information, or community (prioritized in that order)
      // If coordinates are not found, use the BC Geocoder to determine the latitude and longitude based on either the address or community
      if (coordinates && isWithinBC(coordinates)) {
        setLatLng(coordinates);
      } else if (address) {
        console.log(`coordinates not found, using address: ${address}`)
        const features = await getGeocodedFeatures(`${address}`, 10);
        const lat = features.features[0].geometry?.coordinates[1];
        const lng = features.features[0].geometry?.coordinates[0];
        console.log(`Latlng: ${lat} ${lng}`)
        setLatLng({lat: lat, lng: lng });
      } else if (community) {
        console.log(`coordinates not found, using area: ${community}`)
        const features = await getGeocodedFeatures(`${community}`, 10);
        const lat = features.features[0].geometry?.coordinates[1];
        const lng = features.features[0].geometry?.coordinates[0];
        console.log(`Latlng: ${lat} ${lng}`)
        setLatLng({lat: lat, lng: lng });
      }
    };
    fetchData();
  }, [address, community, coordinates]);

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
