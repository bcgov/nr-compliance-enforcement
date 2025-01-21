import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import {
  getGeocodedComplaintCoordinates,
  selectComplaintDetails,
  selectGeocodedComplaintCoordinates,
} from "@store/reducers/complaints";
import LeafletMapWithPoint from "@components/mapping/leaflet-map-with-point";
import { ComplaintDetails } from "@apptypes/complaints/details/complaint-details";
import { isWithinBC } from "@common/methods";
import { Coordinates } from "@apptypes/app/coordinate-type";

type Props = {
  parentCoordinates?: { lat: number; lng: number };
  complaintType: string;
  draggable: boolean;
  onMarkerMove?: (lat: number, lng: number) => void;
  hideMarker?: boolean;
  editComponent: boolean;
};

/**
 * Component that displays a map with a marker representing the complaint location
 *
 */
export const ComplaintLocation: FC<Props> = ({
  parentCoordinates,
  complaintType,
  draggable,
  onMarkerMove,
  hideMarker,
  editComponent,
}) => {
  const dispatch = useAppDispatch();
  const { area, coordinates } = useAppSelector(selectComplaintDetails(complaintType)) as ComplaintDetails;

  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

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
    if (parentCoordinates && isWithinBC([parentCoordinates.lng, parentCoordinates.lat])) {
      setMarkerPosition(parentCoordinates);
    } else if (geocodedComplaintCoordinates?.features) {
      const lat =
        geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[Coordinates.Latitude] !== undefined
          ? geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[Coordinates.Latitude]
          : 0;
      const lng =
        geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[Coordinates.Longitude] !== undefined
          ? geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[Coordinates.Longitude]
          : 0;

      setMarkerPosition({ lat: lat, lng: lng });
    }
  }, [parentCoordinates, geocodedComplaintCoordinates?.features]);

  const calculatedClass = editComponent ? "comp-complaint-details-location-block" : "display-none";

  return (
    <section className={"comp-details-section" + calculatedClass}>
      <h3>Complaint location</h3>
      <LeafletMapWithPoint
        coordinates={markerPosition && { lat: markerPosition.lat, lng: markerPosition.lng }}
        draggable={draggable}
        onMarkerMove={onMarkerMove}
        hideMarker={hideMarker}
      />
    </section>
  );
};
