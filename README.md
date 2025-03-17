# Firewall Monitoring Tool
Authors & Developers : Liam Bouffard, Andrew Chan, Sophia Zhang

## Introduction 
GeoMap is a real-time network monitoring tool that visualizes IP traffic and potential security threats by mapping incoming connections. It works alongside a firewall script that filters network traffic based on predefined rules, allowing or blocking connections as needed. A listener script continuously captures network data, which is analyzed and displayed on an interactive map to track connection origins and patterns. Built with React Leaflet, the system leverages marker clustering for efficient data visualization, providing users with an intuitive way to monitor and analyze network activity across different locations.

## Getting Started  
This application is locally hosted. To begin monitoring, the firewall script must first be loaded into the kernel module, followed by running the listener script to capture network traffic. 

Our project was developed and tested in Ubuntu 24.04.2.  It is highly recommended to use the same environmenta as we cannot gurantee succesful use in others.

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
    - if errors occur, see error list and fixes below
3. **Creating your IPGeo API key**:
    Head over to [IP Geolocation](https://ipgeolocation.io/) to create a free account. Once logged in, head over to dashboards to copy your api key into the program. 
    
    To add the api key, create a `.env` file in the same directory as the the `firewall_app`. Inside the file, write, `IPGEO_API_KEY="paste your key"` then save the file. 

4. **Start the web application**:
    - After the installation completes, you can start the application by running:
      `npm run dev`

5. **Access the web app**:
    - Open your browser and go to `http://localhost:3000` to view and interact with the firewall application.

**NOTE:** If you encouter any issues when running, see list of potential issues you may try : 
1. Error: Could not locate the bindings file. Remove and re-install the package json independicies

    `rm -rf node_modules package-lock.json`
    
    Run `npm install` again. 
2. Error: npm ERR! code ENOTEMPTY run the following:
   'npx rimraf node_modules package-lock.json'
   'npm install'


> Once the firewall is running, the listener script captures network data, which is processed and visualized on the GeoMap dashboard.

## Setting Up Docker for Testing Purposes
There are two machines, a virtual machine and a docker container. The docker container will send IP packets to the VM via a simulated network. We will load a firewall into the VM's kernel that will filter out packets sent from the docker container. Data will then be collected from the kernel space and be sent off to the user space program for visualization. 

### Step 1 : Loading Firewall Script into Kernel (If not already)
1. Compile it:

    `make`

2. Insert kernel module into the running kernel:

    `sudo insmod firewall.ko`

3. List the kernel module:

    `lsmod | grep firewall`

4. Check kernel printout for evidence of firewall working and printing - useful for debugging:

    `sudo dmesg`
5. Remove firewall module from kernel (ending firewall), this is cleaning it up when we're done running it

    `sudo rmmod firewall`
### STEP 2 : Running the Listener Script
1. **Compile the listener module :**

    `make listener`

2. **Run the executable:**

    `./listener`

3. For testing purposes, we need to get the port number listener is listening on.

    Run `ps aux | grep listener`. You should see something like this : 

    `username    313685  0.2  0.0   4756  1524 pts/0    S+   15:39   0:00 ./listener`

    Make note of the `313695` port number (it is different each time)

### Step 3:  Setup Docker Container 
1. Start up Docker Container, this will search up the directory for a `.yml` file to run 

    `sudo docker compose up -d`

2. Get the ID of the Container

    `sudo docker ps`

3. The packet spoofing python program exists in the vm so we need to copy it over to the container 

    `sudo docker cp packet_spoofer.py <container id>:/tmp`

4. We need to run the python packet sending program from the container so we need to open up a shell in the container

    `sudo docker exec -it <container id> /bin/bash`

5. Execute the python packet sending program from the container terminal we just opened

    `cd tmp`

    Open up the `packet_spoofer.py` file and look for 
    
    `dst_addr = (133625, 0)  # Set to listener's PID here`
    
    Replace the first index of the tuple with the port number your got from step 2. 
    
    Save the file and run : 

    `python3 packet_spoofer.py`
    
