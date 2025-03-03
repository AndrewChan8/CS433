"use client";
import { useEffect, useState } from "react";

import Header from "./components/header/Header.js"
import Traffic from "./components/traffic/Traffic.js"

function Dashboard() {
  const [data, setData] = useState([])
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch("/api/initializeApp"); 
        const result = await response.json()
        console.log(result)
        setData(result.data);
      };
      fetchData();
  }, []);
  
  return (
    <>
      <Header/>
      <Traffic />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
        <p className="text-lg text-gray-600">This is the main landing page.</p>
      </main>
      <p>{ data }</p>
    </>
  );
}
export default Dashboard