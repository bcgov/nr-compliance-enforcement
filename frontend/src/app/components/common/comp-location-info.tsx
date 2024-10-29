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
        <dd>
          <span id="geo-details-y-coordinate">Latitude: {yCoordinate ? `${yCoordinate}` : ""}</span>
        </dd>
      </div>
      <div>
        <dt>
          <span id="geo-details-x-coordinate">Longitude: {xCoordinate ? `${xCoordinate}` : ""}</span>
        </dt>
      </div>
      <br />
      <div>
        <dt></dt>
        <dd className="comp-lat-long">
          <span id="geo-details-easting-coordinate">Easting: {easting}</span>
        </dd>
      </div>
      <div>
        <dt></dt>
        <dd className="comp-lat-long">
          <span id="geo-details-northing-coordinate">Northing: {northing}</span>
        </dd>
      </div>
      <div>
        <dt></dt>
        <dd className="comp-lat-long">
          <span id="geo-details-zone-coordinate">Zone: {utmZone}</span>
        </dd>
      </div>
    </>
  );
};
