import { FC } from "react";
import LeafletMapWithPoint from "@components/mapping/leaflet-map-with-point";
import { MapElement, MapObjectType } from "@/app/types/maps/map-element";

type Props = {
  locationCoordinates?: { lat: number; lng: number };
  draggable: boolean;
  onMarkerMove?: (lat: number, lng: number) => void;
};

export const InvestigationLocation: FC<Props> = ({
  locationCoordinates,
  draggable,
  onMarkerMove,
}) => {
  const mapElements: MapElement[] = [];

  if (locationCoordinates && locationCoordinates.lat && locationCoordinates.lng) {
    mapElements.push({
      objectType: MapObjectType.Investigation,
      name: "Investigation",
      description: "Investigation location",
      isActive: true,
      location: {
        lat: locationCoordinates.lat,
        lng: locationCoordinates.lng,
      },
    });
  }


  return (
    <section className={"comp-details-section"}>
      <h3>Investigation location</h3>
      <LeafletMapWithPoint
        mapElements={mapElements}
        draggable={draggable}
        onMarkerMove={onMarkerMove}
      />
    </section>
  );
};
