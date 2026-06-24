import React, { FC } from "react";
export const TooltipContent: FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="complaint-search-fields-tooltip">
    <div className="complaint-search-fields-tooltip-title">{title}</div>
    <ul className="complaint-search-fields-tooltip-list">
      {items.map((item, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </div>
);
