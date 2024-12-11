import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// Hacky, but there is no ES6 module for this library
import "overlapping-marker-spiderfier-leaflet/dist/oms";
declare global {
  interface Window {
    OverlappingMarkerSpiderfier: any;
  }
}

interface SpiderfyProps {
  onSpiderfy?: (markers: any[]) => void;
  onUnspiderfy?: (markers: any) => void;
  onClick?: (marker: any) => void;
  handlePopupOpen?: (id: string) => void;
  handlePopupClose?: () => void;
  children?: React.ReactNode;
}

const Spiderfy = (props: SpiderfyProps) => {
  const map = useMap();
  // Get the OverlappingMarkerSpiderfier from the window object
  const OverlappingMarkerSpiderfier = window.OverlappingMarkerSpiderfier;
  // Create a new instance of the OverlappingMarkerSpiderfier whenever we get a new map instnace
  const oms = React.useMemo(() => new OverlappingMarkerSpiderfier(map), [OverlappingMarkerSpiderfier, map]);

  // When the props change, we need to clear then rebind the event listeners again
  useEffect(() => {
    oms.clearListeners("spiderfy");
    oms.addListener("spiderfy", (markers: any[]) => {
      markers.forEach((m) => m.closePopup()); //force to close popup
      if (props.onSpiderfy) props.onSpiderfy(markers);
    });

    oms.clearListeners("unspiderfy");
    oms.addListener("unspiderfy", (markers: any) => {
      if (props.onUnspiderfy) props.onUnspiderfy(markers);
    });

    oms.clearListeners("click");
    oms.addListener("click", (marker: any) => {
      // Hacky, but event listeners here always run first before the map click event listener resulting in the popup never opening
      // so we will delay by 100ms
      setTimeout(() => {
        // Hacky, but alt is being used to store the complaint id. Maybe later we could create
        // our own custom marker class to add but it's not clear that will work with the spiderfier library used here
        props.handlePopupOpen && props.handlePopupOpen(marker.options.alt);
        marker.openPopup();
        marker.addOneTimeEventListener("popupclose", props.handlePopupClose);
      }, 100);

      if (props.onClick) props.onClick(marker);
    });
  }, [oms, props]);

  useEffect(() => {
    map.eachLayer((layer) => {
      // Hacky, but "RiseOnHover" is being used to identify non-clustered markers that should be spiderfied.
      if (layer instanceof L.Marker && layer?.options?.riseOnHover) {
        oms.addMarker(layer);
      }
    });
  }, [oms, map, props.children]);

  return <div>{props.children}</div>;
};

export default Spiderfy;
