import { FC } from "react";
import { useAppSelector } from "../../../hooks/hooks";
import { profileZone } from "../../../store/reducers/app";
import { getBannerByZone } from "./banner-map";

export const ZoneAtAGlance: FC = () => {
  const currentZone = useAppSelector<string>(profileZone);
  let image = getBannerByZone(currentZone);

  return (
    <>
      <div className="comp-sub-header">Zone At a Glance</div>
      <img src={image} />
    </>
  );
};
