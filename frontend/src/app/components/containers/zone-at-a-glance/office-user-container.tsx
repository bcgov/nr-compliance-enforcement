import { FC  } from "react";
import { Officer } from "../../../types/person/person";

type Props = {
    officersInOffice: Officer[],
}

export const OfficeUserContainer: FC<Props> = ({officersInOffice}) => {
  if(officersInOffice !== undefined && officersInOffice.length !== 0)
  {
    return (
        <>
            { 
                    officersInOffice.map((item) => {
                        return <div>{item.person_guid.first_name + " " + item.person_guid.last_name}</div>;
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
