import { FC, useEffect, useState } from "react";
import { latLngToUtm } from "../../common/methods";
interface CompLocationInfoProps {
  yCoordinate: string;
  xCoordinate: string;
}
export const CompLocationInfo: FC<CompLocationInfoProps> = ({ yCoordinate, xCoordinate }) => {
  const [utmZone, setUtmZone] = useState<string>("");
  const [northing, setNorthing] = useState<string>("");
  const [easting, setEasting] = useState<string>("");

  useEffect(() => {
    const { easting: eastingValue, northing: northingValue, zone: zoneValue } = latLngToUtm(yCoordinate, xCoordinate);
    setUtmZone(zoneValue);
    setNorthing(northingValue);
    setEasting(eastingValue);
  }, [yCoordinate, xCoordinate]);
  return (
    <>
      <div>
        <dt>Coordinates</dt>
        <dd>Latitude: {yCoordinate ? `${yCoordinate}` : ""}</dd>
      </div>
      <div>
        <dt></dt>
        <dd>Longitude: {xCoordinate ? `${xCoordinate}` : ""}</dd>
      </div>
      <br />
      <div>
        <dt></dt>
        <dd className="comp-lat-long">
          <span id="call-details-easting">Easting: {easting}</span>
        </dd>
      </div>
      <div>
        <dt></dt>
        <dd className="comp-lat-long">
          <span id="call-details-northing">Northing: {northing}</span>
        </dd>
      </div>
      <div>
        <dt></dt>
        <dd className="comp-lat-long">
          <span id="call-details-northing">Zone: {utmZone}</span>
        </dd>
      </div>
    </>
  );
};
