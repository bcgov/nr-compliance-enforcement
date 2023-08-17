import { FC } from "react";
import { SortArrow } from "./sort-arrow";

type Props = {
  title: string;
  sortFnc: Function;
  sortKey: string;
  currentSort: string;
  sortDirection: string;
  className?: string;
};

export const SortableHeader: FC<Props> = ({
  title,
  sortFnc,
  sortKey,
  currentSort,
  sortDirection,
  className,
}) => {
  return (
    <th className={["sortableHeader", className].join(" ")}>
      <div className="comp-header-label" onClick={() => sortFnc(sortKey)}>
        {title}
      </div>
      <div className="comp-header-caret">
        <SortArrow
          sortKey={sortKey}
          current={currentSort}
          direction={sortDirection}
        />
      </div>
    </th>
  );
};
