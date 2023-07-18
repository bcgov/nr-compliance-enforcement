import { FC } from "react";
import { OfficeStats } from "../../../types/complaints/zone-at-a-glance-stats";
import { OfficeContainer } from "./office-container";


type Props = {
  hwcrOpenComplaintsOfficeStats: OfficeStats[],
  allegationOpenComplaintsOfficeStats: OfficeStats[],
}

export const OfficesContainer: FC<Props> = ({hwcrOpenComplaintsOfficeStats, allegationOpenComplaintsOfficeStats}) => {
  if(hwcrOpenComplaintsOfficeStats !== undefined && hwcrOpenComplaintsOfficeStats.length !== 0 && allegationOpenComplaintsOfficeStats !== undefined && allegationOpenComplaintsOfficeStats.length !== 0)
  {
  return (
    <>
        { 
            hwcrOpenComplaintsOfficeStats.map((item, index) => {
              //fear the hackiness -- this should probably be refactored -- the orderby on the backend should keep these in line, but allegationOpenComplaintsOfficeStats[index] makes me feel dirty
              return (<OfficeContainer hwcrOpenComplaintsOfficeStat={item} allegationOpenComplaintsOfficeStat={allegationOpenComplaintsOfficeStats[index]} />);
            }) 
        }
    </>
  );
      }
      else
      {
        return <></>
      }
};
