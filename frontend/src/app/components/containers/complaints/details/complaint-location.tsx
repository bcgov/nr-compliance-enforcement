import { FC, useEffect } from "react";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintLocation } from "../../../../store/reducers/complaints";
import LeafletMapWithPoint from "../../../mapping/leaflet-map-with-point";

type Props = {
  complaintType: string;
  draggable: boolean;
};

/**
 * Component that displays a map with a marker representing the complaint location
 * 
 */
export const ComplaintLocation: FC<Props> = ({ draggable }) => {

  const complaintLocation = useAppSelector(selectComplaintLocation);

  let lat = 0;
  let lng = 0;
 if (complaintLocation) {
  lat = complaintLocation?.features[0].geometry.coordinates[1];
  lng = complaintLocation?.features[0].geometry.coordinates[0];
 }
console.log(`lat/lng: ${lat} ${lng}`);
  useEffect(() => {
    console.log('Blabladflksdaj');
    console.log(complaintLocation);
  }, [complaintLocation]);
  return (
    <div className="comp-complaint-details-location-block">
      <h6>Complaint Location</h6>
      <div className="comp-complaint-location">
        <LeafletMapWithPoint
          coordinates={{lat:lat, lng : lng}}
          draggable={draggable}
        />
      </div>
    </div>
  );
};
