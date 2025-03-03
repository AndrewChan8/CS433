// app/api/initializeApp/route.js
import { initializeDb } from '../../../../lib/initDBScript';  // Adjust the path if needed
import { runFirewallScript } from '../../../../lib/runFirewallScript';  // Adjust the path if needed

// Named export for GET method
export async function GET() {
  try {
    // Initialize the database and run the firewall script
    await initializeDb();
    await runFirewallScript();

    // Return a successful response
    return new Response(
      JSON.stringify({ message: 'Initialization and firewall script execution successful.' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during initialization:', error.message);
    return new Response(
      JSON.stringify({ error: 'Error during initialization: ' + error.message }),
      { status: 500 }
    );
  }
}
