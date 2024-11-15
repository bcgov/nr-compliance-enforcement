import { FC } from "react";
import { SORT_TYPES } from "@constants/sort-direction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

type Props = {
  sortKey: string;
  current: string;
  direction: string;
};

export const SortArrow: FC<Props> = ({ sortKey, current, direction }): JSX.Element => {
  if (sortKey === current) {
    if (direction === SORT_TYPES.ASC) {
      return <FontAwesomeIcon icon={faSortUp} />;
    }
    return <FontAwesomeIcon icon={faSortDown} />;
  }

  return <FontAwesomeIcon icon={faSort} />;
};
