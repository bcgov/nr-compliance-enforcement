import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOMServer from "react-dom/server";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Leaflet, { LatLngExpression, Map } from "leaflet";
import { ComplaintSummaryPopup } from "./complaint-summary-popup";

interface MapProps {
  markers: {
    complaint_type: string;
    complaint_identifier: string;
    lat: number;
    lng: number;
  }[];
}

const LeafletMapWithMultiplePoints: React.FC<MapProps> = ({ markers }) => {
  const iconHTML = ReactDOMServer.renderToString(
    <FontAwesomeIcon icon={faMapMarkerAlt} />
  );
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      // Calculate the bounds of all markers
      const bounds = Leaflet.latLngBounds(
        markers.map((marker) => [marker.lat, marker.lng] as LatLngExpression)
      );

      // Fit the map to the bounds
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers]);this is where shit is changing

  const customMarkerIcon = new Leaflet.DivIcon({
    html: iconHTML,
    className: "map-marker",
    iconSize: [40, 0], // Adjust icon size as needed
    iconAnchor: [20, 40], // Adjust icon anchor point
  });

  return (
    <MapContainer
      style={{ height: "652px", width: "1330px", zIndex: 0 }}
      className="map-container"
      center={[53.7267, -127.6476]}
      zoom={6}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup chunkedLoading>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.lat, marker.lng]}
            icon={customMarkerIcon}
          >
            <Popup>
              <ComplaintSummaryPopup
                complaintType={marker.complaint_type}
                complaint_identifier={marker.complaint_identifier}
              />
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default LeafletMapWithMultiplePoints;
