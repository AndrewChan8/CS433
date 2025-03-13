import { queryDb } from '../../../../lib/dbHandler';

let lastTimeStamp = ""; // Move this outside to persist across requests

export async function GET(req) {
  try {
    const query = lastTimeStamp
      ? "SELECT * FROM packet_logs WHERE timestamp > ? ORDER BY timestamp ASC;"
      : "SELECT * FROM packet_logs ORDER BY timestamp;";
    
    const logs = lastTimeStamp
      ? await queryDb(query, [lastTimeStamp]) // Pass lastTimeStamp as parameter
      : await queryDb(query);

    if (logs.length === 0) {
      console.log("No new logs.");
      return new Response(JSON.stringify([]), { status: 200 });
    }

    let newTimeStamp = logs[logs.length - 1].timestamp;
    console.log("Last Time Stamp :", lastTimeStamp);
    console.log("New Time Stamp :", newTimeStamp);

    if (newTimeStamp === lastTimeStamp) {
      console.log("Timestamps match, returning empty response.");
      return new Response(JSON.stringify([]), { status: 200 });
    }

    lastTimeStamp = newTimeStamp; // Update lastTimeStamp

    // Get unique IP addresses
    const ipAddresses = [...new Set(logs.map(log => log.source_ip))];
    console.log(ipAddresses);
    // Fetch geolocation data
    const locations = await Promise.all(ipAddresses.map(async (ip) => {
      try {
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEO_API_KEY}&ip=${ip}`);
        const data = await response.json();
        console.log(data);
        if (data.latitude && data.longitude) {
          return {
            ip,
            lat: data.latitude,
            lon: data.longitude,
            city: data.city,
            country: data.country_name,
            timestamp: logs.find(log => log.source_ip === ip)?.timestamp
          };
        }
      } catch (geoError) {
        console.error("Geolocation error for IP:", ip, geoError.message);
      }
      return null; // Handle failed lookups
    }));

    // Remove null values
    const filteredLocations = locations.filter(Boolean);
    console.log("Locations: ", locations);
    return new Response(JSON.stringify(locations), { status: 200 });
  } catch (err) {
    console.error("Error in /api/geoIP:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
