import { usePark } from "@/app/hooks/usePark";
import { FC } from "react";

export const ParkCell: FC<{ parkGuid?: string }> = ({ parkGuid }) => {
  const park = usePark(parkGuid);
  return <>{park?.name ?? "-"}</>;
};
