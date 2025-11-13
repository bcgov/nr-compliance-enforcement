import { FC, useEffect, useMemo, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Modal, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { MapContainer, Marker, useMapEvents, Tooltip, LayersControl, WMSTileLayer, Pane } from "react-leaflet";
import VectorTileLayer from "react-esri-leaflet/plugins/VectorTileLayer";
import { selectGeocodedComplaintCoordinates } from "@store/reducers/complaints";
import Leaflet from "leaflet";
import { Coordinates } from "@apptypes/app/coordinate-type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import "leaflet/dist/leaflet.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BasemapLayer } from "react-esri-leaflet";

const iconHTML = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faMapMarkerAlt} />);
const blueMarkerIcon = new Leaflet.DivIcon({
  html: iconHTML,
  className: "map-marker-equipment-select",
  iconSize: [40, 0],
  iconAnchor: [20, 40],
});

const redMarkerIcon = new Leaflet.DivIcon({
  html: iconHTML,
  className: "map-marker",
  iconSize: [40, 0],
  iconAnchor: [20, 40],
});

const ZOOM_LEVELS = {
  Continent: 2,
  Country: 4,
  Province: 6,
  Region: 8,
  City: 10,
  Neighborhood: 12,
  Street: 17,
};

type MapClickHandlerProps = {
  mode: "complaint" | "equipment" | "investigation";
  complaintCoords: [number, number] | null;
  tempCoordinates: [number, number] | null;
  equipmentType: string;
  setTempCoordinates: (coords: [number, number]) => void;
};

const MapClickHandler: FC<MapClickHandlerProps> = ({
  mode,
  complaintCoords,
  tempCoordinates,
  equipmentType,
  setTempCoordinates,
}) => {
  const getPinTitle = () => {
    switch (mode) {
      case "complaint":
        return "Complaint coordinates";
      case "equipment":
        return `${equipmentType} coordinates`;
      case "investigation":
        return "Investigation coordinates";
      default:
        return "Coordinates";
    }
  }
  useMapEvents({
    click(e) {
      setTempCoordinates([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <>
      {/* Complaint marker (red) */}
      {mode === "equipment" && complaintCoords && (
        <Marker
          position={[complaintCoords[1], complaintCoords[0]]}
          icon={redMarkerIcon}
        />
      )}
      {/* Equipment marker (blue), shown only if tempCoordinates exists */}
      {tempCoordinates && (
        <Marker
          position={tempCoordinates}
          icon={mode === "equipment" ? blueMarkerIcon : redMarkerIcon}
        >
          <Tooltip
            direction="top"
            offset={[0, -50]}
            opacity={1}
            permanent
          >
            <div>{getPinTitle()}</div>
            <div>
              {tempCoordinates[0]} , {tempCoordinates[1]}
            </div>
          </Tooltip>
        </Marker>
      )}
    </>
  );
};

type MapModalProps = {
  mode: "complaint" | "equipment";
  close: () => void;
  submit: () => void;
  complaintCoords: [number, number] | null;
  equipmentCoords: [number, number] | null;
  equipmentType: string;
  setXCoordinate: (xCoord: string) => void;
  setYCoordinate: (yCoord: string) => void;
  syncCoordinates: (lat: string, log: string) => void;
};

export const MapModal: FC<MapModalProps> = ({
  mode,
  close,
  submit,
  complaintCoords,
  equipmentCoords,
  equipmentType,
  setXCoordinate,
  setYCoordinate,
  syncCoordinates,
}) => {
  const modalData = useAppSelector(selectModalData);
  const { title } = modalData;

  const [mapCenterPosition, setMapCenterPosition] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });
  const geocodedComplaintCoordinates = useAppSelector(selectGeocodedComplaintCoordinates);
  const [tempCoordinates, setTempCoordinates] = useState<[number, number] | null>(null);

  let zoomLevel = ZOOM_LEVELS.Province;
  if (mode === "equipment") {
    zoomLevel = complaintCoords ? ZOOM_LEVELS.Street : ZOOM_LEVELS.Neighborhood;
  } else if (mode === "complaint") {
    if (equipmentCoords) {
      zoomLevel = ZOOM_LEVELS.Neighborhood;
    }
  }

  const parkLayerParams = useMemo(() => {
    return { format: "image/png", layers: "pub:WHSE_TANTALIS.TA_PARK_ECORES_PA_SVW", transparent: true };
  }, []);
  const reserveLayerParams = useMemo(() => {
    return { format: "image/png", layers: "pub:WHSE_ADMIN_BOUNDARIES.ADM_INDIAN_RESERVES_BANDS_SP", transparent: true };
  }, []);

  useEffect(() => {
    if (equipmentCoords) {
      setTempCoordinates(equipmentCoords);
    }
  }, [equipmentCoords]);

  useEffect(() => {
    if (mode === "equipment" || (mode === "complaint" && equipmentCoords)) {
      if (complaintCoords) {
        setMapCenterPosition({ lat: complaintCoords[1], lng: complaintCoords[0] });
      } else if (geocodedComplaintCoordinates?.features) {
        const lat =
          geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[Coordinates.Latitude] !== undefined
            ? geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[Coordinates.Latitude]
            : 0;
        const lng =
          geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[Coordinates.Longitude] !== undefined
            ? geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[Coordinates.Longitude]
            : 0;
        setMapCenterPosition({ lat: lat, lng: lng });
      }
    } else {
      setMapCenterPosition({ lat: 49.57, lng: -120.333 });
    }
  }, [complaintCoords]);

  // Save coordinates and close modal
  const handleSaveCoordinates = () => {
    if (tempCoordinates && tempCoordinates.length > 0) {
      if (mode === "equipment") {
        setYCoordinate(tempCoordinates[0].toString());
        setXCoordinate(tempCoordinates[1].toString());
      }
      syncCoordinates(tempCoordinates[0].toString(), tempCoordinates[1].toString());
    }
    submit();
  };

  return (
    <>
      <Modal.Header closeButton={true}>
        <Modal.Title as="h1">{`${title}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mapCenterPosition.lat !== 0 && mapCenterPosition.lng !== 0 && (
          <MapContainer
            center={mapCenterPosition} // Center on complaint coordinates
            zoom={zoomLevel}
            style={{ height: "50vh", width: "100%", cursor: "default" }}
          >
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
            <MapClickHandler
              mode={mode}
              complaintCoords={complaintCoords}
              tempCoordinates={tempCoordinates}
              equipmentType={equipmentType}
              setTempCoordinates={setTempCoordinates}
            />
          </MapContainer>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
        >
          Cancel
        </Button>
        <Button onClick={handleSaveCoordinates}>Save and close</Button>
      </Modal.Footer>
    </>
  );
};
