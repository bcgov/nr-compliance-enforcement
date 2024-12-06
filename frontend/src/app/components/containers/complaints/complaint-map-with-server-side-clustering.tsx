import { FC, useState, useContext, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { SORT_TYPES } from "@constants/sort-direction";
import { ComplaintFilterContext } from "@providers/complaint-filter-provider";
import { ComplaintFilters } from "@apptypes/complaints/complaint-filters/complaint-filters";
import { ComplaintRequestPayload } from "@/app/types/complaints/complaint-filters/complaint-request-payload";
import LeafletMapWithServerSideClustering from "@components/mapping/leaflet-map-with-server-side-clustering";
import {
  getMappedComplaints,
  selectMappedComplaints,
  selectTotalUnmappedComplaints,
  setMappedComplaints,
} from "@store/reducers/complaints";
import { generateApiParameters, get } from "@common/api";
import config from "@/config";

type Props = {
  type: string;
  searchQuery: string;
};

export const generateMapComplaintRequestPayload = (
  complaintType: string,
  filters: ComplaintFilters,
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
    complaintMethod,
    actionTaken,
    outcomeAnimal,
  } = filters;

  let common = {
    sortColumn: "", // sort or order has no bearing on map data
    sortOrder: "", // sort or order has no bearing on map data
    regionCodeFilter: region,
    zoneCodeFilter: zone,
    areaCodeFilter: community,
    officerFilter: officer,
    startDateFilter: startDate,
    endDateFilter: endDate,
    complaintStatusFilter: status,
    actionTakenFilter: actionTaken,
  };

  switch (complaintType) {
    case COMPLAINT_TYPES.ERS:
      return {
        ...common,
        violationFilter: violationType,
        complaintMethodFilter: complaintMethod,
      } as ComplaintRequestPayload;
    case COMPLAINT_TYPES.HWCR:
    default:
      return {
        ...common,
        speciesCodeFilter: species,
        natureOfComplaintFilter: natureOfComplaint,
        outcomeAnimalFilter: outcomeAnimal,
      } as ComplaintRequestPayload;
  }
};

export const ComplaintMapWithServerSideClustering: FC<Props> = ({ type, searchQuery }) => {
  const dispatch = useAppDispatch();

  const [loadingMapData, setLoadingMapData] = useState<boolean>(false);
  const [clusters, setClusters] = useState<Array<any>>([]);
  const [defaultClusterView, setDefaultClusterView] = useState<any>();
  const [unmappedComplaints, setUnmappedComplaints] = useState<number>(0);

  //-- the state from the context is not the same state as used in the rest of the application
  //-- this is self-contained, rename the state locally to make clear
  const { state: filters } = useContext(ComplaintFilterContext);

  const fetchMapData = useCallback(
    async (
      filters: ComplaintFilters,
      searchQuery: string,
      unmapped: boolean,
      zoom: number = 0,
      west?: number,
      south?: number,
      east?: number,
      north?: number,
    ) => {
      setLoadingMapData(true);
      let payload = generateMapComplaintRequestPayload(type, filters);

      let parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/map/search/clustered/${type}`, {
        bbox: west && south && east && north ? `${west},${south},${east},${north}` : undefined, // If the bbox is not provided, return all complaint clusters
        zoom: zoom,
        unmapped: unmapped,
        region: payload.regionCodeFilter?.value,
        zone: payload.zoneCodeFilter?.value,
        community: payload.areaCodeFilter?.value,
        officerAssigned: payload.officerFilter?.value,
        natureOfComplaint: payload.natureOfComplaintFilter?.value,
        speciesCode: payload.speciesCodeFilter?.value,
        incidentReportedStart: payload.startDateFilter,
        incidentReportedEnd: payload.endDateFilter,
        violationCode: payload.violationFilter?.value,
        status: payload.complaintStatusFilter?.value,
        complaintMethod: payload.complaintMethodFilter?.value,
        actionTaken: payload.actionTakenFilter?.value,
        outcomeAnimal: payload.outcomeAnimalFilter?.value,
        query: searchQuery,
      });

      const response: any = await get(dispatch, parameters, {}, false);
      if (response) {
        setClusters(response.clusters);
        if (response.zoom && response.center) {
          setDefaultClusterView({ zoom: response.zoom, center: response.center });
        }
        response.unmappedComplaints && setUnmappedComplaints(response.unmappedComplaints);
      }
      setLoadingMapData(false);
    },
    [dispatch, type],
  );

  useEffect(() => {
    //Update map when filters or searchQuery change
    fetchMapData(filters, searchQuery, true);
  }, [fetchMapData, filters, searchQuery]);

  const handleMapMoved = (zoom: number, west?: number, south?: number, east?: number, north?: number) => {
    setDefaultClusterView(undefined); // Clear the default cluster view when the map is moved
    fetchMapData(filters, searchQuery, false, zoom, west, south, east, north);
  };

  return (
    <LeafletMapWithServerSideClustering
      complaintType={type}
      handleMapMoved={handleMapMoved}
      loadingMapData={loadingMapData}
      clusters={clusters}
      defaultClusterView={defaultClusterView}
      unmappedComplaints={unmappedComplaints}
    />
  );
};
