import { FC, useState, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import { SORT_TYPES } from "../../../constants/sort-direction";
import { ComplaintFilterContext } from "../../../providers/complaint-filter-provider";
import { ComplaintFilters } from "../../../types/complaints/complaint-filters/complaint-filters";
import { ComplaintRequestPayload } from "../../../types/complaints/complaint-filters/complaint-reauest-payload";
import LeafletMapWithMultiplePoints from "../../mapping/leaflet-map-with-multiple-points";
import {
  getComplaintsOnMap,
  selectComplaintLocations,
  selectTotalUnmappedComplaintsOnMapByType,
  setComplaintsOnMap,
} from "../../../store/reducers/complaint-locations";

type Props = {
  type: string;
  searchQuery: string
};

export const generateMapComplaintRequestPayload = (
  complaintType: string,
  filters: ComplaintFilters,
  sortKey: string,
  sortDirection: string
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

export const ComplaintMap: FC<Props> = ({ type, searchQuery }) => {
  const dispatch = useAppDispatch();

  const coordinatesArray = useAppSelector(selectComplaintLocations(type));
  const unmappedComplaints = useAppSelector(selectTotalUnmappedComplaintsOnMapByType(type));

  //-- the state from the context is not the same state as used in the rest of the application
  //-- this is self-contained, rename the state locally to make clear
  const { state: filters } = useContext(ComplaintFilterContext);

  const [sortKey, setSortKey] = useState("incident_reported_utc_timestmp");
  const [sortDirection, setSortDirection] = useState(SORT_TYPES.DESC);

  useEffect(() => {
    //Update map when filters change
    let payload = generateMapComplaintRequestPayload(type, filters, sortKey, sortDirection);

    if (searchQuery) {
      payload = { ...payload, query: searchQuery };
    }

    dispatch(getComplaintsOnMap(type, payload));
  }, [filters]);

  useEffect(() => {
    //when the search Query is cleared refresh the map
    if (!searchQuery) {
      let payload = generateMapComplaintRequestPayload(type, filters, sortKey, sortDirection);
      payload = { ...payload, query: searchQuery };
      dispatch(getComplaintsOnMap(type, payload));
    }
  }, [searchQuery]);

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setComplaintsOnMap({ type: { type }, data: [] }));
    };
  }, []);

  return (
    <LeafletMapWithMultiplePoints
      complaint_type={type}
      markers={coordinatesArray}
      unmapped_complaints={unmappedComplaints}
    />
  );
};
