"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapCircles({ locations }) {
  const map = useMap(); // Get the map instance

  useEffect(() => {
    if (!map || locations.length === 0) return;

    const locationCounts = {};

    locations.forEach((loc) => {
      const key = `${loc.lat},${loc.lon}`;
      console.log("This is the key", key);
      if (!locationCounts[key]) {
        locationCounts[key] = { count: 0, data: loc };
      }
      locationCounts[key].count += 1;
    });

    Object.values(locationCounts).forEach(({ count, data }) => {
      const radius = count * 5000; // Adjust radius based on occurrences
      L.circle([parseFloat(data.lat), parseFloat(data.lon)], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: radius,
      })
        .addTo(map)
        .bindPopup(`${data.city}, ${data.country} - ${count} requests`);
    });
  }, [map, locations]);

  return null; 
}

function GeoMap() {
  useEffect(() => {
    getIP(); // Initial call
    const intervalId = setInterval(() => {
      getIP(); // Call every 5 seconds
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const [locations, setLocations] = useState([]);
  const getIP = async () => {
    try {
      const response = await fetch("/api/geoIP");
      const result = await response.json();
      console.log("this is result,", result);
      setLocations(result);
    } catch (error) {
      console.error("Failed to fetch geolocation data:", error);
    }
  };

  return (
    <>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapCircles locations={locations} />
      </MapContainer>
    </>
  );
}

export default GeoMap;
