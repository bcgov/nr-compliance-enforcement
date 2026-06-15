import { useState } from "react";
import { Col, Row, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { z } from "zod";

import { FormField } from "@/app/components/common/form-field";
import { CompInput } from "@/app/components/common/comp-input";
import {
  cmToFeetInches,
  feetInchesToCm,
  kgToLb,
  lbToKg,
} from "@/app/components/containers/parties/form/party-form-utils";

type HeightWeightUnit = "metric" | "imperial";

interface HeightWeightFieldProps {
  form: any;
  isDisabled: boolean;
}

const sanitizeDigits = (value: string): string => value.replace(/\D/g, "");

export function HeightField({ form, isDisabled }: Readonly<HeightWeightFieldProps>) {
  const [unit, setUnit] = useState<HeightWeightUnit>("metric");

  return (
    <FormField
      form={form}
      name="heightInCm"
      label="Height"
      validators={{ onChange: z.number().positive("Height must be greater than 0").nullish() }}
      render={(field) => {
        const cm = field.state.value as number | null | undefined;
        const error = field.state.meta.errors?.[0]?.message || "";
        const feetInches = cm == null ? null : cmToFeetInches(cm);

        const handleCmChange = (raw: string): void => {
          const digits = sanitizeDigits(raw);
          field.handleChange(digits === "" ? null : Number(digits));
        };

        const handleFeetChange = (raw: string): void => {
          const digits = sanitizeDigits(raw);
          const feet = digits === "" ? 0 : Number(digits);
          const inches = feetInches?.inches ?? 0;
          field.handleChange(feet === 0 && inches === 0 ? null : feetInchesToCm(feet, inches));
        };

        const handleInchesChange = (raw: string): void => {
          let digits = sanitizeDigits(raw);
          if (digits !== "" && Number(digits) > 11) {
            digits = "11"; // inches are 0–11; whole feet carry the rest
          }
          const inches = digits === "" ? 0 : Number(digits);
          const feet = feetInches?.feet ?? 0;
          field.handleChange(feet === 0 && inches === 0 ? null : feetInchesToCm(feet, inches));
        };

        const setActive = (base: string, value: HeightWeightUnit) => `${base} ${unit === value ? "active" : ""}`;

        return (
          <>
            <ToggleButtonGroup
              className="height-toggle"
              type="radio"
              name="height-unit"
              value={unit}
              onChange={(value: HeightWeightUnit) => setUnit(value)}
            >
              <ToggleButton
                id="height-unit-metric"
                value="metric"
                disabled={isDisabled}
                className={setActive("toggle-button", "metric")}
              >
                cm
              </ToggleButton>

              <ToggleButton
                id="height-unit-imperial"
                value="imperial"
                disabled={isDisabled}
                className={setActive("toggle-button", "imperial")}
              >
                ft / in
              </ToggleButton>
            </ToggleButtonGroup>

            {unit === "metric" ? (
              <CompInput
                id="HeightInCm"
                divid=""
                type="input"
                inputClass="comp-form-control comp-details-input mt-3"
                value={cm == null ? "" : String(Math.round(cm))}
                error={error}
                maxLength={3}
                onChange={(evt: any) => handleCmChange(evt?.target?.value || "")}
                placeholder="Enter height in cm"
                disabled={isDisabled}
              />
            ) : (
              <Row className="mt-3">
                <Col>
                  <CompInput
                    id="HeightFeet"
                    divid=""
                    type="input"
                    inputClass="comp-form-control comp-details-input mt-3"
                    value={feetInches ? String(feetInches.feet) : ""}
                    error=""
                    maxLength={1}
                    onChange={(evt: any) => handleFeetChange(evt?.target?.value || "")}
                    placeholder="Feet"
                    disabled={isDisabled}
                  />
                </Col>
                <Col>
                  <CompInput
                    id="HeightInches"
                    divid=""
                    type="input"
                    inputClass="comp-form-control comp-details-input mt-3"
                    value={feetInches ? String(feetInches.inches) : ""}
                    error={error}
                    maxLength={2}
                    onChange={(evt: any) => handleInchesChange(evt?.target?.value || "")}
                    placeholder="Inches"
                    disabled={isDisabled}
                  />
                </Col>
              </Row>
            )}
          </>
        );
      }}
    />
  );
}

export function WeightField({ form, isDisabled }: Readonly<HeightWeightFieldProps>) {
  const [unit, setUnit] = useState<HeightWeightUnit>("metric");

  return (
    <FormField
      form={form}
      name="weightInKg"
      label="Weight"
      validators={{ onChange: z.number().positive("Weight must be greater than 0").nullish() }}
      render={(field) => {
        const kg = field.state.value as number | null | undefined;
        const error = field.state.meta.errors?.[0]?.message || "";
        const lbs = kg == null ? null : kgToLb(kg);

        const handleKgChange = (raw: string): void => {
          const digits = sanitizeDigits(raw);
          field.handleChange(digits === "" ? null : Number(digits));
        };

        const handleLbsChange = (raw: string): void => {
          const digits = sanitizeDigits(raw);
          const lbs = digits === "" ? 0 : Number(digits);
          field.handleChange(lbs === 0 ? null : lbToKg(lbs));
        };

        const setActive = (base: string, value: HeightWeightUnit) => `${base} ${unit === value ? "active" : ""}`;

        return (
          <>
            <ToggleButtonGroup
              className="weight-toggle"
              type="radio"
              name="weight-unit"
              value={unit}
              onChange={(value: HeightWeightUnit) => setUnit(value)}
            >
              <ToggleButton
                id="weight-unit-metric"
                value="metric"
                disabled={isDisabled}
                className={setActive("toggle-button", "metric")}
              >
                kg
              </ToggleButton>

              <ToggleButton
                id="weight-unit-imperial"
                value="imperial"
                disabled={isDisabled}
                className={setActive("toggle-button", "imperial")}
              >
                lbs
              </ToggleButton>
            </ToggleButtonGroup>

            {unit === "metric" ? (
              <CompInput
                id="WeightInKg"
                divid=""
                type="input"
                inputClass="comp-form-control comp-details-input mt-3"
                value={kg == null ? "" : String(Math.round(kg))}
                error={error}
                maxLength={3}
                onChange={(evt: any) => handleKgChange(evt?.target?.value || "")}
                placeholder="Enter weight in kg"
                disabled={isDisabled}
              />
            ) : (
              <CompInput
                id="WeightInLbs"
                divid=""
                type="input"
                inputClass="comp-form-control comp-details-input mt-3"
                value={lbs ? String(lbs) : ""}
                error=""
                maxLength={3}
                onChange={(evt: any) => handleLbsChange(evt?.target?.value || "")}
                placeholder="Pounds"
                disabled={isDisabled}
              />
            )}
          </>
        );
      }}
    />
  );
}
