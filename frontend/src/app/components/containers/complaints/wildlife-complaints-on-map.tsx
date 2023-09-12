import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  getComplaintsOnMap,
  selectWildlifeComplaintLocations,
  setComplaintsOnMap,
} from "../../../store/reducers/complaints";
import LeafletMapWithMultiplePoints from "../../mapping/leaflet-map-with-multiple-points";
import { ComplaintFilters } from "../../../types/complaints/complaint-filters";
import Option from "../../../types/app/option";

type Props = {
  sortColumn: string;
  sortOrder: string;
  regionCodeFilter: Option | null;
  zoneCodeFilter: Option | null;
  areaCodeFilter: Option | null;
  officerFilter: Option | null;
  natureOfComplaintFilter?: Option | null;
  speciesCodeFilter?: Option | null;
  startDateFilter: Date | undefined;
  endDateFilter: Date | undefined;
  complaintStatusFilter: Option | null;
  complaintType: string;
};

export const WildlifeComplaintsOnMap: FC<Props> = ({
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
  complaintType,
}) => {
  const dispatch = useAppDispatch();

  let coordinatesArray;

  coordinatesArray = useAppSelector(selectWildlifeComplaintLocations);

  useEffect(() => {
    //-- when the component unmounts clear the complaint from redux
    return () => {
      dispatch(setComplaintsOnMap({ type: { complaintType }, data: [] }));
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

    dispatch(getComplaintsOnMap(complaintType, payload));
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
    complaintType,
  ]);

  return <LeafletMapWithMultiplePoints markers={coordinatesArray} />;
};
