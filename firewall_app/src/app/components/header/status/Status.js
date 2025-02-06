import Image from "next/image"
import styles from "./Status.module.css"
function Status() {
  return (
    <>
      <div className={styles.statusMain}>
        <Image className={styles.statusImg} src="/online.png" alt="Online" width={25} height={25}/>
        {/* TODO: Check for status */}
        <p className={styles.statusMsg}>Status</p>
      </div>
    </>
  )
}

export default Status