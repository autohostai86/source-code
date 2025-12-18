#!/bin/sh

mkdir -p /usr/local/nvm

export NVM_DIR="/usr/local/nvm"
export NODE_VERSION="v16.15.1"

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

chmod +x $NVM_DIR/nvm.sh
$NVM_DIR/nvm.sh
#nvm install $NODE_VERSION 
#nvm use --delete-prefix $NODE_VERSION

export  NODE_PATH=$NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
export  PATH=$NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH
export  NPM_PATH=$NVM_DIR/versions/node/$NODE_VERSION/bin

$NPM_PATH/npm install -g yarn
$NPM_PATH/npm install -g nx
$NPM_PATH/npm install -g @socket.io/pm2
$NPM_PATH/npm install -g pm2


pip --version
python --version
node --version




## currently adding tslib manually as static version
yarn add tslib@2.0.0
yarn add @socket.io/cluster-adapter
yarn add @socket.io/sticky

yarn install --frozen-lockfile


pm2-runtime ecosystem.config.js

