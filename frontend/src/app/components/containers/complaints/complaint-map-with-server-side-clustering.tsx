import { FC, useState, useContext, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { ComplaintFilterContext } from "@providers/complaint-filter-provider";
import { ComplaintFilters } from "@apptypes/complaints/complaint-filters/complaint-filters";
import { ComplaintRequestPayload } from "@/app/types/complaints/complaint-filters/complaint-request-payload";
import LeafletMapWithServerSideClustering from "@components/mapping/leaflet-map-with-server-side-clustering";
import { generateApiParameters, get } from "@common/api";
import config from "@/config";
import {
  selectComplaintSearchParameters,
  setComplaint,
  setComplaintSearchParameters,
  setMappedComplaintsCount,
} from "@/app/store/reducers/complaints";
import { selectDefaultPageSize } from "@/app/store/reducers/app";

type Props = {
  type: string;
  searchQuery: string;
};

export const generateMapComplaintRequestPayload = (
  complaintType: string,
  filters: ComplaintFilters,
  page: number,
  pageSize: number,
  sortColumn: string,
  sortOrder: string,
  searchQuery: string,
): ComplaintRequestPayload => {
  const {
    region,
    zone,
    community,
    park,
    area,
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
    outcomeActionedBy,
    outcomeAnimalStartDate,
    outcomeAnimalEndDate,
    equipmentStatus,
    equipmentTypes,
  } = filters;

  let common = {
    sortColumn: sortColumn,
    sortOrder: sortOrder,
    regionCodeFilter: region,
    zoneCodeFilter: zone,
    areaCodeFilter: community,
    parkFilter: park,
    areaFilter: area,
    officerFilter: officer,
    startDateFilter: startDate,
    endDateFilter: endDate,
    complaintStatusFilter: status,
    actionTakenFilter: actionTaken,
    outcomeAnimalStartDateFilter: outcomeAnimalStartDate,
    outcomeAnimalEndDateFilter: outcomeAnimalEndDate,
    query: searchQuery,
    page,
    pageSize,
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
        outcomeActionedByFilter: outcomeActionedBy,
        equipmentStatusFilter: equipmentStatus,
        equipmentTypesFilter: equipmentTypes,
      } as ComplaintRequestPayload;
  }
};

export const ComplaintMapWithServerSideClustering: FC<Props> = ({ type, searchQuery }) => {
  const dispatch = useAppDispatch();

  const [loadingMapData, setLoadingMapData] = useState<boolean>(false);
  const [clusters, setClusters] = useState<Array<any>>([]);
  const [defaultClusterView, setDefaultClusterView] = useState<any>();
  const [unmappedCount, setUnmappedCount] = useState<number>(0);

  //-- the state from the context is not the same state as used in the rest of the application
  //-- this is self-contained, rename the state locally to make clear
  const { state: filters } = useContext(ComplaintFilterContext);
  const defaultPageSize = useAppSelector(selectDefaultPageSize);
  const storedSearchParams = useAppSelector(selectComplaintSearchParameters);

  const fetchMapData = useCallback(
    async (
      filters: ComplaintFilters,
      searchQuery: string,
      unmapped: boolean,
      clusters: boolean,
      zoom: number = 0,
      bbox?: {
        west?: number;
        south?: number;
        east?: number;
        north?: number;
      },
    ) => {
      setLoadingMapData(true);
      let payload = generateMapComplaintRequestPayload(
        type,
        filters,
        storedSearchParams.page || 1,
        storedSearchParams.pageSize || defaultPageSize,
        storedSearchParams.sortColumn,
        storedSearchParams.sortOrder,
        searchQuery,
      );
      dispatch(setComplaint(null));
      dispatch(setComplaintSearchParameters(payload));

      let parms: any = {
        bbox: bbox ? `${bbox.west},${bbox.south},${bbox.east},${bbox.north}` : undefined, // If the bbox is not provided, return all complaint clusters
        zoom: zoom,
        region: payload.regionCodeFilter?.value,
        zone: payload.zoneCodeFilter?.value,
        community: payload.areaCodeFilter?.value,
        park: payload.parkFilter?.value,
        area: payload.areaFilter?.value,
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
        outcomeActionedBy: payload.outcomeActionedByFilter?.value,
        outcomeAnimalStartDate: payload.outcomeAnimalStartDateFilter,
        outcomeAnimalEndDate: payload.outcomeAnimalEndDateFilter,
        equipmentStatus: payload.equipmentStatusFilter?.value,
        equipmentTypes: payload.equipmentTypesFilter?.map((type) => type.value),
        query: searchQuery,
      };

      // For a boolean any value including "false" is interpreted as true by our API
      if (unmapped) {
        parms = { ...parms, unmapped: true };
      }
      if (clusters) {
        parms = { ...parms, clusters: true };
      }

      let parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint/map/search/clustered/${type}`, parms);

      const response: any = await get(dispatch, parameters, {}, false);
      if (response) {
        response.unmappedCount != null && setUnmappedCount(response.unmappedCount);
        // If there is no bounding box, update totals
        bbox === undefined &&
          dispatch(
            setMappedComplaintsCount({
              ...(response.mappedCount != null && { mapped: response.mappedCount }),
              ...(response.unmappedCount != null && { unmapped: response.unmappedCount }),
            }),
          );
        response.clusters && setClusters(response.clusters);
        if (response.zoom && response.center) {
          setDefaultClusterView({ zoom: response.zoom, center: response.center });
        }
      }
      setLoadingMapData(false);
    },
    [dispatch, type],
  );

  useEffect(() => {
    //Update map when filters or searchQuery change
    fetchMapData(filters, searchQuery, false, true);
    fetchMapData(filters, searchQuery, true, false);
  }, [fetchMapData, filters, searchQuery]);

  const handleMapMoved = (zoom: number, west?: number, south?: number, east?: number, north?: number) => {
    setDefaultClusterView(undefined); // Clear the default cluster view when the map is moved
    fetchMapData(filters, searchQuery, false, true, zoom, { west, south, east, north });
  };

  return (
    <LeafletMapWithServerSideClustering
      complaintType={type}
      handleMapMoved={handleMapMoved}
      loadingMapData={loadingMapData}
      clusters={clusters}
      defaultClusterView={defaultClusterView}
      unmappedCount={unmappedCount}
    />
  );
};
