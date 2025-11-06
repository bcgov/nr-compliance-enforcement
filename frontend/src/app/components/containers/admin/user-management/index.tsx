import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import Option from "@apptypes/app/option";
import { clearNotification, selectNotification } from "@store/reducers/app";
import { CssUser } from "@apptypes/app/app_user/app_user";
import { SelectUser } from "@/app/components/containers/admin/user-management/select-user";
import { EditUser } from "@/app/components/containers/admin/user-management/edit-user";
import { AddUserSearch } from "@/app/components/containers/admin/user-management/add-user-search";
import "@assets/sass/user-management.scss";

export const UserManagement: FC = () => {
  const SEARCH_VIEW = 0;
  const EDIT_VIEW = 1;
  const ADD_USER_SEARCH_VIEW = 2;

  const dispatch = useAppDispatch();
  const notification = useAppSelector(selectNotification);

  const [viewState, setViewState] = useState<number>(SEARCH_VIEW);
  const [officer, setOfficer] = useState<Option>();
  const [officerError, setOfficerError] = useState<string>("");
  const [isInAddUserView, setIsInAddUserView] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<CssUser | null>(null);

  useEffect(() => {
    const { type } = notification;
    if (type !== "") {
      dispatch(clearNotification());
    }
  }, [dispatch, notification]);

  const resetValidationErrors = () => {
    setOfficerError("");
  };

  const handleEdit = () => {
    setViewState(EDIT_VIEW);
    setIsInAddUserView(false);
    setNewUser(null);
  };

  const handleCancel = () => {
    //return to search view
    if (viewState !== SEARCH_VIEW) {
      //if in add new user details view -> return to add search view
      if (isInAddUserView && viewState === EDIT_VIEW) {
        setViewState(ADD_USER_SEARCH_VIEW);
      } else setViewState(SEARCH_VIEW);
    }
    resetValidationErrors();
  };

  const handleAddNewUser = () => {
    setViewState(ADD_USER_SEARCH_VIEW);
  };

  const goToSearchView = () => {
    setViewState(SEARCH_VIEW);
  };

  const goToEditView = () => {
    setViewState(EDIT_VIEW);
  };

  return (
    <>
      {viewState === SEARCH_VIEW && (
        <SelectUser
          setOfficer={setOfficer}
          setOfficerError={setOfficerError}
          handleAddNewUser={handleAddNewUser}
          officer={officer}
          officerError={officerError}
          handleEdit={handleEdit}
        />
      )}
      {viewState === EDIT_VIEW && officer && (
        <EditUser
          officer={officer}
          isInAddUserView={isInAddUserView}
          handleCancel={handleCancel}
          goToSearchView={goToSearchView}
          newUser={newUser}
          setOfficer={setOfficer}
        />
      )}
      {viewState === ADD_USER_SEARCH_VIEW && (
        <AddUserSearch
          setOfficer={setOfficer}
          handleCancel={handleCancel}
          goToEditView={goToEditView}
          setIsInAddUserView={setIsInAddUserView}
          setNewUser={setNewUser}
        />
      )}
    </>
  );
};
