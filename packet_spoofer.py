import socket
import struct
import random
import time
import os

NETLINK_USER = 31
MAX_PAYLOAD = 1024  # Maximum payload size

def main():
    d = {}
    d[0] = ("China", "1.0.0.0/8")
    d[1] = ("Germany", "2.0.0.0/8")
    d[2] = ("United States", "3.0.0.0/8")
    d[3] = ("Japan", "133.0.0.0/8")

    # Create Netlink socket
    sock = socket.socket(socket.AF_NETLINK, socket.SOCK_RAW, NETLINK_USER)
    src_addr = (os.getpid(), 0)
    dst_addr = (133625, 0)  # Set to listener's PID here
    sock.bind(src_addr)

    while True:
        # Create spoofed IP addresses
        src_country, src_ip = d[random.randint(0, 3)]
        rand_host_bytes = str(random.randint(0, 255))
        backslash_i = src_ip.index('/')
        src_ip = src_ip[:backslash_i - 1] + rand_host_bytes
        dst_ip = "8.8.8.8"

        # Create Netlink message
        message = f"SRC={src_ip}, DST={dst_ip}"
        nlmsg_len = socket.htonl(len(message) + 16)  # Adjusting for the header size
        nlmsg_type = socket.htonl(0)  # msg type
        nlmsg_flags = socket.htonl(0)  # flags
        nlmsg_seq = socket.htonl(0)  # sequence number
        nlmsg_pid = socket.htonl(0)  # the kernel process ID

        # Pack the Netlink message header and payload
        nlmsg = struct.pack("IHHII", nlmsg_len, nlmsg_type, nlmsg_flags, nlmsg_seq, nlmsg_pid) + message.encode('utf-8')

        # Send the message to the Netlink socket
        sock.sendto(nlmsg, dst_addr)
        print("[INFO] Sending Netlink message")
        print(f"├─ Message :  {nlmsg}")
        print(f"├─ Destination Address: {dst_addr}")
        print("└─ Message sent successfully\n")

        time.sleep(2)

if __name__ == "__main__":
    main()
