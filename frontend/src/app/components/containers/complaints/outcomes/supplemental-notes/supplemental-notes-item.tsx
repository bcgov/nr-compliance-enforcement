import { FC } from "react";
import { CompTextIconButton } from "../../../../common/comp-text-icon-button";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { useAppSelector } from "../../../../../hooks/hooks";
import { formatDate } from "../../../../../common/methods";

import { CaseAction } from "../../../../../types/outcomes/case-action";
import { selectNotesOfficer } from "../../../../../store/reducers/case-selectors";

type props = {
  notes: string;
  action: CaseAction;
  enableEditMode: Function;
  deleteNote: Function;
};

export const SupplementalNotesItem: FC<props> = ({ notes, action, enableEditMode, deleteNote }) => {
  const { initials, displayName } = useAppSelector(selectNotesOfficer);

  return (
    <div className="comp-outcome-supporting-notes">
      <div className="comp-details-edit-container">
        <div className="comp-details-edit-column">
          <p>{notes}</p>
          <div className="comp-details-edit-container">
            <div className="comp-details-edit-column">
              <div className="comp-details-label-div-pair">
                <label
                  className="comp-details-inner-content-label"
                  htmlFor="comp-review-required-officer"
                >
                  Officer
                </label>
                <div
                  data-initials-sm={initials}
                  className="comp-orange-avatar-sm comp-details-inner-content"
                >
                  <span
                    id="comp-review-required-officer"
                    className="comp-padding-left-xs"
                  >
                    {displayName}
                  </span>
                </div>
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
                  {formatDate(new Date(action?.date).toString())}
                </div>
              </div>
            </div>
            <div className="supporting-width"></div>
          </div>
        </div>
        <div className="comp-details-right-column">
          <CompTextIconButton
            buttonClasses="button-text"
            style={{ marginRight: "15px" }}
            text="Delete"
            icon={BsTrash3}
            click={() => deleteNote()}
          />
          <CompTextIconButton
            buttonClasses="button-text"
            text="Edit"
            icon={BsPencil}
            click={(e) => enableEditMode(true)}
          />
        </div>
      </div>
    </div>
  );
};
