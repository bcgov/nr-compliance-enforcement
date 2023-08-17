import { FC } from "react";
import { SORT_DIRECTIONS } from "../../constants/sort-direction";

type Props = {
  sortKey: string;
  current: string;
  direction: string;
};

export const SortArrow: FC<Props> = ({ sortKey, current, direction }): JSX.Element => {
  console.log(sortKey);
  console.log(current);
  console.log(direction);
  if (sortKey === current) {
    if (direction === SORT_DIRECTIONS.ASCENDING) {
      return <i className="fa-solid fa-sort-up"></i>;
    }
    return <i className="fa-solid fa-sort-down"></i>;
  }

  return <i className="fa-solid fa-sort"></i>;
};
