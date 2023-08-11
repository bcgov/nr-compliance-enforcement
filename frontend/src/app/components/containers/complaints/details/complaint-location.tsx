import { FC } from "react";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintDeails } from "../../../../store/reducers/complaints";
import LeafletMapWithPoint from "../../../mapping/LeafletMapWithPoint";
import { ComplaintDetails } from "../../../../types/complaints/details/complaint-details";
import { isWithinBC } from "../../../../common/methods";

type Props = {
  complaintType: string;
  draggable: boolean;
};

export const ComplaintLocation: FC<Props> = ({ complaintType, draggable }) => {
  const { coordinates } = useAppSelector(
    selectComplaintDeails(complaintType)
  ) as ComplaintDetails;

  if (coordinates && isWithinBC(coordinates)) {
    return (
      <div className="comp-complaint-details-location-block">
        <h6>Complaint Location</h6>
        <div className="comp-complaint-location">
          <LeafletMapWithPoint
            coordinates={coordinates}
            draggable={draggable}
          />
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
