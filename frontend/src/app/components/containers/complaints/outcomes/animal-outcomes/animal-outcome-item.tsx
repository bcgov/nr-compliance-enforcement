import { FC, useState } from "react";
import { useAppSelector } from "../../../../../hooks/hooks";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import {
  selectEarDropdown,
} from "../../../../../store/reducers/code-table";
import { formatDate, getAvatarInitials, pad } from "../../../../../common/methods";
import { from } from "linq-to-typescript";
import { DrugItem } from "./drug-item";
import { AnimalOutcome } from "../../../../../types/app/complaints/outcomes/wildlife/animal-outcome";
import { DeleteConfirmModal } from "../../../../modal/instances/delete-confirm-modal";
import { CompTextIconButton } from "../../../../common/comp-text-icon-button";


interface AnimalOutcomeProps {
  animalOutcome: AnimalOutcome
  indexItem: number
  handleDelete: (param: any) => void | null
  handleEdit: (param: any) => void | null
}
export const AnimalOutcomeItem: FC<AnimalOutcomeProps> = ({
  animalOutcome,
  handleDelete,
  handleEdit,
  indexItem, 
}) => {


  const ears = useAppSelector(selectEarDropdown);
  const leftEar = ears.find((ear) => ear.value === "L");
  const rightEar = ears.find((ear) => ear.value === "R");

  const [showModal, setShowModal] = useState(false);

  return (
    <><DeleteConfirmModal
      show={showModal}
      title="Delete animal outcome?"
      content="All the data in this section will be lost."
      onHide={() => setShowModal(false)}
      onDelete={() => {
        handleDelete(indexItem);
        setShowModal(false);
      } }
      confirmText="Yes, delete animal outcome" />
        <div className="comp-animal-outcome">
        <div className="equipment-item">
        <div className="equipment-item-header">
          <div className="title">
            <h6>Animal {pad((indexItem + 1)?.toString(), 2)}</h6>
          </div>
          <div>
            <CompTextIconButton
              buttonClasses="button-text"
              style={{ marginRight: '15px'}}
              text="Delete"
              icon={BsTrash3}
              click={() => setShowModal(true)}
            />
            <CompTextIconButton
              buttonClasses="button-text"
              text="Edit"
              icon={BsPencil}
              click={() => handleEdit(indexItem)}
            />
          </div>
        </div>
        </div>
        <div className="comp-details-edit-container">
        
          <div className="comp-details-edit-column">
            <div className="comp-details-edit-container comp-details-nmargin-right-xxl">
              <div className="comp-details-edit-column">
                <div className="comp-details-label-div-pair ">
                  <label className="comp-details-inner-content-label" htmlFor="comp-review-required-officer">
                    Animal
                  </label>
                  <div className="flex-container">
                    <div className="comp-margin-right-xs">
                      <b>{animalOutcome?.species?.label}</b>,
                    </div>
                    {animalOutcome?.sex && <div className="comp-margin-right-xs">{animalOutcome?.sex?.label},</div>}
                    {animalOutcome?.age && <div className="comp-margin-right-xs">{animalOutcome?.age?.label}</div>}
                    {animalOutcome?.threatLevel && (
                      <div className="badge comp-status-badge-threat-level comp-margin-right-xs">
                        Category level: {animalOutcome?.threatLevel?.label}
                      </div>
                    )}
                    {animalOutcome?.conflictHistory && (
                      <div className="badge comp-status-badge-conflict-history comp-margin-right-xs">
                        Conflict history: {animalOutcome?.conflictHistory?.label}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {from(animalOutcome?.tags).any() && (
              <div className="comp-details-edit-column">
                <div className="comp-details-label-input-pair">
                  <label className="comp-details-inner-content-label top">Ear Tag{animalOutcome?.tags.length > 1 && "s"}</label>

                  <div className="comp-animal-outcome-fill-space">
                    <ul className="comp-ear-tag-list">
                      {animalOutcome?.tags.map(({ id, number, ear }) => (
                        <li key={id}>
                          {number} {ear === "L" ? leftEar?.label : rightEar?.label} side
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            )}

            {from(animalOutcome?.drugs).any() && (
              <div className="comp-details-edit-column">
                <div className="comp-details-label-input-pair">
                  <label className="comp-details-inner-content-label top">Drug{animalOutcome?.drugs.length > 1 && "s"}</label>
                  <div className="comp-animal-outcome-fill-space">
                    {animalOutcome.drugs.map((item) => {
                      const { officer, date } = animalOutcome?.drugAuthorization || {};
                      return <DrugItem {...item} officer={officer} date={date} key={item.id} />;
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="comp-details-edit-column">
              <div className="comp-details-label-input-pair">
                <label className="comp-details-inner-content-label center">Outcome</label>
                <div>{animalOutcome?.outcome?.label}</div>
              </div>
            </div>

            <div className="comp-details-edit-container">
              <div className="comp-details-edit-column">
                <div className="comp-details-label-div-pair">
                  <label className="comp-details-inner-content-label center" htmlFor="comp-review-required-officer">
                    Officer
                  </label>
                  <div
                    data-initials-sm={(getAvatarInitials(animalOutcome?.officer?.label ?? 'Unknow User'))}
                    className="comp-orange-avatar-sm comp-details-inner-content"
                  >
                    <span id="comp-review-required-officer" className="comp-padding-left-xs">
                      {animalOutcome?.officer?.label}
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
                    {formatDate(animalOutcome?.date?.toString())}
                  </div>
                </div>
              </div>
              <div className="supporting-width"></div>
            </div>
          </div>
        </div>
      </div></>
  );
};
