/**
 * @fileoverview 
 * This file currently sends info the the database 
 * 
 * Authors : Sophia Zhang
 */

#include <stdio.h>
#include <sqlite3.h>

int main() {
    sqlite3 *db;
    char *errMsg = NULL;
    int rc = sqlite3_open("./firewall_app/database/database.sqlite", &db);
    printf("This is RC %s\n", rc);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return 1;
    } else {
        printf("Database connection was successful!\n");
    };
      // Example packet data
      char *source_ip = "192.168.1.1";
      char *destination_ip = "8.8.8.8";
      char *protocol = "TCP";
      int port = 443;
  
      char sql[512]; // data buffer
      snprintf(sql, sizeof(sql),
          "INSERT INTO packet_logs (source_ip, destination_ip, protocol, port) "
          "VALUES ('%s', '%s', '%s', %d);",
          source_ip, destination_ip, protocol, port
      ); 
  
      rc = sqlite3_exec(db, sql, 0, 0, &errMsg); // insert data into db
  
      if (rc != SQLITE_OK) {
          fprintf(stderr, "SQL error: %s\n", errMsg);
          sqlite3_free(errMsg);
      } else {
          printf("Packet log inserted successfully!\n");
      }
  
      sqlite3_close(db);
    return 0;
}
