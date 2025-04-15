import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import {
  getGeocodedComplaintCoordinates,
  selectComplaintDetails,
  selectGeocodedComplaintCoordinates,
} from "@store/reducers/complaints";
import LeafletMapWithPoint from "@components/mapping/leaflet-map-with-point";
import { isWithinBC } from "@common/methods";
import { Coordinates } from "@apptypes/app/coordinate-type";
import { MapElement, MapObjectType } from "@/app/types/maps/map-element";

type Props = {
  parentCoordinates?: { lat: number; lng: number };
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
  const dispatch = useAppDispatch();
  const { area, coordinates } = useAppSelector((state) => selectComplaintDetails(state, complaintType));
  const geocodedComplaintCoordinates = useAppSelector(selectGeocodedComplaintCoordinates);

  useEffect(() => {
    if (
      editComponent &&
      area &&
      coordinates &&
      +coordinates[Coordinates.Latitude] === 0 &&
      +coordinates[Coordinates.Longitude] === 0
    ) {
      // geocode the complaint using the area.  Used in case there are no parentCoordinates
      dispatch(getGeocodedComplaintCoordinates(area));
    }
  }, [area, dispatch, editComponent, coordinates]);

  useEffect(() => {
    let complaintMapElement = mapElements.find((item) => item.objectType === MapObjectType.Complaint);
    const complaintMapElementLocation = complaintMapElement?.location;
    if (complaintMapElement) {
      if (
        !(
          complaintMapElementLocation && isWithinBC([complaintMapElementLocation.lng, complaintMapElementLocation.lat])
        ) &&
        geocodedComplaintCoordinates?.features
      ) {
        const lat =
          geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[Coordinates.Latitude] !== undefined
            ? geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[Coordinates.Latitude]
            : 0;
        const lng =
          geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[Coordinates.Longitude] !== undefined
            ? geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[Coordinates.Longitude]
            : 0;
        setGeocodedLocation({ lat: lat, lng: lng });
      }
    }
  }, [mapElements, geocodedComplaintCoordinates?.features]);

  const [geocodedLocation, setGeocodedLocation] = useState({ lat: 0, lng: 0 });

  const calculatedClass = editComponent ? "comp-complaint-details-location-block" : "display-none";

  return (
    <section className={"comp-details-section" + calculatedClass}>
      <h3>Complaint location</h3>
      <LeafletMapWithPoint
        mapElements={mapElements}
        draggable={draggable}
        onMarkerMove={onMarkerMove}
        geocodedLocation={geocodedLocation}
      />
    </section>
  );
};
