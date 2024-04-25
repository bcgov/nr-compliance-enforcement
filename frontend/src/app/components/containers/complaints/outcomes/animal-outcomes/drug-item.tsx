import { FC, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectDrugs, selectDrugUseMethods, selectRemainingDrugUse } from "../../../../../store/reducers/code-table";
import { formatDate, getAvatarInitials } from "../../../../../common/methods";
import { selectOfficersByAgencyDropdown } from "../../../../../store/reducers/officer";
import { from } from "linq-to-typescript";
import { selectComplaint } from "../../../../../store/reducers/complaints";

type props = {
  vial: string;
  drug: string;
  amountUsed: string;
  amountDiscarded: string;

  injectionMethod: string;
  discardMethod: string;

  reactions: string;
  remainingUse: string;

  officer?: string;
  date?: Date;
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
}) => {
  const complaintData = useAppSelector(selectComplaint);
  const drugs = useAppSelector(selectDrugs);
  const drugUseMethods = useAppSelector(selectDrugUseMethods);
  const remainingDrugUse = useAppSelector(selectRemainingDrugUse);
  const officers = useAppSelector(selectOfficersByAgencyDropdown(complaintData?.ownedBy ?? "COS"));

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
          <span className="comp-fake-label">Amount used</span> {amountUsed}ml
        </Col>
        <Col md={4}>
          <span className="comp-fake-label">Injection method</span> {injectedMethod}
        </Col>
        <Col md={3}>
          <span className="comp-fake-label">Adverse reactions</span> {reactions}
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <span className="comp-fake-label">Fate of remaining drug in vial</span> {remaining}
        </Col>
        <Col md={3}>
          {remainingUse === "DISC" && (
            <>
              <span className="comp-fake-label">Amount discarded</span> {amountDiscarded}ml
            </>
          )}
        </Col>
        <Col md={3}>
          {remainingUse === "DISC" && (
            <>
              <span className="comp-fake-label">Discard method</span> {discardMethod}
            </>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <span className="comp-fake-label">Officer</span>
          <div
            data-initials-sm={getAvatarInitials(assignedOfficer())}
            className="comp-orange-avatar-sm comp-details-inner-content"
          >
            <span
              id="comp-review-required-officer"
              className="comp-padding-left-xs"
            >
              {assignedOfficer()}
            </span>
          </div>
        </Col>
        <Col md={6}>
          <span className="comp-fake-label">Date</span> {formatDate(date?.toString())}
        </Col>
      </Row>
    </div>
  );
};
