import InOut from "./InOut.js"
import Protocol from "./Protocol.js"
import styles from "./Traffic.module.css"
function Traffic () {
  return (
    <div className={styles.trafficMain}>
      <div className={styles.graph}>
        <InOut />
      </div>
      <Protocol/>
    </div>
  )
}

export default Traffic