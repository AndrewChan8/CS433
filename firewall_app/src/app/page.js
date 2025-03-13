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
    <h1>Coming Soon...</h1>
    <p>Head over to Geo Map to see your network traffic!</p>
      {/* <Header/>
      <Traffic />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
        <p className="text-lg text-gray-600">This is the main landing page.</p>
      </main>
      <div>
    </div> */}
      
    </>
  );
}
export default Dashboard