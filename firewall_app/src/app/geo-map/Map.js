"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import 'leaflet/dist/leaflet.css'
import 'react-leaflet-markercluster/styles'
import styles from "./map.module.css"

const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: styles["marker-cluster-custom"],
    iconSize: L.point(40, 40, true),
  });
};

const pinIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // URL of the pin icon (you can change it to your own)
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Anchor point of the icon (adjust if needed)
  popupAnchor: [0, -32], // Adjust where the popup appears (relative to the icon)
});

function GeoMap() {
  const [locations, setLocations] = useState([]);

  const getIP = async () => {
    try {
      const res = await fetch("/api/geoIP");
      if (!res.ok) throw new Error("Failed to fetch data");
      const newData = await res.json();
      setLocations((prevLocations) => [...prevLocations, ...newData]);
    } catch (error) {
      console.error("Failed to fetch geolocation data:", error);
    }
  };

  useEffect(() => {
    getIP(); // Initial call
    const intervalId = setInterval(getIP, 5000); // Call every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>

      <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

      <MarkerClusterGroup 
        showCoverageOnHover={true}
        iconCreateFunction={createClusterCustomIcon}
      >  
        {locations.map((loc, index) => {
          if (!loc || !loc.lat || !loc.lon) return null; // Skip if lat or lon is missing
      
          return (
            <Marker
              key={index}
              position={[parseFloat(loc.lat), parseFloat(loc.lon)]}
              // title={`${loc.city}, ${loc.country} - ${loc.count || 1} requests`}
              icon={pinIcon}
            />
          );
        })}
      </MarkerClusterGroup>

    </MapContainer>
  );
}

export default GeoMap;
