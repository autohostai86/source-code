#!/bin/bash
echo "BB BUILD SCRIPT STARTED"
### remove unwanted lock file
# rm -rf *.lock

#  INSTALL PROJECT DEPS
yarn global add nx
yarn install

#   BUILD CLIENT
ls
#   remove .env.local file
rm -rf apps/client/.env.local
rm -rf apps/api/.env.local
# remove old .env 
rm -rf apps/client/.env
rm -rf apps/chatapp/.env

## rename .env.dev file to .env
mv  apps/client/.env.dev apps/client/.env
cat apps/client/.env

# rename chatapp env
mv  apps/chatapp/.env.dev apps/chatapp/.env

CI=false yarn build:client
CI=false yarn build:chatapp
CI=false yarn build:api

#   MOVE BUILDS
mv dist/apps/client  ./chat-server
mv dist/apps/chatapp  ./chat-server
mv dist/apps/api  ./chat-server

#   RENAMVE BUILDS
mv ./chat-server/client ./chat-server/web-build
mv ./chat-server/api ./chat-server/build

# move chatapp to web-build
mv ./chat-server/chatapp ./chat-server/web-build/chatapp

#   MOVE CONFIG FILES

cp -rf  apps/api/.env ./chat-server
# cp -rf  requirements.txt ./chat-server
cp -rf  ecosystem.config.js ./chat-server
cp -rf  ./chat-server/build/package.json ./chat-server
# cp -rf  python_scripts ./chat-server

# nginx file
rm -rf nginx.conf/default-no-domain.conf
rm -rf nginx.conf/default-demo.conf
rm -rf nginx.conf/default-dev.conf
cp -rf nginx.conf ./chat-server

#   REMOVING NODE MODULES AFTER BUILD
rm -rf node_modules

# COPYING DOCKER CONFIG FILES
cp -rf Dockerfile ./chat-server
#   disabled domain https scripts
#   - chmod +x ./utilities/init-letsencrypt.sh
#   - cp -rf  ./utilities/init-letsencrypt.sh ./chat-server
cp -rf  docker-compose.yml ./chat-server

cp -rf utilities/postDeployment.sh ./chat-server 
cp -rf utilities/init-letsencrypt.sh ./chat-server 

chmod +x postDeployment.sh
chmod +x init-letsencrypt.sh

ls ./chat-server
