import { FC, memo, useMemo, useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { useForm } from "@tanstack/react-form";
import { FormField } from "@/app/components/common/form-field";
import { CompSelect } from "@/app/components/common/comp-select";
import { convertLegislationToOption, useLegislationSearchQuery } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { getUserAgency } from "@/app/service/user-service";
import { indentByType, Legislation } from "@/app/types/app/legislation";

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
    legislationTypeCodes: [Legislation.ACT],
    enabled: true,
  });

  const actOptions = convertLegislationToOption(data?.legislation ?? []);

  // Vars
  const { title, activityGuid } = modalData;

  // State
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>();

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
            <form.Subscribe selector={(state) => state.values.act}>
              {(actValue) => {
                // Filter regulation options based on selected act
                const { data, isLoading, error } = useLegislationSearchQuery({
                  agencyCode: userAgency,
                  legislationTypeCodes: [Legislation.REGULATION],
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
                      >
                        {({ act, regulation }) => {
                          // Filter sections based on regulation if present, otherwise by act
                          const { data, isLoading, error } = useLegislationSearchQuery({
                            agencyCode: userAgency,
                            legislationTypeCodes: [Legislation.SECTION],
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
                                  className="comp-details-input mb-4"
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
                      </form.Subscribe>
                    </>
                  )
                );
              }}
            </form.Subscribe>
            <form.Subscribe selector={(state) => state.values.section}>
              {(sectionValue) => {
                const { data, isLoading, error } = useLegislationSearchQuery({
                  agencyCode: userAgency,
                  legislationTypeCodes: [
                    Legislation.SECTION,
                    Legislation.SUBSECTION,
                    Legislation.PARAGRAPH,
                    Legislation.SUBPARAGRAPH,
                  ],
                  ancestorGuid: sectionValue, // Provide default value
                  enabled: !!sectionValue, // Only query if a value has been selected
                });

                return (
                  sectionValue &&
                  data?.legislation && (
                    <>
                      {data.legislation
                        .filter((section) => !!section.legislationText)
                        .map((section) => {
                          const indentClass = indentByType[section.legislationTypeCode as keyof typeof indentByType];
                          return (
                            <button
                              key={section.legislationGuid}
                              type="button"
                              className={`contravention-section ${selectedSection === section.legislationGuid ? "selected" : ""}`}
                              onClick={() => setSelectedSection(section.legislationGuid as string)}
                            >
                              <div>
                                <p className={`mb-2 ${indentClass}`}>
                                  {/* If we're getting a section here it's a special case where there is nothing else 
                                      in the legislation this is considered to not have an implied (1) as it is the only one.
                                    */}
                                  {section.legislationTypeCode !== Legislation.SECTION && <>{section.citation}</>}{" "}
                                  {section.legislationText}
                                </p>
                                {section.alternateText && (
                                  <div className="contravention-alternate-text">{section.alternateText}</div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                    </>
                  )
                );
              }}
            </form.Subscribe>
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
