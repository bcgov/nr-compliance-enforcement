import { FC, useEffect, useState } from "react";
import { useAppDispatch } from "@hooks/hooks";
import { setIsInEdit } from "@store/reducers/cases";
import { HWCRPreventionItem } from "./hwcr-prevention-item";
import { HWCRPreventionForm } from "./hwcr-prevention-form";
import { Prevention } from "@/app/types/outcomes/prevention";
import { useParams } from "react-router-dom";
import { DELETE_CONFIRM } from "@/app/types/modal/modal-types";
import { openModal } from "@/app/store/reducers/app";
import { deletePrevention } from "@/app/store/reducers/case-thunks";

type props = {
  prevention?: Prevention;
};

export const HWCRPrevention: FC<props> = ({ prevention }) => {
  const { id = "" } = useParams();
  const dispatch = useAppDispatch();

  const [showInput, setShowInput] = useState(!prevention);

  useEffect(() => {
    dispatch(setIsInEdit({ prevention: showInput }));
    return () => {
      dispatch(setIsInEdit({ prevention: false }));
    };
  }, [dispatch, showInput]);

  const openDeletePreventionModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: DELETE_CONFIRM,
        data: {
          title: "Delete prevention and education actions",
          description: "All the actions on this date will be lost.",
          confirmText: "delete actions",
          cancel: "No, go back",
          deleteConfirmed: () => {
            if (prevention?.id) {
              dispatch(deletePrevention(id, prevention?.id));
            }
          },
        },
      }),
    );
  };

  return (
    <>
      {!prevention || showInput ? (
        <HWCRPreventionForm
          id={id}
          prevention={prevention}
          handleCancel={() => {
            setShowInput(false);
          }}
          handleSave={() => setShowInput(false)}
        />
      ) : (
        prevention && (
          <HWCRPreventionItem
            prevention={prevention}
            handleEdit={() => setShowInput(true)}
            handleDelete={openDeletePreventionModal}
          />
        )
      )}
    </>
  );
};
