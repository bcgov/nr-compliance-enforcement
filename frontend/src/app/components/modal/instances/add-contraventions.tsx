import { FC, memo, useMemo, useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData, isLoading } from "@store/reducers/app";
import { useForm } from "@tanstack/react-form";
import { FormField } from "@/app/components/common/form-field";
import { CompSelect } from "@/app/components/common/comp-select";
import { gql } from "graphql-request";

const GET_ACTS = gql`
  query GetLegislation($agencyCode: String, $legislationTypeCode: String) {
    legislation(agencyCode: $agencyCode, legislationTypeCode: $legislationTypeCode) {
      legislationGuid
      legislationText
    }
  }
`;

type ActivityType = "investigation" | "inspection";

const ModalLoading: FC = memo(() => (
  <div className="modal-loader">
    <div className="comp-overlay-content d-flex align-items-center justify-content-center">
      <Spinner
        animation="border"
        role="loading"
        id="modal-loader"
      />
    </div>
  </div>
));

type AddContraventionModalProps = {
  activityType: ActivityType;
  close: () => void;
  submit: () => void;
};

export const AddContraventionModal: FC<AddContraventionModalProps> = ({ activityType, close, submit }) => {
  // Selectors
  const loading = useAppSelector(isLoading);
  const modalData = useAppSelector(selectModalData);
  const actOptions = [
    { value: "EMA", label: "Environmental Management Act" },
    { value: "PA", label: "Park Act" },
  ];
  const regOptions = [
    { value: "HWR", label: "Hazardous Waste Regulation" },
    { value: "PCRAR", label: "Park, Conservancy and Recreation Area Regulation" },
  ];
  const secOptions = [
    { value: "7", label: "7. Hazardous waste - confinement" },
    { value: "8", label: "8. Hazardous waste management facility" },
    { value: "9", label: "9. Hazardous waste storage and disposal" },
    { value: "6", label: "6. Waste record" },
    { value: "4", label: "4. Permits for guiding required" },
    { value: "5", label: "5. Permits for trapping required" },
    { value: "77", label: "7. Must give information" },
  ];

  const actToRegulations: { [key: string]: string[] } = {
    EMA: ["HWR"],
    PA: ["PCRAR"],
  };

  const actToSection: { [key: string]: string[] } = {
    EMA: ["7", "8", "9", "6"],
    PA: ["4", "5", "77"],
  };

  const regToSection: { [key: string]: string[] } = {
    HWR: ["6"],
    PCRAR: ["4", "5", "77"],
  };

  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Vars
  const { title, activityGuid } = modalData;

  // State
  const [errorMessage, setErrorMessage] = useState<string>("");

  const defaultValues = useMemo(
    () => ({
      name: "",
      description: "",
      act: "",
      regulation: "",
      section: "",
    }),
    [],
  );

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      submit();
      close();
    },
  });

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="modal-create-add-case">
        {loading && <ModalLoading />}
        <div
          className="comp-details-body"
          style={{
            visibility: loading ? "hidden" : "inherit",
            display: "inherit",
          }}
        >
          <div>
            <h4 className="contravention-modal-subtitle">Enter Contravention Details</h4>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FormField
              form={form}
              name="act"
              label="Act"
              required
              render={(field) => (
                <CompSelect
                  id="act-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={actOptions}
                  value={actOptions.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select act"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                />
              )}
            />
            <form.Subscribe
              selector={(state) => state.values.act}
              children={(actValue) => {
                // Filter regulation options based on selected act
                const filteredRegOptions =
                  actValue && actToRegulations[actValue]
                    ? regOptions.filter((opt) => actToRegulations[actValue].includes(opt.value))
                    : regOptions;

                return (
                  actValue && (
                    <>
                      <FormField
                        form={form}
                        name="regulation"
                        label="Regulation"
                        render={(field) => (
                          <CompSelect
                            id="regulation-select"
                            classNamePrefix="comp-select"
                            className="comp-details-input"
                            options={filteredRegOptions}
                            value={filteredRegOptions.find((opt) => opt.value === field.state.value)}
                            onChange={(option) => field.handleChange(option?.value || "")}
                            placeholder="Select regulation"
                            isClearable={true}
                            showInactive={false}
                            enableValidation={true}
                            errorMessage={field.state.meta.errors?.[0]?.message || ""}
                          />
                        )}
                      />

                      <form.Subscribe
                        selector={(state) => ({ act: state.values.act, regulation: state.values.regulation })}
                        children={({ act, regulation }) => {
                          // Filter sections based on regulation if present, otherwise by act
                          let filteredSecOptions = secOptions;

                          if (regulation && regToSection[regulation]) {
                            filteredSecOptions = secOptions.filter((opt) =>
                              regToSection[regulation].includes(opt.value),
                            );
                          } else if (act && actToSection[act]) {
                            filteredSecOptions = secOptions.filter((opt) => actToSection[act].includes(opt.value));
                          }

                          return (
                            <FormField
                              form={form}
                              name="section"
                              label="Section"
                              render={(field) => (
                                <CompSelect
                                  id="section-select"
                                  classNamePrefix="comp-select"
                                  className="comp-details-input"
                                  options={filteredSecOptions}
                                  value={filteredSecOptions.find((opt) => opt.value === field.state.value)}
                                  onChange={(option) => field.handleChange(option?.value || "")}
                                  placeholder="Select section"
                                  isClearable={true}
                                  showInactive={false}
                                  enableValidation={true}
                                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                                />
                              )}
                            />
                          );
                        }}
                      />
                    </>
                  )
                );
              }}
            />
            <form.Subscribe
              selector={(state) => state.values.section}
              children={(sectionValue) => {
                return (
                  sectionValue && (
                    <>
                      <button
                        type="button"
                        className={`contravention-section ${selectedSection === "9(1)" ? "selected" : ""}`}
                        onClick={() => setSelectedSection("9(1)")}
                      >
                        <p className="mt-4">
                          <b>9</b> (1) A person must not store more than a prescribed amount of a hazardous waste except
                          in accordance with any of the following that apply:
                          <div className="contravention-alternate-text">Unlawful storage of Hazardous waste</div>
                        </p>
                      </button>

                      <button
                        type="button"
                        className={`contravention-section ${selectedSection === "9(1)(a)" ? "selected" : ""}`}
                        onClick={() => setSelectedSection("9(1)(a)")}
                      >
                        <p>(a) the regulations in relation to storing hazardous waste;</p>
                      </button>

                      <button
                        type="button"
                        className={`contravention-section ${selectedSection === "9(1)(b)" ? "selected" : ""}`}
                        onClick={() => setSelectedSection("9(1)(b)")}
                      >
                        <p>(b) an order that requires the person to store that kind of hazardous waste;</p>
                      </button>

                      <button
                        type="button"
                        className={`contravention-section ${selectedSection === "9(1)(c)" ? "selected" : ""}`}
                        onClick={() => setSelectedSection("9(1)(c)")}
                      >
                        <p>(c) an approved waste management plan that provides for storage of hazardous waste.</p>
                      </button>

                      <button
                        type="button"
                        className={`contravention-section ${selectedSection === "9(2)" ? "selected" : ""}`}
                        onClick={() => setSelectedSection("9(2)")}
                      >
                        <p>
                          (2) A person who is storing a quantity of a substance at the time that the substance is
                          prescribed to be a hazardous waste does not contravene subsection (1) by continuing to store
                          the same or a different quantity of that substance if the person notifies a director, in
                          accordance with the regulations, of the location, quantity and type of substance that the
                          person is storing.
                        </p>
                      </button>

                      <button
                        type="button"
                        className={`contravention-section ${selectedSection === "9(3)" ? "selected" : ""}`}
                        onClick={() => setSelectedSection("9(3)")}
                      >
                        <p>
                          (3) Despite subsection (2), a director may serve a person referred to in that subsection with
                          a written order to comply with the regulations or the approved waste management plan, and, if
                          a director does so, subject to subsection (4), the person must comply with the order within
                          the period the director specifies in that order.
                        </p>
                      </button>

                      <button
                        type="button"
                        className={`contravention-section ${selectedSection === "9(4)" ? "selected" : ""}`}
                        onClick={() => setSelectedSection("9(4)")}
                      >
                        <p>
                          (4) If a person who is served with an order under subsection (3) does not comply with the
                          regulations in the period specified by the director, the person must dispose of the hazardous
                          waste as directed by a director.
                        </p>
                      </button>
                    </>
                  )
                );
              }}
            />
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="comp-details-form-buttons">
          <Button
            variant="outline-primary"
            id="add-contravention-cancel-button"
            title="Cancel"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            id="add-contravention-save-button"
            title="Save Add Contravention"
            onClick={() => {
              submit();
              close();
            }}
          >
            <i className="bi bi-check-circle"></i>
            <span>Add Contravention</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
