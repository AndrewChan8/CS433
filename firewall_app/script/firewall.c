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
    char *errMsg = 0;
    int rc = sqlite3_open("../database/database.sqlite", &db);

    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return 1;
    }

    // Example packet data
    char *source_ip = "192.168.1.1";
    char *destination_ip = "8.8.8.8";
    char *protocol = "TCP";
    int port = 443;
    int packet_size = 512;
    char *location = "New York, USA";

    char sql[512]; // data buffer
    snprintf(sql, sizeof(sql),
        "INSERT INTO packet_logs (source_ip, destination_ip, protocol, port, packet_size, location) "
        "VALUES ('%s', '%s', '%s', %d, %d, '%s');",
        source_ip, destination_ip, protocol, port, packet_size, location
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
