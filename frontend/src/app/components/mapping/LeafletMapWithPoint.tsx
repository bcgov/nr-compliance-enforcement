import { FC, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { Icon } from "leaflet";
import markerIcon2x from "../../../assets/images/map/marker-icon-2x.png";

type Props = {
  coordinates?: { lat: number; lng: number };
  address?: string;
  community?: string;
  draggable: boolean;
};

/**
 * Renders a map with a marker at the supplied location 
 * 
*/
const LeafletMapWithPoint: FC<Props> = ({ coordinates, draggable }) => {

  // the derived lat long pair.
  // If a coordinate is supplied, then the latLng is set to the supplied coordinates.
  // If coordinates aren't supplied, then use the BC Geocoder to determine the latLng based on an address (if supplied), or
  // the community.  Every complaint will have a community, so theoretically, there will always be a latLng that can be derived.
  let latLng: { lat: number; lng: number };

  if (coordinates) {
    latLng = coordinates;
  } else {
    // handle other methods of determining coordinates
    // for now just return 0,0
    latLng = { lat: 0, lng: 0 };
  }

  // recenter the map when the center value is updated
  const Centerer = () => {
    const map = useMap();

    useEffect(() => {
      if (latLng) {
        map.setView(latLng);
      }
    }, [map]);

    return null;
  };

  return (
    <MapContainer
      id="map"
      center={latLng}
      zoom={10}
      style={{ height: "400px", width: "100%" }}
    >
      <Centerer />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        data-testid="complaint-location-marker"
        position={latLng}
        icon={
          new Icon({
            iconUrl: markerIcon2x,
            iconSize: [50, 77],
            iconAnchor: [25, 77],
          })
        }
        draggable={draggable}
      ></Marker>
    </MapContainer>
  );
};

export default LeafletMapWithPoint;
