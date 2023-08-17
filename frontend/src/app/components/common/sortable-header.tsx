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
    //  <th scope="col" className={["sortableHeader", className].join(" ")}>
    //    <a onClick={() => sortFnc(sortKey)}>{title}</a>
    //    <SortArrow
    //      sortKey={sortKey}
    //      current={currentSort}
    //      direction={sortDirection}
    //    />
    //  </th>
    <th className="comp-small-cell comp-header-cell comp-top-left comp-cell-left">
      <div className="comp-header-label">{title}</div>
      <div
        className="comp-header-caret"
        onClick={() => sortFnc("complaint_identifier")}
      >
        <SortArrow
          sortKey={sortKey}
          current={currentSort}
          direction={sortDirection}
        />
      </div>
    </th>
  );
};
