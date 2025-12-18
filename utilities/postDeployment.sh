#!/bin/bash
echo "Restarting nginx"
sudo docker restart nginx-chat
echo "Restarting nginx is done"

echo "Installing tslib"
sudo docker exec node-chat sh -c yarn add tslib@2.0.0
sleep 10
echo "Installing tslib is done"