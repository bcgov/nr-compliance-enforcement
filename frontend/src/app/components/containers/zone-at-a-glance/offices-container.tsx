import { FC } from "react";
import { OfficeStats } from "@apptypes/complaints/zone-at-a-glance-stats";
import { OfficeContainer } from "./office-container";

type Props = {
  hwcrOpenComplaintsOfficeStats: OfficeStats[];
  allegationOpenComplaintsOfficeStats: OfficeStats[];
};

export const OfficesContainer: FC<Props> = ({ hwcrOpenComplaintsOfficeStats, allegationOpenComplaintsOfficeStats }) => {
  return (
    <>
      {hwcrOpenComplaintsOfficeStats.map((item, index) => {
        //fear the hackiness -- this should probably be refactored -- the orderby on the backend should keep these in line, but allegationOpenComplaintsOfficeStats[index] makes me feel dirty
        return (
          <OfficeContainer
            key={item.name}
            hwcrOpenComplaintsOfficeStat={item}
            allegationOpenComplaintsOfficeStat={allegationOpenComplaintsOfficeStats[index]}
          />
        );
      })}
    </>
  );
};
