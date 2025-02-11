#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/netfilter.h>
#include <linux/netfilter_ipv4.h>
#include <linux/netlink.h>
#include <linux/skbuff.h>
#include <net/sock.h>
#include <linux/ip.h>

/*How to run firewall
compile
  make
insert kernel module into the running kernel
	sudo insmod firewall.ko
list the kernel module
	lsmod | grep firewall
remove firewall module from kernel (ending firewall)
	sudo rmmod firewall
check kernel printout
	sudo dmesg
*/

#define NETLINK_USER 31  // Unique Netlink protocol ID

static struct nf_hook_ops hook1;
struct sock *nl_sk = NULL;  // Netlink socket
int user_pid = 0; // Stores user-space PID for message sending

// Function to send data to user space via Netlink
static void send_to_user_space(char *message) {
    struct sk_buff *skb_out;
    struct nlmsghdr *nlh;
    int msg_size = strlen(message);
    int res;

    if (!user_pid) {
        printk(KERN_INFO "[KERNEL] No user-space process registered, skipping send.\n");
        return;
    }

    skb_out = nlmsg_new(msg_size, 0);
    if (!skb_out) {
        printk(KERN_ERR "[KERNEL] Failed to allocate new skb\n");
        return;
    }

    nlh = nlmsg_put(skb_out, 0, 0, NLMSG_DONE, msg_size, 0);
    memcpy(nlmsg_data(nlh), message, msg_size);

    res = nlmsg_unicast(nl_sk, skb_out, user_pid);
    if (res < 0) {
        printk(KERN_INFO "[KERNEL] Error sending message to user-space: %d\n", res);
    } else {
        printk(KERN_INFO "[KERNEL] Successfully sent message to user-space.\n");
    }
}

// Packet inspection function
unsigned int hello1(void *priv, struct sk_buff *skb, const struct nf_hook_state *state) {
    struct iphdr *ip_header;
    char message[100];

    if (!skb)
        return NF_ACCEPT;

    ip_header = ip_hdr(skb);
    if (!ip_header)
        return NF_ACCEPT;

    snprintf(message, sizeof(message), "SRC=%pI4, DST=%pI4", &ip_header->saddr, &ip_header->daddr);
    send_to_user_space(message);

    printk(KERN_INFO "[KERNEL] Packet Captured: %s\n", message);
    return NF_ACCEPT;
}

// Handle incoming messages from user space
static void nl_recv_msg(struct sk_buff *skb) {
    struct nlmsghdr *nlh;
    nlh = (struct nlmsghdr *)skb->data;
    user_pid = nlh->nlmsg_pid; // Store user-space PID
    printk(KERN_INFO "[KERNEL] User-space process registered, PID: %d\n", user_pid);
}

// Initialize module: Register Netfilter & Netlink
static int __init registerFilter(void) {
    struct netlink_kernel_cfg cfg = {
        .input = nl_recv_msg,
    };

    printk(KERN_INFO "[KERNEL] Registering filters and Netlink socket.\n");

    nl_sk = netlink_kernel_create(&init_net, NETLINK_USER, &cfg);
    if (!nl_sk) {
        printk(KERN_ALERT "[KERNEL] Error creating Netlink socket.\n");
        return -10;
    }

    hook1.hook = hello1;
    hook1.hooknum = NF_INET_LOCAL_IN;
    hook1.pf = PF_INET;
    hook1.priority = -100;
    nf_register_net_hook(&init_net, &hook1);

    return 0;
}

// Cleanup function: Unregister Netfilter & close Netlink socket
static void __exit removeFilter(void) {
    printk(KERN_INFO "[KERNEL] Removing filter and Netlink socket.\n");
    nf_unregister_net_hook(&init_net, &hook1);

    if (nl_sk) {
        netlink_kernel_release(nl_sk);
    }
}

module_init(registerFilter);
module_exit(removeFilter);

MODULE_LICENSE("GPL");