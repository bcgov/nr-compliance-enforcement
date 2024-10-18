import React, { useEffect, useRef, useState } from "react";
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
import { getComplaintById, setComplaint } from "../../store/reducers/complaints";
import { isEqual } from "lodash";
import { BsInfoCircleFill } from "react-icons/bs";
import { ComplaintMapItem } from "../../types/app/complaints/complaint-map-item";
import { from } from "linq-to-typescript";
import { MapGestureHandler } from "./map-gesture-handler";
import { Alert } from "react-bootstrap";

interface MapProps {
  complaintType: string;
  markers: Array<ComplaintMapItem>;
  unmappedComplaints: number;
}

const LeafletMapWithMultiplePoints: React.FC<MapProps> = ({ complaintType, markers, unmappedComplaints }) => {
  const iconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} />);
  const mapRef = useRef<Map | null>(null);
  const [markersState, setMarkersState] = useState<Array<ComplaintMapItem>>(markers);

  useEffect(() => {
    if (mapRef.current && markersState.length > 0) {
      // Calculate the bounds of all markers
      const bounds = Leaflet.latLngBounds(
        markersState.map((marker) => [marker.latitude, marker.longitude] as LatLngExpression),
      );

      // Fit the map to the bounds
      mapRef.current.fitBounds(bounds, { padding: [35, 35] });
    }
  }, [markersState]);

  // redux will update the location store when the complaint details are retrieved.  We don't want this to trigger
  // a re-render of the map to fit the markers on screen.  So, let's compare the new markers against the marker state.
  // If they're the same, don't re-center the map and don't zoom out.
  useEffect(() => {
    if (!isEqual(markersState, markers)) {
      setMarkersState(markers);
    }
  }, [markers, markersState]);

  const customMarkerIcon = new Leaflet.DivIcon({
    html: iconHTML,
    className: "map-marker",
    iconSize: [40, 0], // Adjust icon size as needed
    iconAnchor: [20, 40], // Adjust icon anchor point
  });

  const dispatch = useAppDispatch();

  const handlePopupOpen = (id: string) => (e: L.PopupEvent) => {
    dispatch(getComplaintById(id, complaintType));
  };

  const handlePopupClose = (e: L.LeafletEvent) => {
    dispatch(setComplaint(null));
  };

  const renderInformationBanner = () => {
    const showBar = () => {
      if (unmappedComplaints >= 1) {
        return true;
      } else if (!from(markers).any()) {
        return true;
      } else {
        return false;
      }
    };

    const isPluralized = unmappedComplaints === 1 ? "" : "s";

    if (showBar()) {
      const bannerType = unmappedComplaints >= 1 ? "unmapped" : "no-results";
      const info =
        unmappedComplaints >= 1
          ? `${unmappedComplaints} complaint${isPluralized} could not be mapped`
          : "No complaints found using your current filters. Remove or change your filters to see complaints.";

      return (
        <Alert
          variant="warning"
          className="comp-complaint-details-alert"
          id={`complaint-${bannerType}-notification`}
        >
          <i className="bi bi-info-circle-fill"></i>
          <span>{info}</span>
        </Alert>
      );
    }

    return <></>;
  };

  return (
    <div className="comp-map-container">
      {renderInformationBanner()}
      <MapContainer
        id="multi-point-map"
        className="map-container"
        center={[53.7267, -127.6476]}
        zoom={6}
        ref={mapRef}
      >
        <MapGestureHandler />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup>
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
              icon={customMarkerIcon}
              eventHandlers={{
                popupopen: handlePopupOpen(marker.id),
                popupclose: handlePopupClose,
              }}
            >
              <ComplaintSummaryPopup
                complaintType={complaintType}
                complaint_identifier={marker.id}
              />
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default LeafletMapWithMultiplePoints;
