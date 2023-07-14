import { FC, useEffect, useState  } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { getOfficesInZone, officesInZone } from "../../../store/reducers/office";
import { getTokenProfile, profileZone } from "../../../store/reducers/app";
import { Office } from "../../../types/office/office";
import { OfficeUserContainer } from "./office-user-container";
import { Row, Col } from "react-bootstrap";

export const OfficesContainer: FC = () => {
    const dispatch = useAppDispatch();

    const defaultZone = useAppSelector(profileZone);
    const officeArray = useAppSelector(officesInZone);

    const [officeArrayList, setOfficeArrayList] = useState<Office[]>([]);
    
    useEffect(() => {
        if (!defaultZone || defaultZone === "") {
          dispatch(getTokenProfile());
        }
      }, [dispatch, defaultZone]);

      useEffect(() => {
        if ((defaultZone && defaultZone !== "") && (officeArray === null || officeArray.length === 0)) {
          dispatch(getOfficesInZone(defaultZone));
        }
        else
        {
            setOfficeArrayList(officeArray);
        }
      }, [dispatch, defaultZone, officeArray]);

  return (
    <>
        { 
            officeArrayList.map((item) => {
                return <>
                    <div className="comp-zag-office-container">
                          <Row className="comp-zag-flex-container">
                            <Col className="comp-zag-office">
                              {item.cos_geo_org_unit.office_location_name + " Office"}
                            </Col>
                            <Col className="comp-padding-left-md">
                              <div className="comp-zag-stats-title">
                                Human Wildlife Conflict
                              </div>
                              <div>
                                Stats
                              </div>
                              <div className="comp-zag-stats-view">
                                View Unassigned Compaints
                              </div>
                            </Col>
                            <Col className="comp-padding-left-md">
                              <div className="comp-zag-stats-title">
                                Enforcement
                              </div>
                              <div>
                                Stats
                              </div>
                              <div className="comp-zag-stats-view">
                                View Unassigned Compaints
                              </div>
                            </Col>
                          </Row>
                      <div><OfficeUserContainer officersInOffice={item.officers}/></div>
                    </div>
                </>;
            }) 
        }
    </>
  );
};
