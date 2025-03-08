import { queryDb } from '../../../../lib/readDB';

export async function GET(req) {
  try {
    // Query the database for the most recent 100 packet logs
    const logs = await queryDb('SELECT * FROM packet_logs ORDER BY timestamp DESC LIMIT 5;');
    // Get unique IP addresses from the logs
    const ipAddresses = logs.map(log => log.source_ip);
    
    // Make the geolocation API call for each IP address
    const locations = await Promise.all(ipAddresses.map(async (ip) => {
      const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEO_API_KEY}&ip=${ip}`);
      const data = await response.json();
      console.log(data)
      
      if (data.country_name && data.city) {
        return {
          ip,
          lat: data.latitude,
          lon: data.longitude,
          city: data.city,
          country: data.country_name
        };
      } else {
        return null; // Handle failed geolocation lookup
      }
    }));

    // Filter out unsuccessful geolocation lookups
    const filteredLocations = locations.filter(Boolean);

    // Send the response with geolocation data
    return new Response(JSON.stringify(filteredLocations), { status: 200 });
  } catch (err) {
    // Handle errors
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
