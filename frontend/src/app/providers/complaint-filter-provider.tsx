import { FC, createContext, useContext, useEffect, useState } from "react";
import { DropdownOption } from "../types/code-tables/option";
import {
  ComplaintFilter,
  ComplaintFilterState,
} from "../types/providers/complaint-filter-provider-type";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { selectDefaultZone, getTokenProfile } from "../store/reducers/app";

export const ComplaintFilterContext = createContext<ComplaintFilter>({
  filters: {
    region: null,
    zone: null,
    community: null,
    officer: null,
    status: null,
    species: null,
    natureOfComplaint: null,
    violationType: null,
  },

  setRegion: () => {},
  setZone: () => {},
  setCommunity: () => {},
  setOfficer: () => {},

  setStartDate: () => {},
  setEndDate: () => {},
  setStatus: () => {},

  setSpecies: () => {},
  setNatureOfComplaint: () => {},

  setViolationType: () => {},

  resetFilters: () => {},
  hasFilter: (filter: string) => {
    return false;
  },
  hasDate: () => {
    return false;
  },
});

type ProviderProps = {
  children: React.ReactNode;
};

export const ComplaintFilterProvider: FC<ProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const defaultZone = useAppSelector(selectDefaultZone);

  useEffect(() => {
    if (!defaultZone) {
      dispatch(getTokenProfile());
    } else {
      setZone(defaultZone);
    }
  }, [defaultZone]);

  //-- base filters used for every complaint type
  const [region, setRegion] = useState<DropdownOption | null>(null);
  const [zone, setZone] = useState<DropdownOption | null>(null);
  const [community, setCommunity] = useState<DropdownOption | null>(null);
  const [officer, setOfficer] = useState<DropdownOption | null>(null);

  //-- shared complaint filters
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [status, setStatus] = useState<DropdownOption | null>({
    value: "OPEN",
    label: "Open",
  });

  //-- wildlife filters
  const [species, setSpecies] = useState<DropdownOption | null>(null);
  const [natureOfComplaint, setNatureOfComplaint] =
    useState<DropdownOption | null>(null);

  //-- allegation filters
  const [violationType, setViolationType] = useState<DropdownOption | null>(
    null
  );

  const filterData: ComplaintFilterState = {
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
  };

  const resetFilters = () => {
    setRegion(null);
    setZone(!defaultZone ? null : defaultZone);
    setCommunity(null);
    setOfficer(null);

    setStartDate(undefined);
    setEndDate(undefined);
    setStatus({ value: "OPEN", label: "Open" });

    setSpecies(null);
    setNatureOfComplaint(null);

    setViolationType(null);
  };

  const hasFilter = (filter: string) => {
    const selected = filterData[filter as keyof ComplaintFilterState];
    return !!selected;
  };

  const hasDate = () => {
    const { startDate, endDate } = filterData;
    if (
      (startDate === undefined || startDate === null) &&
      (endDate === undefined || endDate === null)
    ) {
      return false;
    }

    return true;
  };

  const value: ComplaintFilter = {
    filters: filterData,
    setRegion,
    setZone,
    setCommunity,
    setOfficer,

    setStartDate,
    setEndDate,
    setStatus,

    setSpecies,
    setNatureOfComplaint,

    setViolationType,

    resetFilters,
    hasFilter,
    hasDate,
  };

  return (
    <ComplaintFilterContext.Provider value={value}>
      {children}
    </ComplaintFilterContext.Provider>
  );
};
