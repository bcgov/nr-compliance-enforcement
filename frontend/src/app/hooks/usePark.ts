import { useEffect } from "react";
import { Park } from "@/app/types/app/shared/park";
import { getParkData, selectParkByGuid } from "@/app/store/reducers/park";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";

export const usePark = (parkGuid?: string): Park | undefined => {
  const dispatch = useAppDispatch();
  const park = useAppSelector(selectParkByGuid(parkGuid));

  useEffect(() => {
    if (parkGuid && !park) {
      dispatch(getParkData(parkGuid));
    }
  }, [dispatch, parkGuid, park]);

  return park;
};
