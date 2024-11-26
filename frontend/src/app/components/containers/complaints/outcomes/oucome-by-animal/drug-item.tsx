import { FC, useEffect, useState } from "react";
import { Row, Col, ListGroup } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectDrugs, selectDrugUseMethods, selectRemainingDrugUse } from "@store/reducers/code-table";
import { formatDate } from "@common/methods";
import { selectOfficerListByAgency } from "@store/reducers/officer";
import { from } from "linq-to-typescript";
import { selectComplaint } from "@store/reducers/complaints";

type props = {
  vial: string;
  drug: string;
  amountUsed: string;

  injectionMethod: string;
  additionalComments: string;

  remainingUse: string | null;

  officer?: string;
  date?: Date;
};

export const DrugItem: FC<props> = ({
  vial,
  drug,
  amountUsed,
  injectionMethod,
  additionalComments,
  remainingUse,
  officer,
  date,
}) => {
  const complaintData = useAppSelector(selectComplaint);
  const drugs = useAppSelector(selectDrugs);
  const drugUseMethods = useAppSelector(selectDrugUseMethods);
  const remainingDrugUse = useAppSelector(selectRemainingDrugUse);
  const officers = useAppSelector(selectOfficerListByAgency);

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
    <ListGroup.Item className="py-3 px-0">
      <h5 className="mb-2 fw-bold">
        Vial #{vial} - {drugUsed}
      </h5>

      <Row as="dl">
        <Col
          xs={12}
          md={6}
        >
          <dt>Injection method</dt>
          <dd>{injectedMethod}</dd>
        </Col>
        <Col
          xs={12}
          md={6}
        >
          <dt>Amount used</dt>
          <dd>{amountUsed}mL</dd>
        </Col>
        <Col
          xs={12}
          md={6}
        >
          <dt>Fate of remaining drug in vial</dt>
          <dd>{remaining}</dd>
        </Col>

        <Col
          xs={12}
          md={6}
        >
          <dt>Additional comments</dt>
          <dd>{additionalComments ? <>{additionalComments}</> : "None"}</dd>
        </Col>

        <Col
          xs={12}
          md={6}
        >
          <dt>Drug administered by</dt>
          <dd>{assignedOfficer()}</dd>
        </Col>
        <Col
          xs={12}
          md={6}
        >
          <dt>Date</dt>
          <dd>{formatDate(date?.toString())}</dd>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};
