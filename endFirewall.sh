cd ..

echo "Remove firewall module from kernel ('Ending firewall')"
sudo rmmod firewall

echo "Make clean"
make clean 
rm ./listener