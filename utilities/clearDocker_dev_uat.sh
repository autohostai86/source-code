#!/bin/bash
echo "Cleaning Old Docker Setup"


# sudo rm -rf /home/$USER_NAME_DEV/mocr-server
# sudo rm -rf mocr-server 

# sudo mv /home/$USER_NAME_DEV/mocr-server  mocr-server-old

# FIXME:DEPLOY CHECK
cd /home/ubuntu
echo $USER_NAME_DEV

# print pwd and ls
pwd 
ls 

sudo rm -rf mocr-server-uat-old
sudo mv mocr-server-uat  mocr-server-uat-old
sudo rm -rf mocr-server-uat 

# sudo docker stop $(sudo docker ps -a -q)
# sudo docker rm $(sudo docker ps -a -q)

# REMOVING mocr CONTAINERS 
docker stop node-mocr-uat
docker rm  node-mocr-uat

docker stop mongo-mocr-uat
docker rm  mongo-mocr-uat

docker stop nginx-mocr-uat
docker rm  nginx-mocr-uat

docker stop certbot-mocr
docker rm  certbot-mocr

# CLEANING UNUSED IMAGES
yes | docker system prune -a


