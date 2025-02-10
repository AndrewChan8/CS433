# CS43

there's 2 machines: A VM and the docker container
the docker container will send IP packets to the VM via a simulated network
we will load a firewall into the VM's kernel that will filter out packets sent from docker container.
we'll collect data within the firewall (kernel space) and send it to the user space program to display it

start up docker container
    sudo docker compose up -d
    this will search directory for .yml file and run it
get the id of the container
    sudo docker ps
the packet spoofing python program exists in the vm so we need to copy it over to the container to run it
    sudo docker cp packet_spoofer.py <container id>:/tmp
we need to run the python packet sending program from the container so we need to open up a shell in the container
    sudo docker exec -it <container id> /bin/bash
execute the python packet sending program from the container terminal we just opened
    cd tmp
    python3 packet_spoofer.py
open up a second terminal inside your VM
we now need to compile and load the firewall

/*How to run firewall
compile it
  make
insert kernel module into the running kernel
        sudo insmod firewall.ko
list the kernel module
        lsmod | grep firewall
remove firewall module from kernel (ending firewall) this is cleaning it up when we're done running it
        sudo rmmod firewall
check kernel printout for evidence of firewall working and printing - useful for debugging
        sudo dmesg
*/



