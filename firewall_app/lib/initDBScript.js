/**
 * @fileoverview
 * Initialize the database, ensuring the required table is created.
 */
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Function to initialize the database
export async function initializeDb() {
  try {
    const dbPath = path.resolve(process.cwd(), 'database', 'database.sqlite');

    // Open the database connection
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log('Connected to the SQLite database.');

    // Create the table if it doesn't exist
    await db.exec(`
        CREATE TABLE IF NOT EXISTS packet_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source_ip TEXT NOT NULL,
          destination_ip TEXT NOT NULL,
          latitude REAL, 
          longitude REAL,
          city TEXT, 
          country TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
          );
        `);
          
        console.log('Table is ready.');
        
        return db; // Return the connection for further use if needed
      } catch (error) {
        console.error('Error initializing database:', error);
        throw error; // Ensure errors propagate properly
      }
    }
    
    // timestamp TEXT NOT NULL,
    // protocol TEXT NOT NULL,
    // port TEXT NOT NULL,