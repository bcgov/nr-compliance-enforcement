import { FC, useEffect, useState } from "react";
import { AnimalTag } from "../../../../../types/app/complaints/outcomes/wildlife/animal-tag";
import { DrugUsed } from "../../../../../types/app/complaints/outcomes/wildlife/drug-used";
import { DrugAuthorization } from "../../../../../types/app/complaints/outcomes/wildlife/drug-authorization";
import { useAppSelector } from "../../../../../hooks/hooks";
import {
  selectSpeciesCodeDropdown,
  selectAgeDropdown,
  selectSexDropdown,
  selectThreatLevelDropdown,
  selectConflictHistoryDropdown,
  selectWildlifeComplaintOutcome,
} from "../../../../../store/reducers/code-table";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import { formatDate, getAvatarInitials } from "../../../../../common/methods";
import { from } from "linq-to-typescript";

type props = {
  id: number;
  agency: string;
  species: string;
  sex: string;
  age: string;
  threatLevel: string;
  conflictHistory: string;
  tags: Array<AnimalTag>;
  drugs: Array<DrugUsed>;
  drugAuthorization?: DrugAuthorization;
  outcome: string;
  officer: string;
  date?: Date;
};
export const AnimalOutcomeItem: FC<props> = ({
  id,
  agency,
  species,
  sex,
  age,
  threatLevel,
  conflictHistory,
  tags,
  drugs,
  drugAuthorization,
  outcome,
  officer,
  date,
}) => {
  const speciesList = useAppSelector(selectSpeciesCodeDropdown);
  const ages = useAppSelector(selectAgeDropdown);
  const sexes = useAppSelector(selectSexDropdown);
  const threatLevels = useAppSelector(selectThreatLevelDropdown);
  const conflictHistories = useAppSelector(selectConflictHistoryDropdown);

  const outcomes = useAppSelector(selectWildlifeComplaintOutcome);
  const officers = useAppSelector(selectOfficersByAgencyDropdown(agency));

  const [animal, setAnimal] = useState("");
  const [animalSex, setAnimalSex] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [animalThreatLevel, setAnimalThreatLevel] = useState("");
  const [animalHistory, setAnimalHistory] = useState("");

  useEffect(() => {
    if (species) {
      const selected = from(speciesList).firstOrDefault((item) => item.value === species);
      if (selected && selected.label) {
        setAnimalSex(selected.label);
      }
    }
  }, [species]);

  useEffect(() => {
    if (sex) {
      const selected = from(sexes).firstOrDefault((item) => item.value === sex);
      if (selected && selected.label) {
        setAnimal(selected.label);
      }
    }
  }, [sex]);

  useEffect(() => {
    if (age) {
      const selected = from(ages).firstOrDefault((item) => item.value === age);
      if (selected && selected.label) {
        setAnimalAge(selected.label);
      }
    }
  }, [age]);

  useEffect(() => {
    if (threatLevel) {
      const selected = from(threatLevels).firstOrDefault((item) => item.value === threatLevel);
      if (selected && selected.label) {
        setAnimalThreatLevel(selected.label);
      }
    }
  }, [threatLevel]);

  useEffect(() => {
    if (conflictHistory) {
      const selected = from(conflictHistories).firstOrDefault((item) => item.value === conflictHistory);
      if (selected && selected.label) {
        setAnimalHistory(selected.label);
      }
    }
  }, [conflictHistory]);

  const assignedOfficer = () => {
    if (officer) {
      const selected = officers.find((item) => item.value === officer);
      return selected?.label ?? "";
    }

    return "";
  };

  return (
    <div className="comp-outcome-report-complaint-assessment">
      <div className="comp-outcome-report-container">
        <div className="comp-outcome-report-label-column">Animal</div>
        <div className="comp-outcome-report-edit-column">
          <span>{animal}</span>, {animalSex}, {animalAge} {animalThreatLevel} {animalHistory}
        </div>
      </div>
      <div className="comp-outcome-report-container comp-outcome-report-inner-spacing">
        <div className="comp-outcome-report-label-half-column">Officer</div>
        <div className="comp-outcome-report-edit-column">
          {" "}
          <div data-initials-sm={getAvatarInitials(assignedOfficer())} className="comp-pink-avatar-sm">
            <span id="comp-details-assigned-officer-name-text-id" className="comp-padding-left-xs">
              {assignedOfficer()}
            </span>
          </div>
        </div>
        <div className="comp-outcome-report-label-half-column">Date</div>
        <div className="comp-outcome-report-edit-column">{formatDate(date?.toString())}</div>
      </div>
    </div>
  );
};
