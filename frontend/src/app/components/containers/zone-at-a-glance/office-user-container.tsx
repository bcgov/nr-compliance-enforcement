import { FC  } from "react";
import { OfficerStats } from "../../../types/complaints/zone-at-a-glance-stats";

type Props = {
  hwcrOfficers: OfficerStats[],
  allegationOfficers: OfficerStats[],
}

export const OfficeUserContainer: FC<Props> = ({hwcrOfficers, allegationOfficers}) => {
  if(hwcrOfficers !== undefined && hwcrOfficers.length !== 0 && allegationOfficers !== undefined && allegationOfficers.length !== 0)
  {
    console.log("hwcrOfficers: " + JSON.stringify(hwcrOfficers));
                      console.log("allegationOfficers: " + JSON.stringify(allegationOfficers));
    return (
        <>
            { 
                    hwcrOfficers.map((item, index) => {
                      console.log("hate you" + JSON.stringify(item));
                      console.log("hate you 22" + JSON.stringify(allegationOfficers[index]));
                        return <>
                        <div className="comp-zag-officer-container">
                          {item.name} - - {item.hwcrAssigned} - - {allegationOfficers[index].allegationAssigned}
                        </div>
                        </>
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
