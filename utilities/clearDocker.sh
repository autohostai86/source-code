#!/bin/bash
echo "Cleaning Old Docker Setup"

cd /home/ubuntu

# print pwd and ls
ls 

sudo rm -rf chat-server-old
mv chat-server  chat-server-old
sudo rm -rf chat-server 


sudo docker stop node-chat
sudo docker rm  node-chat

# CLEANING UNUSED IMAGES
yes | sudo docker system prune -a


