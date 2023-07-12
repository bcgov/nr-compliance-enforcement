import { FC, useEffect, useState  } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { getOfficesInZone, officesInZone } from "../../../store/reducers/office";
import { getTokenProfile, profileZone } from "../../../store/reducers/app";
import { Office } from "../../../types/office/office";
import { OfficeUserContainer } from "./office-user-container";

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
                    <div>{"ITEM: " + JSON.stringify(item)}</div>
                    <div>{item.cos_geo_org_unit.office_location_name + " Office " + item.office_guid}</div>
                    <div><OfficeUserContainer officersInOffice={item.officers}/></div>
                </>;
            }) 
        }
    </>
  );
};
