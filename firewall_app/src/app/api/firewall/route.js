import { startFirewall } from '../../../../lib/startFirewall';
import { endFirewall } from '../../../../lib/endFirewall'; // If you have a separate function for stopping the firewall

// Named export for POST method
export async function POST(req) {
  const { action } = await req.json(); // Action could be 'start' or 'stop'
  
  try {
    if (action === "start") {
      // Start the firewall script
      await startFirewall();
      return new Response(
        JSON.stringify({ message: 'Firewall started successfully.' }),
        { status: 200 }
      );
    } else if (action === "stop") {
      // Stop the firewall script
      await endFirewall();
      return new Response(
        JSON.stringify({ message: 'Firewall stopped successfully.' }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action.' }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error during firewall action:', error.message);
    return new Response(
      JSON.stringify({ error: 'Error during action: ' + error.message }),
      { status: 500 }
    );
  }
}
