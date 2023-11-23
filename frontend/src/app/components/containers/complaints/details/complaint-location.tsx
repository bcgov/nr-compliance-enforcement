import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import {
  getGeocodedComplaintCoordinates,
  selectComplaintDetails,
  selectGeocodedComplaintCoordinates,
} from "../../../../store/reducers/complaints";
import LeafletMapWithPoint from "../../../mapping/leaflet-map-with-point";
import { ComplaintDetails } from "../../../../types/complaints/details/complaint-details";
import { isWithinBC } from "../../../../common/methods";
import { Coordinates } from "../../../../types/app/coordinate-type";

type Props = {
  coordinates?: { lat: number; lng: number };
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
  coordinates,
  complaintType,
  draggable,
  onMarkerMove,
  hideMarker,
  editComponent
}) => {
  const dispatch = useAppDispatch();
  const { area, location } = useAppSelector(
    selectComplaintDetails(complaintType),
  ) as ComplaintDetails;

  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  }>({lat: 0, lng: 0});

  const geocodedComplaintCoordinates = useAppSelector(selectGeocodedComplaintCoordinates);

  useEffect(() => {
    if (editComponent && area) {
      // geocode the complaint using the area.  Used in case there are no coordinates
      dispatch(getGeocodedComplaintCoordinates(area));
    }
  }, [area, dispatch, location, editComponent]);


  useEffect(() => {
    if (coordinates && isWithinBC([coordinates.lng, coordinates.lat])) {
      setMarkerPosition(coordinates);
    } else {
      if(geocodedComplaintCoordinates?.features)
      {
        const lat =
        geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[
            Coordinates.Latitude
          ] !== undefined
            ? geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[
                Coordinates.Latitude
              ]
            : 0;
        const lng = geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[
            Coordinates.Longitude
          ] !== undefined
            ? geocodedComplaintCoordinates?.features[0]?.geometry?.coordinates[
                Coordinates.Longitude
              ]
            : 0;
            
          setMarkerPosition({lat: lat, lng: lng});
        }
  }
  }, [coordinates, geocodedComplaintCoordinates?.features]);

  const calculatedClass = editComponent ? "comp-complaint-details-location-block" : "display-none";

  return (
    <div className={calculatedClass}>
      <h6>Complaint Location</h6>
      <div className="comp-complaint-location">
        <LeafletMapWithPoint
          coordinates={markerPosition && { lat: markerPosition.lat, lng: markerPosition.lng }}
          draggable={draggable}
          onMarkerMove={onMarkerMove}
          hideMarker={hideMarker}
        />
      </div>
    </div>
  );
};
