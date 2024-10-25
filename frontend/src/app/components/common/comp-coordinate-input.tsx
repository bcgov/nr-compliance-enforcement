import { FC, useEffect, useState } from "react";
import Option from "../../types/app/option";
import { CompRadioGroup } from "./comp-radiogroup";
import { Coordinates } from "../../types/app/coordinate-type";
import { UTMCoordinates } from "../../types/app/utm-coordinate-type";
import { bcBoundaries } from "../../common/methods";
import { bcUtmBoundaries } from "../../common/methods";
import { CompSelect } from "./comp-select";
import { Button } from "react-bootstrap";
import { formatLatLongCoordinate } from "../../common/methods";
let utmObj = require("utm-latlng");

type Props = {
  id?: string;
  utmZones?: Array<Option>;
  initXCoordinate?: string | undefined;
  initYCoordinate?: string | undefined;
  initXCoordinateErrorMsg?: string | undefined;
  initYCoordinateErrorMsg?: string | undefined;
  syncCoordinates: (yCoordinate: string | undefined, xCoordinate: string | undefined) => void;
  throwError: (hasError: boolean) => void;
  sourceXCoordinate?: string;
  sourceYCoordinate?: string;
  enableCopyCoordinates: boolean;
};

const COORDINATE_TYPES = {
  LatLong: "Lat/Long",
  UTM: "UTM",
};

