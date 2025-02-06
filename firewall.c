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
unsigned int hello2(void *priv, struct sk_buff *skb, const struct nf_hook_state *state);
int registerFilter(void);
void removeFilter(void) ;

static struct nf_hook_ops hook1, hook2;


unsigned int hello1(void *priv, struct sk_buff *skb, const struct nf_hook_state *state) {
	printk(KERN_INFO "*** Hello, netfilter 11111!\n");
	return NF_DROP;
}

unsigned int hello2(void *priv, struct sk_buff *skb, const struct nf_hook_state *state) {
	printk(KERN_INFO "*** Hello, netfilter 22222!\n");
	return NF_DROP;
}

int registerFilter(void) {
	printk(KERN_INFO "Registering filters.\n");

	hook1.hook = hello1;
	hook1.hooknum = NF_INET_LOCAL_IN;
	hook1.pf = PF_INET;
	hook1.priority = -100;
	nf_register_net_hook(&init_net, &hook1);
	/*
	hook2.hook = hello2;
	hook2.hooknum = NF_INET_LOCAL_OUT;
	hook2.pf = PF_INET;
	hook2.priority = -180;
	nf_register_net_hook(&init_net, &hook2);
	*/
	return 0;
}

void removeFilter(void) {
	printk(KERN_INFO "The filter are being removed.\n");
	nf_unregister_net_hook(&init_net, &hook1);
	nf_unregister_net_hook(&init_net, &hook2);
}

module_init(registerFilter);
module_exit(removeFilter);

MODULE_LICENSE("GPL");
