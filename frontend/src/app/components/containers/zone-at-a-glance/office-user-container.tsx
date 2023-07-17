import { FC  } from "react";
import { Officer } from "../../../types/person/person";
import { OfficerStats } from "../../../types/complaints/zone-at-a-glance-stats";

type Props = {
    officersInOffice: OfficerStats[],
}

export const OfficeUserContainer: FC<Props> = ({officersInOffice}) => {
  if(officersInOffice !== undefined && officersInOffice.length !== 0)
  {
    return (
        <>
            { 
                    officersInOffice.map((item) => {
                        return <div className="comp-zag-officer-container">{item.name + " " + item.name}</div>;
                    }) 
            }
        </>
    );
  }
  else
  {
    return <></>;
  }
};
