import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, WMSTileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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
import Spiderfy from "./spiderfy";

interface MapProps {
  complaintType: string;
  handleMapMoved: (zoom: number, west: number, south: number, east: number, north: number) => void;
  loadingMapData: boolean;
  clusters: Array<any>;
  defaultClusterView: any;
  unmappedCount: number;
}

const LeafletMapWithServerSideClustering: React.FC<MapProps> = ({
  complaintType,
  loadingMapData,
  handleMapMoved,
  clusters,
  defaultClusterView,
  unmappedCount,
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

  const handlePopupOpen = (id: string) => {
    dispatch(getComplaintById(id, complaintType));
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    dispatch(setComplaint(null));
  };

  useEffect(() => {
    if (defaultClusterView) {
      if (clusters.length > 0) {
        // Calculate the bounds of all markers
        const bounds = Leaflet.latLngBounds(
          clusters.map(
            (marker) => [marker.geometry.coordinates[1], marker.geometry.coordinates[0]] as LatLngExpression,
          ),
        );

        // Fit the map to the bounds. Disable animation due to known Leaflet issue if map unmounts while animating: https://github.com/Leaflet/Leaflet/issues/9527
        mapRef?.current?.flyToBounds(bounds, { padding: [35, 35], animate: false });
      } else if (defaultClusterView.center && defaultClusterView.zoom) {
        mapRef?.current?.setView(defaultClusterView.center, defaultClusterView.zoom);
      }
    }
  }, [clusters, defaultClusterView]);

  const renderInformationBanner = () => {
    const isPluralized = unmappedCount === 1 ? "" : "s";

    const bannerType = unmappedCount >= 1 ? "unmapped" : "no-results";
    const info =
      unmappedCount >= 1
        ? `${unmappedCount} complaint${isPluralized} could not be mapped`
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

  const showInfoBar = unmappedCount >= 1 || !from(clusters).any();
  const parkLayerParams = useMemo(() => {
    return { format: "image/png", layers: "pub:WHSE_TANTALIS.TA_PARK_ECORES_PA_SVW", transparent: true };
  }, []);
  const reserveLayerParams = useMemo(() => {
    return { format: "image/png", layers: "pub:WHSE_ADMIN_BOUNDARIES.ADM_INDIAN_RESERVES_BANDS_SP", transparent: true };
  }, []);

  return (
    <div className="comp-map-container">
      {showInfoBar && renderInformationBanner()}
      {loadingMapData && !loading && (
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
        center={[55.0, -125.0]}
        zoom={5}
        ref={mapRef}
      >
        <ServerSideClusteringHandler />
        <MapGestureHandler />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LayersControl position="topleft">
          <LayersControl.Overlay name="Provincial Parks, Ecological Reserves, and Protected Areas">
            <WMSTileLayer
              url="https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_PARK_ECORES_PA_SVW/ows"
              params={parkLayerParams}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="First Nations Reserves">
            <WMSTileLayer
              url="https://openmaps.gov.bc.ca/geo/pub/WHSE_ADMIN_BOUNDARIES.ADM_INDIAN_RESERVES_BANDS_SP/ows"
              params={reserveLayerParams}
            />
          </LayersControl.Overlay>
        </LayersControl>
        <Spiderfy
          handlePopupOpen={handlePopupOpen}
          handlePopupClose={handlePopupClose}
        >
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
                key={`marker-${cluster.id || clusterId}`}
                alt={`${clusterId}`} // alt is being used to store the complaint id for the Spiderfy handler
                riseOnHover
                position={[latitude, longitude]}
                icon={customMarkerIcon}
                eventHandlers={{
                  click: (event) => {
                    event.target.closePopup();
                  },
                }}
              >
                <ComplaintSummaryPopup
                  complaintType={complaintType}
                  complaint_identifier={clusterId}
                />
              </Marker>
            );
          })}
        </Spiderfy>
      </MapContainer>
    </div>
  );
};

export default LeafletMapWithServerSideClustering;
