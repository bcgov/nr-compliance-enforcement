import { FC, memo, useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { generateApiParameters, get } from "@common/api";
import config from "@/config";
import { ToggleError } from "@common/toast";
import { selectModalData } from "@store/reducers/app";
import { formatGuid } from "@common/methods";

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

type RelinkIdirModalProps = {
  close: () => void;
  submit: () => void;
};

export const RelinkIdirModal: FC<RelinkIdirModalProps> = ({ close, submit }) => {
  const dispatch = useAppDispatch();
  const modalData: any = useAppSelector(selectModalData);
  const firstName = modalData?.firstName ?? "";
  const lastName = modalData?.lastName ?? "";
  const onRelink = modalData?.onRelink;

  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/team/find-user`, {
          firstName,
          lastName,
        });
        const data: any = await get(dispatch, parameters);
        if (Array.isArray(data)) {
          const mapped: Option[] = data.map((item: any) => ({
            label: item?.attributes?.display_name?.[0] ?? "",
            value: formatGuid(item?.attributes?.idir_user_guid?.[0]),
          }));
          setOptions(mapped);
        } else {
          setOptions([]);
        }
      } catch {
        ToggleError("Unable to find matching IDIR accounts");
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [firstName, lastName, dispatch]);

  const handleClose = () => {
    setSelected(null);
    close();
  };

  const handleRelink = async () => {
    if (!selected?.value) return;
    try {
      if (typeof onRelink === "function") {
        await onRelink(selected.value);
      }
    } catch {
      ToggleError("Unable to relink IDIR account");
    }
    setSelected(null);
    submit();
  };

  return (
    <>
      <Modal.Header
        closeButton
        className="pb-0"
      >
        <Modal.Title>Relink IDIR</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <ModalLoading />}
        <div className="mb-3">
          <label
            htmlFor="relink-idir-select"
            className="form-label"
          >
            Matching accounts
          </label>
          <CompSelect
            id="relink-idir-select"
            classNamePrefix="comp-select"
            className="comp-details-input"
            options={options}
            value={selected ?? undefined}
            onChange={(opt) => setSelected(opt ?? null)}
            placeholder="Select account"
            showInactive={false}
            enableValidation={false}
            isClearable={true}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleRelink}
          disabled={!selected?.value}
        >
          Relink
        </Button>
      </Modal.Footer>
    </>
  );
};

export default RelinkIdirModal;
