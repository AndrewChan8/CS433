/**
 * @fileoverview
 * Awaits for db connection before querying everything from the db table
 * 
 * Author: Sophia Zhang 
 * Date: 02/10/2025
 */

import { queryDb } from '../../../../lib/readDB';

export async function GET(req) {
  try {
    const logs = await queryDb('SELECT * FROM packet_logs');
    return new Response(JSON.stringify(logs), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
