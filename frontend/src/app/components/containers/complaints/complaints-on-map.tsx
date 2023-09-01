import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  getComplaints,
  selectAllegationComplaints, selectComplaintLocations, setComplaints,
} from "../../../store/reducers/complaints";
import LeafletMapWithMultiplePoints from "../../mapping/leaflet-map-with-multiple-points";
import { ComplaintFilters } from "../../../types/complaints/complaint-filters";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import Option from "../../../types/app/option";


type Props = {
  sortColumn: string,
  sortOrder: string,
  regionCodeFilter: Option | null,
  zoneCodeFilter: Option | null,
  areaCodeFilter: Option | null,
  officerFilter: Option | null,
  natureOfComplaintFilter: Option | null,
  speciesCodeFilter: Option | null,
  startDateFilter: Date | undefined,
  endDateFilter: Date | undefined,
  complaintStatusFilter: Option | null,
}

export const ComplaintsOnMap: FC<Props>  = ({ sortColumn, sortOrder, regionCodeFilter, zoneCodeFilter, areaCodeFilter, officerFilter, natureOfComplaintFilter, speciesCodeFilter, startDateFilter, endDateFilter, complaintStatusFilter}) => {
  
  const dispatch = useAppDispatch();


  const coordinatesArray = useAppSelector(selectComplaintLocations);

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setComplaints({ type: COMPLAINT_TYPES.HWCR, data: [] }))
    };
  }, []);

  useEffect(() => {
      const payload = {
        sortColumn,
        sortOrder,
        regionCodeFilter,
        zoneCodeFilter,
        areaCodeFilter,
        officerFilter,
        natureOfComplaintFilter,
        speciesCodeFilter,
        startDateFilter,
        endDateFilter,
        complaintStatusFilter,
      } as ComplaintFilters;
  
      dispatch(getComplaints(COMPLAINT_TYPES.HWCR, payload));
    }, [
      dispatch,
      sortColumn,
      sortOrder,
      regionCodeFilter,
      zoneCodeFilter,
      areaCodeFilter,
      officerFilter,
      natureOfComplaintFilter,
      speciesCodeFilter,
      startDateFilter,
      endDateFilter,
      complaintStatusFilter,
    ]);


  return (
        <LeafletMapWithMultiplePoints
          markers={coordinatesArray}
        />
  );
};
