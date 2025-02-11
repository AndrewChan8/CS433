

from scapy.all import *
import time
import random

def main():
    d = {}
    d[0] = ("China", "1.0.0.0/8")
    d[1] = ("Germany", "2.0.0.0/8")
    d[2] = ("United States", "3.0.0.0/8")
    d[3] = ("Japan", "133.0.0.0/8")

    while (1):
        a = IP()

        # create spoofed ip_src
        src_country, src_ip = d[random.randint(0,3)]
        rand_host_bytes = str(random.randint(0,255))
        backslash_i = src_ip.index('/')
        a.src = src_ip[:backslash_i - 1] + rand_host_bytes
        print(a.src) 
        # build packet
        b = ICMP()
        p = a/b
        # send it out baby
        send(p, verbose=1)
        time.sleep(2)
main()
