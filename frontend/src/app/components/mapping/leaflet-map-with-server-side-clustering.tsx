import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, LayerGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOMServer from "react-dom/server";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Leaflet, { LatLngExpression, Map } from "leaflet";
import { ComplaintSummaryPopup } from "./complaint-summary-popup";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { getComplaintById, setComplaint } from "@store/reducers/complaints";
import { from } from "linq-to-typescript";
import { MapGestureHandler } from "./map-gesture-handler";
import { Alert, Spinner } from "react-bootstrap";
import { isLoading } from "@store/reducers/app";

interface MapProps {
  complaintType: string;
  handleMapMoved: (zoom: number, west: number, south: number, east: number, north: number) => void;
  loadingMapData: boolean;
  clusters: Array<any>;
  defaultClusterView: any;
  unmappedComplaints: number;
}

const LeafletMapWithServerSideClustering: React.FC<MapProps> = ({
  complaintType,
  loadingMapData,
  handleMapMoved,
  clusters,
  defaultClusterView,
  unmappedComplaints,
}) => {
  const loading = useAppSelector(isLoading);

  const iconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} />);
  const mapRef = useRef<Map | null>(null);

  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  const customMarkerIcon = new Leaflet.DivIcon({
    html: iconHTML,
    className: "map-marker",
    iconSize: [40, 0], // Adjust icon size as needed
    iconAnchor: [20, 40], // Adjust icon anchor point
  });

  const dispatch = useAppDispatch();

  const handlePopupOpen = (id: string) => (e: L.PopupEvent) => {
    console.log("Popup opened for complaint id: ", id);
    dispatch(getComplaintById(id, complaintType));
    setPopupOpen(true);
  };

  const handlePopupClose = (e: L.LeafletEvent) => {
    dispatch(setComplaint(null));
    setPopupOpen(false);
    refreshMapData();
  };

  useEffect(() => {
    if (defaultClusterView) {
      if (mapRef.current && clusters.length > 0) {
        // Calculate the bounds of all markers
        const bounds = Leaflet.latLngBounds(
          clusters.map(
            (marker) => [marker.geometry.coordinates[1], marker.geometry.coordinates[0]] as LatLngExpression,
          ),
        );

        // Fit the map to the bounds
        mapRef.current.fitBounds(bounds, { padding: [35, 35] });
      }
    }
  }, [clusters, defaultClusterView]);

  const renderInformationBanner = () => {
    const isPluralized = unmappedComplaints === 1 ? "" : "s";

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
  };

  const refreshMapData = () => {
    console.log("Refreshing map data");
    const bounds = mapRef.current?.getBounds();
    if (bounds && mapRef?.current) {
      handleMapMoved(
        mapRef.current.getZoom(),
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      );
    }
  };

  const ServerSideClusteringHandler = () => {
    useMapEvents({
      moveend: () => {
        if (!popupOpen && !loading) {
          refreshMapData();
        }
      },
    });

    return null;
  };

  const showInfoBar = unmappedComplaints >= 1 || !from(clusters).any();

  return (
    <div className="comp-map-container">
      {showInfoBar && renderInformationBanner()}
      {loadingMapData && (
        <Spinner
          animation="border"
          role="loading"
          id="page-loader"
          style={{ position: "absolute", top: showInfoBar ? "75px" : "25px", right: "25px", zIndex: 1000 }}
        />
      )}
      <MapContainer
        id="multi-point-map"
        className="map-container"
        center={[53.7267, -127.6476]}
        zoom={4}
        ref={mapRef}
      >
        <ServerSideClusteringHandler />
        <MapGestureHandler />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LayerGroup>
          {clusters.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const {
              id: clusterId,
              cluster: isCluster,
              point_count: pointCount,
              point_count_abbreviated: pointCountAbbreviated,
              zoom: clusterZoom,
            } = cluster.properties;
            let size;
            if (pointCount < 5) {
              size = "small";
            } else if (pointCount < 50) {
              size = "medium";
            } else {
              size = "large";
            }

            if (!(cluster.id || clusterId)) {
              console.log(cluster);
            }

            const customClusterIcon = new Leaflet.DivIcon({
              html: `<div><span>${pointCountAbbreviated}</span></div>`,
              className: `marker-cluster marker-cluster-${size}`,
              iconSize: [40, 40],
            });

            return isCluster ? (
              <Marker
                key={`cluster-${cluster.id || clusterId}`}
                position={[latitude, longitude]}
                icon={customClusterIcon}
                eventHandlers={{
                  click: () => {
                    // If we are fully zoomed in, all of these clusters share the same coordinates
                    if (mapRef?.current?.getZoom() === 18) {
                      console.log("fully zoomed");
                      return;
                    }

                    // What even is this logic
                    const flyToZoom =
                      (clusterZoom && Math.min(clusterZoom, 18)) ||
                      Math.min(clusterZoom, Math.min((mapRef?.current?.getZoom() || 18) + 2, 18));

                    // If we're not fully zoomed in, zoom in to the cluster
                    mapRef.current?.flyTo([latitude, longitude], flyToZoom, {
                      duration: 0.5,
                      easeLinearity: 0.5,
                    });
                  },
                }}
              />
            ) : (
              <Marker
                key={`cluster-${cluster.id || clusterId}`}
                position={[latitude, longitude]}
                icon={customMarkerIcon}
                eventHandlers={{
                  popupopen: handlePopupOpen(clusterId),
                  popupclose: handlePopupClose,
                }}
              >
                <ComplaintSummaryPopup
                  complaintType={complaintType}
                  complaint_identifier={clusterId}
                  autoPan={true}
                />
              </Marker>
            );
          })}
        </LayerGroup>
      </MapContainer>
    </div>
  );
};

export default LeafletMapWithServerSideClustering;
