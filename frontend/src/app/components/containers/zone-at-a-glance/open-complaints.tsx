import { FC } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { complaintTypeToName } from "@apptypes/app/complaint-types";
import { Row, Col } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { FEATURE_TYPES } from "@constants/feature-flag-types";
import { isFeatureActive } from "@store/reducers/app";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  radius: 50,
  cutout: "60%",
};

interface BackgroundProps {
  assignedColor: string;
  unassignedColor: string;
}

interface Props {
  assigned: number;
  unassigned: number;
  type: string;
  background: BackgroundProps;
}

export const OpenComplaints: FC<Props> = ({
  type,
  assigned,
  unassigned,
  background: { assignedColor, unassignedColor },
}) => {
  const showExperimentalFeature = useAppSelector(isFeatureActive(FEATURE_TYPES.EXPERIMENTAL_FEATURE));

  const data = {
    labels: [],
    datasets: [
      {
        data: [assigned, unassigned],
        backgroundColor: [assignedColor, unassignedColor],
        borderColor: [assignedColor, unassignedColor],
      },
    ],
  };

  return (
    <div className="comp-zag-chart-container comp-nmargin-left-md">
      <div className="comp-zag-open-complaint-chart">
        <Doughnut
          data={data}
          options={options}
        />
      </div>
      <div className="comp-zag-legend item2">
        <h6>{complaintTypeToName(type)}</h6>
        <Row className="comp-zag-legend-row">
          <Col className="comp-zag-legend-bar-col">
            <span
              className="comp-zag-legend-bar"
              style={{ backgroundColor: unassignedColor }}
            ></span>
          </Col>
          <Col className="comp-zag-legend-label">Unassigned</Col>
          <Col className="comp-zag-legend-value">{unassigned}</Col>
        </Row>
        <Row>
          <Col className="comp-zag-legend-bar-col">
            <span
              className="comp-zag-legend-bar"
              style={{ backgroundColor: assignedColor }}
            ></span>
          </Col>
          <Col className="comp-zag-legend-label">Assigned</Col>
          <Col className="comp-zag-legend-value">{assigned}</Col>
        </Row>
        {showExperimentalFeature && (
          <Row>
            <Col>View complaints</Col>
          </Row>
        )}
      </div>
    </div>
  );
};
