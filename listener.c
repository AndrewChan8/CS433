#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <linux/netlink.h>

#define NETLINK_USER 31
#define MAX_PAYLOAD 1024  // Maximum payload size

int main() {
    struct sockaddr_nl src_addr, dest_addr;
    struct nlmsghdr *nlh = NULL;
    struct iovec iov;
    struct msghdr msg;
    int sock_fd;

    // Create Netlink socket
    sock_fd = socket(AF_NETLINK, SOCK_RAW, NETLINK_USER);
    if (sock_fd < 0) {
        perror("socket");
        return -1;
    }

    // Bind Netlink socket to the current process
    memset(&src_addr, 0, sizeof(src_addr));
    src_addr.nl_family = AF_NETLINK;
    src_addr.nl_pid = getpid();  // User-space process ID
    bind(sock_fd, (struct sockaddr *)&src_addr, sizeof(src_addr));

    // Prepare Netlink message to register with the kernel
    nlh = (struct nlmsghdr *)malloc(NLMSG_SPACE(MAX_PAYLOAD));
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
    msg.msg_name = (void *)&dest_addr;
    msg.msg_namelen = sizeof(dest_addr);
    msg.msg_iov = &iov;
    msg.msg_iovlen = 1;

    // Send registration message to kernel
    sendmsg(sock_fd, &msg, 0);
    printf("[USER] Sent registration message to the kernel.\n");

    // Receive messages from the kernel
    printf("[USER] Waiting for messages from the kernel...\n");
    while (1) {
        recvmsg(sock_fd, &msg, 0);
        printf("[USER] Received from kernel: %s\n", (char *)NLMSG_DATA(nlh));
    }

    // Cleanup
    close(sock_fd);
    free(nlh);
    return 0;
}
