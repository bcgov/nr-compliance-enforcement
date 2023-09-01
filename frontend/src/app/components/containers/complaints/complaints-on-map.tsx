import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  getComplaints,
  selectAllegationComplaints, selectComplaintLocations,
} from "../../../store/reducers/complaints";
import LeafletMapWithMultiplePoints from "../../mapping/leaflet-map-with-multiple-points";
import { ComplaintFilters } from "../../../types/complaints/complaint-filters";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";

type Props = {
};

/**
 * Component that displays a map with a marker representing the complaint location
 *
 */
export const ComplaintsOnMap: FC<Props> = () => {
  
  const dispatch = useAppDispatch();

  const sortColumn: string = "incident_reported_datetime";
          const sortOrder: string = "DESC";
          const regionCodeFilter = undefined;
          const zoneCodeFilter = undefined;
          const areaCodeFilter = undefined;
          const officerFilter = undefined;
          const violationFilter = undefined;
          const startDateFilter = undefined;
          const endDateFilter = undefined;
          const complaintStatusFilter = undefined;

  useEffect(() => {
    const payload = {
      sortColumn,
          sortOrder,
          regionCodeFilter,
          zoneCodeFilter,
          areaCodeFilter,
          officerFilter,
          violationFilter,
          startDateFilter,
          endDateFilter,
          complaintStatusFilter,
    } as ComplaintFilters;

    dispatch(getComplaints(COMPLAINT_TYPES.HWCR, payload));
  }, [
    dispatch,
  ]);

  const coordinatesArray = useAppSelector(selectComplaintLocations);


  return (
    <div className="comp-complaint-details-location-block">
      <h6>Complaint Location</h6>
      <div className="comp-complaint-location">
        <LeafletMapWithMultiplePoints
          markers={coordinatesArray}
        />
      </div>
    </div>
  );
};
