import { FC, useCallback, useEffect, useState } from "react";
import Option from "@apptypes/app/option";
import { CompRadioGroup } from "./comp-radiogroup";
import { bcBoundaries, bcUtmBoundaries, formatLatLongCoordinate } from "@common/methods";
import { CompSelect } from "./comp-select";
import { Button } from "react-bootstrap";
import { useAppDispatch } from "@hooks/hooks";
import { openModal } from "@store/reducers/app";
import { MAP_MODAL } from "@apptypes/modal/modal-types";
let utmObj = require("utm-latlng");

type Props = {
  id?: string;
  utmZones?: Array<Option>;
  initXCoordinate?: string;
  initYCoordinate?: string;
  syncCoordinates: (yCoordinate: string | undefined, xCoordinate: string | undefined) => void;
  throwError: (hasError: boolean) => void;
  sourceXCoordinate?: string;
  sourceYCoordinate?: string;
  enableCopyCoordinates: boolean;
  validationRequired: boolean;
  selectFromMap?: boolean;
  equipmentType?: string;
};

const COORDINATE_TYPES = {
  LatLong: "Latitude/Longitude",
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
  validationRequired,
  selectFromMap,
  equipmentType,
}) => {
  const dispatch = useAppDispatch();
  const [coordinateType, setCoordinateType] = useState(COORDINATE_TYPES.LatLong);
  const [xCoordinate, setXCoordinate] = useState<string | undefined>("");
  const [yCoordinate, setYCoordinate] = useState<string | undefined>("");
  const [xCoordinateErrorMsg, setXCoordinateErrorMsg] = useState<string | undefined>("");
  const [yCoordinateErrorMsg, setYCoordinateErrorMsg] = useState<string | undefined>("");
  const [eastingCoordinate, setEastingCoordinate] = useState<string | undefined>("");
  const [northingCoordinate, setNorthingCoordinate] = useState<string | undefined>("");
  const [eastingCoordinateErrorMsg, setEastingCoordinateErrorMsg] = useState<string | undefined>("");
  const [northingCoordinateErrorMsg, setNorthingCoordinateErrorMsg] = useState<string | undefined>("");
  const [zoneCoordinate, setZoneCoordinate] = useState<Option | undefined | null>();
  const [zoneErrorMsg, setZoneErrorMsg] = useState<string | undefined>("");

  const handleGeoPointChange = useCallback(
    (latitude: string, longitude: string) => {
      setYCoordinateErrorMsg("");
      setXCoordinateErrorMsg("");
      setYCoordinate(latitude);
      setXCoordinate(longitude);

      // handling removal of coordinates here
      if ([latitude?.trim(), longitude?.trim()].every((item) => item === "")) {
        throwError(false);
        syncCoordinates("", "");
        return;
      }
      const regex = /^-?(?:\d+(\.\d+)?|.\d+)$/;
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
    },
    [syncCoordinates, throwError],
  );

  const handleUtmGeoPointChange = useCallback(
    (easting: string, northing: string, zone: string) => {
      setEastingCoordinateErrorMsg("");
      setNorthingCoordinateErrorMsg("");
      setZoneErrorMsg("");
      setYCoordinateErrorMsg("");
      setXCoordinateErrorMsg("");

      setEastingCoordinate(easting);
      setNorthingCoordinate(northing);
      setZoneCoordinate(zone ? ({ label: zone, value: zone } as Option) : undefined);

      const isEmpty = (value: string | undefined) => [undefined, ""].includes(value?.toString().trim());
      if (isEmpty(easting) && isEmpty(northing) && isEmpty(zone)) {
        throwError(false);
        syncCoordinates("", "");
        return;
      }

      const regex = /^-?(?:\d+(\.\d+)?|.\d+)$/;
      let hasErrors = false;
      let lat;
      let lng;
      const errorTextSuffixLat = `The corresponding latitude value must be between ${bcBoundaries.minLatitude} and ${bcBoundaries.maxLatitude} degrees`;
      const errorTextSuffixLng = `The corresponding longitude value must be between ${bcBoundaries.minLongitude} and ${bcBoundaries.maxLongitude} degrees`;
      const eastingErrorText =
        `Invalid Easting. Easting value must be between 290220.6 and 720184.9 metres. ` + errorTextSuffixLng;
      const northingErrorText =
        `Invalid Northing. Northing value must be between 5346051.7 and 6655120.8 metres. ` + errorTextSuffixLat;
      const zoneErrorText = `Invalid Zone. Must be in 7-11 range`;

      let utm = new utmObj();

      const validateCoordinate = (
        value: string,
        setErrorMsg: (msg: string) => void,
        errorMsg: string,
        min: number,
        max: number,
      ) => {
        if (!regex.exec(value)) {
          setErrorMsg("Value must be a number");
          return true;
        }
        const numValue = parseInt(value);
        if (numValue > max || numValue < min) {
          setErrorMsg(errorMsg);
          return true;
        }
        return false;
      };

      hasErrors =
        validateCoordinate(
          easting,
          setEastingCoordinateErrorMsg,
          eastingErrorText,
          bcUtmBoundaries.minEasting,
          bcUtmBoundaries.maxEasting,
        ) || hasErrors;
      hasErrors =
        validateCoordinate(
          northing,
          setNorthingCoordinateErrorMsg,
          northingErrorText,
          bcUtmBoundaries.minNorthing,
          bcUtmBoundaries.maxNorthing,
        ) || hasErrors;

      const isValidZone = (zone: string | undefined): boolean => {
        return (
          (typeof zone === "string" &&
            !Number.isNaN(Number(zone)) &&
            utmZones?.map((item) => item.value).includes(zone)) ||
          false
        );
      };

      if (!isValidZone(zone)) {
        setZoneErrorMsg(zoneErrorText);
        hasErrors = true;
      }

      if (!hasErrors && easting && !Number.isNaN(easting) && northing && !Number.isNaN(northing)) {
        const latLongCoordinates = utm.convertUtmToLatLng(easting, northing, zone, "N");
        lat = latLongCoordinates.lat.toFixed(7);
        lng = latLongCoordinates.lng.toFixed(7);

        if (lat < bcBoundaries.minLatitude || lat > bcBoundaries.maxLatitude) {
          setNorthingCoordinateErrorMsg(northingErrorText);
          hasErrors = true;
        }

        if (lng < bcBoundaries.minLongitude || lng > bcBoundaries.maxLongitude) {
          setEastingCoordinateErrorMsg(eastingErrorText);
          hasErrors = true;
        } else {
          syncCoordinates(lat, lng);
        }
      }
      throwError(hasErrors);
    },
    [syncCoordinates, throwError, utmZones],
  );

  const handleChangeCoordinateType = (coordinateType: string) => {
    if (coordinateType === COORDINATE_TYPES.UTM) {
      if ([xCoordinateErrorMsg, yCoordinateErrorMsg].every((element) => element === "")) {
        if (yCoordinate && xCoordinate) {
          updateUtmFields(yCoordinate, xCoordinate);
        } else {
          setEastingCoordinate("");
          setNorthingCoordinate("");
          setZoneCoordinate(undefined);
        }
        setCoordinateType(coordinateType);
      }
    } else if (coordinateType === COORDINATE_TYPES.LatLong) {
      if ([eastingCoordinateErrorMsg, northingCoordinateErrorMsg, zoneErrorMsg].every((element) => element === "")) {
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
          handleUtmGeoPointChange(easting, northing, zone);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinateType, initXCoordinate, initYCoordinate]);

  useEffect(() => {
    //Check if xCoord and yCoord valid whenever they change
    if (xCoordinate && yCoordinate) {
      handleGeoPointChange(yCoordinate, xCoordinate);
    }
  }, [xCoordinate, yCoordinate]);

  const formatUtmCoordinate = (input: string | undefined): string => {
    const regex = /^-?(?:\d+(\.\d+)?|.\d+)$/;
    let result = input;
    if (regex.exec(input ?? "")) {
      result = input ? Number(input).toFixed(0).toString() : "";
    }
    return result ?? "";
  };

  useEffect(() => {
    if (enableCopyCoordinates) {
      switch (coordinateType) {
        case COORDINATE_TYPES.UTM:
          if (sourceXCoordinate && sourceYCoordinate) {
            const { easting, northing, zone } = updateUtmFields(sourceYCoordinate, sourceXCoordinate);
            if (easting && northing && zone) {
              handleUtmGeoPointChange(easting, northing, zone);
            }
          }
          break;
        case COORDINATE_TYPES.LatLong:
        default:
          setXCoordinate(sourceXCoordinate);
          setYCoordinate(sourceYCoordinate);
          if (sourceXCoordinate && sourceYCoordinate) {
            handleGeoPointChange(sourceYCoordinate, sourceXCoordinate);
          }
          break;
      }
    }
  }, [enableCopyCoordinates]);

  const isZeroOrEmpty = (input: string | undefined): boolean => {
    return input === "" || input === "0";
  };

  const openMapModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: MAP_MODAL,
        data: {
          title: "Select equipment from map",
          complaintCoords:
            sourceXCoordinate !== "0" && sourceYCoordinate !== "0"
              ? [Number(sourceXCoordinate), Number(sourceYCoordinate)]
              : null,
          setXCoordinate: setXCoordinate,
          setYCoordinate: setYCoordinate,
          syncCoordinates: syncCoordinates,
          equipmentCoords: xCoordinate && yCoordinate ? [yCoordinate, xCoordinate] : null,
          equipmentType: equipmentType,
        },
      }),
    );
  };

  return (
    <div
      className="comp-details-form-row"
      id={id}
    >
      <label
        className={validationRequired ? "validation-group-label" : ""}
        htmlFor="coordinate-type-radio-group"
      >
        Coordinates
      </label>
      <div
        id="coordinate-input-div"
        className="comp-details-input full-width"
      >
        <div className="comp-details-input full-width">
          {
            <CompRadioGroup
              id="coordinate-type-radio-group"
              options={[
                { value: COORDINATE_TYPES.LatLong, label: "Latitude/Longitude" } as Option,
                { value: COORDINATE_TYPES.UTM, label: "UTM" } as Option,
              ]}
              enableValidation={true}
              errorMessage=""
              itemClassName="comp-radio-btn"
              groupClassName={
                validationRequired
                  ? "comp-coordinate-type-radio-group validation-group-sub-label"
                  : "comp-coordinate-type-radio-group"
              }
              value={coordinateType}
              onChange={(option: any) => handleChangeCoordinateType(option.target.value)}
              isDisabled={false}
              radioGroupName="coordinate-type-radio-group"
            />
          }
        </div>
        <div className="coordinates-group-input">
          {coordinateType === COORDINATE_TYPES.LatLong && (
            <div className="comp-lat-long-input">
              <div>
                <input
                  placeholder="Latitude"
                  aria-label="Latitude"
                  type="text"
                  id="input-y-coordinate"
                  className={`
                  comp-form-control
                  ${yCoordinateErrorMsg ? "error-border" : ""}
                  ${validationRequired ? "validation-group-input" : ""}
                `}
                  onChange={(evt: any) => handleGeoPointChange(evt.target.value, xCoordinate ?? "")}
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
                  className={`
                  comp-form-control
                  ${xCoordinateErrorMsg ? "error-border" : ""}
                `}
                  onChange={(evt: any) => handleGeoPointChange(yCoordinate ?? "", evt.target.value)}
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
          {selectFromMap && coordinateType === COORDINATE_TYPES.LatLong && (
            <Button
              variant="outline-primary"
              onClick={openMapModal}
              className="comp-select-from-map-btn"
            >
              <span>Select from map</span>
              <span></span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-crosshair"
                viewBox="0 0 16 16"
                style={{ marginLeft: "5px", marginTop: "-2px" }}
              >
                <path d="M8.5.5a.5.5 0 0 0-1 0v.518A7 7 0 0 0 1.018 7.5H.5a.5.5 0 0 0 0 1h.518A7 7 0 0 0 7.5 14.982v.518a.5.5 0 0 0 1 0v-.518A7 7 0 0 0 14.982 8.5h.518a.5.5 0 0 0 0-1h-.518A7 7 0 0 0 8.5 1.018zm-6.48 7A6 6 0 0 1 7.5 2.02v.48a.5.5 0 0 0 1 0v-.48a6 6 0 0 1 5.48 5.48h-.48a.5.5 0 0 0 0 1h.48a6 6 0 0 1-5.48 5.48v-.48a.5.5 0 0 0-1 0v.48A6 6 0 0 1 2.02 8.5h.48a.5.5 0 0 0 0-1zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
              </svg>
            </Button>
          )}
        </div>
        {coordinateType === COORDINATE_TYPES.UTM && (
          <div className="comp-lat-long-utm-input validation-group-input">
            <input
              placeholder="Easting"
              aria-label="Easting"
              type="text"
              id="input-easting-coordinate"
              className={eastingCoordinateErrorMsg ? "comp-form-control error-border" : "comp-form-control"}
              onChange={(evt: any) =>
                handleUtmGeoPointChange(evt.target.value, northingCoordinate ?? "", zoneCoordinate?.value ?? "")
              }
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
              onChange={(evt: any) =>
                handleUtmGeoPointChange(eastingCoordinate ?? "", evt.target.value, zoneCoordinate?.value ?? "")
              }
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
              showInactive={false}
              classNamePrefix="comp-select"
              className="comp-details-input coordinate-zone-select"
              placeholder="Zone"
              options={utmZones}
              enableValidation={false}
              onChange={(e: any) =>
                handleUtmGeoPointChange(eastingCoordinate ?? "", northingCoordinate ?? "", e?.value)
              }
              value={zoneCoordinate}
              isClearable={true}
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
      </div>
    </div>
  );
};
