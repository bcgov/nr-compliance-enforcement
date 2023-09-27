import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOMServer from "react-dom/server";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Leaflet, { LatLngExpression, Map } from "leaflet";
import { ComplaintSummaryPopup } from "./complaint-summary-popup";
import { useAppDispatch } from "../../hooks/hooks";
import {
  getAllegationComplaintByComplaintIdentifier,
  getWildlifeComplaintByComplaintIdentifier,
  setComplaint,
} from "../../store/reducers/complaints";
import COMPLAINT_TYPES from "../../types/app/complaint-types";

interface MapProps {
  complaint_type: string;
  markers: {
    complaint_identifier: string;
    lat: number;
    lng: number;
  }[];
}

const LeafletMapWithMultiplePoints: React.FC<MapProps> = ({
  complaint_type,
  markers,
}) => {
  const iconHTML = ReactDOMServer.renderToString(
    <FontAwesomeIcon icon={faMapMarkerAlt} />
  );
  const mapRef = useRef<Map | null>(null);
  const [markersState, setMarkersState] =
    useState<{ lat: number; lng: number }[]>(markers);

  useEffect(() => {
    if (mapRef.current && markersState.length > 0) {
      // Calculate the bounds of all markers
      const bounds = Leaflet.latLngBounds(
        markersState.map(
          (marker) => [marker.lat, marker.lng] as LatLngExpression
        )
      );

      // Fit the map to the bounds
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markersState]);

  useEffect(() => {
    if (markersState.length !== markers.length) setMarkersState(markers);
  }, [markers]);

  const customMarkerIcon = new Leaflet.DivIcon({
    html: iconHTML,
    className: "map-marker",
    iconSize: [40, 0], // Adjust icon size as needed
    iconAnchor: [20, 40], // Adjust icon anchor point
  });

  const dispatch = useAppDispatch();

  const handlePopupOpen =
    (complaint_identifier: string) => (e: L.PopupEvent) => {
      if (COMPLAINT_TYPES.HWCR === complaint_type) {
        dispatch(
          getWildlifeComplaintByComplaintIdentifier(complaint_identifier)
        );
      } else {
        dispatch(
          getAllegationComplaintByComplaintIdentifier(complaint_identifier)
        );
      }
    };

  // unmount complaint when popup closes
  const handlePopupClose = (e: L.LeafletEvent) => {
    dispatch(setComplaint(null));
  };

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
      <MarkerClusterGroup>
        {markers.map((marker) => (
          <Marker
            key={marker.complaint_identifier}
            position={[marker.lat, marker.lng]}
            icon={customMarkerIcon}
            eventHandlers={{
              popupopen: handlePopupOpen(marker.complaint_identifier),
              popupclose: handlePopupClose,
            }}
          >
            <ComplaintSummaryPopup
              complaintType={complaint_type}
              complaint_identifier={marker.complaint_identifier}
            />
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default LeafletMapWithMultiplePoints;
