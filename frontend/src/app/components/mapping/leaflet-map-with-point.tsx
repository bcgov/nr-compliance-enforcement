import { FC, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, useMap, LayersControl, WMSTileLayer, Popup, Pane } from "react-leaflet";
import { BasemapLayer } from "react-esri-leaflet";
import VectorTileLayer from "react-esri-leaflet/plugins/VectorTileLayer";
import "leaflet/dist/leaflet.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-leaflet-markercluster/styles";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOMServer from "react-dom/server";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import Leaflet from "leaflet";
import NonDismissibleAlert from "@components/common/non-dismissible-alert";
import { MapGestureHandler } from "./map-gesture-handler";
import { Alert, Card } from "react-bootstrap";
import { MapElement, MapObjectType } from "@/app/types/maps/map-element";
import { nanoid } from "nanoid";

type Props = {
  coordinates?: { lat: number; lng: number };
  draggable: boolean;
  onMarkerMove?: (lat: number, lng: number) => void;
  mapElements: MapElement[];
  geocodedLocation?: { lat: number; lng: number };
  defaultZoom?: number;
};

/**
 * Renders a map with a marker at the supplied location
 *
 */
const LeafletMapWithPoint: FC<Props> = ({ draggable, onMarkerMove, mapElements, geocodedLocation, defaultZoom = 12 }) => {
  const iconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} />);
  const [mapCenterPosition, setMapCenterPosition] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  // update the marker poisition when the coordinates are updated (occurs when geocoded).
  // but don't update them if the marker position has already been set manually
  useEffect(() => {
    let mapElement = mapElements.find((item) => item.objectType === MapObjectType.Complaint || item.objectType === MapObjectType.Investigation || item.objectType === MapObjectType.Inspection);
    const mapElementLocation = mapElement?.location;
    if (mapElementLocation && areCoordinatesValid(mapElementLocation)) {
      setMapCenterPosition(mapElementLocation);
    } else if (geocodedLocation && areCoordinatesValid(geocodedLocation)) {
      setMapCenterPosition(geocodedLocation);
    }
  }, [mapElements, geocodedLocation]);

  const handleMarkerDragEnd = (e: L.LeafletEvent) => {
    const marker = e.target;
    if (marker?.getLatLng) {
      const newPosition = marker.getLatLng();

      if (onMarkerMove) {
        onMarkerMove(newPosition.lat, newPosition.lng);
      }
    }
  };

  const getMarkerIcon = (mapElementType: MapObjectType, isActive: boolean) => {
    let cssClass = "map-marker";
    if (mapElementType === MapObjectType.Equipment) {
      if (isActive) {
        cssClass = "map-marker-equipment-active";
      } else {
        cssClass = "map-marker-equipment-inactive";
      }
    }
    return new Leaflet.DivIcon({
      html: iconHTML,
      className: cssClass,
      iconSize: [40, 0],
      iconAnchor: [20, 40],
    });
  };

  const areCoordinatesValid = (location: { lat: number; lng: number } | undefined): boolean => {
    if (location?.lat && location?.lng && +location.lat !== 0 && +location.lng !== 0) {
      return true;
    } else {
      return false;
    }
  };

  // recenter the map when the center value is updated
  const Centerer = () => {
    const map = useMap();
    useEffect(() => {
      if (areCoordinatesValid(mapCenterPosition)) {
        if (mapElements.some((item) => item.objectType === MapObjectType.Equipment)) {
          const bounds: Leaflet.LatLngBoundsExpression | null = getMapBounds();
          if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
          } else {
            map.setView(mapCenterPosition);
          }
        } else {
          map.setView(mapCenterPosition);
        }
      }
    }, [map]);
    return null;
  };

  const getMapBounds = (): Leaflet.LatLngBoundsExpression | null => {
    const validMapElements = mapElements.filter((item) => ![item.location.lat, item.location.lng].includes(0));
    const lats = validMapElements.map((item) => item.location.lat);
    const lngs = validMapElements.map((item) => item.location.lng);
    let bounds: Leaflet.LatLngBoundsExpression | null = null;
    if (lats.length > 0 && lngs.length > 0) {
      bounds = [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ];
    }
    return bounds;
  };

  const parkLayerParams = useMemo(() => {
    return { format: "image/png", layers: "pub:WHSE_TANTALIS.TA_PARK_ECORES_PA_SVW", transparent: true };
  }, []);
  const reserveLayerParams = useMemo(() => {
    return { format: "image/png", layers: "pub:WHSE_ADMIN_BOUNDARIES.ADM_INDIAN_RESERVES_BANDS_SP", transparent: true };
  }, []);

  const getEquipmentStatus = (locationItem: MapElement): string => {
    if (
      locationItem.objectType === MapObjectType.Complaint ||
      locationItem.objectType === MapObjectType.Investigation ||
      locationItem.objectType === MapObjectType.Inspection ||
      (locationItem.objectType === MapObjectType.Equipment && ["Less lethal", "K9 unit"].includes(locationItem.name))
    ) {
      return "";
    } else {
      return locationItem.isActive ? "Active" : "Inactive";
    }
  };

  const unmappedEquipment = useMemo(() => {
    const countUnmapped = mapElements.filter((item) => {
      return item.objectType === MapObjectType.Equipment && item.location.lat === 0 && item.location.lng === 0;
    }).length;
    return countUnmapped;
  }, [mapElements]);

  const unmappedInvestigation = useMemo(() => {
    const countUnmapped = mapElements.filter((item) => {
      return item.objectType === MapObjectType.Investigation && item.location.lat === 0 && item.location.lng === 0;
    }).length;
    return countUnmapped;
  }, [mapElements]);

  const unmappedInspection = useMemo(() => {
    const countUnmapped = mapElements.filter((item) => {
      return item.objectType === MapObjectType.Inspection && item.location.lat === 0 && item.location.lng === 0;
    }).length;
    return countUnmapped;
  }, [mapElements]);

  return (
    <Card className="comp-map-container">
      {geocodedLocation && areCoordinatesValid(geocodedLocation) && <NonDismissibleAlert />}
      {unmappedEquipment > 0 && (
        <Alert
          variant="warning"
          className="comp-complaint-details-alert"
          id={`equipment-map-notification`}
        >
          <i className="bi bi-info-circle-fill"></i>
          <span>{unmappedEquipment} equipment could not be mapped.</span>
        </Alert>
      )}
      {unmappedInvestigation > 0 && (
        <Alert
          variant="warning"
          className="comp-complaint-details-alert"
          id={`investigation-map-notification`}
        >
          <i className="bi bi-info-circle-fill"></i>
          <span>{unmappedInvestigation} related investigation could not be mapped.</span>
        </Alert>
      )}
      {unmappedInspection > 0 && (
        <Alert
          variant="warning"
          className="comp-complaint-details-alert"
          id={`inspection-map-notification`}
        >
          <i className="bi bi-info-circle-fill"></i>
          <span>{unmappedInspection} related inspection could not be mapped.</span>
        </Alert>
      )}

      <MapContainer
        id="map"
        center={mapCenterPosition}
        zoom={defaultZoom}
        maxZoom={18}
        style={{ height: "400px", width: "100%" }}
        className="map-container markercluster-map"
      >
        <MapGestureHandler />
        <Centerer />
        <LayersControl position="topleft">
          <LayersControl.BaseLayer
            name="Default"
            checked
          >
            <VectorTileLayer url="bbe05270d3a642f5b62203d6c454f457" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Topographic">
            <BasemapLayer name="Topographic" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <BasemapLayer name="Imagery" />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="Provincial Parks, Ecological Reserves, and Protected Areas">
            <Pane
              name="parks"
              style={{ zIndex: 499 }}
            >
              <WMSTileLayer
                url="https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_PARK_ECORES_PA_SVW/ows"
                params={parkLayerParams}
                zIndex={1000}
              />
            </Pane>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="First Nations Reserves">
            <Pane
              name="reserves"
              style={{ zIndex: 499 }}
            >
              <WMSTileLayer
                url="https://openmaps.gov.bc.ca/geo/pub/WHSE_ADMIN_BOUNDARIES.ADM_INDIAN_RESERVES_BANDS_SP/ows"
                params={reserveLayerParams}
                zIndex={1000}
              />
            </Pane>
          </LayersControl.Overlay>
        </LayersControl>
        <MarkerClusterGroup key={nanoid()}>
          {mapElements
            .filter((item) => ![item.location.lat, item.location.lng].includes(0))
            .map((item) => {
              return (
                <Marker
                  key={nanoid()}
                  data-testid="complaint-location-marker"
                  position={item.location}
                  icon={getMarkerIcon(item.objectType, item.isActive)}
                  draggable={draggable}
                  eventHandlers={{ dragend: handleMarkerDragEnd }}
                >
                  <Popup>
                    <p className="leaflet-popup-object-description">{item.name} coordinates</p>
                    <p className="leaflet-popup-object-coordinates">
                      {item.location.lat} , {item.location.lng}
                    </p>
                    <p className="leaflet-popup-object-description">{getEquipmentStatus(item)}</p>
                  </Popup>
                </Marker>
              );
            })}
        </MarkerClusterGroup>
      </MapContainer>
    </Card>
  );
};

export default LeafletMapWithPoint;
