#!/bin/bash


# # init certbot configuration

# restarting the docker containers
cd /home/ubuntu/mocr-server-uat



CURRENT_ENV=${ENV:-no_env}


# if [[ "$CURRENT_ENV" == "dev" ]];
#   then
# sudo chmod +x ./init-letsencrypt.sh  
# yes | sudo ./init-letsencrypt.sh dev

# sudo docker-compose down
# sudo docker-compose up -d  
# fi


# if [[ "$CURRENT_ENV" == "prod" ]];
#   then
# sudo chmod +x ./init-letsencrypt.sh  
# yes | sudo ./init-letsencrypt.sh prod 

# sudo docker-compose down
# sudo docker-compose up -d  
# fi

# echo current env $CURRENT_ENV



## note: not using follow imports flag. if any issue try this: --follow-imports
#data extraction files

## single page file
echo  "excel process report file"

sudo docker exec  node-mocr-uat python -m nuitka --follow-import-to=medical_ocr --follow-import-to=log_service --follow-import-to=dictionary   -o /usr/src/app/python_scripts/report_process/main  --output-dir=/usr/src/app/python_scripts/report_process /usr/src/app/python_scripts/report_process/main.py
# sudo docker exec  node-mocr python -m nuitka --follow-import-to=logging_project_3 -o /usr/src/app/python_scripts/project3/cleanup_report  --output-dir=/usr/src/app/python_scripts/report_process /usr/src/app/python_scripts/project3/cleanup_report.py
sudo docker exec  node-mocr-uat python -m nuitka --follow-import-to=logging_project_3 -o /usr/src/app/python_scripts/project3/clean  --output-dir=/usr/src/app/python_scripts/project3 /usr/src/app/python_scripts/project3/clean.py
sudo docker exec  node-mocr-uat python -m nuitka --follow-import-to=logging_project_3 -o /usr/src/app/python_scripts/project3/PageCount  --output-dir=/usr/src/app/python_scripts/project3 /usr/src/app/python_scripts/project3/PageCount.py

sudo docker exec  node-mocr-uat python -m nuitka --follow-import-to=services --follow-import-to=table_format -o /usr/src/app/python_scripts/split_combine_process/main  --output-dir=/usr/src/app/python_scripts/split_combine_process /usr/src/app/python_scripts/split_combine_process/main.py
sudo docker exec  node-mocr-uat python -m nuitka --follow-import-to=services --follow-import-to=table_format -o /usr/src/app/python_scripts/hyperlink_chaining_process/main  --output-dir=/usr/src/app/python_scripts/hyperlink_chaining_process /usr/src/app/python_scripts/hyperlink_chaining_process/main.py





echo  "deleting python files"

# # delete data extraction file
docker exec  node-mocr-uat sh -c  'rm -rf /usr/src/app/python_scripts/report_process/*.py'
docker exec  node-mocr-uat sh -c  'rm -rf /usr/src/app/python_scripts/report_process/__pycache__'

docker exec  node-mocr-uat sh -c  'rm -rf /usr/src/app/python_scripts/project3/*.py'
docker exec  node-mocr-uat sh -c  'rm -rf /usr/src/app/python_scripts/project3/__pycache__'

docker exec  node-mocr-uat sh -c  'rm -rf /usr/src/app/python_scripts/split_combine_process/*.py'
docker exec  node-mocr-uat sh -c  'rm -rf /usr/src/app/python_scripts/split_combine_process/__pycache__'



# 
# # delete data yolo process file
# docker exec  node-cvman sh -c 'rm -rf /usr/src/app/server/python_scripts/yolo_process/*.py'
# docker exec  node-cvman sh -c 'rm -rf /usr/src/app/server/python_scripts/yolo_process/__pycache__'


# # delete data batch process file
# docker exec  node-cvman sh -c 'rm -rf /usr/src/app/server/python_scripts/batch_processing/*.py'
# docker exec  node-cvman sh -c 'rm -rf /usr/src/app/server/python_scripts/batch_processing/constants/*.py'
# docker exec  node-cvman sh -c 'rm -rf /usr/src/app/server/python_scripts/batch_processing/__pycache__'



# echo "deleting docker internal folders"


# docker exec  node-cvman sh -c 'rm -rf /usr/src/app/server/Dockerfile'
# docker exec  node-cvman sh -c 'rm -rf /usr/src/app/server/docker-compose.yml'
# docker exec  node-cvman sh -c 'rm -rf /usr/src/app/server/package.json'
# docker exec  node-cvman sh -c 'rm -rf /usr/src/app/server/requirements.txt'
# docker exec  node-cvman sh -c 'rm -rf /usr/src/app/server/tsconfig.json'









echo "clear main host folder container except some"



# # FIXME: CHECK  ON PRODUCTION NEED TO CLEAR FILES
# shopt -s extglob
# sudo rm -rf -v !('nginx.conf'|'web-build'|'logos'|'certbot')

if [[ "$CURRENT_ENV" == "dev" ]];then 
    echo "skipped deletion on dev"
fi

shopt -s extglob

if [[ "$CURRENT_ENV" == "prod" ]];then
sudo rm -rf -v !('nginx.conf'|'web-build'|'logos'|'certbot'|'docker-compose.yml'|'init-letsencrypt.sh')
fi

