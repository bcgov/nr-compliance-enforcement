import { FC, memo, useMemo, useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { useForm } from "@tanstack/react-form";
import { FormField } from "@/app/components/common/form-field";
import { CompSelect } from "@/app/components/common/comp-select";
import { convertLegislationToOption, useLegislationSearchQuery } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { getUserAgency } from "@/app/service/user-service";

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
  // Form Definition
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

  // Selectors
  const modalData = useAppSelector(selectModalData);
  const userAgency = getUserAgency();

  // GQL driven data
  const { data, isLoading, error } = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCode: "ACT",
    enabled: true,
  });

  const actOptions = convertLegislationToOption(data?.legislation ?? []);

  const sectionContent: { [key: string]: Array<{ id: string; name: string; content: JSX.Element }> } = {
    "8f7e5b45-ac1c-419c-b063-dc319ff55aff": [
      {
        id: "6(1)",
        name: "Hazardous Waste Regulation 64/88 s.6(1) : The owner of a hazardous waste facility must keep for inspection by an officer an operating record at the facility and must record in a written or retrievable electronic form the following information for each hazardous waste received, stored or shipped:",
        content: (
          <p className="mt-4">
            <b>6</b> (1) The owner of a hazardous waste facility must keep for inspection by an officer an operating
            record at the facility and must record in a written or retrievable electronic form the following information
            for each hazardous waste received, stored or shipped:
          </p>
        ),
      },
      {
        id: "6(1)(a) : the description including",
        name: "Hazardous Waste Regulation 64/88 s.6(1)(a)",
        content: <p className="ms-4">(a) the description including</p>,
      },
      {
        id: "6(1)(a)(i) : the name and identification number as described in the federal dangerous goods regulations, and",
        name: "Hazardous Waste Regulation 64/88 s.6(1)(a)(i)",
        content: (
          <p className="ms-5">
            (i) the name and identification number as described in the federal dangerous goods regulations, and
          </p>
        ),
      },
      {
        id: "6(1)(a)(ii) : the physical state (i.e. whether it is solid, liquid, gaseous or a combination of one or more of these)",
        name: "Hazardous Waste Regulation 64/88 s.6(1)(a)(ii): the physical state (i.e. whether it is solid, liquid, gaseous or a combination of one or more of these)",
        content: (
          <p className="ms-5">
            (ii) the physical state (i.e. whether it is solid, liquid, gaseous or a combination of one or more of these)
          </p>
        ),
      },
      {
        id: "6(1)(b)",
        name: "Hazardous Waste Regulation 64/88 s.6(1)(b) : the quantity in kilograms or litres",
        content: <p className="ms-4">(b) the quantity in kilograms or litres</p>,
      },
    ],
    "be637fda-e5ae-455d-851e-d75922b51c4f": [
      {
        id: "7(1)",
        name: "Environmental Management Act SBC 2003 s.7(1) : A person who produces, stores, transports, handles, treats, recycles, deals with, processes or owns a hazardous waste must keep the hazardous waste confined in accordance with the regulations.",
        content: (
          <p className="mt-4">
            <b>7</b> (1) A person who produces, stores, transports, handles, treats, recycles, deals with, processes or
            owns a hazardous waste must keep the hazardous waste confined in accordance with the regulations.
          </p>
        ),
      },
      {
        id: "7(2)",
        name: "Environmental Management Act SBC 2003 s.7(2) : Release hazardous waste",
        content: (
          <p className="mt-4">
            (2) Except to the extent expressly authorized by a permit, an approval, an order, a waste management plan or
            the regulations, a person must not release a hazardous waste from the confinement required by subsection
            (1).
            <div className="contravention-alternate-text">Release hazardous waste</div>
          </p>
        ),
      },
    ],
    "5b1fb227-fa10-4b5a-bcdf-88faa80c8e91": [
      {
        id: "8",
        name: "Environmental Management Act SBC 2003 s.8 : Unauthorized operation of hazardous waste site",
        content: (
          <p className="mt-4">
            <b>8</b> A person must not construct, establish, alter, enlarge, extend, use or operate a facility for the
            treatment, recycling, storage, disposal or destruction of a hazardous waste except in accordance with the
            regulations.
            <div className="contravention-alternate-text">Unauthorized operation of hazardous waste site</div>
          </p>
        ),
      },
    ],
    "7f900312-c052-486e-a6d0-70c32e2566f7": [
      {
        id: "9(1)",
        name: "Environmental Management Act SBC 2003 s.9(1) : Unlawful storage of hazardous waste",
        content: (
          <p className="mt-4">
            <b>9</b> (1) A person must not store more than a prescribed amount of a hazardous waste except in accordance
            with any of the following that apply:
            <div className="contravention-alternate-text">Unlawful storage of Hazardous waste</div>
          </p>
        ),
      },
      {
        id: "9(1)(a)",
        name: "Environmental Management Act SBC 2003 s.9(1)(a) : the regulations in relation to storing hazardous waste;",
        content: <p className="ms-4">(a) the regulations in relation to storing hazardous waste;</p>,
      },
      {
        id: "9(1)(b)",
        name: "Environmental Management Act SBC 2003 s.9(1)(b) : an order that requires the person to store that kind of hazardous waste;",
        content: <p className="ms-4">(b) an order that requires the person to store that kind of hazardous waste;</p>,
      },
      {
        id: "9(1)(c)",
        name: "Environmental Management Act SBC 2003 s.9(1)(c) : an approved waste management plan that provides for storage of hazardous waste.",
        content: (
          <p className="ms-4">(c) an approved waste management plan that provides for storage of hazardous waste.</p>
        ),
      },
      {
        id: "9(2)",
        name: "Environmental Management Act SBC 2003 s.9(2) : A person who is storing a quantity of a substance at the time that the substance is prescribed to be a hazardous waste does not contravene subsection (1) by continuing to store the same or a different quantity of that substance if the person notifies a director, in accordance with the regulations, of the location, quantity and type of substance that the person is storing.",
        content: (
          <p>
            (2) A person who is storing a quantity of a substance at the time that the substance is prescribed to be a
            hazardous waste does not contravene subsection (1) by continuing to store the same or a different quantity
            of that substance if the person notifies a director, in accordance with the regulations, of the location,
            quantity and type of substance that the person is storing.
          </p>
        ),
      },
      {
        id: "9(3)",
        name: "Environmental Management Act SBC 2003 s.9(3) : Despite subsection (2), a director may serve a person referred to in that subsection with a written order to comply with the regulations or the approved waste management plan, and, if a director does so, subject to subsection (4), the person must comply with the order within the period the director specifies in that order.",
        content: (
          <p>
            (3) Despite subsection (2), a director may serve a person referred to in that subsection with a written
            order to comply with the regulations or the approved waste management plan, and, if a director does so,
            subject to subsection (4), the person must comply with the order within the period the director specifies in
            that order.
          </p>
        ),
      },
      {
        id: "9(4)",
        name: "Environmental Management Act SBC 2003 s.9(4) : If a person who is served with an order under subsection (3) does not comply with the regulations in the period specified by the director, the person must dispose of the hazardous waste as directed by a director.",
        content: (
          <p>
            (4) If a person who is served with an order under subsection (3) does not comply with the regulations in the
            period specified by the director, the person must dispose of the hazardous waste as directed by a director.
          </p>
        ),
      },
    ],
    "33ad4c7d-86df-4f33-8078-17f68a8fa8f6": [
      {
        id: "4",
        name: "Park, Conservancy and Recreation Area Regulation 180/90 s.4 : A person must not act as a guide or offer services as a guide in a park, conservancy or recreation area without",
        content: (
          <p className="mt-4">
            <b>4</b> A person must not act as a guide or offer services as a guide in a park, conservancy or recreation
            area without
          </p>
        ),
      },
      {
        id: "4(a)",
        name: "Park, Conservancy and Recreation Area Regulation 180/90 s.4(a) : a valid park use permit or resource use permit issued for that purpose, and",
        content: (
          <p className="ms-4">(a) a a valid park use permit or resource use permit issued for that purpose, and</p>
        ),
      },
      {
        id: "4(b)",
        name: "Park, Conservancy and Recreation Area Regulation 180/90 s.4(b) : a licence or permit to guide if required by or under the Wildlife Act.",
        content: <p className="ms-4">(b) a licence or permit to guide if required by or under the Wildlife Act</p>,
      },
    ],
    "8d281e80-dfe3-49e5-a3ce-68a7b9835151": [
      {
        id: "5",
        name: "Park, Conservancy and Recreation Area Regulation 180/90 s.5 : Trap without permit",
        content: (
          <p className="mt-4">
            <b>5</b> A person must not trap or take any fur bearing animal in a park, conservancy or recreation area
            without
            <div className="contravention-alternate-text">Trap without permit</div>
          </p>
        ),
      },
      {
        id: "5(a)",
        name: "Park, Conservancy and Recreation Area Regulation 180/90 s.5(a) : a valid park use permit or resource use permit issued for that purpose, and",
        content: (
          <p className="ms-4">(a) a valid park use permit or resource use permit issued for that purpose, and</p>
        ),
      },
      {
        id: "5(b)",
        name: "Park, Conservancy and Recreation Area Regulation 180/90 s.5(b) : a licence or permit to trap issued under the Wildlife Act.",
        content: <p className="ms-4">(b) a licence or permit to trap issued under the Wildlife Act.</p>,
      },
    ],
    "19b5f25c-7798-4b1a-8622-199cde0a62e6": [
      {
        id: "7",
        name: "Park, Conservancy and Recreation Area Regulation 180/90 s.7 : Fail to give information",
        content: (
          <p className="mt-4">
            <b>7</b> Every person who enters or is in a park, conservancy or recreation area must, at the request of a
            park officer or park ranger, provide information about any matter pertaining to the use or occupancy of the
            park, conservancy or recreation area including that person's correct name, address, destination and proposed
            activities and conduct in the park, conservancy or recreation area
            <div className="contravention-alternate-text">Fail to give information</div>
          </p>
        ),
      },
    ],
  };

  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Vars
  const { title, activityGuid } = modalData;

  // State
  const [errorMessage, setErrorMessage] = useState<string>("");

  function getNameFromId(id: string): string | undefined {
    for (const key in sectionContent) {
      const match = sectionContent[key].find((s) => s.id === id);
      if (match) return match.name;
    }
  }

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="modal-create-add-case">
        {isLoading && <ModalLoading />}
        <div
          className="comp-details-body"
          style={{
            visibility: isLoading ? "hidden" : "inherit",
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
                const { data, isLoading, error } = useLegislationSearchQuery({
                  agencyCode: userAgency,
                  legislationTypeCode: "REG",
                  ancestorGuid: actValue || "", // Provide default value
                  enabled: !!actValue, // Only query if a value has been selected
                });

                const regOptions = convertLegislationToOption(data?.legislation ?? []);

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
                            options={regOptions}
                            value={regOptions.find((opt) => opt.value === field.state.value)}
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
                          const { data, isLoading, error } = useLegislationSearchQuery({
                            agencyCode: userAgency,
                            legislationTypeCode: "SEC",
                            ancestorGuid: regulation || act,
                            enabled: !!regulation || !!act,
                          });

                          const secOptions = convertLegislationToOption(data?.legislation ?? []);

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
                                  options={secOptions}
                                  value={secOptions.find((opt) => opt.value === field.state.value)}
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
                const sectionsToDisplay =
                  sectionValue && sectionContent[sectionValue] ? sectionContent[sectionValue] : [];

                return (
                  sectionsToDisplay.length > 0 && (
                    <>
                      {sectionsToDisplay.map((section) => (
                        <button
                          key={section.id}
                          type="button"
                          className={`contravention-section ${selectedSection === section.id ? "selected" : ""}`}
                          onClick={() => setSelectedSection(section.id)}
                        >
                          {section.content}
                        </button>
                      ))}
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
              localStorage.setItem("contraventions", getNameFromId(selectedSection ?? "") ?? "");
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
