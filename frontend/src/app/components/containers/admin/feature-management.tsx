import { FC, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { assignOfficerToOffice, selectOfficersDropdown } from "../../../store/reducers/officer";
import { CompSelect } from "../../common/comp-select";
import Option from "../../../types/app/option";
import { fetchOfficeAssignments, selectOfficesForAssignmentDropdown } from "../../../store/reducers/office";
import { ToastContainer } from "react-toastify";
import { ToggleSuccess } from "../../../common/toast";
import {
  clearNotification,
  selectNotification,
  checkFeatureActive,
  updateFeatureFlag,
} from "../../../store/reducers/app";
import { Table, Form, InputGroup } from "react-bootstrap";
import { FEATURE_TYPES } from "../../../constants/feature-flag-types";

export const FeatureManagement: FC = () => {
  const dispatch = useAppDispatch();
  const officers = useAppSelector(selectOfficersDropdown(true));
  const officeAssignments = useAppSelector(selectOfficesForAssignmentDropdown);
  const notification = useAppSelector(selectNotification);
  //for demo, COS for now
  // const allFeatures = useAppSelector((state) => state.app.featureFlag.allFeatures);
  // console.log(allFeatures);
  const showExperimentalFeature = useAppSelector(checkFeatureActive(FEATURE_TYPES.EXPERIMENTAL_FEATURE));
  const showGir = useAppSelector(checkFeatureActive(FEATURE_TYPES.GIR_COMPLAINT));
  const showActionTaken = useAppSelector(checkFeatureActive(FEATURE_TYPES.ACTION_TAKEN));

  const [experimental, setExperimental] = useState<boolean>(false);
  const [gir, setGir] = useState<boolean>(false);
  const [actionTaken, setActionTaken] = useState<boolean>(false);

  useEffect(() => {
    if (officeAssignments) dispatch(fetchOfficeAssignments());
  }, [dispatch]);

  useEffect(() => {
    setExperimental(showExperimentalFeature);
  }, [showExperimentalFeature]);
  useEffect(() => {
    setGir(showGir);
  }, [showGir]);
  useEffect(() => {
    setActionTaken(showActionTaken);
  }, [showActionTaken]);

  useEffect(() => {
    const { type } = notification;
    if (type !== "") {
      dispatch(clearNotification());
    }
  }, [dispatch, notification]);

  return (
    <>
      <ToastContainer />
      <div className="comp-page-container comp-page-container--noscroll">
        <div className="comp-page-header">
          <div className="comp-page-title-container">
            <h1>Feature Management</h1>
          </div>
          <p>Manage features within different agency.</p>

          <h6>Agency: COS</h6>
          <div className="comp-table">
            <Table
              bordered
              hover
              responsive="sm"
              width={500}
            >
              <thead>
                <tr>
                  <th>No</th>
                  <th>Feature</th>
                  <th style={{ maxWidth: "100px" }}>Description</th>
                  <th style={{ width: "80px", textAlign: "center" }}>Active</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Experimental Features</td>
                  <td style={{ maxWidth: "500px", wordWrap: "break-word", whiteSpace: "normal" }}>
                    Features that were included as early prototypes or placeholders , may be used to solicit feedback
                    from user groups.
                  </td>
                  <td style={{ width: "80px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      id="feature1"
                      checked={experimental}
                      onChange={() => {
                        setExperimental(!experimental);
                        dispatch(updateFeatureFlag("479fb225-9491-4a2d-a4f2-19c429b08228", !experimental));
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>GIR Complaints</td>
                  <td style={{ maxWidth: "500px", wordWrap: "break-word", whiteSpace: "normal" }}>
                    Load and display general Incident Report (GIR)  incidents from webEOC.
                  </td>
                  <td style={{ width: "80px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      id="feature2"
                      checked={gir}
                      onChange={() => {
                        setGir(!gir);
                        dispatch(updateFeatureFlag("87d4a9c1-c420-4e2f-aeff-1c15475d4242", !gir));
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Actions Taken</td>
                  <td style={{ maxWidth: "500px", wordWrap: "break-word", whiteSpace: "normal" }}>
                    Load and display actions taken for incidents and updates from webEOC.
                  </td>
                  <td style={{ width: "80px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      id="feature3"
                      checked={actionTaken}
                      onChange={() => {
                        setActionTaken(!actionTaken);
                        dispatch(updateFeatureFlag("9ebaebac-a67b-4e82-b558-7b942b46440b", !actionTaken));
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};
