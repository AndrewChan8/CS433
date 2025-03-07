import { useState } from "react";
import Image from "next/image";
import styles from "./Status.module.css";

function Status() {
  const [statusMessage, setStatusMessage] = useState("Status");

  // Function to call the firewall API on button click
  const callFirewallAPI = async (action) => {
    try {
      const response = await fetch("/api/firewall", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }) 
      });
      const data = await response.json();
      
      // Update the status message based on the response
      if (response.ok) {
        setStatusMessage(`Firewall ${action}ed successfully!`);
      } else {
        setStatusMessage("Error calling the firewall API.");
      }
      console.log("Response from firewall API:", data);
    } catch (error) {
      setStatusMessage("Error with the API request.");
      console.error("Error calling firewall API:", error);
    }
  };

  return (
    <>
      <div className={styles.statusMain}>
        <Image className={styles.statusImg} src="/online.png" alt="Online" width={25} height={25} />
        <p className={styles.statusMsg}>{statusMessage}</p>
      </div>

      {/* Buttons to start or stop the firewall */}
      <button onClick={() => callFirewallAPI("start")} className={styles.firewallButton}>
        Start Firewall
      </button>
      <button onClick={() => callFirewallAPI("stop")} className={styles.firewallButton}>
        Stop Firewall
      </button>
    </>
  );
}

export default Status;
