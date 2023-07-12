import { FC } from "react";
import { OfficesContainer } from "./offices-container";

export const ZoneAtAGlance: FC = () => {
  return (
    <>
      <div className="comp-sub-header">Zone At a Glance</div>
      <div><OfficesContainer/></div>
    </>
  );
};
