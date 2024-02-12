import { FC, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectDrugs, selectDrugUseMethods, selectRemainingDrugUse } from "../../../../../store/reducers/code-table";
import { formatDate, getAvatarInitials } from "../../../../../common/methods";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import { from } from "linq-to-typescript";

type props = {
  vial: string;
  drug: string;
  amountUsed: number;
  amountDiscarded: number;

  injectionMethod: string;
  discardMethod: string;

  reactions: string;
  remainingUse: string;

  officer?: string;
  date?: Date;

  agency: string;
};

export const DrugItem: FC<props> = ({
  vial,
  drug,
  amountUsed,
  amountDiscarded,
  injectionMethod,
  discardMethod,
  reactions,
  remainingUse,
  officer,
  date,
  agency,
}) => {
  const drugs = useAppSelector(selectDrugs);
  const drugUseMethods = useAppSelector(selectDrugUseMethods);
  const remainingDrugUse = useAppSelector(selectRemainingDrugUse);
  const officers = useAppSelector(selectOfficersByAgencyDropdown(agency));

  const [injectedMethod, setInjectedMethod] = useState("");
  const [remaining, setRemaining] = useState("");
  const [drugUsed, setDrugUsed] = useState("");

  useEffect(() => {
    if (injectionMethod) {
      const selected = from(drugUseMethods).firstOrDefault((item) => item.value === injectionMethod);
      if (selected?.label) {
        setInjectedMethod(selected.label);
      }
    }
  }, [drugUseMethods, injectionMethod]);

  useEffect(() => {
    if (remainingUse) {
      const selected = from(remainingDrugUse).firstOrDefault((item) => item.value === remainingUse);
      if (selected?.label) {
        setRemaining(selected.label);
      }
    }
  }, [remainingDrugUse, remainingUse]);

  useEffect(() => {
    if (drug) {
      const selected = from(drugs).firstOrDefault((item) => item.value === drug);
      if (selected?.label) {
        setDrugUsed(selected.label);
      }
    }
  }, [drug, drugs]);

  const assignedOfficer = () => {
    if (officer) {
      const selected = officers.find((item) => item.value === officer);
      return selected?.label ?? "";
    }

    return "";
  };

  return (
    <div className="comp-padding-xs comp-drug-item">
      <Row>
        <Col md={2}>
          <b>Vial #{vial}</b>
        </Col>
        <Col md={8}>
          <b>{drugUsed}</b>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <label className="comp-outcome-drug-label">Amount used</label> {amountUsed}ml
        </Col>
        <Col md={4}>
          <label className="comp-outcome-drug-label">Injection method</label> {injectedMethod}
        </Col>
        <Col md={3}>
          <label className="comp-outcome-drug-label">Adverse reactions</label> {reactions}
        </Col>
      </Row>
      <Row>
        <Col md={5}>
          <label className="comp-outcome-drug-label">Fate of remaining drug in vial</label> {remaining}
        </Col>
        <Col md={4}>
          <label className="comp-outcome-drug-label">Amount discarded</label> {amountDiscarded}ml
        </Col>
        <Col md={3}>
          <label className="comp-outcome-drug-label">Discard method</label> {discardMethod}
        </Col>
      </Row>
      <Row>
        <Col>
          <label className="comp-outcome-drug-label">Officer</label>
          <div
            data-initials-sm={getAvatarInitials(assignedOfficer())}
            className="comp-orange-avatar-sm comp-details-inner-content"
          >
            <span id="comp-review-required-officer" className="comp-padding-left-xs">
              {assignedOfficer()}
            </span>
          </div>
        </Col>
        <Col>
          <label className="comp-outcome-drug-label">Date</label> {formatDate(date?.toString())}
        </Col>
      </Row>
    </div>
  );
};
