import { FC, useState, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import { SORT_TYPES } from "../../../constants/sort-direction";
import { ComplaintFilterContext } from "../../../providers/complaint-filter-provider";
import { ComplaintFilters } from "../../../types/complaints/complaint-filters/complaint-filters";
import { ComplaintRequestPayload } from "../../../types/complaints/complaint-filters/complaint-reauest-payload";
import LeafletMapWithMultiplePoints from "../../mapping/leaflet-map-with-multiple-points";
import { getComplaintsOnMap, selectComplaintLocations, setComplaintsOnMap } from "../../../store/reducers/complaintLocations";

type Props = {
  type: string;
};

export const ComplaintMap: FC<Props> = ({ type }) => {
  const dispatch = useAppDispatch();

  const coordinatesArray = useAppSelector(selectComplaintLocations(type));

  //-- the state from the context is not the same state as used in the rest of the application
  //-- this is self-contained, rename the state locally to make clear
  const { state: filters } = useContext(ComplaintFilterContext);

  const [sortKey, setSortKey] = useState("incident_reported_datetime");
  const [sortDirection, setSortDirection] = useState(SORT_TYPES.DESC);

  const generateComplaintRequestPayload = (
    complaintType: string,
    filters: ComplaintFilters
  ): ComplaintRequestPayload => {
    const {
      region,
      zone,
      community,
      officer,
      startDate,
      endDate,
      status,
      species,
      natureOfComplaint,
      violationType,
    } = filters;

    const common = {
      sortColumn: sortKey,
      sortOrder: sortDirection,
      regionCodeFilter: region,
      zoneCodeFilter: zone,
      areaCodeFilter: community,
      officerFilter: officer,
      startDateFilter: startDate,
      endDateFilter: endDate,
      complaintStatusFilter: status,
    };

    switch (complaintType) {
      case COMPLAINT_TYPES.ERS:
        return {
          ...common,
          violationFilter: violationType,
        } as ComplaintRequestPayload;
      case COMPLAINT_TYPES.HWCR:
      default:
        return {
          ...common,
          speciesCodeFilter: species,
          natureOfComplaintFilter: natureOfComplaint,
        } as ComplaintRequestPayload;
    }
  };

  useEffect(() => {
    const payload = generateComplaintRequestPayload(type, filters);
    dispatch(getComplaintsOnMap(type, payload));
  }, [filters]);

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setComplaintsOnMap({ type: { type }, data: [] }));
    };
  }, []);

  useEffect(() => {
    //alert('test10');
  }, [coordinatesArray]);

  return <LeafletMapWithMultiplePoints complaint_type={type} markers={coordinatesArray} />;
};
