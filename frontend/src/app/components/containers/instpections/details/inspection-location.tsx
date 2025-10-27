import { FC } from "react";
import LeafletMapWithPoint from "@components/mapping/leaflet-map-with-point";
import { MapElement, MapObjectType } from "@/app/types/maps/map-element";

type Props = {
  locationCoordinates?: { lat: number; lng: number };
  draggable: boolean;
  onMarkerMove?: (lat: number, lng: number) => void;
};

export const InspectionLocation: FC<Props> = ({
  locationCoordinates,
  draggable,
  onMarkerMove,
}) => {
  const mapElements: MapElement[] = [];

  if (locationCoordinates?.lat && locationCoordinates?.lng) {
    mapElements.push({
      objectType: MapObjectType.Inspection,
      name: "Inspection",
      description: "Inspection location",
      isActive: true,
      location: {
        lat: locationCoordinates.lat,
        lng: locationCoordinates.lng,
      },
    });
  }


  return (
    <section className={"comp-details-section"}>
      <h3>Inspection location</h3>
      <LeafletMapWithPoint
        mapElements={mapElements}
        draggable={draggable}
        onMarkerMove={onMarkerMove}
      />
    </section>
  );
};
