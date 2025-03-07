cd ..

echo "compile your code"
make 
make listener

# Wait for firewall.ko to be generated
if [ ! -f "firewall.ko" ]; then
    echo "Error: firewall.ko not found!"
    exit 1
fi

echo "insert kernel module into the running kernel"
sudo insmod firewall.ko

echo "list the kernel module"
lsmod | grep firewall

echo "running listener"
./listener
