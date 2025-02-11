/**
 * @fileoverview
 * Open initial database connection 
 */
import sqlite3 from 'sqlite3';
import path from 'path';

// Open the database connection
export function openDb() {
  const dbPath = path.resolve('./database/database.sqlite');
  return new sqlite3.Database(dbPath);
}

// Function to query the database
export function queryDb(query, params = []) {
  return new Promise((resolve, reject) => {
    const db = openDb();
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
    db.close();
  });
}
