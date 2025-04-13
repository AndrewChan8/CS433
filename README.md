# 🔥 GeoMap: Real-Time Firewall Monitoring & Visualization Tool

**Authors & Developers**: Andrew Chan, Sophia Zhang, Liam Bouffard  
**Languages:** C (Kernel Module, Netlink), JavaScript/React (Frontend), Python (Testing), SQL (SQLite3)  
**Project Type:** Systems Programming / Network Security / Full-Stack Visualization  
**Last Updated (Code):** March 2025  
**Last Updated (Documentation):** April 2025

A full-stack personal project combining **Linux kernel-level packet monitoring**, **Netlink socket communication**, **SQLite3 data persistence**, and an interactive **Next.js dashboard** with maps, analytics, and logs.

This project visualizes intercepted network traffic in real time, geolocates source IPs, and renders insights using charts and maps.

## 🏷️ Badges

![Linux Kernel Module](https://img.shields.io/badge/Kernel%20Module-Netfilter%20Hook-green?logo=linux)
![C](https://img.shields.io/badge/C-Low%20Level-blue?logo=c)
![Netlink IPC](https://img.shields.io/badge/IPC-Netlink-blueviolet)
![SQLite3](https://img.shields.io/badge/Database-SQLite3-lightgrey?logo=sqlite)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4.7-FF6384?logo=chartdotjs)
![Leaflet](https://img.shields.io/badge/Map-Leaflet-199900?logo=leaflet)
![Python](https://img.shields.io/badge/Python-Scapy-yellow?logo=python)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🌐 Overview

**GeoMap** is a real-time network monitoring platform that visualizes IP traffic and potential security threats on an interactive map. It integrates with a custom firewall kernel module that filters network traffic based on user-defined rules. A listener script captures incoming connection data, which is then processed and displayed using a React + Leaflet web interface. The system employs marker clustering and geolocation APIs for efficient, intuitive visualization of global traffic patterns.

---

## ⚙️ Getting Started

GeoMap runs locally on a Linux machine. It was developed and tested on **Ubuntu 24.04.2** — using the same environment is recommended for best results.

### 1️⃣ Load the Firewall Kernel Module

1. **Compile the module**  
   ```bash
   make
   ```

2. **Insert it into the running kernel**  
   ```bash
   sudo insmod firewall.ko
   ```

3. **Verify the module is active**  
   ```bash
   lsmod | grep firewall
   ```

4. **View debug output (optional)**  
   ```bash
   sudo dmesg
   ```

5. **To remove the module when finished**  
   ```bash
   sudo rmmod firewall
   ```

---

### 2️⃣ Start the Listener Script

1. **Compile the listener**  
   ```bash
   make listener
   ```

2. **Run the listener**  
   ```bash
   ./listener
   ```

   > Press `Ctrl + C` to stop it, or `Ctrl + D` if it's waiting for input.

---

### 3️⃣ Launch the Web Application

1. **Navigate to the frontend directory**  
   ```bash
   cd firewall
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up your IP Geolocation API key**  
   - Sign up at [ipgeolocation.io](https://ipgeolocation.io)
   - Create a `.env` file in the `firewall` directory:
     ```bash
     IPGEO_API_KEY="your_api_key_here"
     ```

4. **Run the development server**  
   ```bash
   npm run dev
   ```

5. **View the dashboard**  
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 🧰 Troubleshooting

**Binding Error Fix**  
If you see an error like:  
`Error: Could not locate the bindings file`

Try:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🐳 Docker-Based Packet Testing Setup

Simulate traffic by sending spoofed packets from a Docker container to the VM where the firewall is loaded. Here's how to set up the test pipeline:

---

### 1️⃣ Load the Firewall on the VM (if not done already)

```bash
make
sudo insmod firewall.ko
lsmod | grep firewall
sudo dmesg  # Optional debug logs
```

To remove when done:
```bash
sudo rmmod firewall
```

---

### 2️⃣ Run the Listener

```bash
make listener
./listener
```

To find the listener's PID:
```bash
ps aux | grep listener
```

Example:
```
username 313685 0.2 0.0 4756 1524 pts/0 S+ 15:39 0:00 ./listener
```

Note the PID (e.g., `313685`) for use in the spoofing script.

---

### 3️⃣ Start Docker Test Environment

1. **Start container**  
   ```bash
   sudo docker compose up -d
   ```

2. **Get container ID**  
   ```bash
   sudo docker ps
   ```

3. **Copy the spoofing script into the container**  
   ```bash
   sudo docker cp packet_spoofer.py <container_id>:/tmp
   ```

4. **Open a shell in the container**  
   ```bash
   sudo docker exec -it <container_id> /bin/bash
   ```

5. **Run the packet spoofing script**  
   ```bash
   cd /tmp
   ```

   Edit `packet_spoofer.py`:
   ```python
   dst_addr = (PID_HERE, 0)  # Replace with the PID from earlier
   ```

   Save the file and run:
   ```bash
   python3 packet_spoofer.py
   ```

---

## ✅ Summary

Once set up, GeoMap provides a real-time, interactive dashboard for monitoring and visualizing firewall events. It’s ideal for understanding network behavior, identifying potential intrusions, and gaining insight into traffic origins using IP geolocation.

---

## 📄 License & Contributions

This project is open for further development and contributions. Reach out if you'd like to collaborate or expand the tool’s capabilities.

## 🙋 About the Authors

This is a personal exploration into operating system internals, network monitoring, and interactive data visualization. Built from scratch to understand Linux packet flow, IPC, and data pipelines from kernel to browser.

Feel free to fork, collaborate, or reach out with feedback or feature ideas.

## 📬 Contact

Feel free to reach out with questions, feedback, or collaboration inquiries!

📧 [andrewsushi.c8@gmail.com]  
💼 [linkedin.com/in/andrew-chan8]

---# network-geolocator
