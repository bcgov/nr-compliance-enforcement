import { FC, useMemo } from "react";
import { useAppSelector } from "@hooks/hooks";
import { selectComplaintDetails } from "@store/reducers/complaints";
import LeafletMapWithPoint from "@components/mapping/leaflet-map-with-point";
import { isWithinBC } from "@common/methods";
import { Coordinates } from "@apptypes/app/coordinate-type";
import { MapElement, MapObjectType } from "@/app/types/maps/map-element";
import { useGeocodedCenter } from "@/app/hooks/use-geocoded-center";
import { getMapZoom } from "@/app/common/geocoder";

type Props = {
  complaintType: string;
  draggable: boolean;
  onMarkerMove?: (lat: number, lng: number) => void;
  editComponent: boolean;
  mapElements: MapElement[];
};

/**
 * Component that displays a map with a marker representing the complaint location
 *
 */
export const ComplaintLocation: FC<Props> = ({
  complaintType,
  draggable,
  onMarkerMove,
  editComponent,
  mapElements,
}) => {
  const { area, coordinates } = useAppSelector((state) => selectComplaintDetails(state, complaintType));

  const shouldGeocode =
    editComponent && // Only geocode in edit
    !!area && // and there is a community / area
    !!coordinates && // and there is something in the coordinates area
    +coordinates[Coordinates.Latitude] === 0 && // and it's [0,0] our representation of empty
    +coordinates[Coordinates.Longitude] === 0;

  const { center: geocodedCommunityCenter, isLoaded: isCommunityLoaded } = useGeocodedCenter(
    shouldGeocode ? area : undefined,
  );

  const geocodedLocation = useMemo(() => {
    if (!geocodedCommunityCenter) {
      return { lat: 0, lng: 0 };
    }

    const complaintMapElement = mapElements.find((item) => item.objectType === MapObjectType.Complaint);
    const complaintMapElementLocation = complaintMapElement?.location;

    if (complaintMapElementLocation && isWithinBC([complaintMapElementLocation.lng, complaintMapElementLocation.lat])) {
      return { lat: 0, lng: 0 };
    }

    return geocodedCommunityCenter;
  }, [geocodedCommunityCenter, mapElements]);

  const calculatedClass = editComponent ? "comp-complaint-details-location-block" : "display-none";

  return (
    <section className={"comp-details-section" + calculatedClass}>
      <h3>Complaint location</h3>
      {coordinates && (!shouldGeocode || isCommunityLoaded) && (
        <LeafletMapWithPoint
          mapElements={mapElements}
          draggable={draggable}
          onMarkerMove={onMarkerMove}
          geocodedLocation={geocodedLocation}
          defaultZoom={shouldGeocode ? getMapZoom(null, geocodedCommunityCenter) : 14}
          mapType="complaint"
        />
      )}
    </section>
  );
};
