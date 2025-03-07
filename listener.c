#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <linux/netlink.h>
#include <sqlite3.h>

#define NETLINK_USER 31
#define MAX_PAYLOAD 1024  // Maximum payload size

int main() {
    sqlite3 *db;
    char *errMsg = NULL;
    int rc = sqlite3_open("./firewall_app/database/database.sqlite", &db);
    printf("This is RC %d\n", rc);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return 1;
    } else {
        printf("Database connection was successful!\n");
    };
   

    struct sockaddr_nl src_addr, dest_addr;
    struct nlmsghdr *nlh = NULL;
    struct iovec iov;
    struct msghdr msg;
    int sock_fd;
    int buffer_size = 256 * 1024;  // 256KB buffer size
    
    // Create Netlink socket
    sock_fd = socket(AF_NETLINK, SOCK_RAW, NETLINK_USER);
    if (sock_fd < 0) {
        perror("socket");
        return -1;
    }

    // Increase Socket Buffer size  -> Resolve DB buffer info 
    if (setsockopt(sock_fd, SOL_SOCKET, SO_RCVBUF, &buffer_size, sizeof(buffer_size)) < 0) {
        perror("setsockopt SO_RCVBUF");
        close(sock_fd);
        return -1;
    }
    if (setsockopt(sock_fd, SOL_SOCKET, SO_SNDBUF, &buffer_size, sizeof(buffer_size)) < 0) {
        perror("setsockopt SO_SNDBUF");
        close(sock_fd);
        return -1;
    }

    // Bind Netlink socket to the current process
    memset(&src_addr, 0, sizeof(src_addr));
    src_addr.nl_family = AF_NETLINK;
    src_addr.nl_pid = getpid();  // User-space process ID
    // bind(sock_fd, (struct sockaddr *)&src_addr, sizeof(src_addr));
    if (bind(sock_fd, (struct sockaddr *)&src_addr, sizeof(src_addr)) < 0) {
        perror("bind");
        close(sock_fd);
        return -1;
    }
    // Prepare Netlink message to register with the kernel
    nlh = (struct nlmsghdr *)malloc(NLMSG_SPACE(MAX_PAYLOAD));
    if (!nlh) {
        perror("malloc");
        close(sock_fd);
        return -1;
    }
    memset(nlh, 0, NLMSG_SPACE(MAX_PAYLOAD));
    nlh->nlmsg_len = NLMSG_SPACE(MAX_PAYLOAD);
    nlh->nlmsg_pid = getpid();
    nlh->nlmsg_flags = 0;

    // Set up destination address
    memset(&dest_addr, 0, sizeof(dest_addr));
    dest_addr.nl_family = AF_NETLINK;
    dest_addr.nl_pid = 0; // Kernel

    iov.iov_base = (void *)nlh;
    iov.iov_len = nlh->nlmsg_len;
    memset(&msg, 0, sizeof(msg));
    msg.msg_name = (void *)&dest_addr;
    msg.msg_namelen = sizeof(dest_addr);
    msg.msg_iov = &iov;
    msg.msg_iovlen = 1;

    // Send registration message to kernel
    // sendmsg(sock_fd, &msg, 0);
    if (sendmsg(sock_fd, &msg, 0) < 0) {
        perror("sendmsg");
        close(sock_fd);
        free(nlh);
        return -1;
    }
    printf("[USER] Sent registration message to the kernel.\n");

    // Receive messages from the kernel
    printf("[USER] Waiting for messages from the kernel...\n");
    char sql[512];
    while (1) {
        recvmsg(sock_fd, &msg, 0);
        char *infoData = (char *)NLMSG_DATA(nlh);
        printf("[USER] Received from kernel: %s\n", infoData); // may cause issues if string contains '
        
        char src_ip[32], dest_ip[32];
        sscanf(infoData, "SRC=%[^,], DST=%s", src_ip, dest_ip);
        printf("Source ip: %s Dest ip: %s\n", src_ip, dest_ip);
        printf("------------------------------------------\n");
        snprintf(sql, sizeof(sql),
        "INSERT INTO packet_logs (source_ip, destination_ip) "
        "VALUES ('%s', '%s');",
        src_ip, dest_ip);
        
        rc = sqlite3_exec(db, sql, 0, 0, &errMsg);
        if (rc != SQLITE_OK) {
            fprintf(stderr, "SQL error: %s\n", errMsg);
            sqlite3_free(errMsg);
        }
    }
    sqlite3_close(db);
    // Cleanup
    close(sock_fd);
    free(nlh);
    return 0;
}