export const CompCoordinateInput: FC<Props> = ({
  id,
  utmZones,
  initXCoordinate,
  initYCoordinate,
  sourceXCoordinate,
  sourceYCoordinate,
  syncCoordinates,
  throwError,
  enableCopyCoordinates,
}) => {
  const [coordinateType, setCoordinateType] = useState(COORDINATE_TYPES.LatLong);
  const [xCoordinate, setXCoordinate] = useState<string | undefined>("");
  const [yCoordinate, setYCoordinate] = useState<string | undefined>("");
  const [xCoordinateErrorMsg, setXCoordinateErrorMsg] = useState<string | undefined>("");
  const [yCoordinateErrorMsg, setYCoordinateErrorMsg] = useState<string | undefined>("");
  const [eastingCoordinate, setEastingCoordinate] = useState<string | undefined>("");
  const [northingCoordinate, setNorthingCoordinate] = useState<string | undefined>("");
  const [eastingCoordinateErrorMsg, setEastingCoordinateErrorMsg] = useState<string | undefined>("");
  const [northingCoordinateErrorMsg, setNorthingCoordinateErrorMsg] = useState<string | undefined>("");
  const [zoneCoordinate, setZoneCoordinate] = useState<Option | undefined>();
  const [zoneErrorMsg, setZoneErrorMsg] = useState<string | undefined>("");

  const handleCoordinateChange = (input: string, type: Coordinates) => {
    if (type === Coordinates.Latitude) {
      setYCoordinate(input);
      if (xCoordinate) {
        handleGeoPointChange(input, xCoordinate);
      }
    } else {
      setXCoordinate(input);
      if (yCoordinate) {
        handleGeoPointChange(yCoordinate, input);
      }
    }
  };

  const handleGeoPointChange = (latitude: string, longitude: string) => {
    setYCoordinateErrorMsg("");
    setXCoordinateErrorMsg("");
    const regex = /^-?\d*\.?\d*$/;
    let hasErrors = false;
    if (!regex.exec(latitude)) {
      setYCoordinateErrorMsg("Latitude value must be a number");
      hasErrors = true;
    }
    if (!regex.exec(longitude)) {
      setXCoordinateErrorMsg("Longitude value must be a number");
      hasErrors = true;
    }
    if (latitude && !Number.isNaN(latitude)) {
      const item = parseFloat(latitude);
      if (item > bcBoundaries.maxLatitude || item < bcBoundaries.minLatitude) {
        setYCoordinateErrorMsg(
          `Latitude value must be between ${bcBoundaries.maxLatitude} and ${bcBoundaries.minLatitude} degrees`,
        );
        hasErrors = true;
      }
    }
    if (longitude && !Number.isNaN(longitude) && longitude.trim() !== "-") {
      const item = parseFloat(longitude);
      if (item > bcBoundaries.maxLongitude || item < bcBoundaries.minLongitude) {
        setXCoordinateErrorMsg(
          `Longitude value must be between ${bcBoundaries.minLongitude} and ${bcBoundaries.maxLongitude} degrees`,
        );
        hasErrors = true;
      } else {
        syncCoordinates(latitude, longitude);
      }
    }
    throwError(hasErrors);
  };

  const handleUtmCoordinateChange = (input: string | Option, type: UTMCoordinates) => {
    if (type === UTMCoordinates.Easting) {
      setEastingCoordinate(input.toString());
      if (northingCoordinate && zoneCoordinate) {
        handleUtmGeoPointChange(input.toString(), northingCoordinate, zoneCoordinate.value as string);
      }
    } else if (type === UTMCoordinates.Northing) {
      setNorthingCoordinate(input.toString());
      if (eastingCoordinate && zoneCoordinate) {
        handleUtmGeoPointChange(eastingCoordinate, input.toString(), zoneCoordinate.value as string);
      }
    } else {
      setZoneCoordinate(input as Option);
      if (northingCoordinate && eastingCoordinate) {
        handleUtmGeoPointChange(eastingCoordinate, northingCoordinate, (input as Option).value as string);
      }
    }
  };

  const handleUtmGeoPointChange = (easting: string, northing: string, zone: string) => {
    setEastingCoordinateErrorMsg("");
    setNorthingCoordinateErrorMsg("");
    setZoneErrorMsg("");
    setYCoordinateErrorMsg("");
    setXCoordinateErrorMsg("");

    const regex = /^\d*\.?\d*$/;
    let hasErrors = false;
    let lat;
    let lng;

    const errorTextSuffix = `The corresponding longitude value must be between ${bcBoundaries.minLongitude} and ${bcBoundaries.maxLongitude} degrees`;
    const eastingErrorText = `Invalid Easting. ` + errorTextSuffix;
    const northingErrorText = `Invalid Northing. ` + errorTextSuffix;
    const zoneErrorText = `Invalid Zone. Must be in 7-11 range`;

    let utm = new utmObj();
    if (!regex.exec(easting)) {
      setEastingCoordinateErrorMsg("Easting value must be a number");
      hasErrors = true;
    }
    if (!regex.exec(northing)) {
      setNorthingCoordinateErrorMsg("Northing value must be a number");
      hasErrors = true;
    }

    if (easting && !Number.isNaN(easting)) {
      const item = parseInt(easting);
      if (item > bcUtmBoundaries.maxEasting || item < bcUtmBoundaries.minEasting) {
        setEastingCoordinateErrorMsg(eastingErrorText);
        hasErrors = true;
      }
    }

    if (northing && !Number.isNaN(northing)) {
      const item = parseInt(northing);
      if (item > bcUtmBoundaries.maxNorthing || item < bcUtmBoundaries.minNorthing) {
        setNorthingCoordinateErrorMsg(northingErrorText);
        hasErrors = true;
      }
    }

    if (zone && !Number.isNaN(zone)) {
      if (
        !utmZones
          ?.map((item) => {
            return item.value;
          })
          .includes(zone.toString())
      ) {
        setZoneErrorMsg(zoneErrorText);
        hasErrors = true;
      }
    }

    if (hasErrors === false && easting && !Number.isNaN(easting) && northing && !Number.isNaN(northing)) {
      const latLongCoordinates = utm.convertUtmToLatLng(easting, northing, zone, "N");
      lat = latLongCoordinates.lat.toFixed(7);
      if (lat > bcBoundaries.maxLatitude || lat < bcBoundaries.minLatitude) {
        setNorthingCoordinateErrorMsg(northingErrorText);
        hasErrors = true;
      }
      lng = latLongCoordinates.lng.toFixed(7);
      if (lng > bcBoundaries.maxLongitude || lng < bcBoundaries.minLongitude) {
        setEastingCoordinateErrorMsg(eastingErrorText);
        hasErrors = true;
      } else {
        syncCoordinates(lat, lng);
      }
    }
    throwError(hasErrors);
  };

  const handleChangeCoordinateType = (coordinateType: string) => {
    if (coordinateType === COORDINATE_TYPES.UTM) {
      if (xCoordinateErrorMsg === "" && yCoordinateErrorMsg === "") {
        if (yCoordinate && xCoordinate) {
          updateUtmFields(yCoordinate, xCoordinate);
        }
        setCoordinateType(coordinateType);
      }
    } else if (coordinateType === COORDINATE_TYPES.LatLong) {
      if (eastingCoordinateErrorMsg === "" && northingCoordinateErrorMsg === "") {
        if (eastingCoordinate && northingCoordinate && zoneCoordinate?.value) {
          let utm = new utmObj();
          const latLongCoordinates = utm.convertUtmToLatLng(
            eastingCoordinate,
            northingCoordinate,
            zoneCoordinate?.value,
            "N",
          );
          const lat = formatLatLongCoordinate(latLongCoordinates.lat.toString());
          const lng = formatLatLongCoordinate(latLongCoordinates.lng.toString());

          setYCoordinate(lat);
          setXCoordinate(lng);
          syncCoordinates(lat, lng);
        }
        setCoordinateType(coordinateType);
      }
    }
  };

  const updateUtmFields = (lat: string, lng: string): { easting: string; northing: string; zone: string } => {
    let utm = new utmObj();
    const utmCoordinates = utm.convertLatLngToUtm(lat, lng, 3);
    setEastingCoordinate(utmCoordinates.Easting);
    setNorthingCoordinate(utmCoordinates.Northing);
    setZoneCoordinate({ label: utmCoordinates.ZoneNumber, value: utmCoordinates.ZoneNumber } as Option);

    return { easting: utmCoordinates.Easting, northing: utmCoordinates.Northing, zone: utmCoordinates.ZoneNumber };
  };

  useEffect(() => {
    const lat = formatLatLongCoordinate(initYCoordinate);
    const lng = formatLatLongCoordinate(initXCoordinate);

    setYCoordinate(lat);
    setXCoordinate(lng);

    if (lat && lng && !isZeroOrEmpty(lat) && !isZeroOrEmpty(lng)) {
      if (coordinateType === COORDINATE_TYPES.LatLong) {
        handleGeoPointChange(lat, lng);
      }

      if (coordinateType === COORDINATE_TYPES.UTM) {
        const { easting, northing, zone } = updateUtmFields(lat, lng);
        if (easting && northing && zone) {
          handleUtmGeoPointChange(easting, northing, zone as string);
        }
      }
    }
  }, [initXCoordinate, initYCoordinate]);

  const formatUtmCoordinate = (input: string | undefined): string => {
    const regex = /^-?\d*\.?\d*$/;
    let result = input;
    if (regex.exec(input ?? "")) {
      result = input ? Number(input).toFixed(0).toString() : "";
    }
    return result ?? "";
  };

  const isZeroOrEmpty = (input: string | undefined): boolean => {
    return input === "" || input === "0";
  };

  return (
    <div
      className="comp-details-form-row"
      id={id}
    >
      <label htmlFor="coordinate-type-radio-group">Coordinates</label>
      <div
        id="coordinate-input-div"
        className="comp-details-input full-width"
      >
        <div className="comp-details-input full-width">
          {
            <CompRadioGroup
              id="coordinate-type-radio-group"
              options={[
                { value: COORDINATE_TYPES.LatLong, label: "Lat/Long" } as Option,
                { value: COORDINATE_TYPES.UTM, label: "UTM" } as Option,
              ]}
              enableValidation={true}
              errorMessage=""
              itemClassName="comp-radio-btn"
              groupClassName="comp-coordinate-type-radio-group"
              value={coordinateType}
              onChange={(option: any) => handleChangeCoordinateType(option.target.value)}
              isDisabled={false}
              radioGroupName="coordinate-type-radio-group"
            />
          }
        </div>
        {coordinateType === COORDINATE_TYPES.LatLong && (
          <div className="comp-lat-long-input">
            <div>
              <input
                placeholder="Latitude"
                aria-label="Latitude"
                type="text"
                id="input-y-coordinate"
                className={yCoordinateErrorMsg ? "comp-form-control error-border" : "comp-form-control"}
                onChange={(evt: any) => handleCoordinateChange(evt.target.value, Coordinates.Latitude)}
                value={yCoordinate ?? ""}
                maxLength={120}
              />
              <label
                className="comp-form-label-below"
                htmlFor="input-y-coordinate"
                hidden
              >
                Latitude
              </label>
            </div>
            <div>
              <input
                placeholder="Longitude"
                aria-label="Longitude"
                type="text"
                id="input-x-coordinate"
                className={xCoordinateErrorMsg ? "comp-form-control error-border" : "comp-form-control"}
                onChange={(evt: any) => handleCoordinateChange(evt.target.value, Coordinates.Longitude)}
                value={xCoordinate ?? ""}
                maxLength={120}
              />
              <label
                className="comp-form-label-below"
                htmlFor="input-x-coordinate"
                hidden
              >
                Longitude
              </label>
            </div>
          </div>
        )}
        {coordinateType === COORDINATE_TYPES.UTM && (
          <div className="comp-lat-long-utm-input">
            <input
              placeholder="Easting"
              aria-label="Easting"
              type="text"
              id="input-easting-coordinate"
              className={eastingCoordinateErrorMsg ? "comp-form-control error-border" : "comp-form-control"}
              onChange={(evt: any) => handleUtmCoordinateChange(evt.target.value, UTMCoordinates.Easting)}
              value={formatUtmCoordinate(eastingCoordinate) ?? ""}
            />
            <label
              className="comp-form-label-below"
              htmlFor="input-easting-coordinate"
              hidden
            >
              Easting
            </label>

            <input
              placeholder="Northing"
              aria-label="Northing"
              type="text"
              id="input-northing-coordinate"
              className={northingCoordinateErrorMsg ? "comp-form-control error-border" : "comp-form-control"}
              onChange={(evt: any) => handleUtmCoordinateChange(evt.target.value, UTMCoordinates.Northing)}
              value={formatUtmCoordinate(northingCoordinate) ?? ""}
            />
            <label
              className="comp-form-label-below"
              htmlFor="input-northing-coordinate"
              hidden
            >
              Northing
            </label>

            <CompSelect
              id="utm-zone-id"
              classNamePrefix="comp-select"
              className="comp-details-input coordinate-zone-select"
              placeholder="Zone"
              options={utmZones}
              enableValidation={false}
              onChange={(e: any) => handleUtmCoordinateChange(e, UTMCoordinates.Zone)}
              value={zoneCoordinate}
            />
            <label
              className="comp-form-label-below"
              htmlFor="utm-zone-id"
              hidden
            >
              Zone
            </label>
          </div>
        )}
        <div className="error-message">{yCoordinateErrorMsg}</div>
        <div className="error-message">{xCoordinateErrorMsg}</div>
        <div className="error-message">{eastingCoordinateErrorMsg}</div>
        <div className="error-message">{northingCoordinateErrorMsg}</div>
        <div className="error-message">{zoneErrorMsg}</div>
        {enableCopyCoordinates && (
          <Button
            variant="outline-primary"
            size="sm"
            className="btn-txt svg-icon mt-2"
            id="copy-coordinates-button"
            onClick={() => {
              if (coordinateType === COORDINATE_TYPES.LatLong) {
                setXCoordinate(sourceXCoordinate);
                setYCoordinate(sourceYCoordinate);
                if (sourceXCoordinate && sourceYCoordinate) {
                  handleGeoPointChange(sourceYCoordinate, sourceXCoordinate);
                }
              } else if (coordinateType === COORDINATE_TYPES.UTM) {
                if (sourceXCoordinate && sourceYCoordinate) {
                  const { easting, northing, zone } = updateUtmFields(sourceYCoordinate, sourceXCoordinate);
                  if (easting && northing && zone) {
                    handleUtmGeoPointChange(easting, northing, zone as string);
                  }
                }
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-copy"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
              />
            </svg>
            <span>Copy coordinates from complaint details</span>
          </Button>
        )}
      </div>
    </div>
  );
};
