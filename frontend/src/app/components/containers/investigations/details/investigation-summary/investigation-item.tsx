import { CompLocationInfo } from "@/app/components/common/comp-location-info";
import { Investigation } from "@/generated/graphql";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

interface InvestigationItemProps {
  investigationData: Investigation;
  caseGuid: string;
  caseName: string;
}

export const InvestigationItem = ({ investigationData, caseGuid, caseName }: InvestigationItemProps) => {
  return (
    <section className="comp-details-section">
      <Card
        className="mb-3"
        border="default"
      >
        <Card.Body>
          <dl>
            <div>
              <dt>Investigation ID</dt>
              <dd>
                <pre id="investigation-summary-id">{investigationData.name}</pre>
              </dd>
            </div>
            <div>
              <dt>Case ID</dt>
              <dd>
                <pre id="investigation-summary-case-id">
                  {caseGuid ? <Link to={`/case/${caseGuid}`}>{caseName || caseGuid}</Link> : "N/A"}
                </pre>
              </dd>
            </div>
            {investigationData.description && (
              <div>
                <dt>Investigation description</dt>
                <dd>
                  <pre id="investigation-summary-description">{investigationData.description}</pre>
                </dd>
              </div>
            )}
            {investigationData.locationAddress && (
              <div>
                <dt>Location/address</dt>
                <dd>
                  <pre id="investigation-summary-location">{investigationData.locationAddress}</pre>
                </dd>
              </div>
            )}
            {investigationData.locationDescription && (
              <div>
                <dt>Location description</dt>
                <dd>
                  <pre id="investigation-summary-description">{investigationData.locationDescription}</pre>
                </dd>
              </div>
            )}
            {investigationData.locationGeometry && (
              <CompLocationInfo
                xCoordinate={
                  investigationData.locationGeometry.coordinates?.[0] === 0
                    ? ""
                    : (investigationData.locationGeometry.coordinates?.[0].toString() ?? "")
                }
                yCoordinate={
                  investigationData.locationGeometry.coordinates?.[1] === 0
                    ? ""
                    : (investigationData.locationGeometry.coordinates?.[1].toString() ?? "")
                }
              />
            )}
          </dl>
        </Card.Body>
      </Card>
    </section>
  );
};
