import { FC, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, LayersControl, WMSTileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "react-leaflet-markercluster/styles";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOMServer from "react-dom/server";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import Leaflet from "leaflet";
import NonDismissibleAlert from "@components/common/non-dismissible-alert";
import { MapGestureHandler } from "./map-gesture-handler";
import { Card } from "react-bootstrap";
import { MapElement, MapObjectType } from "@/app/types/maps/map-element";

type Props = {
  coordinates?: { lat: number; lng: number };
  draggable: boolean;
  onMarkerMove?: (lat: number, lng: number) => void;
  mapElements: MapElement[];
  geocodedLocation?: { lat: number; lng: number };
};

/**
 * Renders a map with a marker at the supplied location
 *
 */
const LeafletMapWithPoint: FC<Props> = ({ draggable, onMarkerMove, mapElements, geocodedLocation }) => {
  const iconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} />);
  const [mapCenterPosition, setMapCenterPosition] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  // update the marker poisition when the coordinates are updated (occurs when geocoded).
  // but don't update them if the marker position has already been set manually
  useEffect(() => {
    let complaintMapElement = mapElements.find((item) => item.objectType === MapObjectType.Complaint);
    const complaintLocation = complaintMapElement?.location;
    if (complaintLocation && areCoordinatesValid(complaintLocation)) {
      setMapCenterPosition(complaintLocation);
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
    if (location && location.lat && location.lng && +location.lat !== 0 && +location.lng !== 0) {
      return true;
    } else {
      return false;
    }
  };

  // recenter the map when the center value is updated
  const Centerer = () => {
    const map = useMap();

    useEffect(() => {
      if (mapCenterPosition) {
        map.setView(mapCenterPosition);
      }
    }, [map]);

    return null;
  };

  const parkLayerParams = useMemo(() => {
    return { format: "image/png", layers: "pub:WHSE_TANTALIS.TA_PARK_ECORES_PA_SVW", transparent: true };
  }, []);

  return (
    <Card className="comp-map-container">
      {geocodedLocation && areCoordinatesValid(geocodedLocation) && <NonDismissibleAlert />}

      <MapContainer
        id="map"
        center={mapCenterPosition}
        zoom={12}
        style={{ height: "400px", width: "100%" }}
        className="map-container markercluster-map"
      >
        <MapGestureHandler />
        <Centerer />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LayersControl position="topleft">
          <LayersControl.Overlay name="Provincial Parks, Ecological Reserves, and Protected Areas">
            <WMSTileLayer
              url="https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_PARK_ECORES_PA_SVW/ows"
              params={parkLayerParams}
            />
          </LayersControl.Overlay>
        </LayersControl>
        <MarkerClusterGroup>
          {mapElements.map((item, index) => {
            return (
              <Marker
                key={item.name}
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
                  <p className="leaflet-popup-object-description">
                    {item.objectType === MapObjectType.Complaint ? "" : item.isActive ? "Active" : "Inactive"}
                  </p>
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
