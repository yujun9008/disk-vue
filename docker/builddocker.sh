#!/bin/bash
#docker部分

echo '================打包完成，开始制作镜像================'

echo '================停止容器 disk================'
sudo docker stop disk
echo '================删除容器 disk================'
sudo docker rm disk
echo '================删除镜像 disk:latest================'
sudo docker rmi disk:latest
echo '================build 镜像 disk:latest================'
sudo docker build -t disk:latest  .
echo '================运行容器 disk================'
sudo docker run --name=disk --restart always -d -p 80:80  disk:latest

echo "finished!"
echo '================部署完成================'
