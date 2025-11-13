import { FC } from "react";
import LeafletMapWithPoint from "@components/mapping/leaflet-map-with-point";
import { MapElement, MapObjectType } from "@/app/types/maps/map-element";


type Props = {
  map_object_type: MapObjectType;
  locationCoordinates?: { lat: number; lng: number };
  draggable: boolean;
  onMarkerMove?: (lat: number, lng: number) => void;
};

export const MapObjectLocation: FC<Props> = ({
  map_object_type,
  locationCoordinates,
  draggable,
  onMarkerMove,
}) => {
  const mapElements: MapElement[] = [];
  const name = `${map_object_type} location`;
  const description = `${map_object_type} location`;
  const map_section_title = `${map_object_type} location`;

  if (locationCoordinates?.lat && locationCoordinates?.lng) {
    mapElements.push({
      objectType: map_object_type,
      name: name,
      description: description,
      isActive: true,
      location: {
        lat: locationCoordinates.lat,
        lng: locationCoordinates.lng,
      },
    });
  }

  return (
    <section className={"comp-details-section"}>
      <h3>{map_section_title}</h3>
      <LeafletMapWithPoint
        mapElements={mapElements}
        draggable={draggable}
        onMarkerMove={onMarkerMove}
      />
    </section>
  );
};
