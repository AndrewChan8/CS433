#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/netfilter.h>
#include <linux/netfilter_ipv4.h>

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

unsigned int hello1(void *priv, struct sk_buff *skb, const struct nf_hook_state *state);
int registerFilter(void);
void removeFilter(void) ;

static struct nf_hook_ops hook1;


unsigned int hello1(void *priv, struct sk_buff *skb, const struct nf_hook_state *state) {
	printk(KERN_INFO "*** Hello, netfilter 11111!\n");
	
	/* when a packet is picked up by the firewall this function will execute
	 * since we don't have any packet parsing in yet, just create random string
	 * this is where we need you to implement communication from kernel to user space*/
	
	return ACCEPT;
}

int registerFilter(void) {
	printk(KERN_INFO "Registering filters.\n");

	hook1.hook = hello1;
	hook1.hooknum = NF_INET_LOCAL_IN;
	hook1.pf = PF_INET;
	hook1.priority = -100;
	nf_register_net_hook(&init_net, &hook1);

	return 0;
}

void removeFilter(void) {
	printk(KERN_INFO "The filter are being removed.\n");
	nf_unregister_net_hook(&init_net, &hook1);
}

module_init(registerFilter);
module_exit(removeFilter);

MODULE_LICENSE("GPL");
