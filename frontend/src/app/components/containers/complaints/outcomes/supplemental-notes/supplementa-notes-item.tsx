import { FC } from "react";
import { CompTextIconButton } from "../../../../common/comp-text-icon-button";
import { BsPencil } from "react-icons/bs";
import { useAppSelector } from "../../../../../hooks/hooks";
import { profileDisplayName, profileInitials } from "../../../../../store/reducers/app";
import { formatDate } from "../../../../../common/methods";

type props = {
  notes: string;

  enableEditMode: Function;
};

export const SupplementalNotesItem: FC<props> = ({ notes, enableEditMode }) => {
  const initials = useAppSelector(profileInitials);
  const displayName = useAppSelector(profileDisplayName);

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
                  {formatDate(new Date().toString())}
                </div>
              </div>
            </div>
            <div className="supporting-width"></div>
          </div>
        </div>
        <div className="comp-details-right-column">
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
