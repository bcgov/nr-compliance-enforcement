import { FC, useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Modal, Button } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import { selectGeocodedComplaintCoordinates } from "@store/reducers/complaints";
import Leaflet from "leaflet";
import { Coordinates } from "@apptypes/app/coordinate-type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

type MapModalProps = {
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

  useEffect(() => {
    if (equipmentCoords) {
      setTempCoordinates(equipmentCoords);
    }
  }, [equipmentCoords]);

  useEffect(() => {
    if (complaintCoords) {
      setMapCenterPosition({ lat: complaintCoords[1], lng: complaintCoords[0] });
    } else {
      if (geocodedComplaintCoordinates?.features) {
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
    }
  }, [complaintCoords]);

  // Save coordinates and close modal
  const handleSaveCoordinates = () => {
    if (tempCoordinates && tempCoordinates.length > 0) {
      setYCoordinate(tempCoordinates[0].toString());
      setXCoordinate(tempCoordinates[1].toString());
      syncCoordinates(tempCoordinates[0].toString(), tempCoordinates[1].toString());
    }
    submit();
  };

  const MapClickHandler: React.FC = () => {
    useMapEvents({
      click(e) {
        setTempCoordinates([e.latlng.lat, e.latlng.lng]);
      },
    });
    return (
      <>
        {/* Complaint marker (red) */}
        {complaintCoords && (
          <Marker
            position={[complaintCoords[1], complaintCoords[0]]}
            icon={redMarkerIcon}
          />
        )}
        {/* Equipment marker (blue), shown only if tempCoordinates exists */}
        {tempCoordinates && (
          <Marker
            position={tempCoordinates}
            icon={blueMarkerIcon}
          >
            <Popup>
              <p className="leaflet-popup-object-description">{equipmentType} coordinates</p>
              <p className="leaflet-popup-object-coordinates">
                {tempCoordinates[0]} , {tempCoordinates[1]}
              </p>
            </Popup>
          </Marker>
        )}
      </>
    );
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
            zoom={complaintCoords ? 17 : 12} //Zoom in more details if has complaint coords
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler />
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
