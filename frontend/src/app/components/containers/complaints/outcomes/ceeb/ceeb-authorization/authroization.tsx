import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/hooks";
import { ComplaintParams } from "../../../details/complaint-details-edit";
import { setIsInEdit } from "../../../../../../store/reducers/cases";
import { selectCeebAuthorization } from "../../../../../../store/reducers/case-selectors";
import { Button, Card } from "react-bootstrap";
import { BsExclamationCircleFill } from "react-icons/bs";
import { AuthorizationForm } from "./authorization-form";
import { AuthorizationItem } from "./authorization-item";

export const CeebAuthoization: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  //-- select the authorization
  const data = useAppSelector(selectCeebAuthorization);

  const isInEdit = useAppSelector((state) => state.cases.isInEdit);
  const [editable, setEditable] = useState(true);
  const showSectionErrors = isInEdit.showSectionErrors;

  const cases = useAppSelector((state) => state.cases);
  const hasAuthorization = !cases.site;

  useEffect(() => {
    if (!hasAuthorization && editable) {
      dispatch(setIsInEdit({ site: false }));
    } else dispatch(setIsInEdit({ site: editable }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, hasAuthorization]);

  useEffect(() => {
    setEditable(!data.id);
  }, [data.id]);

  const toggleEdit = () => {
    setEditable(true);
  };

  return (
    <section
      className="comp-details-section"
      id="ceeb-authorization"
    >
      <div className="comp-details-section-header">
        <h3>Authorization</h3>
        {!editable && (
          <div className="comp-details-section-header-actions">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                toggleEdit();
              }}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit</span>
            </Button>
          </div>
        )}
      </div>

      <Card
        id="ceeb-authorization"
        border={showSectionErrors ? "danger" : "default"}
      >
        <Card.Body>
          {showSectionErrors && (
            <div className="section-error-message">
              <BsExclamationCircleFill />
              {hasAuthorization ? (
                <span>Save section before closing the complaint.</span>
              ) : (
                <span>Complete section before closing the complaint.</span>
              )}
            </div>
          )}

          {editable ? (
            <AuthorizationForm
              {...data}
              leadIdentifier={id}
              toggleEdit={setEditable}
            />
          ) : (
            <AuthorizationItem {...data} />
          )}
        </Card.Body>
      </Card>
    </section>
  );
};
