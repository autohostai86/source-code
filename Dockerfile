# FROM python:3.9.6-buster
FROM ubuntu:20.04


### initial required packages and theme setup
RUN apt-get update --fix-missing
RUN apt-get install  -y vim
RUN apt-get install  -y wget
RUN apt install -y python3.9 --fix-missing
RUN apt install -y python3-pip --fix-missing

# RUN ln -s /usr/bin/python3.9 /usr/bin/python3


## zsh in docker link
#https://github.com/deluan/zsh-in-docker
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.2/zsh-in-docker.sh)" -- \
    -t eastwood -p  https://github.com/zsh-users/zsh-autosuggestions 

# BASIC PYTHON and  JAVA SETUP
RUN apt-get update \
    && apt-get install -y libgl1-mesa-glx \
    && apt-get install -y libglib2.0-0 \
    && apt-get install -y libzbar0
# RUN apt-get update \
#     && apt-get install tesseract-ocr build-essential -y \
#     && apt install -y libsm6 libxext6 vim libgl1-mesa-glx \
#     && apt-get autoremove \
#     && apt-get install -y openjdk-11-jre-headless \
#     && apt-get install -y libreoffice --no-install-recommends \
#     && apt-get clean 





WORKDIR /usr/src/app

# ## PROJECT DEPENDENCIES
# COPY ./requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # installing pdf to png dependancies
# RUN apt-get install ghostscript -y
# #RUN apt-get install graphicsmagick -y





#NODEJS  SETUP
RUN echo "y" | apt-get install curl
ENV NVM_DIR /usr/local/nvm
RUN mkdir -p /usr/local/nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
# ENV NODE_VERSION v14.15.4
ENV NODE_VERSION v18.18.2

RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"

ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH
ENV NPM_PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin

RUN $NPM_PATH/npm install -g yarn
RUN $NPM_PATH/npm install -g nx 
#RUN $NPM_PATH/npm install -g pm2 
RUN $NPM_PATH/npm install -g @socket.io/pm2


RUN if [ ! -e /usr/bin/python3 ]; then ln -s /usr/bin/python3.9 /usr/bin/python3; fi


WORKDIR /usr/src/app
COPY . .
## currently adding tslib manually as static version
RUN yarn add tslib@2.0.0 
RUN yarn add reflect-metadata
RUN yarn add @socket.io/cluster-adapter
RUN yarn add @socket.io/sticky

RUN yarn install --frozen-lockfile
CMD ["pm2-runtime", "ecosystem.config.js"]