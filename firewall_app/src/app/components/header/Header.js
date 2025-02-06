import Image from "next/image";
import styles from "./Header.module.css";
import Status from "./status/Status.js";

function Header() {
  return (
    <>
      <div className={styles.headerMain}>
        <div className={styles.headerTitle}>
          <p>Your Firewall Status</p>
        </div>
        <hr className={styles.horizontalLine} />
        <div className={styles.headerInfo}>
          <Status />
          <p>Insert Up time</p>
          <p className={styles.lastUpdated}>Last Updated : 5 min ago</p>
        </div>
      </div>
    </>
  )
}

export default Header