import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GestureHandling } from "leaflet-gesture-handling";

import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";

export const MapGestureHandler = () => {
  const map = useMap();

  //To set Ctrl + Scroll for map
  useEffect(() => {
    map.addHandler("gestureHandling", GestureHandling);
    // @ts-expect-error
    map.gestureHandling.enable();
  }, [map]);

  return null;
};
