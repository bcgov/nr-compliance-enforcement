import { FC, useEffect, useState } from "react";
import { HwcrComplaintTabContainer } from "./hwcr/hwcr-complaint-tab-container";
import { AllegationComplaintTabContainer } from "./allegations/allegation-complaint-tab-container";
import ComplaintType from "../../../constants/complaint-types";
import Option from "../../../types/app/option";
import { getComplaintTypeFromUrl } from "../../../common/methods";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  getTokenProfile,
  profileZone,
  profileZoneDescription,
} from "../../../store/reducers/app";

type Props = {
  initialState: number;
};

export const ComplaintContainer: FC<Props> = ({ initialState }) => {
  const dispatch = useAppDispatch();
  const defaultZone = useAppSelector(profileZone);
  const defaultZoneLabel = useAppSelector(profileZoneDescription);

  useEffect(() => {
    if (!defaultZone) {
      dispatch(getTokenProfile());
    } else {
      setZoneCodeFilter({ value: defaultZone, label: defaultZoneLabel });
    }
  }, [dispatch, defaultZone, defaultZoneLabel]);

  const [sort, setSort] = useState(["incident_reported_datetime", "DESC"]);
  const [regionCodeFilter, setRegionCodeFilter] = useState<Option | null>(null);
  const [zoneCodeFilter, setZoneCodeFilter] = useState<Option | null>({
    value: defaultZone,
    label: defaultZoneLabel,
  });
  const [areaCodeFilter, setAreaCodeFilter] = useState<Option | null>(null);
  const [officerFilter, setOfficerFilter] = useState<Option | null>(null);
  const [natureOfComplaintFilter, setNatureOfComplaintFilter] =
    useState<Option | null>(null);
  const [speicesCodeFilter, setSpeicesCodeFilter] = useState<Option | null>(
    null
  );
  const [violationFilter, setViolationFilter] = useState<Option | null>(null);
  const [startDateFilter, setStartDateFilter] = useState<Date>();
  const [endDateFilter, setEndDateFilter] = useState<Date>();
  const [complaintStatusFilter, setComplaintStatusFilter] =
    useState<Option | null>({ value: "OPEN", label: "Open" });
  const _test = getComplaintTypeFromUrl();
  const [complaintType, setComplaintType] = useState<number>(
    _test !== -1 ? _test : initialState
  );


  function handleChange(newState: number) {
    setComplaintType(newState);
    setSort(["incident_reported_datetime", "DESC"]);
    setComplaintStatusFilter({ value: "OPEN", label: "Open" });
    setRegionCodeFilter(null);
    setZoneCodeFilter({ value: defaultZone, label: defaultZoneLabel });
    setAreaCodeFilter(null);
    setOfficerFilter(null);
    setNatureOfComplaintFilter(null);
    setSpeicesCodeFilter(null);
    setViolationFilter(null);
    setStartDateFilter(undefined);
    setEndDateFilter(undefined);
  }


  function handleSort(newSortColumn: string) {
    if (newSortColumn === sort[0]) {
      if (sort[1] === "DESC") {
        setSort([newSortColumn, "ASC"]);
      } else {
        setSort([newSortColumn, "DESC"]);
      }
    } else {
      if (
        newSortColumn === "incident_reported_datetime" ||
        newSortColumn === "update_timestamp"
      ) {
        setSort([newSortColumn, "DESC"]);
      } else {
        setSort([newSortColumn, "ASC"]);
      }
    }
  }

  if (complaintType === ComplaintType.HWCR_COMPLAINT) {
    return (
      <>
        <div className="comp-sub-header">Complaints</div>
        <div>
          <HwcrComplaintTabContainer
            handleSort={handleSort}
            handleChange={handleChange}
            sort={sort}
            regionCodeFilter={regionCodeFilter}
            setRegionCodeFilter={setRegionCodeFilter}
            zoneCodeFilter={zoneCodeFilter}
            setZoneCodeFilter={setZoneCodeFilter}
            areaCodeFilter={areaCodeFilter}
            setAreaCodeFilter={setAreaCodeFilter}
            officerFilter={officerFilter}
            setOfficerFilter={setOfficerFilter}
            natureOfComplaintFilter={natureOfComplaintFilter}
            setNatureOfComplaintFilter={setNatureOfComplaintFilter}
            speciesCodeFilter={speicesCodeFilter}
            setSpeicesCodeFilter={setSpeicesCodeFilter}
            startDateFilter={startDateFilter}
            setStartDateFilter={setStartDateFilter}
            endDateFilter={endDateFilter}
            setEndDateFilter={setEndDateFilter}
            complaintStatusFilter={complaintStatusFilter}
            setComplaintStatusFilter={setComplaintStatusFilter}
          />
        </div>
      </>
    );
  } else if (complaintType === ComplaintType.ALLEGATION_COMPLAINT) {
    return (
      <>
        <div className="comp-sub-header">Complaints</div>

        <div>
          <AllegationComplaintTabContainer
            handleSort={handleSort}
            handleChange={handleChange}
            sort={sort}
            regionCodeFilter={regionCodeFilter}
            setRegionCodeFilter={setRegionCodeFilter}
            zoneCodeFilter={zoneCodeFilter}
            setZoneCodeFilter={setZoneCodeFilter}
            areaCodeFilter={areaCodeFilter}
            setAreaCodeFilter={setAreaCodeFilter}
            officerFilter={officerFilter}
            setOfficerFilter={setOfficerFilter}
            violationFilter={violationFilter}
            setViolationFilter={setViolationFilter}
            startDateFilter={startDateFilter}
            setStartDateFilter={setStartDateFilter}
            endDateFilter={endDateFilter}
            setEndDateFilter={setEndDateFilter}
            complaintStatusFilter={complaintStatusFilter}
            setComplaintStatusFilter={setComplaintStatusFilter}
          />
        </div>
      </>
    );
  } else {
    return <></>;
  }
};
