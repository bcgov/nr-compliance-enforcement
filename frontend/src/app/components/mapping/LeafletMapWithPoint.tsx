import { FC, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { Icon } from "leaflet";
import markerIcon2x from "../../../assets/images/map/marker-icon-2x.png";
import { Coordinates } from "../../types/app/coordinate-type";
import { parseDecimalDegreesCoordinates } from "../../common/methods";

type Props = {
  coordinates: number[] | string[] | undefined;
  draggable: boolean;
};

const LeafletMapWithPoint: FC<Props> = ({ coordinates, draggable }) => {
  const complaintPositionLatitude: number = parseDecimalDegreesCoordinates(
    coordinates,
    Coordinates.Latitude
  );
  const complaintPositionLongitude: number = parseDecimalDegreesCoordinates(
    coordinates,
    Coordinates.Longitude
  );

  const center = {
    lat: complaintPositionLatitude,
    lng: complaintPositionLongitude,
  };

  // recenter the map when the center value is updated
  const Centerer = () => {
    const map = useMap();

    useEffect(() => {
      map.setView(center);
    }, [map]);

    return null;
  };

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >
      <Centerer />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        position={center}
        icon={
          new Icon({
            iconUrl: markerIcon2x,
            iconSize: [50, 77],
            iconAnchor: [25, 77],
          })
        }
        draggable={draggable}
      >
        <Popup>
          {complaintPositionLatitude} {complaintPositionLongitude}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LeafletMapWithPoint;
