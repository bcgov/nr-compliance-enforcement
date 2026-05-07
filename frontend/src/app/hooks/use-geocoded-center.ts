import { fetchRawGeocoderResponse } from "@/app/common/geocoder";
import { useAppDispatch } from "@/app/hooks/hooks";
import { useEffect, useState } from "react";

type GeocodedCenterResult = {
  center: { lat: number; lng: number } | null;
  isLoaded: boolean;
};

// Looks up coordinates without enforcing constraints to be used for display purposes
export const useGeocodedCenter = (community: string | null | undefined): GeocodedCenterResult => {
  const dispatch = useAppDispatch();
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoaded, setIsLoaded] = useState(!community);

  useEffect(() => {
    if (!community) {
      setCenter(null);
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);

    fetchRawGeocoderResponse(community, undefined, dispatch).then((response) => {
      const topFeature = response?.features?.[0];

      if (topFeature?.geometry?.coordinates && topFeature.geometry.coordinates.length >= 2) {
        const [lng, lat] = topFeature.geometry.coordinates;
        setCenter({ lat, lng });
      } else {
        setCenter(null);
      }

      setIsLoaded(true);
    });
  }, [community, dispatch]);

  return { center, isLoaded };
};
