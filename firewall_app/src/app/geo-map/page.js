import Map from "./Map.js"
import styles from "./map.module.css"
function GeoMap () {
  return (
    <>
      <h1>Geo Map</h1>
      <div className = { styles.map }>
        <Map />
      </div>
    </>
  )
}

export default GeoMap