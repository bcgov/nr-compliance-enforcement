import { FC } from "react";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintDeails } from "../../../../store/reducers/complaints";
import LeafletMapWithPoint from "../../../mapping/leaflet-map-with-point";
import { ComplaintDetails } from "../../../../types/complaints/details/complaint-details";
import {
  parseDecimalDegreesCoordinates,
} from "../../../../common/methods";

type Props = {
  complaintType: string;
  draggable: boolean;
};

/**
 * Component that displays a map with a marker representing the complaint location
 * 
 */
export const ComplaintLocation: FC<Props> = ({ complaintType, draggable }) => {
  const { coordinates } = useAppSelector(
    selectComplaintDeails(complaintType)
  ) as ComplaintDetails;

  const decimalDegreesCoordinates = parseDecimalDegreesCoordinates(coordinates);

  return (
    <div className="comp-complaint-details-location-block">
      <h6>Complaint Location</h6>
      <div className="comp-complaint-location">
        <LeafletMapWithPoint
          coordinates={decimalDegreesCoordinates}
          draggable={draggable}
        />
      </div>
    </div>
  );
};
