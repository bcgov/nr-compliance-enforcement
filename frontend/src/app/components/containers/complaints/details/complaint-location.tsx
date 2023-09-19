import { FC } from "react";
import { useAppSelector } from "../../../../hooks/hooks";
import {
  selectComplaintDeails,
  selectComplaintLocation,
} from "../../../../store/reducers/complaints";
import LeafletMapWithPoint from "../../../mapping/leaflet-map-with-point";
import { ComplaintDetails } from "../../../../types/complaints/details/complaint-details";
import { isWithinBC } from "../../../../common/methods";
import { Coordinates } from "../../../../types/app/coordinate-type";

type Props = {
  complaintType: string;
  draggable: boolean;
  onMarkerMove?: (lat: number, lng: number) => void;
};

/**
 * Component that displays a map with a marker representing the complaint location
 *
 */
export const ComplaintLocation: FC<Props> = ({ complaintType, draggable, onMarkerMove }) => {
  
  const { coordinates } = useAppSelector(
    selectComplaintDeails(complaintType)
  ) as ComplaintDetails;
  const complaintLocation = useAppSelector(selectComplaintLocation);

  // the lat and long of the marker we need to display on the map
  // Initialized to 0.  This will either be populated using the optionally supplied coordinates
  // or they'll be derived using the complaint's location and/or community.
  let lat = 0;
  let lng = 0;

  if (coordinates && isWithinBC(coordinates)) {
    lat = +coordinates[Coordinates.Latitude];
    lng = +coordinates[Coordinates.Longitude];
  } else if (complaintLocation) {
    lat = (complaintLocation?.features[0]?.geometry?.coordinates[Coordinates.Latitude] !== undefined ? complaintLocation?.features[0]?.geometry?.coordinates[Coordinates.Latitude] : 0);
    lng = (complaintLocation?.features[0]?.geometry?.coordinates[Coordinates.Longitude] !== undefined ? complaintLocation?.features[0]?.geometry?.coordinates[Coordinates.Longitude] : 0);
  }

    return (
      <div className="comp-complaint-details-location-block">
        <h6>Complaint Location</h6>
        <div className="comp-complaint-location">
          <LeafletMapWithPoint
            coordinates={{ lat: lat, lng: lng }}
            draggable={draggable}
            onMarkerMove={onMarkerMove}
          />
        </div>
      </div>
    );
  
};
