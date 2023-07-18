import { FC } from "react";
import { OfficeUserContainer } from "./office-user-container";
import { Row, Col } from "react-bootstrap";
import { OfficeStats } from "../../../types/complaints/zone-at-a-glance-stats";
import { useCollapse } from 'react-collapsed';
import chevronDown from "../../../../assets/images/chevron-down.png";
import chevronUp from "../../../../assets/images/chevron-up.png";


type Props = {
  hwcrOpenComplaintsOfficeStats: OfficeStats[],
  allegationOpenComplaintsOfficeStats: OfficeStats[],
}

export const OfficesContainer: FC<Props> = ({hwcrOpenComplaintsOfficeStats, allegationOpenComplaintsOfficeStats}) => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
  if(hwcrOpenComplaintsOfficeStats !== undefined && hwcrOpenComplaintsOfficeStats.length !== 0 && allegationOpenComplaintsOfficeStats !== undefined && allegationOpenComplaintsOfficeStats.length !== 0)
  {
  return (
    <>
        { 
            hwcrOpenComplaintsOfficeStats.map((item, index) => {
              let hwcrUnassigned:number = 0;
              let hwcrUnassignedStyle:{width:string} = {width: "49%" };
              let hwcrAssigned:number = 0;
              let hwcrAssignedStyle:{width:string} = {width: "49%" };

              let allegationUnassigned:number = 0;
              let allegationUnassignedStyle:{width: string} = {width: "49%" };
              let allegationAssigned:number = 0;
              let allegationAssignedStyle:{width: string} = {width: "49%" };

               //fear the hackiness -- this should probably be refactored -- the orderby on the backend should keep these in line, but allegationOpenComplaintsOfficeStats[index] makes me feel dirty
              if(item !== undefined && item.officers !== undefined && allegationOpenComplaintsOfficeStats[index] !== undefined && allegationOpenComplaintsOfficeStats[index].officers !== undefined)
              {
              if(item.assigned === 0 && item.unassigned !== 0)
              {
                hwcrUnassigned = item.unassigned;
                hwcrUnassignedStyle = {width: "93%" };
                hwcrAssignedStyle = {width: "5%" };
              }
              else if(item.assigned !== 0 && item.unassigned === 0)
              {
                hwcrUnassignedStyle = {width: "5%" };
                hwcrAssigned = item.assigned;
                hwcrAssignedStyle = {width: "93%" };
              }
              else if(item.assigned !== 0 && item.unassigned !== 0)
              {
                hwcrAssigned = item.assigned;
                hwcrAssignedStyle = {
                  width: (Math.round(item.assigned/(item.assigned+item.unassigned) * 100) - 1) + "%",
                };
                hwcrUnassigned = 100 - hwcrAssigned;
                hwcrUnassignedStyle = {
                  width: ( 100 - Math.round(item.assigned/(item.assigned+item.unassigned) * 100) - 1) + "%",
                };
              }
              if(allegationOpenComplaintsOfficeStats[index].assigned === 0 && allegationOpenComplaintsOfficeStats[index].unassigned !== 0)
              {
                allegationUnassigned = allegationOpenComplaintsOfficeStats[index].unassigned;
                allegationUnassignedStyle = {width: "93%" };
                allegationAssignedStyle = {width: "5%" };
              }
              else if(allegationOpenComplaintsOfficeStats[index].assigned !== 0 && allegationOpenComplaintsOfficeStats[index].unassigned === 0)
              {
                allegationUnassignedStyle = {width: "5%" };
                allegationAssigned = allegationOpenComplaintsOfficeStats[index].assigned;
                allegationAssignedStyle = {width: "93%" };
              }
              else if(allegationOpenComplaintsOfficeStats[index].assigned !== 0 && allegationOpenComplaintsOfficeStats[index].unassigned !== 0)
              {
                allegationAssigned = allegationOpenComplaintsOfficeStats[index].assigned;
                allegationAssignedStyle = {
                  width: (Math.round(allegationOpenComplaintsOfficeStats[index].assigned/(allegationOpenComplaintsOfficeStats[index].assigned+allegationOpenComplaintsOfficeStats[index].unassigned) * 100) - 1) + "%",
                };
                allegationUnassigned = allegationOpenComplaintsOfficeStats[index].unassigned;
                allegationUnassignedStyle = {
                  width: (100 - Math.round(allegationOpenComplaintsOfficeStats[index].assigned/(allegationOpenComplaintsOfficeStats[index].assigned+allegationOpenComplaintsOfficeStats[index].unassigned) * 100) - 1) + "%",
                };
              }
            }
            
                return <>
                    <div className="comp-zag-office-container">
                          <Row className="comp-zag-flex-container">
                            <Col className="comp-zag-office">
                              <div className="ms-auto left-float" {...getToggleProps({id: item.name})}>
                                <img src={(isExpanded ? chevronDown : chevronUp)} alt="chevron" />
                              </div>
                              <div className="left-float comp-padding-left-md">
                                {item.name + " Office"}
                              </div>
                            </Col>
                            <Col className="comp-padding-left-md">
                              <div className="comp-zag-stats-title">
                                Human Wildlife Conflict
                              </div>
                              <div className="comp-zag-bar-spacing" >
                                <div className="comp-zag-float-bar hwcr-unassigned" style={hwcrUnassignedStyle}>
                                  <div className="comp-zag-bar-text">
                                    {hwcrUnassigned}
                                  </div>
                                </div>
                                <div className="comp-zag-float-bar comp-zag-bar-spacer">
                                </div>
                                <div className="comp-zag-float-bar hwcr-assigned" style={hwcrAssignedStyle}>
                                  <div className="comp-zag-bar-text">
                                    {hwcrAssigned}
                                  </div>
                                </div>
                                <div className="clear-left-float" />
                              </div>
                              <div className="comp-zag-stats-view">
                                View Unassigned Compaints
                              </div>
                            </Col>
                            <Col className="comp-padding-left-md">
                              <div className="comp-zag-stats-title">
                                Enforcement
                              </div>
                              <div className="comp-zag-bar-spacing" >
                                  <div className="comp-zag-float-bar allegation-unassigned" style={allegationUnassignedStyle}>
                                    <div className="comp-zag-bar-text">
                                      {allegationUnassigned}
                                    </div>
                                  </div>
                                  <div className="comp-zag-float-bar comp-zag-bar-spacer">
                                  </div>
                                  <div className="comp-zag-float-bar allegation-assigned" style={allegationAssignedStyle}>
                                    <div className="comp-zag-bar-text">
                                      {allegationAssigned}
                                    </div>
                                  </div>
                                <div className="clear-left-float"/>
                              </div>
                              <div className="comp-zag-stats-view">
                                View Unassigned Compaints
                              </div>
                            </Col>
                          </Row>
                          <div className="collapsible">
                            <div {...getCollapseProps({id: item.name})}>
                              <OfficeUserContainer hwcrOfficers={item.officers} allegationOfficers={allegationOpenComplaintsOfficeStats[index].officers}/>
                            </div>
                          </div>
                    </div>
                </>;
            }) 
        }
    </>
  );
      }
      else
      {
        return <></>
      }
};
