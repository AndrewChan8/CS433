# Firewall Monitoring Tool
Authors & Developers : Liam Bouffard, Andrew Chan, Sophia Zhang

## Introduction 
GeoMap is a real-time network monitoring tool that visualizes IP traffic and potential security threats by mapping incoming connections. It works alongside a firewall script that filters network traffic based on predefined rules, allowing or blocking connections as needed. A listener script continuously captures network data, which is analyzed and displayed on an interactive map to track connection origins and patterns. Built with React Leaflet, the system leverages marker clustering for efficient data visualization, providing users with an intuitive way to monitor and analyze network activity across different locations.

## Getting Started  
This application is locally hosted. To begin monitoring, the firewall script must first be loaded into the kernel module, followed by running the listener script to capture network traffic.  

### STEP 1 :  Loading the Firewall  

1. **Compile the firewall module:**  
    `make`

2. **Insert the firewall module into the running kernel:**  
   `sudo insmod firewall.ko`  

3. **Verify the module is loaded:**  
   `lsmod | grep firewall`

4. **Check kernel logs for debugging information:**  
    `sudo dmesg`

 $\quad$ **Note:** To unload the firewall from the kernel module, run :  
   $\quad$  `sudo rmmod firewall`

### STEP 2 : Running the Listener Script
1. **Compile the listener module :**

    `make listener`

2. **Run the executable:**

    `./listener`

**Note:** To stop the listener module, simply press `Ctrl + D` if the script is waiting for input, or use `Ctrl + C` to interrupt it immediately. If needed, you can also remove the `./listener` executable by running `rm ./listener` in your terminal.

### STEP 3 : Running the Web Application 

1. **Navigate to the firewall project directory**:
    
    - First, go to the `firewall_app` directory where the web application is located:

      `cd firewall`

2. **Install the necessary dependencies**:
    - Ensure that you have **Node.js** installed. If you don't, you can download and install it from [Node.js Official Website](https://nodejs.org/).
    - Once Node.js is installed, run the following command to install all required dependencies:

      `npm install`

3. **Start the web application**:
    - After the installation completes, you can start the application by running:
      `npm run dev`

4. **Access the web app**:
    - Open your browser and go to `http://localhost:3000` to view and interact with the firewall application.

**NOTE:** If you encouter any issues when running `npm install` you may try : 
1. Add Issues here


> Once the firewall is running, the listener script captures network data, which is processed and visualized on the GeoMap dashboard.
```

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
