import { FC, useState, useContext, useEffect, useCallback } from "react";
import { useAppDispatch } from "@hooks/hooks";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { ComplaintFilterContext } from "@providers/complaint-filter-provider";
import { ComplaintFilters } from "@apptypes/complaints/complaint-filters/complaint-filters";
import { ComplaintRequestPayload } from "@/app/types/complaints/complaint-filters/complaint-request-payload";
import LeafletMapWithServerSideClustering from "@components/mapping/leaflet-map-with-server-side-clustering";
import { generateApiParameters, get } from "@common/api";
import config from "@/config";
import { setMappedComplaintsCount } from "@/app/store/reducers/complaints";

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
    outcomeAnimalStartDate,
    outcomeAnimalEndDate,
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
    outcomeAnimalStartDateFilter: outcomeAnimalStartDate,
    outcomeAnimalEndDateFilter: outcomeAnimalEndDate,
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
  const [unmappedCount, setUnmappedCount] = useState<number>(0);

  //-- the state from the context is not the same state as used in the rest of the application
  //-- this is self-contained, rename the state locally to make clear
  const { state: filters } = useContext(ComplaintFilterContext);

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
      let payload = generateMapComplaintRequestPayload(type, filters);

      let parms: any = {
        bbox: bbox ? `${bbox.west},${bbox.south},${bbox.east},${bbox.north}` : undefined, // If the bbox is not provided, return all complaint clusters
        zoom: zoom,
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
        outcomeAnimalStartDate: payload.outcomeAnimalStartDateFilter,
        outcomeAnimalEndDate: payload.outcomeAnimalEndDateFilter,
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
