import { FC, useEffect, useState } from "react";
import { AnimalOutcomeV2 } from "../../../../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { useAppSelector } from "../../../../../hooks/hooks";
import {
  selectAgeDropdown,
  selectConflictHistoryDropdown,
  selectEarDropdown,
  selectSexDropdown,
  selectSpeciesCodeDropdown,
  selectThreatLevelDropdown,
  selectWildlifeComplaintOutcome,
} from "../../../../../store/reducers/code-table";
import { from } from "linq-to-typescript";
import { BsTrash3, BsPencil } from "react-icons/bs";
import { getAvatarInitials, formatDate, pad } from "../../../../../common/methods";
import { CompTextIconButton } from "../../../../common/comp-text-icon-button";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import { DrugItem } from "../animal-outcomes/drug-item";

type props = {
  index: number;
  data: AnimalOutcomeV2;
  agency: string;
  update: Function;
  remove: Function;
};

export const AnimalOutcome: FC<props> = ({ index, data, agency, update, remove }) => {
  //-- select data from redux
  const ears = useAppSelector(selectEarDropdown);
  const speciesList = useAppSelector(selectSpeciesCodeDropdown);
  const sexes = useAppSelector(selectSexDropdown);
  const ages = useAppSelector(selectAgeDropdown);
  const threatLevels = useAppSelector(selectThreatLevelDropdown);
  const conflictHistories = useAppSelector(selectConflictHistoryDropdown);
  const outcomes = useAppSelector(selectWildlifeComplaintOutcome);
  const officers = useAppSelector(selectOfficersByAgencyDropdown(agency));

  const [animal, setAnimal] = useState("");
  const [animalSex, setAnimalSex] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [animalThreatLevel, setAnimalThreatLevel] = useState("");
  const [animalHistory, setAnimalHistory] = useState("");
  const [animalOutcome, setAnimalOutcome] = useState("");
  const [outcomeOfficer, setOutcomeOfficer] = useState("");

  //-- misc
  const [animalNumber] = useState(index + 1);

  const leftEar = ears.find((ear) => ear.value === "L");
  const rightEar = ears.find((ear) => ear.value === "R");

  //-- get all of the values for the animal outcome and apply them
  useEffect(() => {
    const { species, sex, age, threatLevel, conflictHistory, outcome, officer } = data;

    if (species) {
      const selected = from(speciesList).firstOrDefault((item) => item.value === species);
      if (selected?.label) {
        setAnimal(selected.label);
      }
    }

    if (sex) {
      const selected = from(sexes).firstOrDefault((item) => item.value === sex);
      if (selected?.label) {
        setAnimalSex(selected.label);
      }
    }

    if (age) {
      const selected = from(ages).firstOrDefault((item) => item.value === age);
      if (selected?.label) {
        setAnimalAge(selected.label);
      }
    }

    if (threatLevel) {
      const selected = from(threatLevels).firstOrDefault((item) => item.value === threatLevel);
      if (selected?.label) {
        setAnimalThreatLevel(selected.label);
      }
    }

    if (conflictHistory) {
      const selected = from(conflictHistories).firstOrDefault((item) => item.value === conflictHistory);
      if (selected?.label) {
        setAnimalHistory(selected.label);
      }
    }

    if (outcome) {
      const selected = from(outcomes).firstOrDefault((item) => item.value === outcome);
      if (selected?.label) {
        setAnimalOutcome(selected.label);
      }
    }

    if (officer) {
      const selected = officers.find((item) => item.value === officer);
      if (selected?.label) {
        setOutcomeOfficer(selected.label);
      }
    }
  }, [ages, conflictHistories, data, outcomes, sexes, speciesList, threatLevels]);

  return (
    <div className="comp-animal-outcome">
      <div className="equipment-item">
        <div className="equipment-item-header">
          <div className="title">
            <h6>Animal {pad(animalNumber.toString(), 2)}</h6>
          </div>
          <div>
            <CompTextIconButton
              buttonClasses="button-text"
              style={{ marginRight: "15px" }}
              text="Delete"
              icon={BsTrash3}
              // click={() => setShowModal(true)}
              click={() => {}}
            />
            <CompTextIconButton
              buttonClasses="button-text"
              text="Edit"
              icon={BsPencil}
              // click={() => handleEdit(indexItem)}
              click={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="comp-details-edit-container">
        <div className="comp-details-edit-column">
          <div className="comp-details-edit-container comp-details-nmargin-right-xxl">
            <div className="comp-details-edit-column">
              <div className="comp-details-label-div-pair ">
                <label
                  className="comp-details-inner-content-label"
                  htmlFor="comp-review-required-officer"
                >
                  Animal
                </label>
                <div className="flex-container">
                  <div>
                    <b>{animal}</b>
                  </div>
                  {data?.sex && (
                    <>
                      <div className="comp-margin-right-xs">,</div>
                      <div>{animalSex}</div>
                    </>
                  )}
                  {data?.age && (
                    <>
                      <div className="comp-margin-right-xs">,</div>
                      <div className="comp-margin-right-xs">{animalAge}</div>
                    </>
                  )}
                  {data?.threatLevel && (
                    <div className="badge comp-status-badge-threat-level comp-margin-right-xs">
                      Category level: {animalThreatLevel}
                    </div>
                  )}
                  {data?.conflictHistory && (
                    <div className="badge comp-status-badge-conflict-history comp-margin-right-xs">
                      Conflict history: {animalHistory}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {data?.tags && from(data?.tags).any() && (
            <div className="comp-details-edit-column">
              <div className="comp-details-label-input-pair">
                <label className="comp-details-inner-content-label top">Ear Tag{data?.tags.length > 1 && "s"}</label>

                <div className="comp-animal-outcome-fill-space">
                  <ul className="comp-ear-tag-list">
                    {data?.tags.map(({ id, identifier, ear }) => (
                      <li key={id}>
                        {identifier} {ear === "L" ? leftEar?.label : rightEar?.label} side
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {data?.drugs && from(data?.drugs).any() && (
            <div className="comp-details-edit-column">
              <div className="comp-details-label-input-pair">
                <label className="comp-details-inner-content-label top">{`Drug${data?.drugs.length}s`}</label>
                <div className="comp-animal-outcome-fill-space">
                  {data.drugs.map((item) => {
                    const { officer, date } = data?.drugAuthorization || {};
                    return (
                      <DrugItem
                        {...item}
                        officer={officer}
                        date={date}
                        key={item.id}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="comp-details-edit-column">
            <div className="comp-details-label-input-pair">
              <label className="comp-details-inner-content-label center">Outcome</label>
              <div>{data?.outcome ? animalOutcome : <span style={{ color: "red" }}>Outcome pending</span>}</div>
            </div>
          </div>

          <div className="comp-details-edit-container">
            <div className="comp-details-edit-column">
              <div className="comp-details-label-div-pair">
                <label
                  className="comp-details-inner-content-label center"
                  htmlFor="comp-review-required-officer"
                >
                  Officer
                </label>
                {data?.officer ? (
                  <div
                    data-initials-sm={getAvatarInitials(outcomeOfficer)}
                    className="comp-orange-avatar-sm comp-details-inner-content"
                  >
                    <span
                      id="comp-review-required-officer"
                      className="comp-padding-left-xs"
                    >
                      {outcomeOfficer}
                    </span>
                  </div>
                ) : (
                  <span style={{ color: "red" }}>Officer pending</span>
                )}
              </div>
            </div>
            <div
              className="comp-details-edit-column"
              id="complaint-supporting-date-div"
            >
              <div className="comp-details-label-div-pair">
                <label
                  className="comp-details-inner-content-label"
                  htmlFor="file-review-supporting-date"
                >
                  Date
                </label>
                <div
                  className="bi comp-margin-right-xxs comp-details-inner-content"
                  id="file-review-supporting-date"
                >
                  {data?.date ? formatDate(data?.date?.toString()) : <span style={{ color: "red" }}>Date pending</span>}
                </div>
              </div>
            </div>
            <div className="supporting-width"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
