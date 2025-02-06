import InOut from "./InOut.js"
import Protocol from "./Protocol.js"
import styles from "./Traffic.module.css"
function Traffic () {
  return (
    <div className={styles.container}>
      <div className={styles.trafficMain}>
        <div className={styles.trafficContainer}>
          <InOut className={styles.trafficGraph} />
        </div>
        <div className={styles.protocolContainer}>
          <Protocol className={styles.protocolGraph}/>
        </div>
      </div>
    </div>
  )
}

export default Traffic