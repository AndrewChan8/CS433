"use client";
import { useEffect, useState } from "react";

import Header from "./components/header/Header.js"
import Traffic from "./components/traffic/Traffic.js"

function Dashboard() {
  const [data, setData] = useState([])
    useEffect(() => {
      const initDB = async () => {
        const response = await fetch("/api/initializeDB"); 
        await response.json()
      };
      initDB();
  }, []);

  return (
    <>
      <Header/>
      <Traffic />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
        <p className="text-lg text-gray-600">This is the main landing page.</p>
      </main>
      <div>
      <h1>Packet Logs</h1>
      {/* {data.length === 0 ? (
        <p>Loading data...</p>
      ) : (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              <strong>Source:</strong> {item.source_ip} →  
              <strong> Destination:</strong> {item.destination_ip}  
              <strong>timestamp :</strong> {item.timestamp}
            </li>
          ))}
        </ul>
      )} */}
    </div>
      
    </>
  );
}
export default Dashboard