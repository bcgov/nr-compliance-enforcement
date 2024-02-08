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
  selectEarDropdown,
} from "../../../../../store/reducers/code-table";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import { formatDate, getAvatarInitials } from "../../../../../common/methods";
import { from } from "linq-to-typescript";
import { DrugItem } from "./drug-item";
import { Button } from "react-bootstrap";
import { BsPencil } from "react-icons/bs";

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

  const ears = useAppSelector(selectEarDropdown);
  const leftEar = ears.find((ear) => ear.value === "L");
  const rightEar = ears.find((ear) => ear.value === "R");

  const outcomes = useAppSelector(selectWildlifeComplaintOutcome);
  const officers = useAppSelector(selectOfficersByAgencyDropdown(agency));

  const [animal, setAnimal] = useState("");
  const [animalSex, setAnimalSex] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [animalThreatLevel, setAnimalThreatLevel] = useState("");
  const [animalHistory, setAnimalHistory] = useState("");
  const [animalOutcome, setAnimalOutcome] = useState("");

  useEffect(() => {
    if (species) {
      const selected = from(speciesList).firstOrDefault((item) => item.value === species);
      if (selected && selected.label) {
        setAnimal(selected.label);
      }
    }
  }, [species, speciesList]);

  useEffect(() => {
    if (sex) {
      const selected = from(sexes).firstOrDefault((item) => item.value === sex);
      if (selected && selected.label) {
        setAnimalSex(selected.label);
      }
    }
  }, [sex, sexes]);

  useEffect(() => {
    if (age) {
      const selected = from(ages).firstOrDefault((item) => item.value === age);
      if (selected && selected.label) {
        setAnimalAge(selected.label);
      }
    }
  }, [age, ages]);

  useEffect(() => {
    if (threatLevel) {
      const selected = from(threatLevels).firstOrDefault((item) => item.value === threatLevel);
      if (selected && selected.label) {
        setAnimalThreatLevel(selected.label);
      }
    }
  }, [threatLevel, threatLevels]);

  useEffect(() => {
    if (conflictHistory) {
      const selected = from(conflictHistories).firstOrDefault((item) => item.value === conflictHistory);
      if (selected && selected.label) {
        setAnimalHistory(selected.label);
      }
    }
  }, [conflictHistory, conflictHistories]);

  useEffect(() => {
    if (outcome) {
      const selected = from(outcomes).firstOrDefault((item) => item.value === outcome);
      if (selected && selected.label) {
        setAnimalOutcome(selected.label);
      }
    }
  }, [outcome, outcomes]);

  const assignedOfficer = () => {
    if (officer) {
      const selected = officers.find((item) => item.value === officer);
      return selected?.label ?? "";
    }

    return "";
  };

  return (
    <div className="comp-outcome-animal">
      <div className="comp-details-edit-container">
        <div className="comp-details-edit-column">
          <div className="comp-details-edit-container">
            <div className="comp-details-edit-column">
              <div className="comp-details-label-div-pair">
                <label className="comp-details-inner-content-label" htmlFor="comp-review-required-officer">
                  Animal
                </label>
                <div className="flex-container">
                  <div className="comp-margin-right-xxs">
                    <b>{animal}</b>,
                  </div>
                  <div className="comp-margin-right-xxs">{animalSex},</div>
                  <div className="comp-margin-right-xxs">{animalAge}</div>
                  <div className="badge comp-status-badge-threat-level comp-margin-right-xxs">
                    Threat level: {animalThreatLevel}
                  </div>
                  <div className="badge comp-status-badge-conflict-history comp-margin-right-xxs">
                    Conflict history: {animalHistory}
                  </div>
                </div>
              </div>
            </div>
            <div className="supporting-width"></div>
          </div>

          {from(tags).any() && (
            <div className="comp-details-edit-container">
              <div className="comp-details-edit-column">
                <div className="comp-details-label-div-pair">
                  <label
                    className="comp-outcome-anima-label comp-details-inner-content-label"
                    htmlFor="comp-review-required-officer"
                  >
                    Ear tag
                  </label>
                  <ul>
                    {tags.map(({ id, number, ear }) => (
                      <li className="comp-ear-tag-list" key={id}>
                        {number} {ear === "L" ? leftEar?.label : rightEar?.label} side
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="supporting-width"></div>
            </div>
          )}

          {from(drugs).any() && (
            <div className="comp-details-edit-container">
              <div className="comp-details-edit-column">
                <div className="comp-details-label-div-pair">
                  <label
                    className="comp-outcome-anima-label comp-details-inner-content-label"
                    htmlFor="comp-review-required-officer"
                  >
                    Drugs
                  </label>

                  <div>
                    {drugs.map((item) => (
                      <DrugItem {...item} agency={agency} key={item.id} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="supporting-width"></div>
            </div>
          )}

          <div className="comp-details-edit-container">
            <div className="comp-details-edit-column">
              <div className="comp-details-label-div-pair">
                <label className="comp-details-inner-content-label" htmlFor="comp-review-required-officer">
                  Officer
                </label>
                <div data-initials-sm={"MS"} className="comp-orange-avatar-sm comp-details-inner-content">
                  <span id="comp-review-required-officer" className="comp-padding-left-xs">
                    Mike
                  </span>
                </div>
              </div>
            </div>
            <div className="comp-details-edit-column" id="complaint-supporting-date-div">
              <div className="comp-details-label-div-pair">
                <label className="comp-details-inner-content-label" htmlFor="file-review-supporting-date">
                  Date
                </label>
                <div className="bi comp-margin-right-xxs comp-details-inner-content" id="file-review-supporting-date">
                  {formatDate(new Date().toString())}
                </div>
              </div>
            </div>
            <div className="supporting-width"></div>
          </div>
        </div>
        <div className="comp-details-right-column">
          <Button
            id="details-screen-edit-button"
            className="sub-section-edit-button"
            title="Edit Complaint"
            variant="outline-primary"
            onClick={(evt) => {}}
          >
            <span>Edit</span>
            <BsPencil />
          </Button>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="comp-outcome-report-complaint-assessment">
  //     <div className="comp-outcome-report-container">
  //       <div className="comp-outcome-report-label-column">Animal</div>
  //       <div className="comp-outcome-report-edit-column">
  //         <div className="flex-container">
  //           <div className="comp-margin-right-xxs">
  //             <b>{animal}</b>,
  //           </div>
  //           <div className="comp-margin-right-xxs">{animalSex},</div>
  //           <div className="comp-margin-right-xxs">{animalAge}</div>
  //           <div className="badge comp-status-badge-threat-level comp-margin-right-xxs">
  //             Threat level: {animalThreatLevel}
  //           </div>
  //           <div className="badge comp-status-badge-conflict-history comp-margin-right-xxs">
  //             Conflict history: {animalHistory}
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {from(tags).any() && (
  //       <div className="comp-outcome-report-container">
  //         <div className="comp-outcome-report-label-column">Ear tag</div>
  //         <div className="comp-outcome-report-edit-column">
  // {tags.map(({ id, number, ear }) => (
  //   <div className="flex-container" key={id}>
  //     <div className="comp-margin-right-xxs">{number}</div>
  //     <div>{ear === "L" ? leftEar?.label : rightEar?.label} side</div>
  //   </div>
  // ))}
  //         </div>
  //       </div>
  //     )}

  //     {from(drugs).any() && (
  //       <div className="comp-outcome-report-container">
  //         <div className="comp-outcome-report-label-column">Drug</div>
  //         <div className="comp-outcome-report-edit-column">
  //           {drugs.map((item) => (
  //             <div className="flex-container" key={id}>
  //               <DrugItem {...item} {...drugAuthorization} agency={agency} />
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     )}

  //     <div className="comp-outcome-report-container comp-outcome-report-inner-spacing">
  //       <div className="comp-outcome-report-label-half-column">Outcome</div>
  //       <div className="comp-outcome-report-edit-column">
  //         <div data-initials-sm={getAvatarInitials(assignedOfficer())} className="comp-pink-avatar-sm">
  //           <span id="comp-details-assigned-officer-name-text-id" className="comp-padding-left-xs">
  //             {animalOutcome}
  //           </span>
  //         </div>
  //       </div>
  //       <div className="comp-outcome-report-label-half-column"></div>
  //       <div className="comp-outcome-report-edit-column"></div>
  //     </div>

  //     <div className="comp-outcome-report-container comp-outcome-report-inner-spacing">
  //       <div className="comp-outcome-report-label-half-column">Officer</div>
  //       <div className="comp-outcome-report-edit-column">
  //         {" "}
  //         <div data-initials-sm={getAvatarInitials(assignedOfficer())} className="comp-pink-avatar-sm">
  //           <span id="comp-details-assigned-officer-name-text-id" className="comp-padding-left-xs">
  //             {assignedOfficer()}
  //           </span>
  //         </div>
  //       </div>
  //       <div className="comp-outcome-report-label-half-column">Date</div>
  //       <div className="comp-outcome-report-edit-column">{formatDate(date?.toString())}</div>
  //     </div>
  //   </div>
  // );
};
