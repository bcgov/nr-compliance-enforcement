import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOMServer from "react-dom/server";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Leaflet from "leaflet";


interface MapProps {
    markers: { lat: number; lng: number }[];
}

const LeafletMapWithMultiplePoints: React.FC<MapProps> = ({ markers }) => {

    const iconHTML = ReactDOMServer.renderToString(
        <FontAwesomeIcon icon={faMapMarkerAlt} />
      );

      const customMarkerIcon = new Leaflet.DivIcon({
        html: iconHTML,
        className: "map-marker",
        iconSize: [40, 0], // Adjust icon size as needed
        iconAnchor: [20, 40], // Adjust icon anchor point
      });

    return (
        <MapContainer style={{ height: '652px', width: '1390' }}
        center={[53.7267,-127.6476]}
        zoom={6}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MarkerClusterGroup chunkedLoading>
            {markers.map((marker, index) => (
              <Marker key={index} position={[marker.lat, marker.lng]} icon={customMarkerIcon} />
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      );
    };

export default LeafletMapWithMultiplePoints;
